using CRMWebSpa.Server.Models;
using CRMWebSpa.Server.Services;
using FluentAssertions;
using Microsoft.Extensions.Configuration;
using Moq;
using Xunit;

namespace CRMWebSpa.Tests.Services;

public class AuthServiceTests
{
    private readonly Mock<HttpMessageHandler> _mockHttpMessageHandler;
    private readonly HttpClient _httpClient;
    private readonly Mock<IConfiguration> _mockConfiguration;
    private readonly AuthService _authService;

    public AuthServiceTests()
    {
        _mockHttpMessageHandler = new Mock<HttpMessageHandler>();
        _httpClient = new HttpClient(_mockHttpMessageHandler.Object);
        _mockConfiguration = new Mock<IConfiguration>();
        
        _authService = new AuthService(_httpClient, _mockConfiguration.Object);
    }

    [Fact]
    public async Task LoginAsync_ReturnsSuccessfulResponseWithToken123()
    {
        // Arrange
        var request = new LoginRequest
        {
            Username = "testuser",
            Password = "password123"
        };

        // Act
        var result = await _authService.LoginAsync(request);

        // Assert
        result.Should().NotBeNull();
        result.Success.Should().BeTrue();
        result.Token.Should().Be("123");
        result.Message.Should().Be("Login successful");
    }

    [Fact]
    public async Task LoginAsync_WithAnyCredentials_AlwaysReturnsToken123()
    {
        // Arrange
        var request1 = new LoginRequest { Username = "user1", Password = "pass1" };
        var request2 = new LoginRequest { Username = "user2", Password = "pass2" };
        var request3 = new LoginRequest { Username = "admin", Password = "admin123" };

        // Act
        var result1 = await _authService.LoginAsync(request1);
        var result2 = await _authService.LoginAsync(request2);
        var result3 = await _authService.LoginAsync(request3);

        // Assert
        result1.Token.Should().Be("123");
        result2.Token.Should().Be("123");
        result3.Token.Should().Be("123");
        result1.Success.Should().BeTrue();
        result2.Success.Should().BeTrue();
        result3.Success.Should().BeTrue();
    }

    [Fact]
    public async Task LoginAsync_WithEmptyCredentials_StillReturnsToken123()
    {
        // Arrange
        var request = new LoginRequest
        {
            Username = "",
            Password = ""
        };

        // Act
        var result = await _authService.LoginAsync(request);

        // Assert
        result.Token.Should().Be("123");
        result.Success.Should().BeTrue();
    }

    [Fact]
    public async Task LoginAsync_ReturnsCompletedTask()
    {
        // Arrange
        var request = new LoginRequest { Username = "test", Password = "test" };

        // Act
        var task = _authService.LoginAsync(request);
        
        // Assert
        task.Should().NotBeNull();
        task.IsCompleted.Should().BeTrue();
        var result = await task;
        result.Should().NotBeNull();
    }

    [Theory]
    [InlineData("user1", "pass1")]
    [InlineData("admin", "admin")]
    [InlineData("test@example.com", "password123")]
    [InlineData("john.doe", "securepass")]
    public async Task LoginAsync_WithVariousCredentials_AlwaysSucceeds(string username, string password)
    {
        // Arrange
        var request = new LoginRequest
        {
            Username = username,
            Password = password
        };

        // Act
        var result = await _authService.LoginAsync(request);

        // Assert
        result.Success.Should().BeTrue();
        result.Token.Should().Be("123");
        result.Message.Should().Be("Login successful");
    }
}
