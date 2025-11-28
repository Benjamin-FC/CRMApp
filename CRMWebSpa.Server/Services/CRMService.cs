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

    public CRMService(HttpClient httpClient, IConfiguration configuration)
    {
        _httpClient = httpClient;
        _configuration = configuration;
    }

    public async Task<CustomerInfo?> GetCustomerInfoAsync(string customerId, string token)
    {
        try
        {
            var baseUrl = _configuration["CRMBackend:BaseUrl"] ?? "http://localhost/CRMbackend";
            var url = $"{baseUrl}/api/v1/ClientData/{customerId}";

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

                return customerInfo;
            }
            
            // Log error or handle specific status codes if needed
            return null;
        }
        catch (Exception ex)
        {
            // Log exception
            Console.WriteLine($"Error fetching customer info: {ex.Message}");
            return null;
        }
    }
}
