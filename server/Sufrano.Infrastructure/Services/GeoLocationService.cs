namespace Sufrano.Infrastructure.Services;

public interface IGeoLocationService
{
    Task<string> GetCountryAsync(string? ipAddress);
}

public class GeoLocationService : IGeoLocationService
{
    private const int MaxCacheEntries = 5000;

    private readonly IHttpClientFactory _httpClientFactory;
    private static readonly ConcurrentDictionary<string, string> _cache = new();

    public GeoLocationService(IHttpClientFactory httpClientFactory)
    {
        _httpClientFactory = httpClientFactory;
    }

    private static bool IsPrivateOrLoopback(System.Net.IPAddress ip)
    {
        if (System.Net.IPAddress.IsLoopback(ip)) return true;

        if (ip.IsIPv4MappedToIPv6) ip = ip.MapToIPv4();

        if (ip.AddressFamily == System.Net.Sockets.AddressFamily.InterNetwork)
        {
            var b = ip.GetAddressBytes();
            return b[0] == 10
                || (b[0] == 172 && b[1] >= 16 && b[1] <= 31)
                || (b[0] == 192 && b[1] == 168)
                || (b[0] == 169 && b[1] == 254)
                || b[0] == 0;
        }

        return ip.IsIPv6LinkLocal || ip.IsIPv6SiteLocal || ip.IsIPv6UniqueLocal;
    }

    public async Task<string> GetCountryAsync(string? ipAddress)
    {
        if (string.IsNullOrWhiteSpace(ipAddress))
            return "Unknown";

        // Strictly validate: only a real IP address may ever reach the outgoing URL.
        if (!System.Net.IPAddress.TryParse(ipAddress.Split(',')[0].Trim(), out var parsedIp))
            return "Unknown";

        if (IsPrivateOrLoopback(parsedIp))
            return "Local Network";

        var cleanIp = parsedIp.ToString();

        if (_cache.TryGetValue(cleanIp, out var cachedCountry))
            return cachedCountry;

        try
        {
            var client = _httpClientFactory.CreateClient();
            client.Timeout = TimeSpan.FromSeconds(3);
            var response = await client.GetAsync($"http://ip-api.com/json/{Uri.EscapeDataString(cleanIp)}?fields=status,country,city");
            if (response.IsSuccessStatusCode)
            {
                var content = await response.Content.ReadAsStringAsync();
                using var doc = JsonDocument.Parse(content);
                if (doc.RootElement.TryGetProperty("status", out var status) && status.GetString() == "success")
                {
                    var country = doc.RootElement.TryGetProperty("country", out var countryProp) ? countryProp.GetString() : null;
                    var city = doc.RootElement.TryGetProperty("city", out var cityProp) ? cityProp.GetString() : null;

                    string location;
                    if (!string.IsNullOrWhiteSpace(country) && !string.IsNullOrWhiteSpace(city))
                    {
                        location = $"{country}, {city}";
                    }
                    else if (!string.IsNullOrWhiteSpace(country))
                    {
                        location = country;
                    }
                    else if (!string.IsNullOrWhiteSpace(city))
                    {
                        location = city;
                    }
                    else
                    {
                        location = "Unknown";
                    }

                    if (location != "Unknown")
                    {
                        if (_cache.Count >= MaxCacheEntries)
                            _cache.Clear();

                        _cache[cleanIp] = location;
                        return location;
                    }
                }
            }
        }
        catch { }

        return "Unknown";
    }
}
