using CRMWebSpa.Server.Models;
using System.Net.Http.Headers;
using System.Text.Json;

namespace CRMWebSpa.Server.Services;

public interface ICRMService
{
    Task<CustomerInfo?> GetCustomerInfoAsync(string customerId, string token);
}

public class CRMService : ICRMService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;
    private readonly ILogger<CRMService> _logger;

    public CRMService(HttpClient httpClient, IConfiguration configuration, ILogger<CRMService> logger)
    {
        _httpClient = httpClient;
        _configuration = configuration;
        _logger = logger;
    }

    public async Task<CustomerInfo?> GetCustomerInfoAsync(string customerId, string token)
    {
        try
        {
            _logger.LogInformation("Fetching customer info for customerId: {CustomerId}", customerId);
            
            var baseUrl = _configuration["CRMBackend:BaseUrl"] ?? "http://localhost/CRMbackend";
            var url = $"{baseUrl}/api/ClientData/{customerId}";

            _logger.LogDebug("Making request to CRM backend: {Url}", url);

            var request = new HttpRequestMessage(HttpMethod.Get, url);
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var response = await _httpClient.SendAsync(request);

            if (response.IsSuccessStatusCode)
            {
                var content = await response.Content.ReadAsStringAsync();
                var customerInfo = JsonSerializer.Deserialize<CustomerInfo>(content, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                _logger.LogInformation("Successfully retrieved customer info for customerId: {CustomerId}", customerId);
                return customerInfo;
            }
            
            _logger.LogWarning("Failed to retrieve customer info for customerId: {CustomerId}. Status code: {StatusCode}", 
                customerId, response.StatusCode);
            return null;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching customer info for customerId: {CustomerId}", customerId);
            return null;
        }
    }
}
