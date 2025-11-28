using CRMWebSpa.Server.Models;

namespace CRMWebSpa.Server.Services;

public interface IAuthService
{
    Task<LoginResponse> LoginAsync(LoginRequest request);
}

public class AuthService : IAuthService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;

    public AuthService(HttpClient httpClient, IConfiguration configuration)
    {
        _httpClient = httpClient;
        _configuration = configuration;
    }

    public async Task<LoginResponse> LoginAsync(LoginRequest request)
    {
        // Return hardcoded token "123" as requested
        return await Task.FromResult(new LoginResponse
        {
            Success = true,
            Token = "123",
            Message = "Login successful"
        });
    }
}
