namespace Sufrano.Infrastructure.Services;

public class ReviewModerationService : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IConfiguration _configuration;
    private readonly ILogger<ReviewModerationService> _logger;
    private readonly SemaphoreSlim _aiApiLock = new(1, 1);

    private const int PollIntervalSeconds = 60;
    private const int DelayBetweenRequestsMs = 15000;
    private const string DefaultModel = "gemma-4-31b-it";
    private static readonly string[] FallbackModels =
    [
        "gemma-4-31b-it",
        "gemma-4-26b-a4b-it",
        "gemini-2.5-flash",
        "gemini-2.5-flash-lite"
    ];
    private const string BaseUrl = "https://generativelanguage.googleapis.com/v1beta/models";

    private static DateTime GetBakuTime() => DateTime.UtcNow.AddHours(4);

    public ReviewModerationService(
        IServiceScopeFactory scopeFactory,
        IHttpClientFactory httpClientFactory,
        IConfiguration configuration,
        ILogger<ReviewModerationService> logger)
    {
        _scopeFactory = scopeFactory;
        _httpClientFactory = httpClientFactory;
        _configuration = configuration;
        _logger = logger;
    }

    private string GetModel()
    {
        var raw = Environment.GetEnvironmentVariable("REVIEW_AI_MODEL")
                  ?? _configuration["REVIEW_AI_MODEL"];
        return string.IsNullOrWhiteSpace(raw) ? DefaultModel : raw.Trim().Trim('"', '\'');
    }

    private string? GetApiKey()
    {
        var raw = Environment.GetEnvironmentVariable("REVIEW_AI_API")
                  ?? _configuration["REVIEW_AI_API"];
        return string.IsNullOrWhiteSpace(raw) ? null : raw.Trim().Trim('"', '\'');
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("ReviewModerationService started with model {Model}.", GetModel());

        var reviewLoopTask = RunReviewModerationLoopAsync(stoppingToken);
        var userVerificationLoopTask = RunHourlyUserVerificationLoopAsync(stoppingToken);

        await Task.WhenAll(reviewLoopTask, userVerificationLoopTask);

        _logger.LogInformation("ReviewModerationService stopped.");
    }

    private async Task RunReviewModerationLoopAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await CleanupExpiredCancelledReviewsAsync(stoppingToken);

                var apiKey = GetApiKey();
                if (!string.IsNullOrWhiteSpace(apiKey))
                {
                    await ProcessNextBatchAsync(apiKey, stoppingToken);
                }
            }
            catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
            {
                break;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error in ReviewModerationService review loop.");
            }

            try
            {
                await Task.Delay(TimeSpan.FromSeconds(PollIntervalSeconds), stoppingToken);
            }
            catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
            {
                break;
            }
        }
    }

    private async Task RunHourlyUserVerificationLoopAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            var bakuNow = GetBakuTime();
            var nextHour = new DateTime(bakuNow.Year, bakuNow.Month, bakuNow.Day, bakuNow.Hour, 0, 0, DateTimeKind.Unspecified).AddHours(1);
            var delay = nextHour - bakuNow;
            if (delay <= TimeSpan.Zero)
            {
                delay = TimeSpan.FromHours(1);
                nextHour = bakuNow.Add(delay);
            }

            _logger.LogInformation(
                "Hourly user verification AI check scheduled at {NextRunBaku:yyyy-MM-dd HH:mm:ss} UTC+4 (in {Minutes}m {Seconds}s).",
                nextHour, (int)delay.TotalMinutes, delay.Seconds);

            try
            {
                await Task.Delay(delay, stoppingToken);

                var afterDelay = GetBakuTime();
                if (afterDelay < nextHour)
                {
                    var remaining = nextHour - afterDelay + TimeSpan.FromMilliseconds(250);
                    if (remaining > TimeSpan.Zero && remaining < TimeSpan.FromMinutes(1))
                    {
                        await Task.Delay(remaining, stoppingToken);
                    }
                }
            }
            catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
            {
                break;
            }

            try
            {
                var apiKey = GetApiKey();
                if (!string.IsNullOrWhiteSpace(apiKey))
                {
                    await ProcessPendingUserVerificationsAsync(apiKey, stoppingToken);
                }
                else
                {
                    _logger.LogWarning("REVIEW_AI_API is not configured; skipping hourly user verification check.");
                }
            }
            catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
            {
                break;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error during hourly user verification AI check.");
            }
        }
    }

    private async Task CleanupExpiredCancelledReviewsAsync(CancellationToken stoppingToken)
    {
        try
        {
            using var scope = _scopeFactory.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

            var cutoff = GetBakuTime().AddDays(-15);

            var expiredCancelledReviews = await db.Reviews
                .Where(r => r.Status.Status == ReviewStatus.Cancelled && r.Status.UpdatedAt <= cutoff)
                .ToListAsync(stoppingToken);

            if (expiredCancelledReviews.Count > 0)
            {
                _logger.LogInformation("Deleting {Count} cancelled reviews older than 15 days (cutoff: {Cutoff}).",
                    expiredCancelledReviews.Count, cutoff);
                db.Reviews.RemoveRange(expiredCancelledReviews);
                await db.SaveChangesAsync(stoppingToken);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while cleaning up expired cancelled reviews.");
        }
    }

    private async Task ProcessNextBatchAsync(string apiKey, CancellationToken stoppingToken)
    {
        using var scope = _scopeFactory.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        var pendingReviews = await db.Reviews
            .Where(r => r.Status.Status == ReviewStatus.Pending)
            .OrderBy(r => r.CreatedAt)
            .ToListAsync(stoppingToken);

        if (pendingReviews.Count == 0)
        {
            return;
        }

        _logger.LogInformation("Processing {Count} pending reviews.", pendingReviews.Count);

        foreach (var review in pendingReviews)
        {
            if (stoppingToken.IsCancellationRequested) break;

            try
            {
                var moderation = await ModerateReviewAsync(apiKey, review, stoppingToken);
                if (moderation == null)
                {
                    _logger.LogWarning("Review {ReviewId} left Pending: AI returned no valid result; will retry on next poll.", review.Id);
                    await Task.Delay(DelayBetweenRequestsMs, stoppingToken);
                    continue;
                }

                var (isClean, detectedLanguage, note) = moderation.Value;

                var parsedLang = ParseDetectedLanguage(detectedLanguage);
                review.Language = parsedLang;

                review.Status.Status = isClean ? ReviewStatus.Published : ReviewStatus.Verification;
                review.Status.UpdatedAt = GetBakuTime();
                review.Status.Note = isClean ? null : note;

                await db.SaveChangesAsync(stoppingToken);

                _logger.LogInformation(
                    "Review {ReviewId} moderated: Language={Language}, IsClean={IsClean}, Status={Status}",
                    review.Id, review.Language, isClean, review.Status.Status);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to moderate review {ReviewId}.", review.Id);
            }

            await Task.Delay(DelayBetweenRequestsMs, stoppingToken);
        }
    }

    private static ReviewLanguage? ParseDetectedLanguage(string? lang)
    {
        if (string.IsNullOrWhiteSpace(lang)) return null;

        var lower = lang.Trim().ToLowerInvariant();

        if (lower.Contains("azer") || lower.Contains("azər") || lower.Contains("az") || lower.Contains("turk") || lower.Contains("türk"))
        {
            return ReviewLanguage.Azerbaijani;
        }
        if (lower.Contains("rus") || lower.Contains("ru"))
        {
            return ReviewLanguage.Russian;
        }
        if (lower.Contains("eng") || lower.Contains("en"))
        {
            return ReviewLanguage.English;
        }

        return null;
    }

    private List<string> GetCandidateModels()
    {
        var primary = GetModel();
        var models = new List<string> { primary };
        foreach (var fallback in FallbackModels)
        {
            if (!models.Contains(fallback, StringComparer.OrdinalIgnoreCase))
            {
                models.Add(fallback);
            }
        }
        return models;
    }

    private async Task<string?> SendAiGenerateContentAsync(
        string apiKey,
        string prompt,
        int maxOutputTokens,
        string contextLabel,
        CancellationToken stoppingToken)
    {
        var candidateModels = GetCandidateModels();

        await _aiApiLock.WaitAsync(stoppingToken);
        try
        {
            const int maxPasses = 2;

            for (int pass = 1; pass <= maxPasses; pass++)
            {
                foreach (var model in candidateModels)
                {
                    var url = $"{BaseUrl}/{model}:generateContent";
                    bool useJsonMimeType = true;

                    for (int formatAttempt = 0; formatAttempt < 2; formatAttempt++)
                    {
                        object generationConfig = useJsonMimeType
                            ? new { temperature = 0.1, maxOutputTokens, responseMimeType = "application/json" }
                            : new { temperature = 0.1, maxOutputTokens };

                        var requestBody = new
                        {
                            contents = new[]
                            {
                                new
                                {
                                    parts = new[]
                                    {
                                        new { text = prompt }
                                    }
                                }
                            },
                            generationConfig
                        };

                        var json = JsonSerializer.Serialize(requestBody);
                        var httpClient = _httpClientFactory.CreateClient();
                        httpClient.Timeout = TimeSpan.FromSeconds(45);

                        using var requestMessage = new HttpRequestMessage(HttpMethod.Post, url);
                        requestMessage.Headers.Add("X-goog-api-key", apiKey);
                        requestMessage.Content = new StringContent(json, Encoding.UTF8, "application/json");

                        HttpResponseMessage response;
                        string responseBody;
                        try
                        {
                            response = await httpClient.SendAsync(requestMessage, stoppingToken);
                            responseBody = await response.Content.ReadAsStringAsync(stoppingToken);
                        }
                        catch (TaskCanceledException) when (!stoppingToken.IsCancellationRequested)
                        {
                            _logger.LogWarning(
                                "AI API request timed out for {Context} on model {Model}; trying next fallback model.",
                                contextLabel, model);
                            break;
                        }

                        using (response)
                        {
                            if (response.IsSuccessStatusCode)
                            {
                                return responseBody;
                            }

                            // Some Gemma endpoints reject responseMimeType="application/json" with HTTP 400.
                            if ((int)response.StatusCode == 400 && useJsonMimeType)
                            {
                                _logger.LogWarning(
                                    "AI API returned 400 with responseMimeType for {Context} (model {Model}); retrying without responseMimeType.",
                                    contextLabel, model);
                                useJsonMimeType = false;
                                continue;
                            }

                            // On 429 (rate limit), 404 (model unavailable), or 5xx (e.g. 503 high demand), try the next fallback model.
                            if ((int)response.StatusCode == 429 || (int)response.StatusCode == 404 || (int)response.StatusCode >= 500)
                            {
                                _logger.LogWarning(
                                    "AI API returned {Status} for {Context} on model {Model} (pass {Pass}/{MaxPasses}); falling back to next model. Body: {Body}",
                                    response.StatusCode, contextLabel, model, pass, maxPasses,
                                    responseBody.Length > 300 ? responseBody[..300] : responseBody);
                                break;
                            }

                            _logger.LogWarning("AI API fatal error for {Context} on model {Model}: {Status} - {Body}",
                                contextLabel, model, response.StatusCode, responseBody);
                            return null;
                        }
                    }
                }

                if (pass < maxPasses)
                {
                    await Task.Delay(TimeSpan.FromSeconds(10), stoppingToken);
                }
            }

            return null;
        }
        finally
        {
            _aiApiLock.Release();
        }
    }

    private static string? ExtractJsonFromCandidateResponse(string responseBody)
    {
        using var doc = JsonDocument.Parse(responseBody);
        if (!doc.RootElement.TryGetProperty("candidates", out var candidates) ||
            candidates.ValueKind != JsonValueKind.Array ||
            candidates.GetArrayLength() == 0)
        {
            return null;
        }

        var firstCandidate = candidates[0];
        if (!firstCandidate.TryGetProperty("content", out var content) ||
            !content.TryGetProperty("parts", out var parts) ||
            parts.ValueKind != JsonValueKind.Array ||
            parts.GetArrayLength() == 0)
        {
            return null;
        }

        var sb = new StringBuilder();
        var fallbackSb = new StringBuilder();

        foreach (var part in parts.EnumerateArray())
        {
            bool isThought = part.TryGetProperty("thought", out var thoughtProp) &&
                             thoughtProp.ValueKind == JsonValueKind.True;

            if (part.TryGetProperty("text", out var textProp) && textProp.ValueKind == JsonValueKind.String)
            {
                var partText = textProp.GetString();
                if (!string.IsNullOrWhiteSpace(partText))
                {
                    if (isThought)
                        fallbackSb.AppendLine(partText);
                    else
                        sb.AppendLine(partText);
                }
            }
        }

        var text = sb.Length > 0 ? sb.ToString().Trim() : fallbackSb.ToString().Trim();
        if (string.IsNullOrWhiteSpace(text))
            return null;

        var startIdx = text.IndexOf('{');
        var endIdx = text.LastIndexOf('}');
        if (startIdx >= 0 && endIdx > startIdx)
        {
            return text[startIdx..(endIdx + 1)];
        }

        return null;
    }

    private static bool TryReadBool(JsonElement root, string propertyName, bool defaultValue = false)
    {
        if (!root.TryGetProperty(propertyName, out var prop))
            return defaultValue;

        return prop.ValueKind switch
        {
            JsonValueKind.True => true,
            JsonValueKind.False => false,
            JsonValueKind.String => bool.TryParse(prop.GetString(), out var b) ? b : defaultValue,
            JsonValueKind.Number => prop.TryGetInt32(out var n) ? n != 0 : defaultValue,
            _ => defaultValue
        };
    }

    private async Task<(bool IsClean, string DetectedLanguage, string? Note)?> ModerateReviewAsync(
        string apiKey,
        Review review,
        CancellationToken stoppingToken)
    {
        var comment = review.ReviewData.Comment;

        var prompt = $$"""
            You are an AI content moderation and language detection assistant.
            Analyze the following user review text for a restaurant ordering service:

            Review text: "{{comment}}"

            Your instructions:
            1. Language Detection:
               - Automatically detect the primary language of the text.
               - Allowed valid languages are: "Russian", "English", "Azerbaijani".
               - Azerbaijani (both Latin script with special characters like 'ç, ə, ğ, ı, ö, ş, ü' AND standard ASCII/English keyboard transliteration like 'cox gozel', 'ela', 'dadlidir', 'qeseng', 'beyendim', 'pisdir', 'gec catdi', etc.) MUST ALWAYS be classified as "Azerbaijani", and hasWrongLanguage MUST be false.
               - Russian (Cyrillic like 'Очень вкусно', 'Все отлично', 'Хуйня полная', etc.) MUST ALWAYS be classified as "Russian", and hasWrongLanguage MUST be false.
               - English ('Great food', 'Very nice', etc.) MUST ALWAYS be classified as "English", and hasWrongLanguage MUST be false.
               - If the text is in any other language (e.g. French, German, Spanish, Arabic, etc.), set detectedLanguage to that language name and set hasWrongLanguage to true.

            2. Offensive Content Check:
               - Detect profanity, curses, swear words, insults, hate speech, vulgarities, and offensive slang in any language (especially Azerbaijani, Russian, English).
               - Notice: Azerbaijani profanities, vulgar slang (e.g. words like "pox", "səfeh", "sefeh", "qələt", "qelet", "it", "it oğlu", "peysər", "peyser", "sik", "am", "göt", "got", "siktir", etc.) MUST be marked as hasOffensiveContent = true.
               - Set hasOffensiveContent to true if any offensive, vulgar, or insulting language is detected; otherwise false.

            3. Advertising & Links:
               - Set hasAdvertising to true if there is promotional spam or marketing; otherwise false.
               - Set hasLinks to true if there are URLs or domains; otherwise false.
               - Set hasContactInfo to true if the user left contact information: a phone number, an email address, or a social media account/handle (e.g. @username, instagram, telegram, whatsapp, facebook, tiktok links or nicknames); otherwise false.

            4. Overall Decision:
               - isClean must be true ONLY IF hasOffensiveContent is false, hasAdvertising is false, hasLinks is false, hasContactInfo is false, and hasWrongLanguage is false.
               - If any violation is found, isClean MUST be false.

            Respond ONLY with a valid JSON object:
            {
              "isClean": true or false,
              "hasOffensiveContent": true or false,
              "hasAdvertising": true or false,
              "hasLinks": true or false,
              "hasContactInfo": true or false,
              "hasWrongLanguage": true or false,
              "detectedLanguage": "Russian" | "English" | "Azerbaijani" | "Other",
              "note": "REQUIRED. If isClean is false: the exact short reason in English (max 10 words) why this specific review failed moderation, naming the actual violation found (e.g. phone number, email, social media handle, profanity, advertising, link, unsupported language). If isClean is true: empty string."
            }
            """;

        var responseBody = await SendAiGenerateContentAsync(
            apiKey, prompt, maxOutputTokens: 4096, $"review {review.Id}", stoppingToken);

        if (responseBody == null)
            return null;

        return ParseResponse(responseBody, review.Id);
    }

    private (bool IsClean, string DetectedLanguage, string? Note)? ParseResponse(string responseBody, Guid reviewId)
    {
        try
        {
            var jsonText = ExtractJsonFromCandidateResponse(responseBody);
            if (string.IsNullOrWhiteSpace(jsonText))
            {
                _logger.LogWarning("AI response for review {ReviewId} contained no JSON object. Raw: {Body}",
                    reviewId, responseBody.Length > 500 ? responseBody[..500] : responseBody);
                return null;
            }

            using var resultDoc = JsonDocument.Parse(jsonText);
            var root = resultDoc.RootElement;

            var offensive = TryReadBool(root, "hasOffensiveContent");
            var advertising = TryReadBool(root, "hasAdvertising");
            var links = TryReadBool(root, "hasLinks");
            var wrongLang = TryReadBool(root, "hasWrongLanguage");
            var isCleanReported = TryReadBool(root, "isClean");
            var contact = TryReadBool(root, "hasContactInfo");
            var isClean = isCleanReported && !offensive && !advertising && !links && !contact && !wrongLang;
            var detectedLang = root.TryGetProperty("detectedLanguage", out var lang) && lang.ValueKind == JsonValueKind.String
                ? lang.GetString() ?? "Unknown"
                : "Unknown";

            string? note = null;
            if (!isClean)
            {
                note = root.TryGetProperty("note", out var noteProp) && noteProp.ValueKind == JsonValueKind.String
                    ? noteProp.GetString()?.Trim()
                    : null;
                if (string.IsNullOrWhiteSpace(note))
                {
                    note = "Review did not pass automated content moderation.";
                }
                if (note.Length > 200) note = note[..200];
            }

            return (isClean, detectedLang, note);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to parse AI response for review {ReviewId}. Body: {Body}",
                reviewId, responseBody.Length > 500 ? responseBody[..500] : responseBody);
            return null;
        }
    }

    private async Task ProcessPendingUserVerificationsAsync(string apiKey, CancellationToken stoppingToken)
    {
        using var scope = _scopeFactory.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        var allSessions = await db.UserSessions
            .Include(s => s.User)
            .ToListAsync(stoppingToken);

        var pendingSessions = allSessions
            .Where(s => s.Verification == VerificationStatus.InProgress)
            .ToList();

        if (pendingSessions.Count == 0)
        {
            _logger.LogInformation("Hourly user verification check: No users with InProgress status found (checked {Total} sessions).", allSessions.Count);
            return;
        }

        _logger.LogInformation("Hourly user verification check: Processing {Count} user(s) with InProgress status.", pendingSessions.Count);

        for (int i = 0; i < pendingSessions.Count; i++)
        {
            if (stoppingToken.IsCancellationRequested) break;

            var session = pendingSessions[i];
            if (session.User == null) continue;

            try
            {
                if (session.User.Role == UserRole.Bot || session.User.Role == UserRole.AI)
                {
                    session.Verification = VerificationStatus.Comfirmed;
                    db.Entry(session).Property(s => s.Verification).IsModified = true;
                    await db.SaveChangesAsync(stoppingToken);
                    _logger.LogInformation("User {UserId} ({Role}) automatically verified as Comfirmed.", session.UserId, session.User.Role);
                    continue;
                }

                var userName = session.User.Name?.Trim();
                if (string.IsNullOrWhiteSpace(userName))
                {
                    session.Verification = VerificationStatus.NotVerificated;
                    db.Entry(session).Property(s => s.Verification).IsModified = true;
                    await db.SaveChangesAsync(stoppingToken);
                    _logger.LogInformation("User {UserId} verification rejected (empty name) -> NotVerificated.", session.UserId);
                    continue;
                }

                var (isRealName, reason) = await VerifyUserNameWithAiAsync(apiKey, userName, session.UserId, stoppingToken);
                if (isRealName.HasValue)
                {
                    session.Verification = isRealName.Value
                        ? VerificationStatus.Comfirmed
                        : VerificationStatus.NotVerificated;
                    db.Entry(session).Property(s => s.Verification).IsModified = true;
                    await db.SaveChangesAsync(stoppingToken);

                    _logger.LogInformation(
                        "User {UserId} (Name='{UserName}') verification completed: IsRealName={IsRealName}, Status={Status}, Reason={Reason}",
                        session.UserId, userName, isRealName.Value, session.Verification, reason);
                }
                else
                {
                    _logger.LogWarning(
                        "User {UserId} (Name='{UserName}') verification returned no AI decision ({Reason}); remains InProgress.",
                        session.UserId, userName, reason);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to verify user {UserId}.", session.UserId);
            }

            if (i < pendingSessions.Count - 1)
            {
                await Task.Delay(DelayBetweenRequestsMs, stoppingToken);
            }
        }
    }

    private async Task<(bool? IsRealName, string Reason)> VerifyUserNameWithAiAsync(
        string apiKey,
        string userName,
        Guid userId,
        CancellationToken stoppingToken)
    {
        var prompt = $$"""
            You are an AI account verification assistant for a restaurant ordering service ("Süfrano").
            Analyze the following user profile name and determine whether it is a real human name:

            User Name: "{{userName}}"

            Your instructions:
            1. Real Human Name Check:
               - Valid real names include genuine human first names (e.g., "Elçin", "Aysel", "Murad", "Leyla", "Orxan", "Nigar", "Александр", "Дмитрий", "Елена", "John", "Sarah", "Mehmet") or full names / first + last names (e.g., "Elçin İmaməliyev", "Aysel Mammadova", "Иван Иванов", "John Smith") in any language (especially Azerbaijani, Russian, English, Turkish) and in Latin or Cyrillic script.
               - Standard ASCII transliterations of real names (e.g., "Elchin", "Ferid", "Resad", "Mehemmed", "Guler", "Ismayil") are completely valid and MUST be treated as real names (isRealName = true).
               - Minor casing variations (e.g., "elchin", "ELCHIN", "elçin imaməliyev") are still valid real human names (isRealName = true).

            2. Invalid / Fake Name Detection (isRealName MUST be false if ANY of the following apply):
               - Profanity, swear words, curses, vulgarities, insults, or offensive slang in any language (Azerbaijani, Russian, English, Turkish, etc., such as "pox", "sik", "göt", "peysər", "səfeh", "хуй", "пизда", "бля", "fuck", "shit", "bitch", etc.).
               - Random keyboard mashing, gibberish, or meaningless letter sequences (e.g., "asdf", "qwerty", "zxcvb", "aaaa", "hhhh", "dfghjk", "test", "user", "admin", "anonim", "guest", "none", "null").
               - Contains digits, phone numbers, URLs, emails, handles, or special symbols other than standard name hyphens/apostrophes/spaces (e.g., "Elchin123", "User99", "@elchin", "777", "bot_1").
               - Single letter or too short to be a real name (e.g., "A", "X", "Я").
               - Objects, food items, brands, animals, fictional/meme characters, or titles/roles instead of a human person's name (e.g., "Kebab", "Pizza", "Batman", "Terminator", "Shaurma", "SuperAdmin", "Президент", "Кот").

            Respond ONLY with a valid JSON object:
            {
              "isRealName": true or false,
              "hasOffensiveContent": true or false,
              "isGibberishOrFake": true or false,
              "reason": "Brief explanation in English"
            }
            """;

        var responseBody = await SendAiGenerateContentAsync(
            apiKey, prompt, maxOutputTokens: 4096, $"user verification {userId}", stoppingToken);

        if (responseBody == null)
        {
            return (null, "API request failed");
        }

        return ParseUserVerificationResponse(responseBody, userId);
    }

    private (bool? IsRealName, string Reason) ParseUserVerificationResponse(string responseBody, Guid userId)
    {
        try
        {
            var jsonText = ExtractJsonFromCandidateResponse(responseBody);
            if (string.IsNullOrWhiteSpace(jsonText))
            {
                _logger.LogWarning("AI response for user verification {UserId} contained no JSON object. Raw: {Body}",
                    userId, responseBody.Length > 500 ? responseBody[..500] : responseBody);
                return (null, "Empty or non-JSON AI response");
            }

            using var resultDoc = JsonDocument.Parse(jsonText);
            var root = resultDoc.RootElement;

            var isRealReported = TryReadBool(root, "isRealName");
            var offensive = TryReadBool(root, "hasOffensiveContent");
            var gibberishOrFake = TryReadBool(root, "isGibberishOrFake");
            var reason = root.TryGetProperty("reason", out var reasonProp) && reasonProp.ValueKind == JsonValueKind.String
                ? reasonProp.GetString() ?? string.Empty
                : string.Empty;

            var isReal = isRealReported && !offensive && !gibberishOrFake;
            return (isReal, reason);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to parse AI response for user verification {UserId}. Body: {Body}",
                userId, responseBody.Length > 500 ? responseBody[..500] : responseBody);
            return (null, "Parse error");
        }
    }
}
