namespace CRMWebSpa.Server.Models;

public class LoginResponse
{
    public string Token { get; set; } = string.Empty;
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
}
