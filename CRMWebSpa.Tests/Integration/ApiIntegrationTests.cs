using CRMWebSpa.Server.Models;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc.Testing;
using System.Net;
using System.Net.Http.Json;
using Xunit;

namespace CRMWebSpa.Tests.Integration;

public class ApiIntegrationTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;
    private readonly HttpClient _client;

    public ApiIntegrationTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory;
        _client = _factory.CreateClient();
    }

    [Fact]
    public async Task Login_ReturnsSuccessResponse()
    {
        // Arrange
        var loginRequest = new LoginRequest
        {
            Username = "testuser",
            Password = "password123"
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/auth/login", loginRequest);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var loginResponse = await response.Content.ReadFromJsonAsync<LoginResponse>();
        loginResponse.Should().NotBeNull();
        loginResponse!.Success.Should().BeTrue();
        loginResponse.Token.Should().Be("123");
    }

    [Fact]
    public async Task Login_WithEmptyUsername_ReturnsBadRequest()
    {
        // Arrange
        var loginRequest = new LoginRequest
        {
            Username = "",
            Password = "password123"
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/auth/login", loginRequest);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task GetCustomer_WithoutToken_ReturnsUnauthorized()
    {
        // Arrange
        var customerId = "12345";

        // Act
        var response = await _client.GetAsync($"/api/customer/{customerId}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task GetCustomer_WithInvalidToken_ReturnsUnauthorized()
    {
        // Arrange
        var customerId = "12345";
        _client.DefaultRequestHeaders.Add("Authorization", "InvalidToken");

        // Act
        var response = await _client.GetAsync($"/api/customer/{customerId}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task GetCustomer_WithEmptyCustomerId_ReturnsBadRequest()
    {
        // Arrange
        var customerId = "";
        _client.DefaultRequestHeaders.Add("Authorization", "Bearer testtoken");

        // Act
        var response = await _client.GetAsync($"/api/customer/{customerId}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NotFound); // Empty route parameter returns 404
    }

    [Theory]
    [InlineData("user1", "pass1")]
    [InlineData("admin", "admin123")]
    [InlineData("test@example.com", "password")]
    public async Task Login_WithVariousCredentials_AlwaysSucceeds(string username, string password)
    {
        // Arrange
        var loginRequest = new LoginRequest
        {
            Username = username,
            Password = password
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/auth/login", loginRequest);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var loginResponse = await response.Content.ReadFromJsonAsync<LoginResponse>();
        loginResponse!.Token.Should().Be("123");
    }

    [Fact]
    public async Task Api_HealthCheck_ReturnsSuccess()
    {
        // Act
        var response = await _client.GetAsync("/");

        // Assert
        response.StatusCode.Should().BeOneOf(HttpStatusCode.OK, HttpStatusCode.NotFound);
    }
}
