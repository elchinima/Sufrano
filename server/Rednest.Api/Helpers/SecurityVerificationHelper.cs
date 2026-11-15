namespace Rednest.Api.Helpers;

public static class SecurityVerificationHelper
{
    public const string CookieName = "user_security_token";
    public const string TwoFactorChallengeCookieName = "two_factor_challenge";
    public const int ExpirationMinutes = 30;
    public const int TwoFactorChallengeMinutes = 15;

    public static string GetJwtSecret(IConfiguration? configuration = null)
    {
        var jwtSecret = Environment.GetEnvironmentVariable("JWT_SECRET")
                        ?? configuration?["JWT_SECRET"];
        if (string.IsNullOrWhiteSpace(jwtSecret))
        {
            throw new InvalidOperationException("JWT_SECRET environment variable is not configured.");
        }

        return jwtSecret.Trim();
    }

    public static byte[] GetJwtKeyBytes(IConfiguration? configuration = null)
    {
        var jwtSecret = GetJwtSecret(configuration);
        return SHA256.HashData(Encoding.UTF8.GetBytes(jwtSecret));
    }

    private static string GetSigningKey()
    {
        var jwtSecret = GetJwtSecret();
        return $"security_verification_key_{jwtSecret}";
    }

    private static string GetTwoFactorSigningKey()
    {
        var jwtSecret = GetJwtSecret();
        return $"two_factor_challenge_key_{jwtSecret}";
    }

    public static string GenerateSignedToken(string userId)
    {
        var key = Encoding.UTF8.GetBytes(GetSigningKey());
        var timestamp = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
        var payload = $"{userId}:{timestamp}";
        var payloadBytes = Encoding.UTF8.GetBytes(payload);
        var hash = HMACSHA256.HashData(key, payloadBytes);
        var signature = Convert.ToBase64String(hash);
        return $"{payload}:{signature}";
    }

    public static bool ValidateToken(string? token, string expectedUserId)
    {
        if (string.IsNullOrWhiteSpace(token))
            return false;

        try
        {
            var parts = token.Split(':');
            if (parts.Length != 3)
                return false;

            var userId = parts[0];
            var timestampStr = parts[1];
            var signature = parts[2];

            if (!string.Equals(userId, expectedUserId, StringComparison.OrdinalIgnoreCase))
                return false;

            if (!long.TryParse(timestampStr, out var timestamp))
                return false;

            var tokenTime = DateTimeOffset.FromUnixTimeSeconds(timestamp);
            if (DateTimeOffset.UtcNow - tokenTime > TimeSpan.FromMinutes(ExpirationMinutes))
                return false;

            var key = Encoding.UTF8.GetBytes(GetSigningKey());
            var payload = $"{userId}:{timestampStr}";
            var payloadBytes = Encoding.UTF8.GetBytes(payload);
            var expectedHash = HMACSHA256.HashData(key, payloadBytes);
            var expectedSignature = Convert.ToBase64String(expectedHash);

            return CryptographicOperations.FixedTimeEquals(
                Encoding.UTF8.GetBytes(signature),
                Encoding.UTF8.GetBytes(expectedSignature));
        }
        catch
        {
            return false;
        }
    }

    public static string GenerateTwoFactorChallengeToken(string email)
    {
        var normalizedEmail = email.Trim().ToLowerInvariant();
        var emailB64 = Convert.ToBase64String(Encoding.UTF8.GetBytes(normalizedEmail));
        var key = Encoding.UTF8.GetBytes(GetTwoFactorSigningKey());
        var timestamp = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
        var payload = $"{emailB64}:{timestamp}";
        var payloadBytes = Encoding.UTF8.GetBytes(payload);
        var hash = HMACSHA256.HashData(key, payloadBytes);
        var signature = Convert.ToBase64String(hash);
        return $"{payload}:{signature}";
    }

    public static bool ValidateTwoFactorChallengeToken(string? token, string? expectedEmail)
    {
        if (string.IsNullOrWhiteSpace(token) || string.IsNullOrWhiteSpace(expectedEmail))
            return false;

        try
        {
            var parts = token.Split(':');
            if (parts.Length != 3)
                return false;

            var emailB64 = parts[0];
            var timestampStr = parts[1];
            var signature = parts[2];

            var normalizedExpectedEmail = expectedEmail.Trim().ToLowerInvariant();
            var decodedEmail = Encoding.UTF8.GetString(Convert.FromBase64String(emailB64));
            if (!string.Equals(decodedEmail, normalizedExpectedEmail, StringComparison.Ordinal))
                return false;

            if (!long.TryParse(timestampStr, out var timestamp))
                return false;

            var tokenTime = DateTimeOffset.FromUnixTimeSeconds(timestamp);
            if (DateTimeOffset.UtcNow - tokenTime > TimeSpan.FromMinutes(TwoFactorChallengeMinutes))
                return false;

            var key = Encoding.UTF8.GetBytes(GetTwoFactorSigningKey());
            var payload = $"{emailB64}:{timestampStr}";
            var payloadBytes = Encoding.UTF8.GetBytes(payload);
            var expectedHash = HMACSHA256.HashData(key, payloadBytes);
            var expectedSignature = Convert.ToBase64String(expectedHash);

            return CryptographicOperations.FixedTimeEquals(
                Encoding.UTF8.GetBytes(signature),
                Encoding.UTF8.GetBytes(expectedSignature));
        }
        catch
        {
            return false;
        }
    }

    public static CookieOptions SecurityCookieOptions() => new()
    {
        HttpOnly = true,
        Secure = true,
        SameSite = SameSiteMode.None,
        Path = "/",
        Expires = DateTimeOffset.UtcNow.AddMinutes(ExpirationMinutes)
    };

    public static CookieOptions TwoFactorChallengeCookieOptions() => new()
    {
        HttpOnly = true,
        Secure = true,
        SameSite = SameSiteMode.None,
        Path = "/",
        Expires = DateTimeOffset.UtcNow.AddMinutes(TwoFactorChallengeMinutes)
    };

    public static void AppendSecurityCookie(HttpResponse response, string userId)
    {
        var token = GenerateSignedToken(userId);
        response.Cookies.Append(CookieName, token, SecurityCookieOptions());
    }

    public static void DeleteSecurityCookie(HttpResponse response)
    {
        response.Cookies.Delete(CookieName, SecurityCookieOptions());
    }

    public static string AppendTwoFactorChallengeCookie(HttpResponse response, string email)
    {
        var token = GenerateTwoFactorChallengeToken(email);
        response.Cookies.Append(TwoFactorChallengeCookieName, token, TwoFactorChallengeCookieOptions());
        return token;
    }

    public static void DeleteTwoFactorChallengeCookie(HttpResponse response)
    {
        response.Cookies.Delete(TwoFactorChallengeCookieName, TwoFactorChallengeCookieOptions());
    }
}
