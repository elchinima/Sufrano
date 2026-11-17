namespace Rednest.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class OrdersController : ControllerBase
{
    private readonly IUserRepository _userRepository;
    private readonly AppDbContext _context;
    private readonly IAnalyticsTrackingService _analyticsTrackingService;
    private static readonly System.Collections.Concurrent.ConcurrentDictionary<Guid, SemaphoreSlim> OrderLocks = new();

    public OrdersController(IUserRepository userRepository, AppDbContext context, IAnalyticsTrackingService analyticsTrackingService)
    {
        _userRepository = userRepository;
        _context = context;
        _analyticsTrackingService = analyticsTrackingService;
    }

    private Guid? GetUserId()
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out var userId))
            return null;
        return userId;
    }

    private static DateTime GetBakuTime() => DateTime.UtcNow.AddHours(4);

    private async Task<OrderCalculationResult?> CalculateOrderAsync(Guid userId, UserBasket basket, string? selectedPromoCode = null)
    {
        if (basket.Items == null || basket.Items.Count == 0) return null;

        var validBasketItems = basket.Items
            .Where(i => i.ProductId != Guid.Empty && i.Quantity > 0)
            .Select(i => new BasketItem
            {
                ProductId = i.ProductId,
                AddedAt = i.AddedAt,
                Quantity = Math.Clamp(i.Quantity, 1, 100)
            })
            .ToList();

        if (validBasketItems.Count == 0) return null;

        var productIds = validBasketItems.Select(i => i.ProductId).Distinct().ToList();
        var products = await _context.Products
            .Where(p => productIds.Contains(p.Id) && p.IsActive)
            .AsNoTracking()
            .ToListAsync();

        var enriched = validBasketItems
            .Select(i => new
            {
                Item = i,
                Product = products.FirstOrDefault(p => p.Id == i.ProductId)
            })
            .Where(x => x.Product != null)
            .ToList();

        if (enriched.Count == 0) return null;

        static decimal GetEffectivePrice(Rednest.Core.Entities.Product p) =>
            Math.Max(0m, p.Prices?.DiscountPrice ?? p.Prices?.Price ?? 0m);

        decimal originalTotal = Math.Round(enriched.Sum(x => GetEffectivePrice(x.Product!) * x.Item.Quantity), 2);
        decimal discount = 0m;
        decimal cashbackAmount = 0m;
        int cashbackPercent = 0;
        string? appliedPromoCode = null;
        string? appliedPromoName = null;

        UserPromo? promo = null;
        if (string.Equals(selectedPromoCode?.Trim(), "NONE", StringComparison.OrdinalIgnoreCase))
        {
            promo = null;
        }
        else if (!string.IsNullOrWhiteSpace(selectedPromoCode))
        {
            var code = selectedPromoCode.Trim().ToUpperInvariant();
            promo = await _context.UserPromos
                .FirstOrDefaultAsync(p => p.UserId == userId && p.Codes.PromoCode == code && p.IsActive);
        }
        else
        {
            promo = await _userRepository.GetActiveUserPromoAsync(userId);
        }

        if (promo != null && promo.IsActive && promo.Dates.ExpiresAt >= DateTime.UtcNow)
        {
            switch (promo.PrizeInfo.Type)
            {
                case PrizeType.Discount25:
                    if (originalTotal >= 50.00m)
                    {
                        discount = Math.Min(Math.Round(originalTotal * 0.15m, 2), 15.00m);
                    }
                    break;

                case PrizeType.Discount50:
                    if (originalTotal >= 50.00m)
                    {
                        discount = Math.Min(Math.Round(originalTotal * 0.25m, 2), 25.00m);
                    }
                    break;

                case PrizeType.DiscountCustom:
                    if (promo.PrizeInfo.DiscountPercent > 0)
                    {
                        if ((promo.PrizeInfo.DiscountPercent == 15 || promo.PrizeInfo.DiscountPercent == 25) && originalTotal < 50.00m)
                        {
                            discount = 0m;
                        }
                        else
                        {
                            var rawDiscount = Math.Round(originalTotal * (promo.PrizeInfo.DiscountPercent / 100m), 2);
                            if (promo.PrizeInfo.DiscountPercent == 15) rawDiscount = Math.Min(rawDiscount, 15.00m);
                            else if (promo.PrizeInfo.DiscountPercent == 25) rawDiscount = Math.Min(rawDiscount, 25.00m);
                            discount = rawDiscount;
                        }
                    }
                    break;

                case PrizeType.SuperPrize:
                    if (originalTotal >= 100.00m)
                    {
                        discount = Math.Min(originalTotal, 30.00m);
                    }
                    break;

                case PrizeType.FreeDrink:
                {
                    var drinkCategories = new[] { "Beverages", "Drinks", "Main Drinks", "Specialty Drinks" };
                    var drinks = enriched.Where(x =>
                        drinkCategories.Contains(x.Product!.Category, StringComparer.OrdinalIgnoreCase) ||
                        (x.Product.Category != null && (
                            x.Product.Category.Contains("Drink", StringComparison.OrdinalIgnoreCase) ||
                            x.Product.Category.Contains("Beverage", StringComparison.OrdinalIgnoreCase) ||
                            x.Product.Category.Contains("Coffee", StringComparison.OrdinalIgnoreCase) ||
                            x.Product.Category.Contains("Tea", StringComparison.OrdinalIgnoreCase) ||
                            x.Product.Category.Contains("İçki", StringComparison.OrdinalIgnoreCase) ||
                            x.Product.Category.Contains("Напит", StringComparison.OrdinalIgnoreCase)
                        ))).ToList();
                    if (drinks.Count > 0)
                    {
                        var totalDrinkQty = drinks.Sum(x => x.Item.Quantity);
                        var totalDrinkPrice = drinks.Sum(x => GetEffectivePrice(x.Product!) * x.Item.Quantity);
                        var avgDrinkPrice = Math.Round(totalDrinkPrice / totalDrinkQty, 2);
                        if (originalTotal - avgDrinkPrice >= 10.00m)
                        {
                            discount = avgDrinkPrice;
                        }
                    }
                    break;
                }

                case PrizeType.FreeDessert:
                {
                    var desserts = enriched.Where(x =>
                        string.Equals(x.Product!.Category, "Desserts", StringComparison.OrdinalIgnoreCase) ||
                        (x.Product.Category != null && (
                            x.Product.Category.Contains("Dessert", StringComparison.OrdinalIgnoreCase) ||
                            x.Product.Category.Contains("Desert", StringComparison.OrdinalIgnoreCase) ||
                            x.Product.Category.Contains("Десерт", StringComparison.OrdinalIgnoreCase) ||
                            x.Product.Category.Contains("Sweet", StringComparison.OrdinalIgnoreCase) ||
                            x.Product.Category.Contains("Cake", StringComparison.OrdinalIgnoreCase) ||
                            x.Product.Category.Contains("Bakery", StringComparison.OrdinalIgnoreCase)
                        ))).ToList();
                    if (desserts.Count > 0)
                    {
                        var totalDessertQty = desserts.Sum(x => x.Item.Quantity);
                        var totalDessertPrice = desserts.Sum(x => GetEffectivePrice(x.Product!) * x.Item.Quantity);
                        var avgDessertPrice = Math.Round(totalDessertPrice / totalDessertQty, 2);
                        if (originalTotal - avgDessertPrice >= 10.00m)
                        {
                            discount = avgDessertPrice;
                        }
                    }
                    break;
                }

                case PrizeType.CashbackOnPurchases:
                    discount = 0m;
                    cashbackPercent = promo.PrizeInfo.CashbackPercent;
                    if (cashbackPercent <= 0 && !string.IsNullOrEmpty(promo.PrizeInfo.PrizeDescription))
                    {
                        var m = Regex.Match(promo.PrizeInfo.PrizeDescription, @"(\d+)\s*%");
                        if (m.Success && int.TryParse(m.Groups[1].Value, out var parsedCb))
                            cashbackPercent = parsedCb;
                    }
                    if (cashbackPercent <= 0) cashbackPercent = 10;
                    break;

                default:
                    discount = 0m;
                    break;
            }

            if (discount > 0)
            {
                discount = Math.Min(discount, originalTotal);
                appliedPromoCode = promo.Codes.PromoCode;
                appliedPromoName = promo.PrizeInfo.Type switch
                {
                    PrizeType.Discount25 => "DISCOUNT UP TO 15%",
                    PrizeType.Discount50 => "DISCOUNT UP TO 25%",
                    PrizeType.SuperPrize => "SUPER PRIZE",
                    _ => promo.PrizeInfo.PrizeName
                };
            }
            else if (promo.PrizeInfo.Type == PrizeType.CashbackOnPurchases || promo.PrizeInfo.CashbackPercent > 0)
            {
                if (cashbackPercent <= 0)
                {
                    cashbackPercent = promo.PrizeInfo.CashbackPercent > 0 ? promo.PrizeInfo.CashbackPercent : 10;
                }
                var payable = Math.Max(0m, Math.Round(originalTotal - discount, 2));
                cashbackAmount = Math.Round(payable * (cashbackPercent / 100m), 2);
                appliedPromoCode = promo.Codes.PromoCode;
                appliedPromoName = $"{cashbackPercent}% CASHBACK ON PURCHASES";
            }
        }

        decimal totalAmount = Math.Max(0m, Math.Round(originalTotal - discount, 2));

        var orderItems = enriched.Select(x => new OrderProductItem
        {
            ProductId = x.Product!.Id,
            Quantity = x.Item.Quantity,
            UnitPrice = GetEffectivePrice(x.Product!)
        }).ToList();

        return new OrderCalculationResult
        {
            OriginalTotal = originalTotal,
            Discount = discount,
            TotalAmount = totalAmount,
            CashbackAmount = cashbackAmount,
            CashbackPercent = cashbackPercent,
            AppliedPromoCode = appliedPromoCode,
            AppliedPromoName = appliedPromoName,
            Promo = promo,
            OrderItems = orderItems
        };
    }

    [HttpGet("stripe/config")]
    [AllowAnonymous]
    public IActionResult GetStripeConfig()
    {
        var publishableKey = StripWhitespace(
            Environment.GetEnvironmentVariable("STRIPE_PUBLISHABLE_KEY")
            ?? Environment.GetEnvironmentVariable("VITE_STRIPE_PUBLISHABLE_KEY")
            ?? "");
        return Ok(new { publishableKey });
    }

    [HttpPost("stripe/create-intent")]
    public async Task<IActionResult> CreateStripePaymentIntent([FromBody] StripeIntentRequest? request)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        var stripeSecretKey = StripWhitespace(Environment.GetEnvironmentVariable("STRIPE_SECRET_KEY") ?? "");
        if (string.IsNullOrEmpty(stripeSecretKey))
        {
            return StatusCode(500, new { message = "Stripe secret key is not configured on the server." });
        }

        var basket = await _userRepository.GetBasketByUserIdAsync(userId.Value);
        if (basket == null || basket.Items == null || basket.Items.Count == 0)
        {
            return BadRequest(new { message = "Basket is empty." });
        }

        var calc = await CalculateOrderAsync(userId.Value, basket, request?.PromoCode);
        if (calc == null || calc.OrderItems.Count == 0)
        {
            return BadRequest(new { message = "Items from basket not found in catalog." });
        }

        if (calc.TotalAmount <= 0)
        {
            return BadRequest(new { message = "Total amount is 0. Please checkout via cashier." });
        }

        StripeConfiguration.ApiKey = stripeSecretKey;

        var amountInCents = (long)Math.Round(calc.TotalAmount * 100, MidpointRounding.AwayFromZero);
        var options = new PaymentIntentCreateOptions
        {
            Amount = amountInCents,
            Currency = "azn",
            AutomaticPaymentMethods = new PaymentIntentAutomaticPaymentMethodsOptions
            {
                Enabled = true,
            },
            Metadata = new Dictionary<string, string>
            {
                { "UserId", userId.Value.ToString() },
                { "AppliedPromoCode", calc.AppliedPromoCode ?? "" },
                { "OriginalTotal", calc.OriginalTotal.ToString("F2") },
                { "DiscountAmount", calc.Discount.ToString("F2") },
                { "TotalAmount", calc.TotalAmount.ToString("F2") },
                { "CashbackAmount", calc.CashbackAmount.ToString("F2") }
            },
            Description = $"Süfrano Order for user {userId.Value}"
        };

        var service = new PaymentIntentService();
        PaymentIntent intent;
        try
        {
            intent = await service.CreateAsync(options);
        }
        catch (StripeException ex) when (ex.StripeError?.Code == "currency_unsupported" || ex.Message.Contains("currency", StringComparison.OrdinalIgnoreCase))
        {
            options.Currency = "usd";
            intent = await service.CreateAsync(options);
        }
        catch (StripeException ex)
        {
            return StatusCode(500, new { message = $"Stripe error: {ex.Message}" });
        }

        return Ok(new
        {
            clientSecret = intent.ClientSecret,
            paymentIntentId = intent.Id,
            totalAmount = calc.TotalAmount,
            discountAmount = calc.Discount,
            originalTotal = calc.OriginalTotal,
            cashbackEarned = calc.CashbackAmount,
            currency = intent.Currency
        });
    }

    [HttpPost("stripe/confirm")]
    public async Task<IActionResult> ConfirmStripeOrder([FromBody] ConfirmStripeOrderRequest request)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        if (string.IsNullOrWhiteSpace(request.PaymentIntentId))
        {
            return BadRequest(new { message = "PaymentIntentId is required." });
        }

        var stripeSecretKey = StripWhitespace(Environment.GetEnvironmentVariable("STRIPE_SECRET_KEY") ?? "");
        if (string.IsNullOrEmpty(stripeSecretKey))
        {
            return StatusCode(500, new { message = "Stripe secret key is not configured on the server." });
        }

        StripeConfiguration.ApiKey = stripeSecretKey;
        var service = new PaymentIntentService();
        PaymentIntent intent;
        try
        {
            intent = await service.GetAsync(request.PaymentIntentId);
        }
        catch (StripeException ex)
        {
            return StatusCode(500, new { message = $"Stripe error: {ex.Message}" });
        }

        if (intent == null || intent.Status != "succeeded")
        {
            return BadRequest(new { message = $"Payment status is '{intent?.Status}'. Payment has not succeeded yet." });
        }

        if (intent.Metadata == null ||
            !intent.Metadata.TryGetValue("UserId", out var intentUserId) ||
            !Guid.TryParse(intentUserId, out var parsedIntentUserId) ||
            parsedIntentUserId != userId.Value)
        {
            return StatusCode(StatusCodes.Status403Forbidden, new { message = "This payment intent does not belong to your account." });
        }

        var userLock = OrderLocks.GetOrAdd(userId.Value, _ => new SemaphoreSlim(1, 1));
        await userLock.WaitAsync();
        try
        {
            await using var tx = await _context.Database.BeginTransactionAsync();
            await _context.Database.ExecuteSqlInterpolatedAsync(
                $"SELECT 1 FROM \"Users\" WHERE \"Id\" = {userId.Value} FOR UPDATE");

            var existingOrders = await _userRepository.GetAllOrdersByUserIdAsync(userId.Value);
            var existingOrder = existingOrders.FirstOrDefault(o =>
                o.Payment?.PaymentIntentId == request.PaymentIntentId ||
                o.Notes?.CustomerNote == request.PaymentIntentId);
            if (existingOrder != null)
            {
                return Ok(new
                {
                    success = true,
                    id = existingOrder.Id,
                    status = existingOrder.Status,
                    createdAt = existingOrder.CreatedAt,
                    items = existingOrder.Items,
                    payment = existingOrder.Payment,
                    notes = existingOrder.Notes
                });
            }

            var basket = await _userRepository.GetBasketByUserIdAsync(userId.Value);
            if (basket == null || basket.Items == null || basket.Items.Count == 0)
            {
                return BadRequest(new { message = "Basket is empty." });
            }

            var appliedPromo = intent.Metadata.TryGetValue("AppliedPromoCode", out var promoMeta) && !string.IsNullOrEmpty(promoMeta) ? promoMeta : request.PromoCode;
            var calc = await CalculateOrderAsync(userId.Value, basket, appliedPromo);
            if (calc == null || calc.OrderItems.Count == 0)
            {
                return BadRequest(new { message = "Items from basket not found in catalog." });
            }

            var expectedAmountInCents = (long)Math.Round(calc.TotalAmount * 100, MidpointRounding.AwayFromZero);
            var paidAmountInCents = intent.AmountReceived > 0 ? intent.AmountReceived : intent.Amount;
            if (paidAmountInCents < expectedAmountInCents)
            {
                return BadRequest(new { message = "Paid amount does not match the current order total." });
            }

            var user = await _userRepository.GetByIdAsync(userId.Value);
            decimal? remainingBalance = null;

            if (user != null && calc.CashbackAmount > 0)
            {
                user.Balance = Math.Round(user.Balance + calc.CashbackAmount, 2);
                await _userRepository.UpdateAsync(user);
                remainingBalance = user.Balance;
            }

            if (calc.Promo != null && (calc.Discount > 0 || calc.CashbackAmount > 0))
            {
                calc.Promo.IsActive = false;
                await _userRepository.UpdateUserPromoAsync(calc.Promo);
            }

            var paymentMethod = CorePaymentMethod.OnlineStripe;
            if (!string.IsNullOrEmpty(request.PaymentMethod))
            {
                var pm = request.PaymentMethod.Trim();
                if (pm.Equals("OnlineCardDetails", StringComparison.OrdinalIgnoreCase) ||
                    pm.Equals("visa", StringComparison.OrdinalIgnoreCase) ||
                    pm.Equals("mastercard", StringComparison.OrdinalIgnoreCase))
                {
                    paymentMethod = CorePaymentMethod.OnlineCardDetails;
                }
                else if (pm.Equals("OnlineGooglePay", StringComparison.OrdinalIgnoreCase) ||
                         pm.Equals("gpay", StringComparison.OrdinalIgnoreCase) ||
                         pm.Equals("googlepay", StringComparison.OrdinalIgnoreCase))
                {
                    paymentMethod = CorePaymentMethod.OnlineGooglePay;
                }
            }

            var paymentDetails = new OrderPaymentDetails
            {
                PaymentMethod = paymentMethod,
                OriginalTotal = calc.OriginalTotal,
                DiscountAmount = calc.Discount,
                TotalAmount = calc.TotalAmount,
                PromoCode = calc.AppliedPromoCode,
                PromoPrizeName = calc.AppliedPromoName,
                PaymentIntentId = request.PaymentIntentId
            };

            var notes = new OrderNotes
            {
                Comment = string.IsNullOrWhiteSpace(request.Notes?.Comment) ? null : request.Notes.Comment.Trim(),
                CustomerNote = string.IsNullOrWhiteSpace(request.Notes?.CustomerNote) ? null : request.Notes.CustomerNote.Trim(),
                KitchenNote = string.IsNullOrWhiteSpace(request.Notes?.KitchenNote) ? null : request.Notes.KitchenNote.Trim()
            };

            var newOrder = new Order
            {
                Id = Guid.NewGuid(),
                UserId = userId.Value,
                CreatedAt = DateTime.UtcNow,
                Status = "Paid Online",
                Items = calc.OrderItems,
                Payment = paymentDetails,
                Notes = notes
            };

            await _userRepository.AddOrderAsync(newOrder);
            basket.Items.Clear();
            await _userRepository.UpdateBasketAsync(basket);
            await tx.CommitAsync();

            _ = Task.Run(() => _analyticsTrackingService.TrackAnalyticsAsync());

            return Ok(new
            {
                success = true,
                id = newOrder.Id,
                status = newOrder.Status,
                createdAt = newOrder.CreatedAt,
                items = newOrder.Items,
                payment = newOrder.Payment,
                notes = newOrder.Notes,
                remainingBalance,
                cashbackEarned = calc.CashbackAmount
            });
        }
        finally
        {
            userLock.Release();
        }
    }

    [HttpPost("cashier")]
    public async Task<IActionResult> CreateCashierOrder([FromBody] CashierOrderRequest? request)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        var paymentMethod = CorePaymentMethod.CashDeskCash;
        if (request != null && !string.IsNullOrEmpty(request.PaymentMethod))
        {
            var pm = request.PaymentMethod.Trim();
            if (pm.Equals("cash", StringComparison.OrdinalIgnoreCase) ||
                pm.Equals("CashDeskCash", StringComparison.OrdinalIgnoreCase))
            {
                paymentMethod = CorePaymentMethod.CashDeskCash;
            }
            else if (pm.Equals("card", StringComparison.OrdinalIgnoreCase) ||
                     pm.Equals("CashDeskCard", StringComparison.OrdinalIgnoreCase) ||
                     pm.Equals("nfc", StringComparison.OrdinalIgnoreCase) ||
                     pm.Equals("CashDeskNfc", StringComparison.OrdinalIgnoreCase))
            {
                paymentMethod = CorePaymentMethod.CashDeskCard;
            }
            else if (pm.Equals("balance", StringComparison.OrdinalIgnoreCase) ||
                     pm.Equals("wallet", StringComparison.OrdinalIgnoreCase) ||
                     pm.Equals("OnlineBalance", StringComparison.OrdinalIgnoreCase))
            {
                paymentMethod = CorePaymentMethod.OnlineBalance;
            }
            else if (pm.Equals("visa", StringComparison.OrdinalIgnoreCase) ||
                     pm.Equals("mastercard", StringComparison.OrdinalIgnoreCase) ||
                     pm.Equals("online_card", StringComparison.OrdinalIgnoreCase) ||
                     pm.Equals("OnlineCardDetails", StringComparison.OrdinalIgnoreCase))
            {
                paymentMethod = CorePaymentMethod.OnlineCardDetails;
            }
            else
            {
                return BadRequest(new { message = "Unsupported payment method for this endpoint. Online Stripe and Google Pay require Stripe confirmation." });
            }
        }

        var userLock = OrderLocks.GetOrAdd(userId.Value, _ => new SemaphoreSlim(1, 1));
        await userLock.WaitAsync();
        try
        {
            await using var tx = await _context.Database.BeginTransactionAsync();
            await _context.Database.ExecuteSqlInterpolatedAsync(
                $"SELECT 1 FROM \"Users\" WHERE \"Id\" = {userId.Value} FOR UPDATE");

            var basket = await _userRepository.GetBasketByUserIdAsync(userId.Value);
            if (basket == null || basket.Items == null || basket.Items.Count == 0)
            {
                return BadRequest(new { message = "Basket is empty." });
            }

            var calc = await CalculateOrderAsync(userId.Value, basket, request?.PromoCode);
            if (calc == null || calc.OrderItems.Count == 0)
            {
                return BadRequest(new { message = "Items from basket not found in catalog." });
            }

            var user = await _userRepository.GetByIdAsync(userId.Value);
            if (user == null)
            {
                return Unauthorized(new { message = "User not found." });
            }

            if (paymentMethod == CorePaymentMethod.OnlineCardDetails)
            {
                bool hasValidCard = false;
                if (request?.CardId != null)
                {
                    var savedCard = user.PaymentMethods?.FirstOrDefault(c => c.Id == request.CardId.Value);
                    if (savedCard != null && PaymentMethodsController.IsValidExpiry(savedCard.ExpiryDate))
                    {
                        hasValidCard = true;
                    }
                }
                else if (!string.IsNullOrWhiteSpace(request?.CardNumber))
                {
                    var cleanNumber = Regex.Replace(request.CardNumber, @"\D", "");
                    var cleanCvc = Regex.Replace(request.Cvc ?? string.Empty, @"\D", "");
                    var brand = PaymentMethodsController.DetectCardBrand(cleanNumber);
                    if (cleanNumber.Length >= 13 && cleanNumber.Length <= 19 &&
                        !string.IsNullOrEmpty(brand) &&
                        PaymentMethodsController.IsValidLuhn(cleanNumber) &&
                        !string.IsNullOrWhiteSpace(request.ExpiryDate) &&
                        PaymentMethodsController.IsValidExpiry(request.ExpiryDate) &&
                        cleanCvc.Length == 3)
                    {
                        hasValidCard = true;
                    }
                }

                if (!hasValidCard)
                {
                    return BadRequest(new { message = "Valid payment card details or a saved card are required for online card payment." });
                }

                if (!PaymentMethodsController.IsValidCardholderName(request?.CardholderName))
                {
                    return BadRequest(new
                    {
                        message = "Cardholder name must contain only English letters without spaces (3-30 characters).",
                        messages = new
                        {
                            az = "Kart sahibinin adı yalnız boşluqsuz ingilis hərflərindən ibarət olmalıdır (3-30 simvol).",
                            ru = "Имя владельца карты должно содержать только английские буквы без пробелов (от 3 до 30 символов).",
                            en = "Cardholder name must contain only English letters without spaces (3-30 characters)."
                        }
                    });
                }
            }

            decimal? remainingBalance = null;
            bool balanceChanged = false;

            if (paymentMethod == CorePaymentMethod.OnlineBalance)
            {
                if (user.Balance < calc.TotalAmount)
                {
                    return BadRequest(new { message = "Insufficient balance on your Süfrano account." });
                }
                user.Balance = Math.Round(user.Balance - calc.TotalAmount, 2);
                balanceChanged = true;
            }

            if (calc.CashbackAmount > 0)
            {
                user.Balance = Math.Round(user.Balance + calc.CashbackAmount, 2);
                balanceChanged = true;
            }

            if (balanceChanged)
            {
                await _userRepository.UpdateAsync(user);
                remainingBalance = user.Balance;
            }

            if (calc.Promo != null && (calc.Discount > 0 || calc.CashbackAmount > 0))
            {
                calc.Promo.IsActive = false;
                await _userRepository.UpdateUserPromoAsync(calc.Promo);
            }

            var paymentDetails = new OrderPaymentDetails
            {
                PaymentMethod = paymentMethod,
                OriginalTotal = calc.OriginalTotal,
                DiscountAmount = calc.Discount,
                TotalAmount = calc.TotalAmount,
                PromoCode = calc.AppliedPromoCode,
                PromoPrizeName = calc.AppliedPromoName
            };

            var orderStatus = (paymentMethod == CorePaymentMethod.OnlineBalance || paymentMethod == CorePaymentMethod.OnlineCardDetails) ? "Paid Online" : "Pending Payment";

            var notes = new OrderNotes
            {
                Comment = string.IsNullOrWhiteSpace(request?.Notes?.Comment) ? null : request.Notes.Comment.Trim(),
                CustomerNote = string.IsNullOrWhiteSpace(request?.Notes?.CustomerNote) ? null : request.Notes.CustomerNote.Trim(),
                KitchenNote = string.IsNullOrWhiteSpace(request?.Notes?.KitchenNote) ? null : request.Notes.KitchenNote.Trim()
            };

            var newOrder = new Order
            {
                Id = Guid.NewGuid(),
                UserId = userId.Value,
                CreatedAt = DateTime.UtcNow,
                Status = orderStatus,
                Items = calc.OrderItems,
                Payment = paymentDetails,
                Notes = notes
            };
            await _userRepository.AddOrderAsync(newOrder);
            basket.Items.Clear();
            await _userRepository.UpdateBasketAsync(basket);
            await tx.CommitAsync();

            _ = Task.Run(() => _analyticsTrackingService.TrackAnalyticsAsync());

            return Ok(new
            {
                success = true,
                id = newOrder.Id,
                status = newOrder.Status,
                createdAt = newOrder.CreatedAt,
                items = newOrder.Items,
                payment = newOrder.Payment,
                notes = newOrder.Notes,
                remainingBalance,
                cashbackEarned = calc.CashbackAmount
            });
        }
        finally
        {
            userLock.Release();
        }
    }

    [HttpGet("active")]
    [RequireSecurityVerification]
    public async Task<IActionResult> GetActiveOrder()
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        var activeOrder = await _userRepository.GetActiveOrderByUserIdAsync(userId.Value);
        if (activeOrder == null || activeOrder.Items == null || activeOrder.Items.Count == 0)
        {
            return Ok(new { hasActiveOrder = false, order = (Order?)null });
        }

        var productIds = activeOrder.Items.Select(i => i.ProductId).Distinct().ToList();
        var products = await _context.Products
            .Where(p => productIds.Contains(p.Id))
            .AsNoTracking()
            .ToDictionaryAsync(p => p.Id);

        return Ok(new
        {
            hasActiveOrder = true,
            id = activeOrder.Id,
            status = activeOrder.Status,
            createdAt = activeOrder.CreatedAt,
            items = activeOrder.Items.Select(i => new
            {
                productId = i.ProductId,
                quantity = i.Quantity,
                unitPrice = i.UnitPrice,
                name = products.TryGetValue(i.ProductId, out var prod) ? prod.Name : "Product",
                imageUrl = products.TryGetValue(i.ProductId, out var prod2) ? prod2.Images?.Image : null,
                images = products.TryGetValue(i.ProductId, out var prod2b) ? new { image = prod2b.Images?.Image ?? string.Empty, icon = prod2b.Images?.Icon ?? string.Empty } : null,
                category = products.TryGetValue(i.ProductId, out var prod3) ? prod3.Category : ""
            }).ToList(),
            payment = new
            {
                paymentMethod = activeOrder.Payment.PaymentMethod.ToString(),
                originalTotal = activeOrder.Payment.OriginalTotal,
                discountAmount = activeOrder.Payment.DiscountAmount,
                totalAmount = activeOrder.Payment.TotalAmount,
                promoCode = activeOrder.Payment.PromoCode,
                promoPrizeName = activeOrder.Payment.PromoPrizeName
            },
            notes = activeOrder.Notes
        });
    }

    [HttpGet("history")]
    [RequireSecurityVerification]
    public async Task<IActionResult> GetOrderHistory()
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        var allOrders = await _userRepository.GetAllOrdersByUserIdAsync(userId.Value);
        var allProductIds = allOrders
            .SelectMany(o => o.Items)
            .Select(i => i.ProductId)
            .Distinct()
            .ToList();

        var products = await _context.Products
            .Where(p => allProductIds.Contains(p.Id))
            .AsNoTracking()
            .ToDictionaryAsync(p => p.Id);

        return Ok(new
        {
            orders = allOrders.Select(o => new
            {
                id = o.Id,
                status = o.Status,
                createdAt = o.CreatedAt,
                items = o.Items.Select(i => new
                {
                    productId = i.ProductId,
                    quantity = i.Quantity,
                    unitPrice = i.UnitPrice,
                    name = products.TryGetValue(i.ProductId, out var prod) ? prod.Name : "Product",
                    imageUrl = products.TryGetValue(i.ProductId, out var prod2) ? prod2.Images?.Image : null,
                    images = products.TryGetValue(i.ProductId, out var prod2b) ? new { image = prod2b.Images?.Image ?? string.Empty, icon = prod2b.Images?.Icon ?? string.Empty } : null,
                    category = products.TryGetValue(i.ProductId, out var prod3) ? prod3.Category : ""
                }).ToList(),
                payment = new
                {
                    paymentMethod = o.Payment.PaymentMethod.ToString(),
                    originalTotal = o.Payment.OriginalTotal,
                    discountAmount = o.Payment.DiscountAmount,
                    totalAmount = o.Payment.TotalAmount,
                    promoCode = o.Payment.PromoCode,
                    promoPrizeName = o.Payment.PromoPrizeName
                },
                notes = o.Notes
            }).ToList()
        });
    }

    private static string StripWhitespace(string value)
        => Regex.Replace(value, @"\s+", "");
}

public class OrderCalculationResult
{
    public decimal OriginalTotal { get; set; }
    public decimal Discount { get; set; }
    public decimal TotalAmount { get; set; }
    public decimal CashbackAmount { get; set; }
    public int CashbackPercent { get; set; }
    public string? AppliedPromoCode { get; set; }
    public string? AppliedPromoName { get; set; }
    public UserPromo? Promo { get; set; }
    public List<OrderProductItem> OrderItems { get; set; } = new();
}

public class CashierOrderRequest
{
    public string? PaymentMethod { get; set; }
    public string? PromoCode { get; set; }
    public int? CardId { get; set; }
    public string? CardNumber { get; set; }
    public string? ExpiryDate { get; set; }
    public string? Cvc { get; set; }
    public string? CardholderName { get; set; }
    public OrderNotes? Notes { get; set; }
}

public class StripeIntentRequest
{
    public string? PaymentMethod { get; set; }
    public string? PromoCode { get; set; }
    public OrderNotes? Notes { get; set; }
}

public class ConfirmStripeOrderRequest
{
    public string PaymentIntentId { get; set; } = string.Empty;
    public string? PaymentMethod { get; set; }
    public string? PromoCode { get; set; }
    public OrderNotes? Notes { get; set; }
}

