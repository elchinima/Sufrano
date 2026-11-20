namespace Rednest.Api.Helpers;

public static class NameValidationHelper
{
    public const int MaxNameLength = 25;

    public static bool ContainsEmoji(string? text)
    {
        if (string.IsNullOrEmpty(text)) return false;

        foreach (var rune in text.EnumerateRunes())
        {
            if (rune.Value >= 0x10000) return true;
            if (rune.Value >= 0x2600 && rune.Value <= 0x27BF) return true;
            if (rune.Value >= 0xFE00 && rune.Value <= 0xFE0F) return true;
            if (rune.Value == 0x200D) return true;
            var cat = System.Globalization.CharUnicodeInfo.GetUnicodeCategory(rune.Value);
            if (cat == System.Globalization.UnicodeCategory.OtherSymbol ||
                cat == System.Globalization.UnicodeCategory.ModifierSymbol)
            {
                return true;
            }
        }

        return false;
    }
}
