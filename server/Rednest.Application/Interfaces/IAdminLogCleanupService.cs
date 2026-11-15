namespace Rednest.Application.Interfaces;

public interface IAdminLogCleanupService
{
    Task<int> CleanupOldAdminLogsAsync(CancellationToken cancellationToken = default);
}
