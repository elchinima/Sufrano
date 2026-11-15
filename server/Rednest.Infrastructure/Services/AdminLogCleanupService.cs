namespace Rednest.Infrastructure.Services;

public class AdminLogCleanupService : BackgroundService, IAdminLogCleanupService
{
    private const int RetentionDays = 90;

    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<AdminLogCleanupService> _logger;

    public AdminLogCleanupService(
        IServiceScopeFactory scopeFactory,
        ILogger<AdminLogCleanupService> logger)
    {
        _scopeFactory = scopeFactory;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("AdminLogCleanupService started (retention: {Days} days, daily run at 01:00 UTC+4).", RetentionDays);

        try
        {
            await CleanupOldAdminLogsAsync(stoppingToken);
        }
        catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
        {
            return;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Initial cleanup in AdminLogCleanupService failed.");
        }

        while (!stoppingToken.IsCancellationRequested)
        {
            var delay = GetDelayUntilNextBakuOneAm();
            var nextRunUtc = DateTime.UtcNow.Add(delay);
            var nextRunBaku = nextRunUtc.AddHours(4);

            _logger.LogInformation(
                "AdminLogCleanupService: Next run scheduled at {NextRunBaku:yyyy-MM-dd HH:mm:ss} UTC+4 ({NextRunUtc:yyyy-MM-dd HH:mm:ss} UTC). Delay: {Hours}h {Minutes}m {Seconds}s.",
                nextRunBaku, nextRunUtc, (int)delay.TotalHours, delay.Minutes, delay.Seconds);

            try
            {
                await Task.Delay(delay, stoppingToken);
            }
            catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
            {
                break;
            }

            try
            {
                await CleanupOldAdminLogsAsync(stoppingToken);
            }
            catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
            {
                break;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred during scheduled AdminLogs cleanup.");
            }
        }

        _logger.LogInformation("AdminLogCleanupService stopped.");
    }

    public async Task<int> CleanupOldAdminLogsAsync(CancellationToken cancellationToken = default)
    {
        var bakuNow = DateTime.SpecifyKind(DateTime.UtcNow.AddHours(4), DateTimeKind.Utc);
        var cutoff = bakuNow.AddDays(-RetentionDays);

        _logger.LogInformation(
            "AdminLogCleanupService running check: deleting AdminLogs created on or before {Cutoff:yyyy-MM-dd HH:mm:ss} UTC+4 ({Days} days retention).",
            cutoff, RetentionDays);

        using var scope = _scopeFactory.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        int deletedCount;
        try
        {
            deletedCount = await db.AdminLogs
                .Where(l => l.CreatedAt <= cutoff)
                .ExecuteDeleteAsync(cancellationToken);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "ExecuteDeleteAsync on AdminLogs failed; falling back to RemoveRange.");
            var expiredLogs = await db.AdminLogs
                .Where(l => l.CreatedAt <= cutoff)
                .ToListAsync(cancellationToken);

            if (expiredLogs.Count == 0)
            {
                return 0;
            }

            db.AdminLogs.RemoveRange(expiredLogs);
            await db.SaveChangesAsync(cancellationToken);
            deletedCount = expiredLogs.Count;
        }

        if (deletedCount == 0)
        {
            _logger.LogInformation("AdminLogCleanupService: No AdminLogs older than {Days} days found.", RetentionDays);
            return 0;
        }

        _logger.LogInformation("AdminLogCleanupService: Successfully deleted {Count} AdminLog record(s) older than {Days} days.", deletedCount, RetentionDays);
        return deletedCount;
    }

    private static TimeSpan GetDelayUntilNextBakuOneAm()
    {
        var bakuNow = DateTime.UtcNow.AddHours(4);
        var nextOneAmBaku = bakuNow.Date.AddHours(1).AddSeconds(5);
        if (bakuNow >= nextOneAmBaku)
        {
            nextOneAmBaku = nextOneAmBaku.AddDays(1);
        }

        var delay = nextOneAmBaku - bakuNow;
        return delay > TimeSpan.Zero ? delay : TimeSpan.FromDays(1);
    }
}
