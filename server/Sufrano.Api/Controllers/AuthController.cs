
namespace Sufrano.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly ILogger<AuthController> _logger;
    private static readonly Guid ProtectedUserId = Guid.Parse("b5e53d0b-7bd6-4d7b-b99b-f9ae40ef5305");
    private static readonly string[] AllowedAvatarExtensions = [".png", ".jpg", ".jpeg"];
    private const long MaxAvatarSizeBytes = 10 * 1024 * 1024;
    private static readonly System.Collections.Concurrent.ConcurrentDictionary<Guid, SemaphoreSlim> SpinLocks = new();
    private static readonly SemaphoreSlim ActivatePromoLock = new(1, 1);

    public AuthController(
        IAuthService authService,
        IHttpClientFactory httpClientFactory,
        ILogger<AuthController> logger)
    {
        _authService = authService;
        _httpClientFactory = httpClientFactory;
        _logger = logger;
    }

    [HttpGet("google/url")]
    public IActionResult GetGoogleAuthUrl([FromQuery] string? redirect_uri)
    {
        try
        {
            var url = _authService.GetGoogleAuthUrl(redirect_uri);
            return Ok(new { url });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("google")]
    public async Task<IActionResult> GoogleAuth(
        [FromBody] GoogleAuthRequest request,
        [FromServices] IUserRepository userRepository)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(request.Code))
            {
                return BadRequest(new { message = "Authorization code is required." });
            }

            var ipAddress = HttpContext.Request.Headers["X-Forwarded-For"].FirstOrDefault()?.Split(',')[0].Trim()
                            ?? HttpContext.Connection.RemoteIpAddress?.ToString();
            var userAgent = Request.Headers["User-Agent"].ToString();
            var platformVersion = Request.Headers["Sec-CH-UA-Platform-Version"].FirstOrDefault()
                                  ?? Request.Headers["X-Platform-Version"].FirstOrDefault();
            var deviceModel = Request.Headers["Sec-CH-UA-Model"].FirstOrDefault()
                              ?? Request.Headers["X-Device-Model"].FirstOrDefault();

            var result = await _authService.AuthenticateWithGoogleAsync(
                request.Code, 
                request.RedirectUri, 
                ipAddress, 
                userAgent, 
                platformVersion, 
                deviceModel);

            SetTokenCookies(result.AccessToken, result.RefreshToken);

            var user = result.User;
            if (user != null)
            {
                SecurityVerificationHelper.AppendSecurityCookie(Response, user.Id.ToString());
            }
            var userSession = user.Session ?? await userRepository.GetSessionByUserIdAsync(user.Id);

            return Ok(new
            {
                requires2FA = false,
                hasName = result.HasName,
                user = new
                {
                    id = user.Id,
                    name = user.Name,
                    email = user.Email,
                    profilePictureUrl = AvatarHelper.Resolve(user.ProfilePictureUrl),
                    balance = user.Balance,
                    role = user.Role == UserRole.SuperAdmin ? "Super Admin" : (user.Role == UserRole.LeadStaff ? "Lead Staff" : user.Role.ToString()),
                    twoFactorEnabled = userSession?.TwoFactorEnabled ?? false,
                    verification = (userSession?.Verification ?? VerificationStatus.NotVerificated).ToString()
                }
            });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message, errorType = "ACCOUNT_NOT_FOUND" });
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(
        [FromBody] LoginRequest request,
        [FromServices] IUserRepository userRepository)
    {
        try
        {
            var ipAddress = HttpContext.Request.Headers["X-Forwarded-For"].FirstOrDefault()?.Split(',')[0].Trim()
                            ?? HttpContext.Connection.RemoteIpAddress?.ToString();
            var userAgent = Request.Headers["User-Agent"].ToString();
            var platformVersion = Request.Headers["Sec-CH-UA-Platform-Version"].FirstOrDefault()
                                  ?? Request.Headers["X-Platform-Version"].FirstOrDefault();
            var deviceModel = Request.Headers["Sec-CH-UA-Model"].FirstOrDefault()
                              ?? Request.Headers["X-Device-Model"].FirstOrDefault();

            var result = await _authService.AuthenticateOrRegisterAsync(request, ipAddress, userAgent, platformVersion, deviceModel);

            if (result.Requires2FA)
            {
                var twoFactorToken = SecurityVerificationHelper.AppendTwoFactorChallengeCookie(Response, request.Email);
                return Ok(new
                {
                    requires2FA = true,
                    email = request.Email,
                    twoFactorToken
                });
            }

            SetTokenCookies(result.AccessToken!, result.RefreshToken!);

            var user = result.User ?? await userRepository.GetByEmailAsync(request.Email);
            if (user != null)
            {
                SecurityVerificationHelper.AppendSecurityCookie(Response, user.Id.ToString());
            }
            var userSession = user?.Session ?? (user != null ? await userRepository.GetSessionByUserIdAsync(user.Id) : null);

            return Ok(new 
            { 
                requires2FA = false,
                hasName = result.HasName,
                user = user == null ? null : new
                {
                    id = user.Id,
                    name = user.Name,
                    email = user.Email,
                    profilePictureUrl = AvatarHelper.Resolve(user.ProfilePictureUrl),
                    balance = user.Balance,
                    role = user.Role == UserRole.SuperAdmin ? "Super Admin" : (user.Role == UserRole.LeadStaff ? "Lead Staff" : user.Role.ToString()),
                    twoFactorEnabled = userSession?.TwoFactorEnabled ?? false,
                    verification = (userSession?.Verification ?? VerificationStatus.NotVerificated).ToString()
                }
            });
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message, Message = ex.Message });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message, Message = ex.Message });
        }
    }

    [HttpPost("2fa/verify")]
    public async Task<IActionResult> VerifyTwoFactor([FromBody] VerifyTwoFactorRequest request)
    {
        try
        {
            var challengeToken = !string.IsNullOrWhiteSpace(request.TwoFactorToken)
                ? request.TwoFactorToken
                : Request.Cookies[SecurityVerificationHelper.TwoFactorChallengeCookieName];

            if (!SecurityVerificationHelper.ValidateTwoFactorChallengeToken(challengeToken, request.Email))
            {
                return Unauthorized(new { message = "Two-factor verification session expired or invalid. Please sign in with your password again.", Message = "Two-factor verification session expired or invalid. Please sign in with your password again." });
            }

            var ipAddress = HttpContext.Request.Headers["X-Forwarded-For"].FirstOrDefault()?.Split(',')[0].Trim()
                            ?? HttpContext.Connection.RemoteIpAddress?.ToString();
            var userAgent = Request.Headers["User-Agent"].ToString();
            var platformVersion = Request.Headers["Sec-CH-UA-Platform-Version"].FirstOrDefault()
                                  ?? Request.Headers["X-Platform-Version"].FirstOrDefault();
            var deviceModel = Request.Headers["Sec-CH-UA-Model"].FirstOrDefault()
                              ?? Request.Headers["X-Device-Model"].FirstOrDefault();

            var result = await _authService.VerifyTwoFactorAsync(request, ipAddress, userAgent, platformVersion, deviceModel);
            SecurityVerificationHelper.DeleteTwoFactorChallengeCookie(Response);
            SetTokenCookies(result.AccessToken, result.RefreshToken);
            if (result.User != null)
            {
                SecurityVerificationHelper.AppendSecurityCookie(Response, result.User.Id.ToString());
            }

            return Ok(new
            {
                requires2FA = false,
                hasName = result.HasName,
                user = new
                {
                    id = result.User.Id,
                    name = result.User.Name,
                    email = result.User.Email,
                    profilePictureUrl = AvatarHelper.Resolve(result.User.ProfilePictureUrl),
                    balance = result.User.Balance,
                    role = result.User.Role == UserRole.SuperAdmin ? "Super Admin" : (result.User.Role == UserRole.LeadStaff ? "Lead Staff" : result.User.Role.ToString()),
                    twoFactorEnabled = true,
                    verification = (result.User.Session?.Verification ?? VerificationStatus.NotVerificated).ToString()
                }
            });
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message, Message = ex.Message });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message, Message = ex.Message });
        }
    }

    [HttpPost("2fa/resend")]
    public async Task<IActionResult> ResendTwoFactor([FromBody] ResendTwoFactorRequest request)
    {
        try
        {
            var challengeToken = !string.IsNullOrWhiteSpace(request.TwoFactorToken)
                ? request.TwoFactorToken
                : Request.Cookies[SecurityVerificationHelper.TwoFactorChallengeCookieName];

            if (!SecurityVerificationHelper.ValidateTwoFactorChallengeToken(challengeToken, request.Email))
            {
                return Unauthorized(new { message = "Two-factor verification session expired or invalid. Please sign in with your password again.", Message = "Two-factor verification session expired or invalid. Please sign in with your password again." });
            }

            await _authService.ResendTwoFactorCodeAsync(request.Email);
            var newToken = SecurityVerificationHelper.AppendTwoFactorChallengeCookie(Response, request.Email);
            return Ok(new { message = "Verification code resent successfully.", twoFactorToken = newToken });
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message, Message = ex.Message });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message, Message = ex.Message });
        }
    }

    [Microsoft.AspNetCore.Authorization.Authorize]
    [RequireSecurityVerification]
    [HttpPut("2fa/toggle")]
    [HttpPost("2fa/toggle")]
    public async Task<IActionResult> ToggleTwoFactor([FromBody] ToggleTwoFactorRequest? request)
    {
        try
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out var userId))
            {
                return Unauthorized();
            }

            if (userId == ProtectedUserId)
            {
                return StatusCode(403, new { message = "CRUD operations are prohibited for this user." });
            }

            var enabled = await _authService.ToggleTwoFactorAsync(userId, request?.Enabled);
            return Ok(new { twoFactorEnabled = enabled });
        }
        catch (Exception ex)
        {
            return BadRequest(new { Message = ex.Message });
        }
    }

    [HttpPost("subscribe/request")]
    public async Task<IActionResult> RequestSubscribe([FromBody] SubscribeRequest request)
    {
        try
        {
            await _authService.RequestSubscriptionCodeAsync(request.Email);
            return Ok(new { message = "Verification code sent to your email." });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message, errorType = "ACCOUNT_NOT_FOUND" });
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message, errorType = "ALREADY_SUBSCRIBED" });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("subscribe/verify")]
    public async Task<IActionResult> VerifySubscribe([FromBody] VerifySubscribeRequest request)
    {
        try
        {
            await _authService.VerifySubscriptionCodeAsync(request.Email, request.Code);
            return Ok(new { message = "Successfully subscribed to the Süfrano Club!" });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message, errorType = "ACCOUNT_NOT_FOUND" });
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message, errorType = "ALREADY_SUBSCRIBED" });
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("forgot-password/request")]
    public async Task<IActionResult> RequestForgotPassword([FromBody] ForgotPasswordRequest request)
    {
        try
        {
            await _authService.RequestPasswordResetCodeAsync(request.Email);
            return Ok(new { message = "Password reset code sent to your email." });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message, errorType = "ACCOUNT_NOT_FOUND" });
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("forgot-password/resend")]
    public async Task<IActionResult> ResendForgotPassword([FromBody] ForgotPasswordRequest request)
    {
        try
        {
            await _authService.RequestPasswordResetCodeAsync(request.Email);
            return Ok(new { message = "Password reset code resent successfully." });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message, errorType = "ACCOUNT_NOT_FOUND" });
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("forgot-password/reset")]
    public async Task<IActionResult> ResetPassword(
        [FromBody] ResetPasswordRequest request,
        [FromServices] IUserRepository userRepository)
    {
        try
        {
            var ipAddress = HttpContext.Request.Headers["X-Forwarded-For"].FirstOrDefault()?.Split(',')[0].Trim()
                            ?? HttpContext.Connection.RemoteIpAddress?.ToString();
            var userAgent = Request.Headers["User-Agent"].ToString();
            var platformVersion = Request.Headers["Sec-CH-UA-Platform-Version"].FirstOrDefault()
                                  ?? Request.Headers["X-Platform-Version"].FirstOrDefault();
            var deviceModel = Request.Headers["Sec-CH-UA-Model"].FirstOrDefault()
                              ?? Request.Headers["X-Device-Model"].FirstOrDefault();

            var result = await _authService.ResetPasswordAsync(request, ipAddress, userAgent, platformVersion, deviceModel);
            SetTokenCookies(result.AccessToken, result.RefreshToken);

            var user = result.User;
            if (user != null)
            {
                SecurityVerificationHelper.AppendSecurityCookie(Response, user.Id.ToString());
            }
            if (user != null)
            {
                SecurityVerificationHelper.AppendSecurityCookie(Response, user.Id.ToString());
            }
            var userSession = user.Session ?? await userRepository.GetSessionByUserIdAsync(user.Id);

            return Ok(new
            {
                message = "Password has been successfully reset.",
                hasName = result.HasName,
                user = new
                {
                    id = user.Id,
                    name = user.Name,
                    email = user.Email,
                    profilePictureUrl = AvatarHelper.Resolve(user.ProfilePictureUrl),
                    balance = user.Balance,
                    role = user.Role == UserRole.SuperAdmin ? "Super Admin" : (user.Role == UserRole.LeadStaff ? "Lead Staff" : user.Role.ToString()),
                    twoFactorEnabled = userSession?.TwoFactorEnabled ?? false,
                    verification = (userSession?.Verification ?? VerificationStatus.NotVerificated).ToString()
                }
            });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message, errorType = "ACCOUNT_NOT_FOUND" });
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh()
    {
        var refreshToken = Request.Cookies["refreshToken"];
        if (string.IsNullOrEmpty(refreshToken))
        {
            ClearTokenCookies();
            return Unauthorized(new { Message = "No refresh token provided." });
        }
        try
        {
            var ipAddress = HttpContext.Request.Headers["X-Forwarded-For"].FirstOrDefault()?.Split(',')[0].Trim()
                            ?? HttpContext.Connection.RemoteIpAddress?.ToString();
            var userAgent = Request.Headers["User-Agent"].ToString();
            var platformVersion = Request.Headers["Sec-CH-UA-Platform-Version"].FirstOrDefault()
                                  ?? Request.Headers["X-Platform-Version"].FirstOrDefault();
            var deviceModel = Request.Headers["Sec-CH-UA-Model"].FirstOrDefault()
                              ?? Request.Headers["X-Device-Model"].FirstOrDefault();

            var result = await _authService.RefreshTokenAsync(refreshToken, ipAddress, userAgent, platformVersion, deviceModel);
            SetTokenCookies(result.AccessToken, result.RefreshToken);
            return Ok();
        }
        catch (UnauthorizedAccessException ex)
        {
            ClearTokenCookies();
            return Unauthorized(new { Message = ex.Message });
        }
        catch (Exception ex)
        {
            return BadRequest(new { Message = ex.Message });
        }
    }

    [Microsoft.AspNetCore.Authorization.Authorize]
    [RequireSecurityVerification]
    [HttpGet("sessions")]
    public async Task<IActionResult> GetSessions()
    {
        try
        {
            var userIdString = User.FindFirstValue(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out var userId))
            {
                return Unauthorized();
            }

            if (userId == ProtectedUserId)
            {
                return StatusCode(403, new { message = "CRUD operations are prohibited for this user." });
            }

            var currentRefreshToken = Request.Cookies["refreshToken"];
            var sessions = await _authService.GetUserSessionsAsync(userId, currentRefreshToken);
            return Ok(sessions);
        }
        catch (Exception ex)
        {
            return BadRequest(new { Message = ex.Message });
        }
    }

    [Microsoft.AspNetCore.Authorization.Authorize]
    [RequireSecurityVerification]
    [HttpPost("sessions/{sessionId}/revoke")]
    public async Task<IActionResult> RevokeSession(string sessionId)
    {
        try
        {
            var userIdString = User.FindFirstValue(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out var userId))
            {
                return Unauthorized();
            }

            if (userId == ProtectedUserId)
            {
                return StatusCode(403, new { message = "CRUD operations are prohibited for this user." });
            }

            var currentRefreshToken = Request.Cookies["refreshToken"];
            var success = await _authService.RevokeSessionAsync(userId, sessionId, currentRefreshToken);
            if (!success)
            {
                return NotFound(new { Message = "Session not found." });
            }

            return Ok(new { Message = "Session revoked successfully." });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { Message = ex.Message });
        }
        catch (Exception ex)
        {
            return BadRequest(new { Message = ex.Message });
        }
    }

    [Microsoft.AspNetCore.Authorization.Authorize]
    [HttpGet("me")]
    public async Task<IActionResult> GetMe([FromServices] IUserRepository userRepository)
    {
        try
        {
            var userIdString = User.FindFirstValue(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out var userId))
            {
                return Unauthorized();
            }

            if (userId == ProtectedUserId)
            {
                return StatusCode(403, new { message = "CRUD operations are prohibited for this user." });
            }

            var user = await userRepository.GetByIdAsync(userId);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            if (user.Role == UserRole.AI || user.Role == UserRole.Bot)
            {
                return Unauthorized(new { message = "Access denied. Logging into accounts with the Bot or AI role is prohibited." });
            }

            var userSession = user.Session ?? await userRepository.GetSessionByUserIdAsync(user.Id);
            if (userSession != null && !userSession.IsActive)
            {
                return Unauthorized(new { message = "Account suspended." });
            }

            return Ok(new 
            { 
                Id = user.Id, 
                Name = user.Name,
                Email = user.Email,
                ProfilePictureUrl = AvatarHelper.Resolve(user.ProfilePictureUrl),
                Balance = user.Balance,
                Role = user.Role == UserRole.SuperAdmin ? "Super Admin" : (user.Role == UserRole.LeadStaff ? "Lead Staff" : user.Role.ToString()),
                TwoFactorEnabled = userSession?.TwoFactorEnabled ?? false,
                Verification = (userSession?.Verification ?? VerificationStatus.NotVerificated).ToString()
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new { Message = ex.Message });
        }
    }

    [Microsoft.AspNetCore.Authorization.Authorize]
    [HttpPost("verification/request")]
    public async Task<IActionResult> RequestVerification([FromServices] IUserRepository userRepository)
    {
        try
        {
            var userIdString = User.FindFirstValue(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out var userId))
            {
                return Unauthorized();
            }

            if (userId == ProtectedUserId)
            {
                return StatusCode(403, new { message = "CRUD operations are prohibited for this user." });
            }

            var user = await userRepository.GetByIdAsync(userId);
            if (user == null)
            {
                return NotFound(new { message = "User not found." });
            }

            if (user.Role == UserRole.AI || user.Role == UserRole.Bot)
            {
                return BadRequest(new { message = "Action not supported for bot or AI accounts." });
            }

            var session = user.Session ?? await userRepository.GetSessionByUserIdAsync(user.Id);
            if (session == null)
            {
                session = new UserSession
                {
                    UserId = user.Id,
                    Verification = VerificationStatus.InProgress,
                    IsActive = true
                };
                await userRepository.AddSessionAsync(session);
            }
            else
            {
                if (session.Verification == VerificationStatus.Comfirmed)
                {
                    return BadRequest(new { message = "Account is already verified.", verification = "Comfirmed" });
                }

                session.Verification = VerificationStatus.InProgress;
                await userRepository.UpdateSessionAsync(session);
            }

            return Ok(new
            {
                message = "Verification requested successfully.",
                verification = session.Verification.ToString()
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [Microsoft.AspNetCore.Authorization.Authorize]
    [RequireSecurityVerification]
    [HttpPost("profile/picture")]
    public async Task<IActionResult> UploadProfilePicture(
        IFormFile file,
        [FromServices] IUserRepository userRepository)
    {
        try
        {
            var userIdString = User.FindFirstValue(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out var userId))
            {
                return Unauthorized();
            }

            if (userId == ProtectedUserId)
            {
                return StatusCode(403, new { message = "CRUD operations are prohibited for this user." });
            }

            var user = await userRepository.GetByIdAsync(userId);
            if (user == null)
            {
                return NotFound(new { message = "User not found." });
            }

            if (file == null || file.Length == 0)
            {
                return BadRequest(new { message = "File not selected." });
            }

            if (file.Length > MaxAvatarSizeBytes)
            {
                return BadRequest(new { message = "File exceeds 10 MB limit." });
            }

            var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (!AllowedAvatarExtensions.Contains(ext))
            {
                return BadRequest(new { message = "Allowed formats: PNG, JPG, JPEG." });
            }

            await using var inputStream = file.OpenReadStream();
            using var image = await Image.LoadAsync(inputStream);

            image.Mutate(x => x.Resize(image.Width / 2, image.Height / 2));

            await using var outputStream = new MemoryStream();
            var encoder = new WebpEncoder { Quality = 50 };
            await image.SaveAsync(outputStream, encoder);
            outputStream.Position = 0;

            var supabaseUrl = Environment.GetEnvironmentVariable("SUPABASE_URL");
            var serviceKey = Environment.GetEnvironmentVariable("SUPABASE_SERVICE_KEY");

            var storagePath = $"profile/{userId}.webp";

            var client = _httpClientFactory.CreateClient("supabase");
            client.DefaultRequestHeaders.Clear();
            client.DefaultRequestHeaders.Add("apikey", serviceKey);
            client.DefaultRequestHeaders.Add("Authorization", $"Bearer {serviceKey}");

            var content = new StreamContent(outputStream);
            content.Headers.ContentType = new MediaTypeHeaderValue("image/webp");

            var request = new HttpRequestMessage(HttpMethod.Post, $"{supabaseUrl}/storage/v1/object/public-files/{storagePath}")
            {
                Content = content
            };
            request.Headers.Add("x-upsert", "true");

            var response = await client.SendAsync(request);

            if (!response.IsSuccessStatusCode)
            {
                try
                {
                    var createBucketBody = JsonSerializer.Serialize(new
                    {
                        id = "public-files",
                        name = "public-files",
                        @public = true
                    });
                    var createRequest = new HttpRequestMessage(HttpMethod.Post, $"{supabaseUrl}/storage/v1/bucket")
                    {
                        Content = new StringContent(createBucketBody, Encoding.UTF8, "application/json")
                    };
                    await client.SendAsync(createRequest);
                }
                catch { }

                outputStream.Position = 0;
                var retryContent = new StreamContent(outputStream);
                retryContent.Headers.ContentType = new MediaTypeHeaderValue("image/webp");

                var retryRequest = new HttpRequestMessage(HttpMethod.Post, $"{supabaseUrl}/storage/v1/object/public-files/{storagePath}")
                {
                    Content = retryContent
                };
                retryRequest.Headers.Add("x-upsert", "true");
                response = await client.SendAsync(retryRequest);

                if (!response.IsSuccessStatusCode)
                {
                    var err = await response.Content.ReadAsStringAsync();
                    return StatusCode(500, new { message = $"Supabase upload error: {err}" });
                }
            }

            var publicUrl = $"{supabaseUrl}/storage/v1/object/public/public-files/{storagePath}?v={DateTimeOffset.UtcNow.ToUnixTimeSeconds()}";
            user.ProfilePictureUrl = publicUrl;
            await userRepository.UpdateAsync(user);

            return Ok(new
            {
                profilePictureUrl = publicUrl,
                sizeKb = Math.Round(outputStream.Length / 1024.0, 1)
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [Microsoft.AspNetCore.Authorization.Authorize]
    [RequireSecurityVerification]
    [HttpDelete("profile/picture")]
    public async Task<IActionResult> DeleteProfilePicture([FromServices] IUserRepository userRepository)
    {
        try
        {
            var userIdString = User.FindFirstValue(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out var userId))
            {
                return Unauthorized();
            }

            if (userId == ProtectedUserId)
            {
                return StatusCode(403, new { message = "CRUD operations are prohibited for this user." });
            }

            var user = await userRepository.GetByIdAsync(userId);
            if (user == null)
            {
                return NotFound(new { message = "User not found." });
            }

            if (AvatarHelper.IsDefaultOrEmpty(user.ProfilePictureUrl))
            {
                return BadRequest(new { message = "Default avatar cannot be deleted." });
            }

            var supabaseUrl = Environment.GetEnvironmentVariable("SUPABASE_URL");
            var serviceKey = Environment.GetEnvironmentVariable("SUPABASE_SERVICE_KEY");

            var client = _httpClientFactory.CreateClient("supabase");
            client.DefaultRequestHeaders.Clear();
            client.DefaultRequestHeaders.Add("apikey", serviceKey);
            client.DefaultRequestHeaders.Add("Authorization", $"Bearer {serviceKey}");

            var storagePath = $"profile/{userId}.webp";
            var body = JsonSerializer.Serialize(new { prefixes = new[] { storagePath } });
            var request = new HttpRequestMessage(HttpMethod.Delete, $"{supabaseUrl}/storage/v1/object/public-files")
            {
                Content = new StringContent(body, Encoding.UTF8, "application/json")
            };

            await client.SendAsync(request);

            user.ProfilePictureUrl = null;
            await userRepository.UpdateAsync(user);

            return Ok(new
            {
                message = "Profile picture deleted.",
                profilePictureUrl = AvatarHelper.DefaultAvatarPath
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [Microsoft.AspNetCore.Authorization.Authorize]
    [HttpPut("name")]
    public async Task<IActionResult> UpdateName(
        [FromBody] UpdateNameRequest nameRequest, 
        [FromServices] IUserRepository userRepository)
    {
        try
        {
            var userIdString = User.FindFirstValue(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out var userId))
            {
                return Unauthorized();
            }

            if (userId == ProtectedUserId)
            {
                return StatusCode(403, new { message = "CRUD operations are prohibited for this user." });
            }

            var user = await userRepository.GetByIdAsync(userId);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            if (user.Role == UserRole.AI || user.Role == UserRole.Bot)
            {
                return Unauthorized(new { message = "Access denied. Logging into accounts with the Bot or AI role is prohibited." });
            }

            var userSession = user.Session ?? await userRepository.GetSessionByUserIdAsync(user.Id);
            var currentVerification = userSession?.Verification ?? VerificationStatus.NotVerificated;

            if (!string.IsNullOrWhiteSpace(user.Name))
            {
                if (currentVerification != VerificationStatus.NotVerificated)
                {
                    return StatusCode(StatusCodes.Status403Forbidden, new
                    {
                        message = "Name cannot be changed while account verification is in progress or confirmed."
                    });
                }

                var secToken = Request.Cookies[SecurityVerificationHelper.CookieName];
                if (string.IsNullOrEmpty(secToken) || !SecurityVerificationHelper.ValidateToken(secToken, userIdString))
                {
                    return StatusCode(StatusCodes.Status403Forbidden, new
                    {
                        message = "Security verification required. Please enter your account password.",
                        requiresSecurityCheck = true
                    });
                }
            }

            if (nameRequest == null || string.IsNullOrWhiteSpace(nameRequest.Name))
            {
                return BadRequest(new { message = "Name cannot be empty." });
            }

            if (nameRequest.Name.Any(char.IsWhiteSpace))
            {
                return BadRequest(new { message = "Name cannot contain spaces." });
            }

            var rawName = nameRequest.Name.Trim();
            if (rawName.Length > NameValidationHelper.MaxNameLength)
            {
                return BadRequest(new { message = "Name cannot exceed 25 characters." });
            }

            if (NameValidationHelper.ContainsEmoji(rawName))
            {
                return BadRequest(new { message = "Name cannot contain emojis." });
            }

            var culture = Request.Headers.AcceptLanguage.ToString().Contains("az", StringComparison.OrdinalIgnoreCase)
                ? new System.Globalization.CultureInfo("az-Latn-AZ")
                : System.Globalization.CultureInfo.InvariantCulture;

            var capitalizedName = char.ToUpper(rawName[0], culture) + (rawName.Length > 1 ? rawName.Substring(1) : string.Empty);

            user.Name = capitalizedName;
            await userRepository.UpdateAsync(user);

            SecurityVerificationHelper.AppendSecurityCookie(Response, user.Id.ToString());

            return Ok(new
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email,
                ProfilePictureUrl = AvatarHelper.Resolve(user.ProfilePictureUrl),
                Balance = user.Balance,
                Verification = currentVerification.ToString()
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new { Message = ex.Message });
        }
    }

    [Microsoft.AspNetCore.Authorization.Authorize]
    [RequireSecurityVerification]
    [HttpPost("change-password")]
    public async Task<IActionResult> ChangePassword(
        [FromBody] ChangePasswordRequest request,
        [FromServices] IUserRepository userRepository)
    {
        try
        {
            var userIdString = User.FindFirstValue(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out var userId))
            {
                return Unauthorized();
            }

            if (userId == ProtectedUserId)
            {
                return StatusCode(403, new { message = "CRUD operations are prohibited for this user." });
            }

            if (string.IsNullOrWhiteSpace(request.CurrentPassword) ||
                string.IsNullOrWhiteSpace(request.NewPassword))
            {
                return BadRequest(new { message = "All password fields are required." });
            }

            if (request.NewPassword.Length < 6)
            {
                return BadRequest(new { message = "New password must be at least 6 characters long." });
            }

            if (!string.IsNullOrEmpty(request.ConfirmPassword) && request.NewPassword != request.ConfirmPassword)
            {
                return BadRequest(new { message = "New password and confirmation do not match." });
            }

            var user = await userRepository.GetByIdAsync(userId);
            if (user == null)
            {
                return NotFound(new { message = "User not found." });
            }

            if (!BCrypt.Net.BCrypt.Verify(request.CurrentPassword, user.PasswordHash))
            {
                return BadRequest(new { message = "Current password is incorrect." });
            }

            if (BCrypt.Net.BCrypt.Verify(request.NewPassword, user.PasswordHash))
            {
                return BadRequest(new { message = "New password cannot be the same as the current password." });
            }

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
            await userRepository.UpdateAsync(user);

            var currentRefreshToken = Request.Cookies["refreshToken"];
            var userSession = await userRepository.GetSessionByUserIdAsync(userId);
            if (userSession?.Sessions != null && userSession.Sessions.Count > 0)
            {
                var changed = false;
                foreach (var s in userSession.Sessions)
                {
                    var isCurrentSession = !string.IsNullOrEmpty(currentRefreshToken) &&
                                           (s.RefreshToken == currentRefreshToken || s.PreviousRefreshToken == currentRefreshToken);
                    if (!isCurrentSession)
                    {
                        s.IsActive = false;
                        s.PreviousRefreshToken = null;
                        s.PreviousTokenRotatedAt = null;
                        changed = true;
                    }
                }
                if (changed)
                {
                    await userRepository.UpdateSessionAsync(userSession);
                }
            }

            return Ok(new { message = "Password updated successfully." });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [Microsoft.AspNetCore.Authorization.Authorize]
    [HttpPost("verify-password")]
    public async Task<IActionResult> VerifyPassword(
        [FromBody] VerifyPasswordRequest request,
        [FromServices] IUserRepository userRepository)
    {
        try
        {
            var userIdString = User.FindFirstValue(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out var userId))
            {
                return Unauthorized(new { message = "Unauthorized" });
            }

            if (string.IsNullOrWhiteSpace(request?.Password))
            {
                return BadRequest(new { message = "Password is required." });
            }

            var user = await userRepository.GetByIdAsync(userId);
            if (user == null)
            {
                return NotFound(new { message = "User not found." });
            }

            if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                return BadRequest(new { message = "Incorrect password. Please try again." });
            }

            SecurityVerificationHelper.AppendSecurityCookie(Response, userId.ToString());

            return Ok(new { success = true, message = "Password verified successfully." });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [Microsoft.AspNetCore.Authorization.Authorize]
    [HttpGet("security-status")]
    public IActionResult GetSecurityStatus()
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out _))
        {
            return Unauthorized();
        }

        var token = Request.Cookies[SecurityVerificationHelper.CookieName];
        var isVerified = SecurityVerificationHelper.ValidateToken(token, userIdString);

        return Ok(new { verified = isVerified });
    }

    [Microsoft.AspNetCore.Authorization.Authorize]
    [HttpGet("promo")]
    public async Task<IActionResult> GetPromo([FromServices] IUserRepository userRepository)
    {
        try
        {
            var userIdString = User.FindFirstValue(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out var userId))
                return Unauthorized();

            var now = DateTime.UtcNow;
            var lastPromo = await userRepository.GetUserPromoAsync(userId);

            if (lastPromo == null)
            {
                return Ok(new
                {
                    hasPromo = false,
                    isActive = false,
                    canSpin = true,
                    cooldownEndsAt = (DateTime?)null
                });
            }

            if (lastPromo.IsActive && lastPromo.Dates.ExpiresAt < now)
            {
                lastPromo.IsActive = false;
                await userRepository.UpdateUserPromoAsync(lastPromo);
            }

            var cooldownEndsAt = lastPromo.Dates.ActivatedAt.AddDays(7);
            bool canSpin = now >= cooldownEndsAt;

            var (normName, normDesc, normDisc, normCb) = NormalizePromoPrizeInfo(lastPromo.PrizeInfo);

            return Ok(new
            {
                hasPromo = true,
                promoCode = lastPromo.Codes.PromoCode,
                prizeName = normName,
                prizeDescription = normDesc,
                prizeType = lastPromo.PrizeInfo.Type.ToString(),
                discountPercent = normDisc,
                cashbackPercent = normCb,
                barCode = lastPromo.Codes.BarCode,
                isActive = lastPromo.IsActive,
                activatedAt = lastPromo.Dates.ActivatedAt,
                expiresAt = lastPromo.Dates.ExpiresAt,
                canSpin = canSpin,
                cooldownEndsAt = cooldownEndsAt
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching user promo state.");
            return StatusCode(500, new { message = "An unexpected error occurred while loading your promo." });
        }
    }

    [Microsoft.AspNetCore.Authorization.Authorize]
    [HttpGet("promos")]
    public async Task<IActionResult> GetAllPromos([FromServices] IUserRepository userRepository)
    {
        try
        {
            var userIdString = User.FindFirstValue(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out var userId))
                return Unauthorized();

            var promos = await userRepository.GetAllUserPromosAsync(userId);
            var now = DateTime.UtcNow;

            var list = promos.Select(promo =>
            {
                bool isExpired = promo.Dates.ExpiresAt < now;
                var (normName, normDesc, normDisc, normCb) = NormalizePromoPrizeInfo(promo.PrizeInfo);
                return new
                {
                    id = promo.Id,
                    promoCode = promo.Codes.PromoCode,
                    barCode = promo.Codes.BarCode,
                    prizeName = normName,
                    prizeDescription = normDesc,
                    prizeType = promo.PrizeInfo.Type.ToString(),
                    discountPercent = normDisc,
                    cashbackPercent = normCb,
                    isActive = promo.IsActive && !isExpired,
                    isExpired = isExpired,
                    activatedAt = promo.Dates.ActivatedAt,
                    expiresAt = promo.Dates.ExpiresAt
                };
            }).ToList();

            return Ok(list);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching all user promos.");
            return StatusCode(500, new { message = "An unexpected error occurred while loading promo codes." });
        }
    }

    [Microsoft.AspNetCore.Authorization.Authorize]
    [HttpPost("promos/activate")]
    public async Task<IActionResult> ActivatePromo(
        [FromBody] ActivatePromoRequest request,
        [FromServices] AppDbContext db)
    {
        try
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out var userId))
                return Unauthorized();

            if (string.IsNullOrWhiteSpace(request?.PromoCode))
            {
                return BadRequest(new { message = "Promo code cannot be empty." });
            }

            var inputCode = request.PromoCode.Trim().ToUpperInvariant();

            await ActivatePromoLock.WaitAsync();
            try
            {
                await using var tx = await db.Database.BeginTransactionAsync();

                var promo = await db.UserPromos.FirstOrDefaultAsync(p => p.Codes.PromoCode == inputCode);
                if (promo == null)
                {
                    return NotFound(new { message = "Promo code not found. Please check the code and try again." });
                }

                await db.Database.ExecuteSqlInterpolatedAsync(
                    $"SELECT 1 FROM \"UserPromos\" WHERE \"Id\" = {promo.Id} FOR UPDATE");
                await db.Entry(promo).ReloadAsync();

                var pixel = await db.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Email == "myrednest@gmail.com");

                if (promo.UserId == userId)
                {
                    return BadRequest(new { message = "You have already activated this promo code." });
                }

                if (pixel != null && promo.UserId != pixel.Id)
                {
                    return Conflict(new { message = "This promo code has already been activated by another user." });
                }

                var now = DateTime.UtcNow;
                if (!promo.IsActive || promo.Dates.ExpiresAt < now)
                {
                    return BadRequest(new { message = "This promo code has expired or is no longer active." });
                }

                promo.UserId = userId;
                promo.PrizeInfo.Source = Sufrano.Core.Entities.PrizeInfo.SourceAdmin;
                db.Entry(promo).Property(p => p.PrizeInfo).IsModified = true;

                await db.SaveChangesAsync();
                await tx.CommitAsync();

                var (normName, normDesc, normDisc, normCb) = NormalizePromoPrizeInfo(promo.PrizeInfo);

                return Ok(new
                {
                    message = "Promo code successfully activated!",
                    promo = new
                    {
                        id = promo.Id,
                        promoCode = promo.Codes.PromoCode,
                        barCode = promo.Codes.BarCode,
                        prizeName = normName,
                        prizeDescription = normDesc,
                        prizeType = promo.PrizeInfo.Type.ToString(),
                        discountPercent = normDisc,
                        cashbackPercent = normCb,
                        isActive = promo.IsActive,
                        isExpired = false,
                        activatedAt = promo.Dates.ActivatedAt,
                        expiresAt = promo.Dates.ExpiresAt
                    }
                });
            }
            finally
            {
                ActivatePromoLock.Release();
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error activating promo code.");
            return StatusCode(500, new { message = "An unexpected error occurred while activating the promo code." });
        }
    }

    [Microsoft.AspNetCore.Authorization.Authorize]
    [HttpPost("promo")]
    public async Task<IActionResult> SavePromo(
        [FromServices] IUserRepository userRepository,
        [FromServices] AppDbContext db)
    {
        try
        {
            var userIdString = User.FindFirstValue(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out var userId))
                return Unauthorized();

            var userSpinLock = SpinLocks.GetOrAdd(userId, _ => new SemaphoreSlim(1, 1));
            await userSpinLock.WaitAsync();
            try
            {
                await using var tx = await db.Database.BeginTransactionAsync();
                await db.Database.ExecuteSqlInterpolatedAsync(
                    $"SELECT 1 FROM \"Users\" WHERE \"Id\" = {userId} FOR UPDATE");

                var now = DateTime.UtcNow;
                var lastPromo = await userRepository.GetUserPromoAsync(userId);

                if (lastPromo != null)
                {
                    var cooldownEndsAt = lastPromo.Dates.ActivatedAt.AddDays(7);
                    if (now < cooldownEndsAt)
                    {
                        return Conflict(new
                        {
                            message = "You can only spin the wheel once a week.",
                            cooldownEndsAt = cooldownEndsAt
                        });
                    }
                }

                var prizeType = PickWeightedPrize();
                var cashbackPercent = prizeType == Sufrano.Core.Entities.PrizeType.CashbackOnPurchases
                    ? Random.Shared.Next(1, 11)
                    : 0;
                var discountPercent = prizeType == Sufrano.Core.Entities.PrizeType.Discount25
                    ? 15
                    : prizeType == Sufrano.Core.Entities.PrizeType.Discount50
                        ? 25
                        : 0;

                var (prizeName, prizeDescription) = GetPrizeDetails(prizeType, cashbackPercent);
                var segmentIndex = (int)prizeType;

                string promoCode;
                string barCode;
                int attempts = 0;
                do
                {
                    promoCode = Sufrano.Core.Entities.PromoCodeGenerator.GeneratePromoCode();
                    barCode = Sufrano.Core.Entities.PromoCodeGenerator.GenerateBarCode();
                    attempts++;
                }
                while (attempts < 5 && await db.UserPromos.AnyAsync(p => p.Codes.PromoCode == promoCode || p.Codes.BarCode == barCode));

                var promo = new Sufrano.Core.Entities.UserPromo
                {
                    UserId = userId,
                    Codes = new Sufrano.Core.Entities.PromoCodes
                    {
                        PromoCode = promoCode,
                        BarCode = barCode
                    },
                    PrizeInfo = new Sufrano.Core.Entities.PrizeInfo
                    {
                        Type = prizeType,
                        PrizeName = prizeName,
                        PrizeDescription = prizeDescription,
                        CashbackPercent = cashbackPercent,
                        DiscountPercent = discountPercent,
                        Source = Sufrano.Core.Entities.PrizeInfo.SourceWheel
                    },
                    Dates = new Sufrano.Core.Entities.PromoDates
                    {
                        ActivatedAt = now,
                        ExpiresAt = now.AddDays(7)
                    },
                    IsActive = true
                };

                await userRepository.AddUserPromoAsync(promo);
                await tx.CommitAsync();

                return Ok(new
                {
                    segmentIndex,
                    prizeType = prizeType.ToString(),
                    prizeName,
                    prizeDescription,
                    promoCode,
                    barCode,
                    cashbackPercent,
                    discountPercent,
                    expiresAt = now.AddDays(7),
                    cooldownEndsAt = now.AddDays(7)
                });
            }
            finally
            {
                userSpinLock.Release();
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error spinning the Wheel of Fortune.");
            return StatusCode(500, new { message = "An unexpected error occurred while spinning the wheel." });
        }
    }

    private static Sufrano.Core.Entities.PrizeType PickWeightedPrize()
    {
        var roll = Random.Shared.Next(1, 101);
        return roll switch
        {
            <= 1  => Sufrano.Core.Entities.PrizeType.SuperPrize,          // 1%
            <= 6  => Sufrano.Core.Entities.PrizeType.FreeDrink,           // 5%
            <= 11 => Sufrano.Core.Entities.PrizeType.FreeDessert,         // 5%
            <= 21 => Sufrano.Core.Entities.PrizeType.Discount25,          // 10% (15% Discount)
            <= 95 => Sufrano.Core.Entities.PrizeType.CashbackOnPurchases, // 74%
            _     => Sufrano.Core.Entities.PrizeType.Discount50           // 5%  (25% Discount)
        };
    }

    private static (string Name, string Description) GetPrizeDetails(
        Sufrano.Core.Entities.PrizeType prizeType, int cashbackPercent) => prizeType switch
    {
        Sufrano.Core.Entities.PrizeType.SuperPrize =>
            ("SUPER PRIZE", "30 AZN discount on orders of 100 AZN or more!"),
        Sufrano.Core.Entities.PrizeType.FreeDrink =>
            ("FREE DRINK", "One free drink on orders with at least 10 AZN to pay!"),
        Sufrano.Core.Entities.PrizeType.FreeDessert =>
            ("FREE DESSERT", "One free dessert on orders with at least 10 AZN to pay!"),
        Sufrano.Core.Entities.PrizeType.Discount25 =>
            ("DISCOUNT UP TO 15%", "15% discount (max 15 AZN) on orders of 50 AZN or more!"),
        Sufrano.Core.Entities.PrizeType.CashbackOnPurchases =>
            ($"{(cashbackPercent > 0 ? cashbackPercent : 10)}% CASHBACK ON PURCHASES", $"{(cashbackPercent > 0 ? cashbackPercent : 10)}% cashback on your next order!"),
        Sufrano.Core.Entities.PrizeType.Discount50 =>
            ("DISCOUNT UP TO 25%", "25% discount (max 25 AZN) on orders of 50 AZN or more!"),
        _ => ("Prize", "Congratulations!")
    };

    private static (string Name, string Description, int DiscountPercent, int CashbackPercent) NormalizePromoPrizeInfo(
        Sufrano.Core.Entities.PrizeInfo? info)
    {
        if (info == null)
            return ("Prize", "Congratulations!", 0, 0);

        switch (info.Type)
        {
            case Sufrano.Core.Entities.PrizeType.SuperPrize:
                return ("SUPER PRIZE", "30 AZN discount on orders of 100 AZN or more!", 0, 0);
            case Sufrano.Core.Entities.PrizeType.FreeDrink:
                return ("FREE DRINK", "One free drink on orders with at least 10 AZN to pay!", 0, 0);
            case Sufrano.Core.Entities.PrizeType.FreeDessert:
                return ("FREE DESSERT", "One free dessert on orders with at least 10 AZN to pay!", 0, 0);
            case Sufrano.Core.Entities.PrizeType.Discount25:
                return ("DISCOUNT UP TO 15%", "15% discount (max 15 AZN) on orders of 50 AZN or more!", 15, 0);
            case Sufrano.Core.Entities.PrizeType.Discount50:
                return ("DISCOUNT UP TO 25%", "25% discount (max 25 AZN) on orders of 50 AZN or more!", 25, 0);
            case Sufrano.Core.Entities.PrizeType.CashbackOnPurchases:
            {
                var cb = info.CashbackPercent;
                if (cb <= 0 && !string.IsNullOrEmpty(info.PrizeDescription))
                {
                    var m = Regex.Match(info.PrizeDescription, @"(\d+)\s*%");
                    if (m.Success && int.TryParse(m.Groups[1].Value, out var parsedCb))
                        cb = parsedCb;
                }
                if (cb <= 0) cb = 10;
                return ($"{cb}% CASHBACK ON PURCHASES", $"{cb}% cashback on your next order!", 0, cb);
            }
            default:
                return (
                    !string.IsNullOrWhiteSpace(info.PrizeName) ? info.PrizeName : $"{info.DiscountPercent}% Discount",
                    !string.IsNullOrWhiteSpace(info.PrizeDescription) ? info.PrizeDescription : $"Get {info.DiscountPercent}% off your order.",
                    info.DiscountPercent,
                    info.CashbackPercent
                );
        }
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        Guid? userId = Guid.TryParse(userIdStr, out var parsedId) ? parsedId : null;
        var refreshToken = Request.Cookies["refreshToken"];

        try
        {
            await _authService.LogoutAsync(userId, refreshToken);
        }
        catch { }

        ClearTokenCookies();
        return Ok();
    }

    private void ClearTokenCookies()
    {
        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.None,
            Path = "/"
        };
        Response.Cookies.Delete("accessToken", cookieOptions);
        Response.Cookies.Delete("refreshToken", cookieOptions);
        Response.Cookies.Delete("admin_session", cookieOptions);
        SecurityVerificationHelper.DeleteSecurityCookie(Response);
        SecurityVerificationHelper.DeleteTwoFactorChallengeCookie(Response);
    }

    private void SetTokenCookies(string accessToken, string refreshToken)
    {
        var accessCookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.None,
            Path = "/",
            Expires = DateTime.UtcNow.AddMinutes(15)
        };

        var refreshCookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.None,
            Path = "/",
            Expires = DateTime.UtcNow.AddDays(15)
        };

        Response.Cookies.Append("accessToken", accessToken, accessCookieOptions);
        Response.Cookies.Append("refreshToken", refreshToken, refreshCookieOptions);
    }
}

public class ActivatePromoRequest
{
    public string? PromoCode { get; set; }
}

public class GoogleAuthRequest
{
    public string Code { get; set; } = string.Empty;
    public string? RedirectUri { get; set; }
}
