using System.Security.Cryptography;

namespace Sufrano.Core.Entities;

public enum PrizeType
{
    SuperPrize = 0,
    FreeDrink = 1,
    FreeDessert = 2,
    Discount25 = 3,
    CashbackOnPurchases = 4,
    Discount50 = 5,
    DiscountCustom = 6
}

public class PrizeInfo
{
    public const string SourceWheel = "Wheel";
    public const string SourceAdmin = "Admin";

    public PrizeType Type { get; set; }
    public string PrizeName { get; set; } = string.Empty;
    public string PrizeDescription { get; set; } = string.Empty;
    public int CashbackPercent { get; set; } = 0;
    public int DiscountPercent { get; set; } = 0;
    public string Source { get; set; } = SourceWheel;
}

public static class PromoCodeGenerator
{
    private const string CodeAlphabet = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
    private const string DigitAlphabet = "0123456789";
    private const string NonZeroDigitAlphabet = "123456789";

    public static string GeneratePromoCode(int length = 8)
    {
        return RandomNumberGenerator.GetString(CodeAlphabet, length);
    }

    public static string GenerateBarCode(int length = 12)
    {
        if (length <= 1)
            return RandomNumberGenerator.GetString(NonZeroDigitAlphabet, 1);

        return RandomNumberGenerator.GetString(NonZeroDigitAlphabet, 1)
             + RandomNumberGenerator.GetString(DigitAlphabet, length - 1);
    }
}

public class PromoCodes
{
    public string PromoCode { get; set; } = string.Empty;
    public string BarCode { get; set; } = string.Empty;
}

public class PromoDates
{
    public DateTime ActivatedAt { get; set; }
    public DateTime ExpiresAt { get; set; }
}

public class UserPromo
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    
    public PromoCodes Codes { get; set; } = new PromoCodes();
    public PrizeInfo PrizeInfo { get; set; } = new PrizeInfo();
    public PromoDates Dates { get; set; } = new PromoDates();
    
    public bool IsActive { get; set; } = true;

    public User User { get; set; } = null!;
}

