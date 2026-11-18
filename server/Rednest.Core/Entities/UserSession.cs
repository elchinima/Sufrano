namespace Rednest.Core.Entities;

public class UserSession
{
    public Guid UserId { get; set; }
    public string? RegistrationIp { get; set; }
    public bool TwoFactorEnabled { get; set; } = false;
    public bool Subscribe { get; set; } = false;
    public bool IsActive { get; set; } = true;
    public VerificationStatus Verification { get; set; } = VerificationStatus.NotVerificated;
    public List<AccountVerifyEntry> AccountVerify { get; set; } = new();
    public List<SessionEntry> Sessions { get; set; } = new();

    public User User { get; set; } = null!;
}
