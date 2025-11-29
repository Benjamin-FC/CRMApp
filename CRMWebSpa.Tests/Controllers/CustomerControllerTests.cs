using CRMWebSpa.Server.Controllers;
using CRMWebSpa.Server.Models;
using CRMWebSpa.Server.Services;
using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace CRMWebSpa.Tests.Controllers;

public class CustomerControllerTests
{
    private readonly Mock<ICRMService> _mockCrmService;
    private readonly CustomerController _controller;

    public CustomerControllerTests()
    {
        _mockCrmService = new Mock<ICRMService>();
        _controller = new CustomerController(_mockCrmService.Object);
        
        // Setup HttpContext with default headers
        _controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext()
        };
    }

    [Fact]
    public async Task GetCustomer_WithValidTokenAndCustomerId_ReturnsOkWithCustomerInfo()
    {
        // Arrange
        var customerId = "12345";
        var token = "123";
        var expectedCustomer = new CustomerInfo
        {
            Id = customerId,
            FirstName = "John",
            LastName = "Doe",
            Email = "john@example.com"
        };

        _controller.ControllerContext.HttpContext.Request.Headers["Authorization"] = $"Bearer {token}";
        _mockCrmService.Setup(s => s.GetCustomerInfoAsync(customerId, token))
            .ReturnsAsync(expectedCustomer);

        // Act
        var result = await _controller.GetCustomer(customerId);

        // Assert
        result.Result.Should().BeOfType<OkObjectResult>();
        var okResult = result.Result as OkObjectResult;
        var customer = okResult!.Value as CustomerInfo;
        customer.Should().NotBeNull();
        customer!.Id.Should().Be(customerId);
        customer.FirstName.Should().Be("John");
        customer.LastName.Should().Be("Doe");
        customer.Email.Should().Be("john@example.com");
    }

    [Fact]
    public async Task GetCustomer_WithoutAuthorizationHeader_ReturnsUnauthorized()
    {
        // Arrange
        var customerId = "12345";

        // Act
        var result = await _controller.GetCustomer(customerId);

        // Assert
        result.Result.Should().BeOfType<UnauthorizedObjectResult>();
        var unauthorizedResult = result.Result as UnauthorizedObjectResult;
        unauthorizedResult!.Value.Should().NotBeNull();
    }

    [Fact]
    public async Task GetCustomer_WithInvalidAuthorizationHeader_ReturnsUnauthorized()
    {
        // Arrange
        var customerId = "12345";
        _controller.ControllerContext.HttpContext.Request.Headers["Authorization"] = "InvalidToken";

        // Act
        var result = await _controller.GetCustomer(customerId);

        // Assert
        result.Result.Should().BeOfType<UnauthorizedObjectResult>();
    }

    [Fact]
    public async Task GetCustomer_WithEmptyCustomerId_ReturnsBadRequest()
    {
        // Arrange
        var customerId = "";
        var token = "123";
        _controller.ControllerContext.HttpContext.Request.Headers["Authorization"] = $"Bearer {token}";

        // Act
        var result = await _controller.GetCustomer(customerId);

        // Assert
        result.Result.Should().BeOfType<BadRequestObjectResult>();
    }

    [Fact]
    public async Task GetCustomer_WithWhitespaceCustomerId_ReturnsBadRequest()
    {
        // Arrange
        var customerId = "   ";
        var token = "123";
        _controller.ControllerContext.HttpContext.Request.Headers["Authorization"] = $"Bearer {token}";

        // Act
        var result = await _controller.GetCustomer(customerId);

        // Assert
        result.Result.Should().BeOfType<BadRequestObjectResult>();
    }

    [Fact]
    public async Task GetCustomer_WhenCustomerNotFound_ReturnsNotFound()
    {
        // Arrange
        var customerId = "99999";
        var token = "123";
        _controller.ControllerContext.HttpContext.Request.Headers["Authorization"] = $"Bearer {token}";
        
        _mockCrmService.Setup(s => s.GetCustomerInfoAsync(customerId, token))
            .ReturnsAsync((CustomerInfo?)null);

        // Act
        var result = await _controller.GetCustomer(customerId);

        // Assert
        result.Result.Should().BeOfType<NotFoundObjectResult>();
    }

    [Fact]
    public async Task GetCustomer_CallsCrmServiceWithCorrectParameters()
    {
        // Arrange
        var customerId = "12345";
        var token = "123";
        var expectedCustomer = new CustomerInfo
        {
            Id = customerId,
            FirstName = "John",
            LastName = "Doe"
        };

        _controller.ControllerContext.HttpContext.Request.Headers["Authorization"] = $"Bearer {token}";
        _mockCrmService.Setup(s => s.GetCustomerInfoAsync(customerId, token))
            .ReturnsAsync(expectedCustomer);

        // Act
        await _controller.GetCustomer(customerId);

        // Assert
        _mockCrmService.Verify(s => s.GetCustomerInfoAsync(customerId, token), Times.Once);
    }

    [Fact]
    public async Task GetCustomer_ExtractsTokenCorrectlyFromHeader()
    {
        // Arrange
        var customerId = "12345";
        var expectedToken = "123";
        var expectedCustomer = new CustomerInfo { Id = customerId };

        _controller.ControllerContext.HttpContext.Request.Headers["Authorization"] = $"Bearer {expectedToken}";
        
        string? capturedToken = null;
        _mockCrmService.Setup(s => s.GetCustomerInfoAsync(It.IsAny<string>(), It.IsAny<string>()))
            .Callback<string, string>((id, token) => capturedToken = token)
            .ReturnsAsync(expectedCustomer);

        // Act
        await _controller.GetCustomer(customerId);

        // Assert
        capturedToken.Should().Be(expectedToken);
    }
}
