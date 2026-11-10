namespace Rednest.Infrastructure.Services;

public class BrevoEmailService : IEmailService
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IConfiguration _configuration;
    private readonly ILogger<BrevoEmailService> _logger;
    private readonly IServiceScopeFactory _scopeFactory;

    public BrevoEmailService(
        IHttpClientFactory httpClientFactory, 
        IConfiguration configuration,
        ILogger<BrevoEmailService> logger,
        IServiceScopeFactory scopeFactory)
    {
        _httpClientFactory = httpClientFactory;
        _configuration = configuration;
        _logger = logger;
        _scopeFactory = scopeFactory;
    }

    private (string apiKey, string senderEmail, string senderName) GetBrevoConfig(string? customSenderName = null)
    {
        var apiKey = Environment.GetEnvironmentVariable("BREVO_API_KEY") 
                     ?? _configuration["BREVO_API_KEY"];

        if (string.IsNullOrWhiteSpace(apiKey) || apiKey.Contains("your-brevo-api-key"))
        {
            throw new InvalidOperationException("BREVO_API_KEY is not configured in secret/.env or configuration.");
        }

        var senderEmail = Environment.GetEnvironmentVariable("BREVO_SENDER_EMAIL") 
                          ?? _configuration["BREVO_SENDER_EMAIL"] 
                          ?? "myrednest@gmail.com";

        var defaultSenderName = Environment.GetEnvironmentVariable("BREVO_SENDER_NAME") 
                                 ?? _configuration["BREVO_SENDER_NAME"] 
                                 ?? "Süfrano";

        var actualSenderName = !string.IsNullOrWhiteSpace(customSenderName) 
            ? customSenderName.Trim() 
            : defaultSenderName;

        return (apiKey, senderEmail, actualSenderName);
    }

    public async Task SendTwoFactorCodeAsync(string toEmail, string code)
    {
        var (apiKey, senderEmail, senderName) = GetBrevoConfig();

        var htmlContent = $@"<!DOCTYPE html>
<html>
<head>
  <meta charset=""utf-8"">
  <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
  <title>Your Süfrano Verification Code</title>
</head>
<body style=""margin:0;padding:0;background-color:#140307;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#ffffff;"">
  <table width=""100%"" border=""0"" cellspacing=""0"" cellpadding=""0"" style=""background-color:#140307;padding:40px 20px;"">
    <tr>
      <td align=""center"">
        <table width=""100%"" border=""0"" cellspacing=""0"" cellpadding=""0"" style=""max-width:480px;background:#24050d;border:1px solid rgba(212,175,55,0.25);border-radius:16px;overflow:hidden;box-shadow:0 12px 40px rgba(0,0,0,0.6);"">
          <tr>
            <td style=""padding:36px 32px 24px;text-align:center;background:linear-gradient(180deg, #4a0e1c 0%, #24050d 100%);border-bottom:1px solid rgba(212,175,55,0.2);"">
              <h1 style=""margin:0;font-size:26px;font-weight:800;letter-spacing:1px;color:#d4af37;"">SÜFRANO</h1>
              <p style=""margin:8px 0 0;font-size:13px;letter-spacing:2px;text-transform:uppercase;color:#c9b38c;"">Two-Factor Authentication</p>
            </td>
          </tr>
          <tr>
            <td style=""padding:32px 32px 24px;text-align:center;"">
              <p style=""margin:0 0 20px;font-size:15px;line-height:1.5;color:#e5d8c5;"">
                Use the following 4-digit code to complete your sign in. This code is valid for <strong>15 minutes</strong>.
              </p>
              <div style=""display:inline-block;padding:16px 36px;background:#1a040a;border:1px solid rgba(212,175,55,0.4);border-radius:12px;margin:8px 0 24px;"">
                <span style=""font-size:36px;font-weight:800;letter-spacing:10px;color:#d4af37;font-family:'Courier New',Courier,monospace;"">{code}</span>
              </div>
              <p style=""margin:0 0 8px;font-size:13px;color:#9e8c7a;"">
                If you did not attempt to sign in to your Süfrano account, please ignore this email or update your password immediately.
              </p>
            </td>
          </tr>
          <tr>
            <td style=""padding:20px 32px;background:#140307;border-top:1px solid rgba(212,175,55,0.15);text-align:center;"">
              <p style=""margin:0;font-size:11px;color:#806d5b;"">
                &copy; {DateTime.UtcNow.Year} Süfrano. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>";

        var payload = new
        {
            sender = new { name = senderName, email = senderEmail },
            to = new[] { new { email = toEmail } },
            subject = $"{code} is your Süfrano verification code",
            htmlContent = htmlContent
        };

        var client = _httpClientFactory.CreateClient();
        using var request = new HttpRequestMessage(HttpMethod.Post, "https://api.brevo.com/v3/smtp/email");
        request.Headers.Add("api-key", apiKey);
        request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
        request.Content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");

        var response = await client.SendAsync(request);
        if (!response.IsSuccessStatusCode)
        {
            var err = await response.Content.ReadAsStringAsync();
            _logger.LogError("Brevo API 2FA error: {Error}", err);
            throw new InvalidOperationException($"Brevo API error: {err}");
        }

        await RecordEmailsSentAsync(1);
    }

    public async Task SendSubscriptionCodeAsync(string toEmail, string code)
    {
        var (apiKey, senderEmail, senderName) = GetBrevoConfig();

        var htmlContent = $@"<!DOCTYPE html>
<html>
<head>
  <meta charset=""utf-8"">
  <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
  <title>Confirm Your Süfrano Club Subscription</title>
</head>
<body style=""margin:0;padding:0;background-color:#140307;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#ffffff;"">
  <table width=""100%"" border=""0"" cellspacing=""0"" cellpadding=""0"" style=""background-color:#140307;padding:40px 20px;"">
    <tr>
      <td align=""center"">
        <table width=""100%"" border=""0"" cellspacing=""0"" cellpadding=""0"" style=""max-width:480px;background:#24050d;border:1px solid rgba(212,175,55,0.25);border-radius:16px;overflow:hidden;box-shadow:0 12px 40px rgba(0,0,0,0.6);"">
          <tr>
            <td style=""padding:36px 32px 24px;text-align:center;background:linear-gradient(180deg, #4a0e1c 0%, #24050d 100%);border-bottom:1px solid rgba(212,175,55,0.2);"">
              <h1 style=""margin:0;font-size:26px;font-weight:800;letter-spacing:1px;color:#d4af37;"">SÜFRANO CLUB</h1>
              <p style=""margin:8px 0 0;font-size:13px;letter-spacing:2px;text-transform:uppercase;color:#c9b38c;"">Newsletter Confirmation</p>
            </td>
          </tr>
          <tr>
            <td style=""padding:32px 32px 24px;text-align:center;"">
              <p style=""margin:0 0 20px;font-size:15px;line-height:1.5;color:#e5d8c5;"">
                Thank you for joining the Süfrano Club! Enter the 4-digit code below to confirm your subscription. This code is valid for <strong>15 minutes</strong>.
              </p>
              <div style=""display:inline-block;padding:16px 36px;background:#1a040a;border:1px solid rgba(212,175,55,0.4);border-radius:12px;margin:8px 0 24px;"">
                <span style=""font-size:36px;font-weight:800;letter-spacing:10px;color:#d4af37;font-family:'Courier New',Courier,monospace;"">{code}</span>
              </div>
              <p style=""margin:0 0 8px;font-size:13px;color:#9e8c7a;"">
                If you did not request this subscription, please ignore this email.
              </p>
            </td>
          </tr>
          <tr>
            <td style=""padding:20px 32px;background:#140307;border-top:1px solid rgba(212,175,55,0.15);text-align:center;"">
              <p style=""margin:0;font-size:11px;color:#806d5b;"">
                &copy; {DateTime.UtcNow.Year} Süfrano. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>";

        var payload = new
        {
            sender = new { name = senderName, email = senderEmail },
            to = new[] { new { email = toEmail } },
            subject = $"{code} is your Süfrano Club confirmation code",
            htmlContent = htmlContent
        };

        var client = _httpClientFactory.CreateClient();
        using var request = new HttpRequestMessage(HttpMethod.Post, "https://api.brevo.com/v3/smtp/email");
        request.Headers.Add("api-key", apiKey);
        request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
        request.Content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");

        var response = await client.SendAsync(request);
        if (!response.IsSuccessStatusCode)
        {
            var err = await response.Content.ReadAsStringAsync();
            _logger.LogError("Brevo API Subscription code error: {Error}", err);
            throw new InvalidOperationException($"Brevo API error: {err}");
        }

        await RecordEmailsSentAsync(1);
    }

    public async Task SendPasswordResetCodeAsync(string toEmail, string code)
    {
        var (apiKey, senderEmail, senderName) = GetBrevoConfig();

        var htmlContent = $@"<!DOCTYPE html>
<html>
<head>
  <meta charset=""utf-8"">
  <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
  <title>Your Süfrano Password Reset Code</title>
</head>
<body style=""margin:0;padding:0;background-color:#140307;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#ffffff;"">
  <table width=""100%"" border=""0"" cellspacing=""0"" cellpadding=""0"" style=""background-color:#140307;padding:40px 20px;"">
    <tr>
      <td align=""center"">
        <table width=""100%"" border=""0"" cellspacing=""0"" cellpadding=""0"" style=""max-width:480px;background:#24050d;border:1px solid rgba(212,175,55,0.25);border-radius:16px;overflow:hidden;box-shadow:0 12px 40px rgba(0,0,0,0.6);"">
          <tr>
            <td style=""padding:36px 32px 24px;text-align:center;background:linear-gradient(180deg, #4a0e1c 0%, #24050d 100%);border-bottom:1px solid rgba(212,175,55,0.2);"">
              <h1 style=""margin:0;font-size:26px;font-weight:800;letter-spacing:1px;color:#d4af37;"">SÜFRANO</h1>
              <p style=""margin:8px 0 0;font-size:13px;letter-spacing:2px;text-transform:uppercase;color:#c9b38c;"">Password Reset</p>
            </td>
          </tr>
          <tr>
            <td style=""padding:32px 32px 24px;text-align:center;"">
              <p style=""margin:0 0 20px;font-size:15px;line-height:1.5;color:#e5d8c5;"">
                You requested a password reset for your Süfrano account. Use the following 7-digit code to set a new password. This code is valid for <strong>15 minutes</strong>.
              </p>
              <div style=""display:inline-block;padding:16px 28px;background:#1a040a;border:1px solid rgba(212,175,55,0.4);border-radius:12px;margin:8px 0 24px;"">
                <span style=""font-size:32px;font-weight:800;letter-spacing:8px;color:#d4af37;font-family:'Courier New',Courier,monospace;"">{code}</span>
              </div>
              <p style=""margin:0 0 8px;font-size:13px;color:#9e8c7a;"">
                If you did not request a password reset, please ignore this email or make sure your account is secure.
              </p>
            </td>
          </tr>
          <tr>
            <td style=""padding:20px 32px;background:#140307;border-top:1px solid rgba(212,175,55,0.15);text-align:center;"">
              <p style=""margin:0;font-size:11px;color:#806d5b;"">
                &copy; {DateTime.UtcNow.Year} Süfrano. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>";

        var payload = new
        {
            sender = new { name = senderName, email = senderEmail },
            to = new[] { new { email = toEmail } },
            subject = $"{code} is your Süfrano password reset code",
            htmlContent = htmlContent
        };

        var client = _httpClientFactory.CreateClient();
        using var request = new HttpRequestMessage(HttpMethod.Post, "https://api.brevo.com/v3/smtp/email");
        request.Headers.Add("api-key", apiKey);
        request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
        request.Content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");

        var response = await client.SendAsync(request);
        if (!response.IsSuccessStatusCode)
        {
            var err = await response.Content.ReadAsStringAsync();
            _logger.LogError("Brevo API Password reset code error: {Error}", err);
            throw new InvalidOperationException($"Brevo API error: {err}");
        }

        await RecordEmailsSentAsync(1);
    }

    public async Task SendNewsletterEmailAsync(string toEmail, string subject, string htmlContent, string? senderName = null)
    {
        var (apiKey, senderEmail, actualSenderName) = GetBrevoConfig(senderName);

        var client = _httpClientFactory.CreateClient();
        using var request = new HttpRequestMessage(HttpMethod.Post, "https://api.brevo.com/v3/smtp/email");
        request.Headers.Add("api-key", apiKey);
        request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

        var payload = new
        {
            sender = new { name = actualSenderName, email = senderEmail },
            to = new[] { new { email = toEmail } },
            subject = subject,
            htmlContent = htmlContent
        };

        request.Content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");
        var response = await client.SendAsync(request);

        if (!response.IsSuccessStatusCode)
        {
            var err = await response.Content.ReadAsStringAsync();
            _logger.LogError("Brevo API Newsletter send error: {Error}", err);
            throw new InvalidOperationException($"Brevo API error: {err}");
        }

        await RecordEmailsSentAsync(1);
    }

    public string BuildNewsletterHtml(
        string subject,
        string? preheader,
        string? badge,
        string? heading,
        string bodyHtml,
        string? buttonText = null,
        string? buttonUrl = null,
        string? recipientName = null,
        string? recipientEmail = null)
    {
        var year = DateTime.UtcNow.Year.ToString();
        var safeRecipientName = !string.IsNullOrWhiteSpace(recipientName)
            ? recipientName.Trim()
            : (!string.IsNullOrWhiteSpace(recipientEmail) && recipientEmail.Contains('@')
                ? char.ToUpper(recipientEmail.Split('@')[0][0]) + recipientEmail.Split('@')[0][1..]
                : "Valued Member");
        var safeRecipientEmail = !string.IsNullOrWhiteSpace(recipientEmail) ? recipientEmail.Trim() : "";

        var processedSubject = ProcessTemplateTags(subject, safeRecipientName, safeRecipientEmail, year);
        var processedPreheader = ProcessTemplateTags(preheader, safeRecipientName, safeRecipientEmail, year);
        var processedBadge = ProcessTemplateTags(badge, safeRecipientName, safeRecipientEmail, year);
        var processedHeading = ProcessTemplateTags(heading, safeRecipientName, safeRecipientEmail, year);
        var processedBody = ProcessTemplateTags(bodyHtml, safeRecipientName, safeRecipientEmail, year);
        var processedButtonText = ProcessTemplateTags(buttonText, safeRecipientName, safeRecipientEmail, year);
        var processedButtonUrl = ProcessTemplateTags(buttonUrl, safeRecipientName, safeRecipientEmail, year);

        var preheaderHtml = !string.IsNullOrWhiteSpace(processedPreheader)
            ? $@"<div style=""display:none;font-size:1px;color:#140307;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;"">{System.Net.WebUtility.HtmlEncode(processedPreheader)}</div>"
            : "";

        var badgeHtml = !string.IsNullOrWhiteSpace(processedBadge)
            ? $@"<div style=""display:inline-block;padding:5px 14px;background:rgba(212,175,55,0.15);border:1px solid rgba(212,175,55,0.4);border-radius:20px;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#d4af37;margin-bottom:14px;"">{System.Net.WebUtility.HtmlEncode(processedBadge)}</div>"
            : "";

        var headingHtml = !string.IsNullOrWhiteSpace(processedHeading)
            ? $@"<h2 style=""margin:0 0 16px 0;font-size:22px;font-weight:700;color:#ffffff;line-height:1.3;letter-spacing:-0.3px;"">{System.Net.WebUtility.HtmlEncode(processedHeading)}</h2>"
            : "";

        var buttonHtml = (!string.IsNullOrWhiteSpace(processedButtonText) && !string.IsNullOrWhiteSpace(processedButtonUrl))
            ? $@"<div style=""margin:32px 0 16px;text-align:center;"">
                  <a href=""{System.Net.WebUtility.HtmlEncode(processedButtonUrl)}"" target=""_blank"" style=""display:inline-block;padding:14px 34px;background:linear-gradient(135deg, #d4af37 0%, #b5892e 100%);color:#24050d;font-size:15px;font-weight:700;letter-spacing:0.5px;text-decoration:none;border-radius:12px;box-shadow:0 6px 20px rgba(212,175,55,0.35);"">
                    {System.Net.WebUtility.HtmlEncode(processedButtonText)}
                  </a>
                </div>"
            : "";

        return $@"<!DOCTYPE html>
<html lang=""en"">
<head>
  <meta charset=""utf-8"">
  <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
  <title>{System.Net.WebUtility.HtmlEncode(processedSubject)}</title>
</head>
<body style=""margin:0;padding:0;background-color:#140307;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;color:#e2e8f0;"">
  {preheaderHtml}
  <table width=""100%"" border=""0"" cellspacing=""0"" cellpadding=""0"" style=""background-color:#140307;padding:40px 16px;"">
    <tr>
      <td align=""center"">
        <table width=""100%"" border=""0"" cellspacing=""0"" cellpadding=""0"" style=""max-width:580px;background:#24050d;border:1px solid rgba(212,175,55,0.25);border-radius:16px;overflow:hidden;box-shadow:0 20px 50px rgba(0,0,0,0.6);"">
          <tr>
            <td style=""padding:32px 28px 24px;text-align:center;background:radial-gradient(ellipse at top, #4a0e1c 0%, #24050d 100%);border-bottom:1px solid rgba(212,175,55,0.2);"">
              <h1 style=""margin:0;font-size:28px;font-weight:900;letter-spacing:3px;color:#d4af37;"">SÜFRANO</h1>
              <p style=""margin:6px 0 0;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#c9b38c;"">Exclusive Member Newsletter</p>
            </td>
          </tr>
          <tr>
            <td style=""padding:36px 32px 28px;color:#e5d8c5;font-size:15px;line-height:1.7;"">
              {badgeHtml}
              {headingHtml}
              <div style=""color:#e5d8c5;font-size:15px;line-height:1.7;"">
                {processedBody}
              </div>
              {buttonHtml}
            </td>
          </tr>
          <tr>
            <td style=""padding:24px 32px;background:#140307;border-top:1px solid rgba(212,175,55,0.15);text-align:center;color:#9e8c7a;font-size:12px;line-height:1.6;"">
              <p style=""margin:0 0 6px 0;"">You are receiving this email because you subscribed to the Süfrano Club.</p>
              <p style=""margin:0;"">&copy; {year} Süfrano. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>";
    }

    private static string ProcessTemplateTags(string? text, string recipientName, string recipientEmail, string year)
    {
        if (string.IsNullOrEmpty(text))
            return string.Empty;

        return System.Text.RegularExpressions.Regex.Replace(text, @"\{name\}", recipientName, System.Text.RegularExpressions.RegexOptions.IgnoreCase)
            .Replace("{email}", recipientEmail, StringComparison.OrdinalIgnoreCase)
            .Replace("{year}", year, StringComparison.OrdinalIgnoreCase);
    }

    private async Task RecordEmailsSentAsync(int count)
    {
        try
        {
            using var scope = _scopeFactory.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

            var utcNow = DateTime.UtcNow;
            var bakuNow = utcNow.AddHours(4);
            var monthYear = bakuNow.ToString("MMMM, yyyy", CultureInfo.InvariantCulture);
            var todayDate = bakuNow.ToString("yyyy-MM-dd");

            var record = await context.Analytics.FirstOrDefaultAsync(a => a.MonthYear == monthYear);
            if (record == null)
            {
                record = new Analytics
                {
                    MonthYear = monthYear,
                    CreatedAt = utcNow,
                    UpdatedAt = utcNow
                };
                context.Analytics.Add(record);
            }

            record.EmailsSent ??= new DailyEmailsSentData();
            record.EmailsSent.Days ??= new List<DailyEmailRecord>();

            var todayRecord = record.EmailsSent.Days.FirstOrDefault(d => d.Date == todayDate);
            if (todayRecord == null)
            {
                todayRecord = new DailyEmailRecord
                {
                    Date = todayDate,
                    SentCount = count,
                    DailyLimit = 300,
                    UpdatedAt = utcNow
                };
                record.EmailsSent.Days.Add(todayRecord);
            }
            else
            {
                todayRecord.SentCount += count;
                todayRecord.DailyLimit = 300;
                todayRecord.UpdatedAt = utcNow;
            }

            record.EmailsSent.TodaySent = todayRecord.SentCount;
            record.EmailsSent.DailyLimit = 300;
            record.EmailsSent.MonthlyTotal = record.EmailsSent.Days.Sum(d => d.SentCount);
            record.EmailsSent.UpdatedAt = utcNow;
            record.UpdatedAt = utcNow;

            context.Entry(record).State = EntityState.Modified;
            await context.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to record sent email metrics");
        }
    }
}
