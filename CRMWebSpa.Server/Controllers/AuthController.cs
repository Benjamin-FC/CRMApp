using CRMWebSpa.Server.Models;
using CRMWebSpa.Server.Services;
using Microsoft.AspNetCore.Mvc;

namespace CRMWebSpa.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("login")]
    public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Password))
        {
            return BadRequest(new LoginResponse
            {
                Success = false,
                Message = "Username and password are required"
            });
        }

        var response = await _authService.LoginAsync(request);
        return Ok(response);
    }
}
