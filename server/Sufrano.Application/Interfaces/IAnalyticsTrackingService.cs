namespace Sufrano.Application.Interfaces;

public interface IAnalyticsTrackingService
{
    Task TrackAnalyticsAsync(CancellationToken stoppingToken = default);
}
