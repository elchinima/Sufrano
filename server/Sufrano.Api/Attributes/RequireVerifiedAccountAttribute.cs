namespace Sufrano.Api.Attributes;

/// <summary>
/// Allows the action only for users whose account verification is Comfirmed.
/// </summary>
[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
public class RequireVerifiedAccountAttribute : Attribute, IAsyncActionFilter
{
    public const string ErrorMessage = "Your account must be verified to perform this action.";

    public static async Task<bool> IsVerifiedAsync(AppDbContext db, Guid userId)
    {
        var session = await db.UserSessions.AsNoTracking()
            .FirstOrDefaultAsync(s => s.UserId == userId);
        return session?.Verification == VerificationStatus.Comfirmed;
    }

    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        var userIdStr = context.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userIdStr) || !Guid.TryParse(userIdStr, out var userId))
        {
            context.Result = new UnauthorizedObjectResult(new { message = "Unauthorized." });
            return;
        }

        var db = context.HttpContext.RequestServices.GetRequiredService<AppDbContext>();
        if (!await IsVerifiedAsync(db, userId))
        {
            context.Result = new ObjectResult(new { message = ErrorMessage, requiresVerification = true })
            {
                StatusCode = StatusCodes.Status403Forbidden
            };
            return;
        }

        await next();
    }
}
