namespace Rednest.Infrastructure.Repositories;

public class UserRepository : IUserRepository
{
    private static readonly Guid ProtectedUserId = Guid.Parse("b5e53d0b-7bd6-4d7b-b99b-f9ae40ef5305");
    private readonly AppDbContext _context;

    public UserRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<User?> GetByEmailAsync(string email)
    {
        return await _context.Users
            .Include(u => u.Session)
            .FirstOrDefaultAsync(u => u.Email == email);
    }

    public async Task<User?> GetByIdAsync(Guid id)
    {
        return await _context.Users
            .Include(u => u.Session)
            .FirstOrDefaultAsync(u => u.Id == id);
    }

    public async Task<(User User, UserSession Session, SessionEntry Entry)?> GetByRefreshTokenAsync(string refreshToken)
    {
        var sessions = await _context.UserSessions
            .Include(s => s.User)
            .Where(s => s.Sessions != null && s.Sessions.Count > 0)
            .ToListAsync();

        foreach (var session in sessions)
        {
            var entry = session.Sessions.FirstOrDefault(e => e.RefreshToken == refreshToken);
            if (entry != null)
            {
                return (session.User, session, entry);
            }
        }

        return null;
    }

    public async Task<(User User, UserSession Session, SessionEntry Entry)?> GetByPreviousRefreshTokenAsync(string previousRefreshToken)
    {
        var sessions = await _context.UserSessions
            .Include(s => s.User)
            .Where(s => s.Sessions != null && s.Sessions.Count > 0)
            .ToListAsync();

        foreach (var session in sessions)
        {
            var entry = session.Sessions.FirstOrDefault(e => e.PreviousRefreshToken == previousRefreshToken);
            if (entry != null)
            {
                return (session.User, session, entry);
            }
        }

        return null;
    }

    public async Task<UserSession?> GetSessionByUserIdAsync(Guid userId)
    {
        return await _context.UserSessions
            .FirstOrDefaultAsync(s => s.UserId == userId);
    }

    public async Task AddAsync(User user)
    {
        await _context.Users.AddAsync(user);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(User user)
    {
        if (user.Id == ProtectedUserId)
            throw new InvalidOperationException("CRUD operations are prohibited for this protected user.");

        _context.Users.Update(user);
        await _context.SaveChangesAsync();
    }

    public async Task AddSessionAsync(UserSession session)
    {
        await _context.UserSessions.AddAsync(session);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateSessionAsync(UserSession session)
    {
        _context.Entry(session).Property(s => s.Sessions).IsModified = true;
        _context.Entry(session).Property(s => s.AccountVerify).IsModified = true;
        _context.Entry(session).Property(s => s.TwoFactorEnabled).IsModified = true;
        _context.Entry(session).Property(s => s.Subscribe).IsModified = true;
        _context.Entry(session).Property(s => s.IsActive).IsModified = true;
        _context.Entry(session).Property(s => s.Verification).IsModified = true;
        _context.UserSessions.Update(session);
        await _context.SaveChangesAsync();
    }

    public async Task<UserPromo?> GetUserPromoAsync(Guid userId)
    {
        var userPromos = await _context.UserPromos
            .Where(p => p.UserId == userId)
            .ToListAsync();

        return userPromos
            .Where(IsWheelPromo)
            .OrderByDescending(p => p.Dates.ActivatedAt)
            .FirstOrDefault();
    }

    private static bool IsWheelPromo(UserPromo promo)
    {
        var source = promo.PrizeInfo?.Source;
        if (!string.IsNullOrEmpty(source))
            return string.Equals(source, PrizeInfo.SourceWheel, StringComparison.OrdinalIgnoreCase);

        return promo.PrizeInfo?.Type != PrizeType.DiscountCustom;
    }

    public async Task<UserPromo?> GetActiveUserPromoAsync(Guid userId)
    {
        return await _context.UserPromos
            .Where(p => p.UserId == userId && p.IsActive)
            .FirstOrDefaultAsync();
    }

    public async Task<List<UserPromo>> GetAllUserPromosAsync(Guid userId)
    {
        return await _context.UserPromos
            .Where(p => p.UserId == userId)
            .OrderByDescending(p => p.Dates.ActivatedAt)
            .ToListAsync();
    }

    public async Task AddUserPromoAsync(UserPromo promo)
    {
        await _context.UserPromos.AddAsync(promo);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateUserPromoAsync(UserPromo promo)
    {
        _context.UserPromos.Update(promo);
        await _context.SaveChangesAsync();
    }

    public async Task<UserBasket?> GetBasketByUserIdAsync(Guid userId)
    {
        return await _context.UserBaskets
            .FirstOrDefaultAsync(b => b.UserId == userId);
    }

    public async Task AddBasketAsync(UserBasket basket)
    {
        await _context.UserBaskets.AddAsync(basket);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateBasketAsync(UserBasket basket)
    {
        _context.UserBaskets.Update(basket);
        await _context.SaveChangesAsync();
    }

    public async Task<Order?> GetOrderByUserIdAsync(Guid userId)
    {
        return await _context.Orders
            .Where(o => o.UserId == userId)
            .OrderByDescending(o => o.CreatedAt)
            .FirstOrDefaultAsync();
    }

    public async Task<Order?> GetActiveOrderByUserIdAsync(Guid userId)
    {
        return await _context.Orders
            .Where(o => o.UserId == userId && o.Status != "Completed" && o.Status != "Cancelled")
            .OrderByDescending(o => o.CreatedAt)
            .FirstOrDefaultAsync();
    }

    public async Task<List<Order>> GetAllOrdersByUserIdAsync(Guid userId)
    {
        return await _context.Orders
            .Where(o => o.UserId == userId)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();
    }

    public async Task AddOrderAsync(Order order)
    {
        await _context.Orders.AddAsync(order);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateOrderAsync(Order order)
    {
        _context.Orders.Update(order);
        await _context.SaveChangesAsync();
    }
}
