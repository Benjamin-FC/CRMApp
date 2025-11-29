using CRMWebSpa.Server.Models;
using CRMWebSpa.Server.Services;
using Microsoft.AspNetCore.Mvc;

namespace CRMWebSpa.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CustomerController : ControllerBase
{
    private readonly ICRMService _crmService;

    public CustomerController(ICRMService crmService)
    {
        _crmService = crmService;
    }

    [HttpGet("{customerId}")]
    public async Task<ActionResult<CustomerInfo>> GetCustomer(string customerId)
    {
        // Get token from Authorization header
        var authHeader = Request.Headers["Authorization"].ToString();
        if (string.IsNullOrWhiteSpace(authHeader) || !authHeader.StartsWith("Bearer "))
        {
            return Unauthorized(new { message = "Authorization token is required" });
        }

        var token = authHeader.Substring("Bearer ".Length).Trim();
        
        // Validate token
        if (token != "123")
        {
            return Unauthorized(new { message = "Invalid token" });
        }

        if (string.IsNullOrWhiteSpace(customerId))
        {
            return BadRequest(new { message = "Customer ID is required" });
        }

        var customerInfo = await _crmService.GetCustomerInfoAsync(customerId, token);

        if (customerInfo == null)
        {
            return NotFound(new { message = "Customer not found" });
        }

        return Ok(customerInfo);
    }
}
