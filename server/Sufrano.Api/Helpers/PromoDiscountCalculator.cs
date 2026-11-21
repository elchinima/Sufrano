namespace Sufrano.Api.Helpers;

/// <summary>
/// Server-side promo calculation (mirrors the rules used by OrdersController) so that
/// amounts are never trusted from the client.
/// </summary>
public static class PromoDiscountCalculator
{
    public static decimal GetEffectivePrice(Sufrano.Core.Entities.Product p) =>
        Math.Max(0m, p.Prices?.DiscountPrice ?? p.Prices?.Price ?? 0m);

    private static bool IsDrink(string? category) =>
        !string.IsNullOrEmpty(category) && (
            new[] { "Beverages", "Drinks", "Main Drinks", "Specialty Drinks" }.Contains(category, StringComparer.OrdinalIgnoreCase) ||
            category.Contains("Drink", StringComparison.OrdinalIgnoreCase) ||
            category.Contains("Beverage", StringComparison.OrdinalIgnoreCase) ||
            category.Contains("Coffee", StringComparison.OrdinalIgnoreCase) ||
            category.Contains("Tea", StringComparison.OrdinalIgnoreCase) ||
            category.Contains("İçki", StringComparison.OrdinalIgnoreCase) ||
            category.Contains("Напит", StringComparison.OrdinalIgnoreCase));

    private static bool IsDessert(string? category) =>
        !string.IsNullOrEmpty(category) && (
            string.Equals(category, "Desserts", StringComparison.OrdinalIgnoreCase) ||
            category.Contains("Dessert", StringComparison.OrdinalIgnoreCase) ||
            category.Contains("Desert", StringComparison.OrdinalIgnoreCase) ||
            category.Contains("Десерт", StringComparison.OrdinalIgnoreCase) ||
            category.Contains("Sweet", StringComparison.OrdinalIgnoreCase) ||
            category.Contains("Cake", StringComparison.OrdinalIgnoreCase) ||
            category.Contains("Bakery", StringComparison.OrdinalIgnoreCase));

    private static decimal FreeItemDiscount(
        IReadOnlyList<(Sufrano.Core.Entities.Product Product, int Quantity)> lines,
        decimal originalTotal,
        Func<string?, bool> predicate)
    {
        var items = lines.Where(l => predicate(l.Product.Category)).ToList();
        if (items.Count == 0) return 0m;

        var qty = items.Sum(l => l.Quantity);
        var price = items.Sum(l => GetEffectivePrice(l.Product) * l.Quantity);
        var avg = Math.Round(price / qty, 2);
        return originalTotal - avg >= 10.00m ? avg : 0m;
    }

    public static (decimal Discount, int CashbackPercent) Calculate(
        Sufrano.Core.Entities.UserPromo promo,
        IReadOnlyList<(Sufrano.Core.Entities.Product Product, int Quantity)> lines,
        decimal originalTotal)
    {
        decimal discount = 0m;
        int cashbackPercent = 0;

        switch (promo.PrizeInfo.Type)
        {
            case Sufrano.Core.Entities.PrizeType.Discount25:
                if (originalTotal >= 50m)
                    discount = Math.Min(Math.Round(originalTotal * 0.15m, 2), 15m);
                break;

            case Sufrano.Core.Entities.PrizeType.Discount50:
                if (originalTotal >= 50m)
                    discount = Math.Min(Math.Round(originalTotal * 0.25m, 2), 25m);
                break;

            case Sufrano.Core.Entities.PrizeType.DiscountCustom:
                var pct = Math.Clamp(promo.PrizeInfo.DiscountPercent, 0, 100);
                if (pct > 0)
                {
                    if ((pct == 15 || pct == 25) && originalTotal < 50m)
                    {
                        discount = 0m;
                    }
                    else
                    {
                        var raw = Math.Round(originalTotal * (pct / 100m), 2);
                        if (pct == 15) raw = Math.Min(raw, 15m);
                        else if (pct == 25) raw = Math.Min(raw, 25m);
                        discount = raw;
                    }
                }
                break;

            case Sufrano.Core.Entities.PrizeType.SuperPrize:
                if (originalTotal >= 100m)
                    discount = Math.Min(originalTotal, 30m);
                break;

            case Sufrano.Core.Entities.PrizeType.FreeDrink:
                discount = FreeItemDiscount(lines, originalTotal, IsDrink);
                break;

            case Sufrano.Core.Entities.PrizeType.FreeDessert:
                discount = FreeItemDiscount(lines, originalTotal, IsDessert);
                break;

            case Sufrano.Core.Entities.PrizeType.CashbackOnPurchases:
                cashbackPercent = promo.PrizeInfo.CashbackPercent;
                if (cashbackPercent <= 0) cashbackPercent = 10;
                break;
        }

        discount = Math.Min(Math.Max(0m, discount), originalTotal);

        if (discount <= 0m && cashbackPercent <= 0 && promo.PrizeInfo.CashbackPercent > 0)
        {
            cashbackPercent = promo.PrizeInfo.CashbackPercent;
        }

        cashbackPercent = Math.Clamp(cashbackPercent, 0, 100);
        return (discount, cashbackPercent);
    }
}
