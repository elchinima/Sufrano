namespace Rednest.Infrastructure.Services;

public class ReviewModerationService : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly ILogger<ReviewModerationService> _logger;

    private const int PollIntervalSeconds = 60;
    private const int DelayBetweenRequestsMs = 60000;

    private static readonly string Model = Environment.GetEnvironmentVariable("REVIEW_AI_MODEL") ?? "gemma-4-31b-it";
    private static readonly string BaseUrl = "https://generativelanguage.googleapis.com/v1beta/models";

    private static DateTime GetBakuTime() => DateTime.UtcNow.AddHours(4);

    public ReviewModerationService(
        IServiceScopeFactory scopeFactory,
        IHttpClientFactory httpClientFactory,
        ILogger<ReviewModerationService> logger)
    {
        _scopeFactory = scopeFactory;
        _httpClientFactory = httpClientFactory;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("ReviewModerationService started with model {Model}.", Model);

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

                var apiKey = Environment.GetEnvironmentVariable("REVIEW_AI_API");
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
            var delay = GetDelayUntilNextHour();
            var nextRunBaku = GetBakuTime().Add(delay);

            _logger.LogInformation(
                "Hourly user verification AI check scheduled at {NextRunBaku:yyyy-MM-dd HH:mm:ss} UTC+4 (in {Minutes}m {Seconds}s).",
                nextRunBaku, (int)delay.TotalMinutes, delay.Seconds);

            try
            {
                await Task.Delay(delay, stoppingToken);
            }
            catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
            {
                break;
            }

            try
            {
                var apiKey = Environment.GetEnvironmentVariable("REVIEW_AI_API");
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

    private static TimeSpan GetDelayUntilNextHour()
    {
        var bakuNow = GetBakuTime();
        var nextHour = new DateTime(bakuNow.Year, bakuNow.Month, bakuNow.Day, bakuNow.Hour, 0, 0, bakuNow.Kind).AddHours(1);
        var delay = nextHour - bakuNow;
        return delay > TimeSpan.Zero ? delay : TimeSpan.FromHours(1);
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
                var (isClean, detectedLanguage) = await ModerateReviewAsync(apiKey, review, stoppingToken);

                var parsedLang = ParseDetectedLanguage(detectedLanguage);
                review.Language = parsedLang;

                review.Status.Status = isClean ? ReviewStatus.Published : ReviewStatus.Verification;
                review.Status.UpdatedAt = GetBakuTime();

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

    private async Task<(bool IsClean, string DetectedLanguage)> ModerateReviewAsync(
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
               - Set hasLinks to true if there are URLs, domains, emails, phone numbers, or social media handles (@username); otherwise false.

            4. Overall Decision:
               - isClean must be true ONLY IF hasOffensiveContent is false, hasAdvertising is false, hasLinks is false, and hasWrongLanguage is false.
               - If any violation is found, isClean MUST be false.

            Respond ONLY with a valid JSON object:
            {
              "isClean": true or false,
              "hasOffensiveContent": true or false,
              "hasAdvertising": true or false,
              "hasLinks": true or false,
              "hasWrongLanguage": true or false,
              "detectedLanguage": "Russian" | "English" | "Azerbaijani" | "Other",
              "summary": "Brief explanation in English"
            }
            """;

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
            generationConfig = new
            {
                temperature = 0.1,
                maxOutputTokens = 2048,
                responseMimeType = "application/json"
            }
        };

        var json = JsonSerializer.Serialize(requestBody);
        var url = $"{BaseUrl}/{Model}:generateContent";

        var httpClient = _httpClientFactory.CreateClient();
        using var requestMessage = new HttpRequestMessage(HttpMethod.Post, url);
        requestMessage.Headers.Add("X-goog-api-key", apiKey);
        requestMessage.Content = new StringContent(json, Encoding.UTF8, "application/json");

        using var response = await httpClient.SendAsync(requestMessage, stoppingToken);
        var responseBody = await response.Content.ReadAsStringAsync(stoppingToken);

        if (!response.IsSuccessStatusCode)
        {
            _logger.LogWarning("AI API error for review {ReviewId}: {Status} - {Body}",
                review.Id, response.StatusCode, responseBody);
            return (false, "Unknown");
        }

        return ParseResponse(responseBody, review.Id);
    }

    private (bool IsClean, string DetectedLanguage) ParseResponse(string responseBody, Guid reviewId)
    {
        try
        {
            using var doc = JsonDocument.Parse(responseBody);
            var candidates = doc.RootElement.GetProperty("candidates");
            var firstCandidate = candidates[0];
            var parts = firstCandidate.GetProperty("content").GetProperty("parts");

            string text = string.Empty;
            foreach (var part in parts.EnumerateArray())
            {
                if (part.TryGetProperty("thought", out var isThought) && isThought.GetBoolean())
                {
                    continue;
                }
                if (part.TryGetProperty("text", out var textProp))
                {
                    text = textProp.GetString() ?? string.Empty;
                }
            }

            if (string.IsNullOrWhiteSpace(text))
            {
                text = parts[0].GetProperty("text").GetString() ?? string.Empty;
            }

            text = text.Trim();
            if (text.StartsWith("```"))
            {
                var startIdx = text.IndexOf('{');
                var endIdx = text.LastIndexOf('}');
                if (startIdx >= 0 && endIdx > startIdx)
                    text = text[startIdx..(endIdx + 1)];
            }

            using var resultDoc = JsonDocument.Parse(text);
            var root = resultDoc.RootElement;

            var offensive = root.GetProperty("hasOffensiveContent").GetBoolean();
            var advertising = root.GetProperty("hasAdvertising").GetBoolean();
            var links = root.GetProperty("hasLinks").GetBoolean();
            var wrongLang = root.GetProperty("hasWrongLanguage").GetBoolean();
            var isCleanReported = root.GetProperty("isClean").GetBoolean();
            var isClean = isCleanReported && !offensive && !advertising && !links && !wrongLang;
            var detectedLang = root.TryGetProperty("detectedLanguage", out var lang) ? lang.GetString() ?? "Unknown" : "Unknown";

            return (isClean, detectedLang);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to parse AI response for review {ReviewId}. Body: {Body}",
                reviewId, responseBody.Length > 500 ? responseBody[..500] : responseBody);
            return (false, "Unknown");
        }
    }

    private async Task ProcessPendingUserVerificationsAsync(string apiKey, CancellationToken stoppingToken)
    {
        using var scope = _scopeFactory.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        List<UserSession> pendingSessions;
        try
        {
            pendingSessions = await db.UserSessions
                .Include(s => s.User)
                .Where(s => s.Verification == VerificationStatus.InProgress)
                .ToListAsync(stoppingToken);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Direct LINQ query on Verification failed; falling back to in-memory filter.");
            var allSessions = await db.UserSessions
                .Include(s => s.User)
                .ToListAsync(stoppingToken);
            pendingSessions = allSessions
                .Where(s => s.Verification == VerificationStatus.InProgress)
                .ToList();
        }

        if (pendingSessions.Count == 0)
        {
            _logger.LogInformation("Hourly user verification check: No users with InProgress status found.");
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
            generationConfig = new
            {
                temperature = 0.1,
                maxOutputTokens = 1024,
                responseMimeType = "application/json"
            }
        };

        var json = JsonSerializer.Serialize(requestBody);
        var url = $"{BaseUrl}/{Model}:generateContent";

        var httpClient = _httpClientFactory.CreateClient();
        using var requestMessage = new HttpRequestMessage(HttpMethod.Post, url);
        requestMessage.Headers.Add("X-goog-api-key", apiKey);
        requestMessage.Content = new StringContent(json, Encoding.UTF8, "application/json");

        using var response = await httpClient.SendAsync(requestMessage, stoppingToken);
        var responseBody = await response.Content.ReadAsStringAsync(stoppingToken);

        if (!response.IsSuccessStatusCode)
        {
            _logger.LogWarning("AI API error for user verification {UserId}: {Status} - {Body}",
                userId, response.StatusCode, responseBody);
            return (null, "API request failed");
        }

        return ParseUserVerificationResponse(responseBody, userId);
    }

    private (bool? IsRealName, string Reason) ParseUserVerificationResponse(string responseBody, Guid userId)
    {
        try
        {
            using var doc = JsonDocument.Parse(responseBody);
            var candidates = doc.RootElement.GetProperty("candidates");
            var firstCandidate = candidates[0];
            var parts = firstCandidate.GetProperty("content").GetProperty("parts");

            string text = string.Empty;
            foreach (var part in parts.EnumerateArray())
            {
                if (part.TryGetProperty("thought", out var isThought) && isThought.GetBoolean())
                {
                    continue;
                }
                if (part.TryGetProperty("text", out var textProp))
                {
                    text = textProp.GetString() ?? string.Empty;
                }
            }

            if (string.IsNullOrWhiteSpace(text))
            {
                text = parts[0].GetProperty("text").GetString() ?? string.Empty;
            }

            text = text.Trim();
            if (text.StartsWith("```"))
            {
                var startIdx = text.IndexOf('{');
                var endIdx = text.LastIndexOf('}');
                if (startIdx >= 0 && endIdx > startIdx)
                    text = text[startIdx..(endIdx + 1)];
            }

            using var resultDoc = JsonDocument.Parse(text);
            var root = resultDoc.RootElement;

            var isRealReported = root.GetProperty("isRealName").GetBoolean();
            var offensive = root.TryGetProperty("hasOffensiveContent", out var offProp) && offProp.GetBoolean();
            var gibberishOrFake = root.TryGetProperty("isGibberishOrFake", out var fakeProp) && fakeProp.GetBoolean();
            var reason = root.TryGetProperty("reason", out var reasonProp) ? reasonProp.GetString() ?? string.Empty : string.Empty;

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
