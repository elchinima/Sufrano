namespace Sufrano.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Route("api/advert")]
[Route("api/announcements")]
public class AdvertsController : ControllerBase
{
    private readonly AppDbContext _db;

    public AdvertsController(AppDbContext db)
    {
        _db = db;
    }

    private Guid? GetUserId()
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out var userId))
            return null;
        return userId;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetActiveAdverts()
    {
        var currentUserId = GetUserId();

        var adverts = await _db.Adverts
            .AsNoTracking()
            .Where(a => a.IsActive)
            .ToListAsync();

        var result = adverts
            .OrderByDescending(a => a.Logs?.CreateDate ?? DateTime.MinValue)
            .Select(a =>
            {
                var likesList = a.Likes ?? new List<Guid>();
                var isLiked = currentUserId.HasValue && likesList.Contains(currentUserId.Value);

                return new
                {
                    id = a.Id,
                    title = a.Title,
                    description = a.Description,
                    mediaUrl = a.MediaUrl,
                    link = a.Link,
                    isActive = a.IsActive,
                    likes = likesList.Count,
                    likesCount = likesList.Count,
                    userLiked = isLiked,
                    createdAt = a.Logs?.CreateDate,
                    updatedAt = a.Logs?.UpdateDate
                };
            })
            .ToList();

        return Ok(result);
    }

    [HttpPost("{id:guid}/like")]
    [Authorize]
    public async Task<IActionResult> ToggleLike(Guid id)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        var isBlocked = await _db.UserSessions.AsNoTracking().AnyAsync(s => s.UserId == userId.Value && !s.IsActive);
        if (isBlocked)
            return StatusCode(StatusCodes.Status403Forbidden, new { message = "Your account has been suspended or blocked." });

        var advert = await _db.Adverts.FirstOrDefaultAsync(a => a.Id == id && a.IsActive);
        if (advert == null)
            return NotFound(new { message = "Advert not found." });

        advert.Likes ??= new List<Guid>();

        bool isLiked;
        if (advert.Likes.Contains(userId.Value))
        {
            advert.Likes.Remove(userId.Value);
            isLiked = false;
        }
        else
        {
            advert.Likes.Add(userId.Value);
            isLiked = true;
        }

        _db.Entry(advert).Property(a => a.Likes).IsModified = true;
        await _db.SaveChangesAsync();

        return Ok(new
        {
            id = advert.Id,
            likes = advert.Likes.Count,
            likesCount = advert.Likes.Count,
            userLiked = isLiked
        });
    }
}
