namespace Sufrano.Application.Interfaces;

public interface IAdminLogCleanupService
{
    Task<int> CleanupOldAdminLogsAsync(CancellationToken cancellationToken = default);
}
