namespace Sufrano.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class CashboxController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IAnalyticsTrackingService _analyticsTrackingService;

    public CashboxController(AppDbContext context, IAnalyticsTrackingService analyticsTrackingService)
    {
        _context = context;
        _analyticsTrackingService = analyticsTrackingService;
    }

    private static bool IsAllowedCashboxRole(UserRole role)
    {
        return role == UserRole.Staff || role == UserRole.LeadStaff || role == UserRole.Admin || role == UserRole.SuperAdmin;
    }

    private static bool IsAllowedCashboxHistoryRole(UserRole role)
    {
        return role == UserRole.LeadStaff || role == UserRole.Admin || role == UserRole.SuperAdmin;
    }

    private async Task<(bool Allowed, User? User, IActionResult? ErrorResult)> ValidateCashboxAccessAsync()
    {
        var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userIdStr) || !Guid.TryParse(userIdStr, out var userId))
        {
            return (false, null, Unauthorized(new { message = "Authentication required." }));
        }

        var user = await _context.Users
            .Include(u => u.Session)
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null)
        {
            return (false, null, Unauthorized(new { message = "User not found." }));
        }

        if (user.Session != null && !user.Session.IsActive)
        {
            return (false, null, Unauthorized(new { message = "Account suspended." }));
        }

        if (!IsAllowedCashboxRole(user.Role))
        {
            return (false, null, StatusCode(StatusCodes.Status403Forbidden, new { message = "Access denied. Cashbox access is restricted to Staff, Lead Staff, Admin, and Super Admin." }));
        }

        return (true, user, null);
    }

    private async Task<(bool Allowed, User? User, IActionResult? ErrorResult)> ValidateCashboxHistoryAccessAsync()
    {
        var (allowed, user, errorResult) = await ValidateCashboxAccessAsync();
        if (!allowed || user == null)
        {
            return (false, null, errorResult);
        }

        if (!IsAllowedCashboxHistoryRole(user.Role))
        {
            return (false, null, StatusCode(StatusCodes.Status403Forbidden, new { message = "Access denied. Cashbox history is restricted to Lead Staff, Admin, and Super Admin." }));
        }

        return (true, user, null);
    }

    [HttpGet("init")]
    [HttpGet("products")]
    public async Task<IActionResult> GetInitData([FromQuery] string? lang = "en")
    {
        var (allowed, cashierUser, errorResult) = await ValidateCashboxAccessAsync();
        if (!allowed || cashierUser == null)
        {
            return errorResult!;
        }
        var normalizedLang = (lang ?? "en").Trim().ToLowerInvariant();

        var products = await _context.Products
            .AsNoTracking()
            .Where(p => p.IsActive)
            .ToListAsync();

        var productList = products.Select(p =>
        {
            var name = normalizedLang switch
            {
                "az" => !string.IsNullOrEmpty(p.Name.AZ) ? p.Name.AZ : (!string.IsNullOrEmpty(p.Name.EN) ? p.Name.EN : p.Name.RU),
                "ru" => !string.IsNullOrEmpty(p.Name.RU) ? p.Name.RU : (!string.IsNullOrEmpty(p.Name.EN) ? p.Name.EN : p.Name.AZ),
                _ => !string.IsNullOrEmpty(p.Name.EN) ? p.Name.EN : (!string.IsNullOrEmpty(p.Name.AZ) ? p.Name.AZ : p.Name.RU),
            };

            var desc = normalizedLang switch
            {
                "az" => !string.IsNullOrEmpty(p.Description.AZ) ? p.Description.AZ : (!string.IsNullOrEmpty(p.Description.EN) ? p.Description.EN : p.Description.RU),
                "ru" => !string.IsNullOrEmpty(p.Description.RU) ? p.Description.RU : (!string.IsNullOrEmpty(p.Description.EN) ? p.Description.EN : p.Description.AZ),
                _ => !string.IsNullOrEmpty(p.Description.EN) ? p.Description.EN : (!string.IsNullOrEmpty(p.Description.AZ) ? p.Description.AZ : p.Description.RU),
            };

            var price = p.Prices != null ? (p.Prices.DiscountPrice ?? p.Prices.Price) : 0m;
            var img = !string.IsNullOrEmpty(p.Images?.Icon) ? p.Images.Icon : (p.Images?.Image ?? string.Empty);

            return new
            {
                id = p.Id,
                name = name,
                displayName = name,
                description = desc,
                displayDescription = desc,
                category = !string.IsNullOrWhiteSpace(p.Category) ? p.Category.Trim() : "General",
                price = price,
                originalPrice = p.Prices?.Price ?? price,
                discountPrice = p.Prices?.DiscountPrice,
                imageUrl = img,
                iconUrl = img,
                image = img
            };
        }).ToList();

        var predefinedOrder = new List<string> { "All", "Starters & Salads", "Soups", "Main Dishes", "Desserts", "Beverages", "Specialty Drinks", "Main Drinks" };
        var foundCategories = productList.Select(p => p.category).Distinct(StringComparer.OrdinalIgnoreCase).ToList();
        var allCategories = new List<string> { "All" };
        foreach (var cat in predefinedOrder.Skip(1))
        {
            if (foundCategories.Any(c => string.Equals(c, cat, StringComparison.OrdinalIgnoreCase)) && !allCategories.Contains(cat))
            {
                allCategories.Add(cat);
            }
        }
        foreach (var cat in foundCategories)
        {
            if (!allCategories.Any(c => string.Equals(c, cat, StringComparison.OrdinalIgnoreCase)))
            {
                allCategories.Add(cat);
            }
        }

        var cashierName = !string.IsNullOrWhiteSpace(cashierUser.Name) ? cashierUser.Name : (cashierUser.Email ?? "Cashier");
        var cashierAvatar = AvatarHelper.Resolve(cashierUser.ProfilePictureUrl);

        return Ok(new
        {
            products = productList,
            categories = allCategories,
            cashier = new
            {
                name = cashierName,
                avatar = cashierAvatar
            }
        });
    }

    [HttpGet("promos/search")]
    public async Task<IActionResult> SearchPromos([FromQuery] string? query)
    {
        var (allowed, _, errorResult) = await ValidateCashboxAccessAsync();
        if (!allowed)
        {
            return errorResult!;
        }

        if (string.IsNullOrWhiteSpace(query))
        {
            return Ok(new List<object>());
        }

        var q = query.Trim();
        var qUpper = q.ToUpperInvariant();

        var now = DateTime.UtcNow;

        var promos = await _context.UserPromos
            .Include(p => p.User)
            .AsNoTracking()
            .Where(p => p.IsActive && p.Dates.ExpiresAt >= now && (p.Codes.BarCode.Contains(q) || p.Codes.PromoCode.ToUpper().Contains(qUpper)))
            .OrderByDescending(p => p.Dates.ActivatedAt)
            .Take(25)
            .ToListAsync();

        var pixel = await _context.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Email == "myrednest@gmail.com");

        var results = promos.Select(p =>
        {
            var isUnclaimed = pixel != null && p.UserId == pixel.Id;
            var isExpired = p.Dates.ExpiresAt < now;
            var status = !p.IsActive ? "Inactive" : (isExpired ? "Expired" : "Active");

            var ownerName = isUnclaimed
                ? "Unclaimed (Public Promo)"
                : (!string.IsNullOrWhiteSpace(p.User?.Name) ? p.User.Name : (p.User?.Email ?? "Anonymous Customer"));

            var pType = p.PrizeInfo?.Type ?? PrizeType.DiscountCustom;
            var discPct = pType == PrizeType.Discount25
                ? 15
                : pType == PrizeType.Discount50
                    ? 25
                    : (p.PrizeInfo?.DiscountPercent ?? 0);
            var cbPct = p.PrizeInfo?.CashbackPercent ?? 0;
            if (pType == PrizeType.CashbackOnPurchases && cbPct <= 0) cbPct = 10;

            var pName = pType switch
            {
                PrizeType.Discount25 => "DISCOUNT UP TO 15%",
                PrizeType.Discount50 => "DISCOUNT UP TO 25%",
                PrizeType.SuperPrize => "SUPER PRIZE",
                PrizeType.FreeDrink => "FREE DRINK",
                PrizeType.FreeDessert => "FREE DESSERT",
                PrizeType.CashbackOnPurchases => $"{cbPct}% CASHBACK ON PURCHASES",
                _ => !string.IsNullOrWhiteSpace(p.PrizeInfo?.PrizeName) ? p.PrizeInfo.PrizeName : "Promo Discount"
            };

            return new
            {
                id = p.Id,
                promoCode = p.Codes.PromoCode,
                barCode = p.Codes.BarCode,
                prizeName = pName,
                prizeDescription = p.PrizeInfo?.PrizeDescription ?? string.Empty,
                prizeType = pType.ToString(),
                discountPercent = discPct,
                cashbackPercent = cbPct,
                isActive = p.IsActive,
                isExpired = isExpired,
                status = status,
                activatedAt = p.Dates.ActivatedAt,
                expiresAt = p.Dates.ExpiresAt,
                isClaimed = !isUnclaimed,
                userName = ownerName,
                userEmail = isUnclaimed ? null : p.User?.Email,
                userAvatar = isUnclaimed ? null : AvatarHelper.Resolve(p.User?.ProfilePictureUrl)
            };
        }).ToList();

        return Ok(results);
    }

    [HttpPost("orders")]
    public async Task<IActionResult> CreateCashboxOrder([FromBody] CashboxOrderRequest request)
    {
        var (allowed, cashierUser, errorResult) = await ValidateCashboxAccessAsync();
        if (!allowed || cashierUser == null)
        {
            return errorResult!;
        }
        if (request == null || request.Products == null || request.Products.Count == 0)
        {
            return BadRequest(new { message = "Order must contain at least one item." });
        }

        if (request.Products.Count > 100 ||
            request.Products.Any(p => p.ProductId == Guid.Empty || p.Quantity < 1 || p.Quantity > 100))
        {
            return BadRequest(new { message = "Invalid product list. Quantity must be between 1 and 100." });
        }

        var merged = request.Products
            .GroupBy(p => p.ProductId)
            .Select(g => new { ProductId = g.Key, Quantity = Math.Min(100, g.Sum(x => x.Quantity)) })
            .ToList();

        var productIds = merged.Select(m => m.ProductId).ToList();
        var dbProducts = await _context.Products
            .AsNoTracking()
            .Where(p => productIds.Contains(p.Id) && p.IsActive)
            .ToDictionaryAsync(p => p.Id);

        if (dbProducts.Count != productIds.Count)
        {
            return BadRequest(new { message = "One or more products were not found or are inactive." });
        }

        var lines = merged
            .Select(m => (Product: dbProducts[m.ProductId], Quantity: m.Quantity))
            .ToList();

        var initialAmount = Math.Round(
            lines.Sum(l => PromoDiscountCalculator.GetEffectivePrice(l.Product) * l.Quantity), 2);

        await using var tx = await _context.Database.BeginTransactionAsync();

        Sufrano.Core.Entities.UserPromo? promo = null;
        decimal discount = 0m;
        decimal cashbackAmount = 0m;
        string? appliedPromoCode = null;

        if (!string.IsNullOrWhiteSpace(request.PromoCodeId))
        {
            var rawCode = request.PromoCodeId.Trim();
            var codeUpper = rawCode.ToUpperInvariant();

            if (Guid.TryParse(rawCode, out var promoGuid))
            {
                promo = await _context.UserPromos.FirstOrDefaultAsync(p => p.Id == promoGuid);
            }

            if (promo == null)
            {
                promo = await _context.UserPromos.FirstOrDefaultAsync(p =>
                    p.Codes.PromoCode == codeUpper || p.Codes.BarCode == rawCode);
            }

            if (promo == null)
            {
                return BadRequest(new { message = "Promo code not found." });
            }

            // Row lock + reload: prevents the same promo being redeemed twice concurrently.
            await _context.Database.ExecuteSqlInterpolatedAsync(
                $"SELECT 1 FROM \"UserPromos\" WHERE \"Id\" = {promo.Id} FOR UPDATE");
            await _context.Entry(promo).ReloadAsync();

            if (!promo.IsActive || promo.Dates.ExpiresAt < DateTime.UtcNow)
            {
                return BadRequest(new { message = "Promo code is expired or has already been used." });
            }

            var (calcDiscount, cashbackPercent) = PromoDiscountCalculator.Calculate(promo, lines, initialAmount);
            discount = calcDiscount;

            if (cashbackPercent > 0)
            {
                var payable = Math.Max(0m, Math.Round(initialAmount - discount, 2));
                cashbackAmount = Math.Round(payable * (cashbackPercent / 100m), 2);
            }

            if (discount > 0 || cashbackAmount > 0)
            {
                appliedPromoCode = promo.Codes.PromoCode;

                if (cashbackAmount > 0)
                {
                    var promoOwner = await _context.Users.FirstOrDefaultAsync(u => u.Id == promo.UserId);
                    if (promoOwner != null && !string.Equals(promoOwner.Email, "myrednest@gmail.com", StringComparison.OrdinalIgnoreCase))
                    {
                        promoOwner.Balance = Math.Round(promoOwner.Balance + cashbackAmount, 2);
                        _context.Users.Update(promoOwner);
                    }
                }

                promo.IsActive = false;
                _context.UserPromos.Update(promo);
            }
        }

        var totalAmount = Math.Max(0m, Math.Round(initialAmount - discount, 2));

        var cashierName = !string.IsNullOrWhiteSpace(cashierUser.Name) ? cashierUser.Name : (cashierUser.Email ?? "Cashier");

        var cashboxRecord = new Sufrano.Core.Entities.Cashbox
        {
            UserId = cashierUser.Id,
            PayMethod = string.Equals(request.PayMethod, "Card", StringComparison.OrdinalIgnoreCase)
                ? CashboxPayMethod.Card
                : CashboxPayMethod.Cash,
            Products = merged.Select(m => new CashboxProductItem
            {
                ProductId = m.ProductId,
                Quantity = m.Quantity
            }).ToList(),
            Paid = new CashboxPaidDetails
            {
                InitialAmount = initialAmount,
                PromoCodeId = appliedPromoCode,
                TotalAmount = totalAmount
            },
            Status = CashboxStatus.Success,
            Description = new CashboxDescription
            {
                Note = string.IsNullOrWhiteSpace(request.Note) ? null : request.Note.Trim(),
                Edited = null,
                CashierId = cashierUser.Id,
                CashierName = cashierName
            },
            CreatedAt = DateTime.UtcNow
        };

        _context.Cashboxes.Add(cashboxRecord);
        await _context.SaveChangesAsync();
        await tx.CommitAsync();

        _ = Task.Run(() => _analyticsTrackingService.TrackAnalyticsAsync());

        return Ok(new { success = true, orderId = cashboxRecord.Id, initialAmount, discountAmount = discount, totalAmount });
    }

    [HttpGet("history")]
    public async Task<IActionResult> GetCashboxHistory(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? search = null,
        [FromQuery] string? status = null,
        [FromQuery] string? payMethod = null,
        [FromQuery] string? dateRange = null,
        [FromQuery] string? lang = "en")
    {
        var (allowed, _, errorResult) = await ValidateCashboxHistoryAccessAsync();
        if (!allowed)
        {
            return errorResult!;
        }

        if (page < 1) page = 1;
        if (pageSize < 1) pageSize = 20;
        if (pageSize > 100) pageSize = 100;

        var normalizedLang = (lang ?? "en").Trim().ToLowerInvariant();
        var now = DateTime.UtcNow;

        var query = _context.Cashboxes.AsNoTracking().AsQueryable();

        if (!string.IsNullOrWhiteSpace(status) && !string.Equals(status, "all", StringComparison.OrdinalIgnoreCase))
        {
            if (Enum.TryParse<CashboxStatus>(status.Trim(), true, out var parsedStatus))
            {
                query = query.Where(c => c.Status == parsedStatus);
            }
        }

        if (!string.IsNullOrWhiteSpace(payMethod) && !string.Equals(payMethod, "all", StringComparison.OrdinalIgnoreCase))
        {
            if (Enum.TryParse<CashboxPayMethod>(payMethod.Trim(), true, out var parsedPayMethod))
            {
                query = query.Where(c => c.PayMethod == parsedPayMethod);
            }
        }

        if (!string.IsNullOrWhiteSpace(dateRange))
        {
            if (string.Equals(dateRange, "today", StringComparison.OrdinalIgnoreCase))
            {
                var todayStart = now.Date;
                query = query.Where(c => c.CreatedAt >= todayStart);
            }
            else if (string.Equals(dateRange, "yesterday", StringComparison.OrdinalIgnoreCase))
            {
                var yesterdayStart = now.Date.AddDays(-1);
                var todayStart = now.Date;
                query = query.Where(c => c.CreatedAt >= yesterdayStart && c.CreatedAt < todayStart);
            }
            else if (string.Equals(dateRange, "week", StringComparison.OrdinalIgnoreCase))
            {
                var weekStart = now.Date.AddDays(-7);
                query = query.Where(c => c.CreatedAt >= weekStart);
            }
            else if (string.Equals(dateRange, "month", StringComparison.OrdinalIgnoreCase))
            {
                var monthStart = now.Date.AddDays(-30);
                query = query.Where(c => c.CreatedAt >= monthStart);
            }
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            var sLower = search.Trim().ToLowerInvariant();
            query = query.Where(c =>
                c.Id.ToString().ToLower().Contains(sLower) ||
                (c.Paid.PromoCodeId != null && c.Paid.PromoCodeId.ToLower().Contains(sLower)) ||
                (c.Description.Note != null && c.Description.Note.ToLower().Contains(sLower)) ||
                (c.Description.CashierName != null && c.Description.CashierName.ToLower().Contains(sLower))
            );
        }

        var totalCount = await query.CountAsync();

        var currentMonthStart = new DateTime(now.Year, now.Month, 1, 0, 0, 0, DateTimeKind.Utc);
        var nextMonthStart = currentMonthStart.AddMonths(1);

        var monthRecords = await _context.Cashboxes
            .AsNoTracking()
            .Where(c => c.CreatedAt >= currentMonthStart && c.CreatedAt < nextMonthStart)
            .Select(c => new
            {
                c.Paid.TotalAmount,
                c.PayMethod,
                c.Status
            })
            .ToListAsync();

        var totalRevenue = monthRecords.Where(c => c.Status == CashboxStatus.Success).Sum(c => c.TotalAmount);
        var cashRevenue = monthRecords.Where(c => c.Status == CashboxStatus.Success && c.PayMethod == CashboxPayMethod.Cash).Sum(c => c.TotalAmount);
        var cardRevenue = monthRecords.Where(c => c.Status == CashboxStatus.Success && c.PayMethod == CashboxPayMethod.Card).Sum(c => c.TotalAmount);
        var successCount = monthRecords.Count(c => c.Status == CashboxStatus.Success);
        var refundedCount = monthRecords.Count(c => c.Status == CashboxStatus.Refunded);
        var cancelledCount = monthRecords.Count(c => c.Status == CashboxStatus.Cancelled);

        var pagedRecords = await query
            .OrderByDescending(c => c.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var productIds = pagedRecords.SelectMany(c => c.Products).Select(p => p.ProductId).Distinct().ToList();
        var products = await _context.Products
            .AsNoTracking()
            .Where(p => productIds.Contains(p.Id))
            .ToListAsync();
        var productDict = products.ToDictionary(p => p.Id);

        var creatorIds = pagedRecords
            .Select(c => c.UserId ?? c.Description?.CashierId)
            .Where(id => id.HasValue && id.Value != Guid.Empty)
            .Select(id => id!.Value)
            .Distinct()
            .ToList();

        var editorIds = pagedRecords
            .Where(c => c.Description?.Edited?.UserId != null && c.Description.Edited.UserId != Guid.Empty)
            .Select(c => c.Description.Edited!.UserId)
            .Distinct()
            .ToList();

        var allUserIds = creatorIds.Concat(editorIds).Distinct().ToList();
        var userDict = await _context.Users
            .AsNoTracking()
            .Where(u => allUserIds.Contains(u.Id))
            .ToDictionaryAsync(u => u.Id);

        var orders = pagedRecords.Select(c =>
        {
            var creatorId = c.UserId ?? c.Description?.CashierId;
            userDict.TryGetValue(creatorId ?? Guid.Empty, out var creatorUser);

            var editorId = c.Description?.Edited?.UserId;
            userDict.TryGetValue(editorId ?? Guid.Empty, out var editorUser);

            var cashierName = !string.IsNullOrWhiteSpace(creatorUser?.Name)
                ? creatorUser.Name
                : (!string.IsNullOrWhiteSpace(c.Description?.CashierName)
                    ? c.Description.CashierName
                    : (creatorUser?.Email ?? "Cashier"));

            var editorName = !string.IsNullOrWhiteSpace(editorUser?.Name)
                ? editorUser.Name
                : editorUser?.Email;

            var items = c.Products.Select(pi =>
            {
                productDict.TryGetValue(pi.ProductId, out var prod);

                var name = normalizedLang switch
                {
                    "az" => !string.IsNullOrEmpty(prod?.Name.AZ) ? prod.Name.AZ : (!string.IsNullOrEmpty(prod?.Name.EN) ? prod.Name.EN : prod?.Name.RU ?? "Məhsul"),
                    "ru" => !string.IsNullOrEmpty(prod?.Name.RU) ? prod.Name.RU : (!string.IsNullOrEmpty(prod?.Name.EN) ? prod.Name.EN : prod?.Name.AZ ?? "Товар"),
                    _ => !string.IsNullOrEmpty(prod?.Name.EN) ? prod.Name.EN : (!string.IsNullOrEmpty(prod?.Name.AZ) ? prod.Name.AZ : prod?.Name.RU ?? "Product"),
                };

                return new
                {
                    productId = pi.ProductId,
                    quantity = pi.Quantity,
                    name = name,
                    nameAZ = prod?.Name.AZ,
                    nameRU = prod?.Name.RU,
                    nameEN = prod?.Name.EN,
                    price = prod?.Prices != null ? (prod.Prices.DiscountPrice ?? prod.Prices.Price) : 0m,
                    originalPrice = prod?.Prices?.Price ?? 0m,
                    discountPrice = prod?.Prices?.DiscountPrice,
                    imageUrl = !string.IsNullOrEmpty(prod?.Images?.Icon) ? prod.Images.Icon : prod?.Images?.Image,
                    category = prod?.Category ?? "General"
                };
            }).ToList();

            return new
            {
                id = c.Id,
                userId = c.UserId ?? creatorId,
                payMethod = c.PayMethod.ToString(),
                status = c.Status.ToString(),
                initialAmount = c.Paid.InitialAmount,
                promoCode = c.Paid.PromoCodeId,
                totalAmount = c.Paid.TotalAmount,
                discountAmount = Math.Max(0m, c.Paid.InitialAmount - c.Paid.TotalAmount),
                note = c.Description?.Note,
                cashierId = creatorId,
                cashierName = cashierName,
                cashierAvatar = creatorUser != null ? AvatarHelper.Resolve(creatorUser.ProfilePictureUrl) : null,
                cashierEmail = creatorUser?.Email,
                editedBy = editorName,
                editorAvatar = editorUser != null ? AvatarHelper.Resolve(editorUser.ProfilePictureUrl) : null,
                editorEmail = editorUser?.Email,
                editedAt = c.Description?.Edited?.Date,
                createdAt = c.CreatedAt,
                itemCount = c.Products.Sum(p => p.Quantity),
                products = items
            };
        }).ToList();

        return Ok(new
        {
            orders,
            totalCount,
            page,
            pageSize,
            totalPages = (int)Math.Ceiling((double)totalCount / pageSize),
            summary = new
            {
                totalRevenue,
                cashRevenue,
                cardRevenue,
                totalOrders = successCount,
                successCount,
                refundedCount,
                cancelledCount,
                currentMonth = now.ToString("yyyy-MM")
            }
        });
    }

    [HttpDelete("orders/{id:guid}")]
    public async Task<IActionResult> DeleteCashboxOrder(Guid id)
    {
        var (allowed, user, errorResult) = await ValidateCashboxHistoryAccessAsync();
        if (!allowed || user == null) return errorResult!;

        if (user.Role != UserRole.Admin && user.Role != UserRole.SuperAdmin)
        {
            return StatusCode(StatusCodes.Status403Forbidden, new { message = "Only Admin and Super Admin can delete cashbox records." });
        }

        var record = await _context.Cashboxes.FirstOrDefaultAsync(c => c.Id == id);
        if (record == null) return NotFound(new { message = "Cashbox order not found." });

        _context.Cashboxes.Remove(record);
        await _context.SaveChangesAsync();
        return Ok(new { success = true, message = "Cashbox order deleted successfully." });
    }

    [HttpPatch("orders/{id:guid}")]
    public async Task<IActionResult> UpdateCashboxOrder(Guid id, [FromBody] UpdateCashboxOrderRequest request)
    {
        var (allowed, cashierUser, errorResult) = await ValidateCashboxAccessAsync();
        if (!allowed || cashierUser == null)
        {
            return errorResult!;
        }

        var cashboxRecord = await _context.Cashboxes.FirstOrDefaultAsync(c => c.Id == id);
        if (cashboxRecord == null)
        {
            return NotFound(new { message = "Cashbox order not found." });
        }

        if (!string.IsNullOrWhiteSpace(request.Status))
        {
            if (!IsAllowedCashboxHistoryRole(cashierUser.Role))
            {
                return StatusCode(StatusCodes.Status403Forbidden, new { message = "Only Lead Staff, Admin and Super Admin can change the status of cashbox orders." });
            }

            if (Enum.TryParse<CashboxStatus>(request.Status.Trim(), true, out var newStatus))
            {
                cashboxRecord.Status = newStatus;
            }
            else
            {
                return BadRequest(new { message = $"Invalid status. Allowed values: {string.Join(", ", Enum.GetNames<CashboxStatus>())}" });
            }
        }

        var existingDesc = cashboxRecord.Description;
        var newNote = existingDesc?.Note;
        if (request.Note != null)
        {
            newNote = string.IsNullOrWhiteSpace(request.Note) ? null : request.Note.Trim();
        }

        var editDate = DateTime.UtcNow;

        cashboxRecord.Description = new CashboxDescription
        {
            CashierId = existingDesc?.CashierId ?? cashboxRecord.UserId,
            CashierName = existingDesc?.CashierName,
            Note = newNote,
            Edited = new CashboxEditedInfo
            {
                UserId = cashierUser.Id,
                Date = editDate
            }
        };

        _context.Entry(cashboxRecord).Property(c => c.Description).IsModified = true;

        await _context.SaveChangesAsync();

        var editorName = !string.IsNullOrWhiteSpace(cashierUser.Name)
            ? cashierUser.Name
            : cashierUser.Email;

        return Ok(new
        {
            success = true,
            order = new
            {
                id = cashboxRecord.Id,
                status = cashboxRecord.Status.ToString(),
                note = newNote,
                editedBy = editorName,
                editorAvatar = AvatarHelper.Resolve(cashierUser.ProfilePictureUrl),
                editorEmail = cashierUser.Email,
                editedAt = editDate
            }
        });
    }
}

public class CashboxOrderRequest
{
    public string PayMethod { get; set; } = "Cash";
    public List<CashboxProductItemRequest> Products { get; set; } = new();
    public decimal InitialAmount { get; set; }
    public string? PromoCodeId { get; set; }
    public decimal TotalAmount { get; set; }
    public string? Status { get; set; }
    public string? Note { get; set; }
}

public class UpdateCashboxOrderRequest
{
    public string? Status { get; set; }
    public string? Note { get; set; }
}

public class CashboxProductItemRequest
{
    public Guid ProductId { get; set; }
    public int Quantity { get; set; } = 1;
}
