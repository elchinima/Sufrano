namespace Sufrano.Application.DTOs;

public class ResendTwoFactorRequest
{
    public string Email { get; set; } = string.Empty;
    public string? TwoFactorToken { get; set; }
}
