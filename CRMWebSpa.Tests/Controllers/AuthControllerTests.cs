using CRMWebSpa.Server.Controllers;
using CRMWebSpa.Server.Models;
using CRMWebSpa.Server.Services;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace CRMWebSpa.Tests.Controllers;

public class AuthControllerTests
{
    private readonly Mock<IAuthService> _mockAuthService;
    private readonly AuthController _controller;

    public AuthControllerTests()
    {
        _mockAuthService = new Mock<IAuthService>();
        _controller = new AuthController(_mockAuthService.Object);
    }

    [Fact]
    public async Task Login_WithValidCredentials_ReturnsOkWithToken()
    {
        // Arrange
        var request = new LoginRequest
        {
            Username = "testuser",
            Password = "password123"
        };

        var expectedResponse = new LoginResponse
        {
            Success = true,
            Token = "123",
            Message = "Login successful"
        };

        _mockAuthService.Setup(s => s.LoginAsync(It.IsAny<LoginRequest>()))
            .ReturnsAsync(expectedResponse);

        // Act
        var result = await _controller.Login(request);

        // Assert
        result.Result.Should().BeOfType<OkObjectResult>();
        var okResult = result.Result as OkObjectResult;
        var response = okResult!.Value as LoginResponse;
        response.Should().NotBeNull();
        response!.Success.Should().BeTrue();
        response.Token.Should().Be("123");
        response.Message.Should().Be("Login successful");
    }

    [Fact]
    public async Task Login_WithEmptyUsername_ReturnsBadRequest()
    {
        // Arrange
        var request = new LoginRequest
        {
            Username = "",
            Password = "password123"
        };

        // Act
        var result = await _controller.Login(request);

        // Assert
        result.Result.Should().BeOfType<BadRequestObjectResult>();
        var badRequestResult = result.Result as BadRequestObjectResult;
        var response = badRequestResult!.Value as LoginResponse;
        response.Should().NotBeNull();
        response!.Success.Should().BeFalse();
        response.Message.Should().Be("Username and password are required");
    }

    [Fact]
    public async Task Login_WithEmptyPassword_ReturnsBadRequest()
    {
        // Arrange
        var request = new LoginRequest
        {
            Username = "testuser",
            Password = ""
        };

        // Act
        var result = await _controller.Login(request);

        // Assert
        result.Result.Should().BeOfType<BadRequestObjectResult>();
        var badRequestResult = result.Result as BadRequestObjectResult;
        var response = badRequestResult!.Value as LoginResponse;
        response.Should().NotBeNull();
        response!.Success.Should().BeFalse();
        response.Message.Should().Be("Username and password are required");
    }

    [Fact]
    public async Task Login_WithNullUsername_ReturnsBadRequest()
    {
        // Arrange
        var request = new LoginRequest
        {
            Username = null!,
            Password = "password123"
        };

        // Act
        var result = await _controller.Login(request);

        // Assert
        result.Result.Should().BeOfType<BadRequestObjectResult>();
    }

    [Fact]
    public async Task Login_WithWhitespaceUsername_ReturnsBadRequest()
    {
        // Arrange
        var request = new LoginRequest
        {
            Username = "   ",
            Password = "password123"
        };

        // Act
        var result = await _controller.Login(request);

        // Assert
        result.Result.Should().BeOfType<BadRequestObjectResult>();
    }

    [Fact]
    public async Task Login_CallsAuthServiceWithCorrectParameters()
    {
        // Arrange
        var request = new LoginRequest
        {
            Username = "testuser",
            Password = "password123"
        };

        var expectedResponse = new LoginResponse
        {
            Success = true,
            Token = "123",
            Message = "Login successful"
        };

        _mockAuthService.Setup(s => s.LoginAsync(It.IsAny<LoginRequest>()))
            .ReturnsAsync(expectedResponse);

        // Act
        await _controller.Login(request);

        // Assert
        _mockAuthService.Verify(s => s.LoginAsync(It.Is<LoginRequest>(r => 
            r.Username == "testuser" && r.Password == "password123")), Times.Once);
    }
}
