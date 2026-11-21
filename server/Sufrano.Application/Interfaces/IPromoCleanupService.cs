namespace Sufrano.Application.Interfaces;

public interface IPromoCleanupService
{
    Task<int> CleanupExpiredPromosAsync(CancellationToken cancellationToken = default);
}
