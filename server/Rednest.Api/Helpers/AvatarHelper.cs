namespace Rednest.Api.Helpers;

public static class AvatarHelper
{
    public const string DefaultAvatarPath = "/assets/images/user_default_avatar.webp";

    public static bool IsDefaultOrEmpty(string? url)
    {
        if (string.IsNullOrWhiteSpace(url))
            return true;

        var pathWithoutQuery = url.Trim().Split('?', '#')[0];
        return string.Equals(pathWithoutQuery, DefaultAvatarPath, StringComparison.OrdinalIgnoreCase)
            || pathWithoutQuery.EndsWith("/user_default_avatar.webp", StringComparison.OrdinalIgnoreCase);
    }

    public static string Resolve(string? url)
    {
        return IsDefaultOrEmpty(url) ? DefaultAvatarPath : url!;
    }
}
