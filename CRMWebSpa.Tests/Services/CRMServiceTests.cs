using CRMWebSpa.Server.Models;
using CRMWebSpa.Server.Services;
using FluentAssertions;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Moq;
using Moq.Protected;
using System.Net;
using System.Text.Json;
using Xunit;

namespace CRMWebSpa.Tests.Services;

public class CRMServiceTests
{
    private readonly Mock<HttpMessageHandler> _mockHttpMessageHandler;
    private readonly HttpClient _httpClient;
    private readonly Mock<IConfiguration> _mockConfiguration;
    private readonly Mock<ILogger<CRMService>> _mockLogger;
    private readonly CRMService _crmService;

    public CRMServiceTests()
    {
        _mockHttpMessageHandler = new Mock<HttpMessageHandler>();
        _httpClient = new HttpClient(_mockHttpMessageHandler.Object);
        _mockConfiguration = new Mock<IConfiguration>();
        _mockLogger = new Mock<ILogger<CRMService>>();

        _mockConfiguration.Setup(c => c["CRMBackend:BaseUrl"])
            .Returns("http://localhost/CRMbackend");

        _crmService = new CRMService(_httpClient, _mockConfiguration.Object, _mockLogger.Object);
    }

    [Fact]
    public async Task GetCustomerInfoAsync_WithValidResponse_ReturnsCustomerInfo()
    {
        // Arrange
        var customerId = "12345";
        var token = "validtoken";
        var expectedCustomer = new CustomerInfo
        {
            ClientId = customerId,
            Dba = "Test Company",
            ClientLegalName = "Test Company LLC",
            Status = "Active"
        };

        var jsonResponse = JsonSerializer.Serialize(expectedCustomer);
        var httpResponse = new HttpResponseMessage
        {
            StatusCode = HttpStatusCode.OK,
            Content = new StringContent(jsonResponse)
        };

        _mockHttpMessageHandler.Protected()
            .Setup<Task<HttpResponseMessage>>(
                "SendAsync",
                ItExpr.IsAny<HttpRequestMessage>(),
                ItExpr.IsAny<CancellationToken>())
            .ReturnsAsync(httpResponse);

        // Act
        var (customer, error) = await _crmService.GetCustomerInfoAsync(customerId, token);

        // Assert
        customer.Should().NotBeNull();
        customer!.ClientId.Should().Be(customerId);
        customer.Dba.Should().Be("Test Company");
        customer.ClientLegalName.Should().Be("Test Company LLC");
        customer.Status.Should().Be("Active");
        error.Should().BeNull();
    }

    [Fact]
    public async Task GetCustomerInfoAsync_WithNotFoundResponse_ReturnsNull()
    {
        // Arrange
        var customerId = "99999";
        var token = "validtoken";

        var httpResponse = new HttpResponseMessage
        {
            StatusCode = HttpStatusCode.NotFound
        };

        _mockHttpMessageHandler.Protected()
            .Setup<Task<HttpResponseMessage>>(
                "SendAsync",
                ItExpr.IsAny<HttpRequestMessage>(),
                ItExpr.IsAny<CancellationToken>())
            .ReturnsAsync(httpResponse);

        // Act
        var (customer, error) = await _crmService.GetCustomerInfoAsync(customerId, token);

        // Assert
        customer.Should().BeNull();
        error.Should().NotBeNull();
    }

    [Fact]
    public async Task GetCustomerInfoAsync_WithUnauthorizedResponse_ReturnsNull()
    {
        // Arrange
        var customerId = "12345";
        var token = "invalidtoken";

        var httpResponse = new HttpResponseMessage
        {
            StatusCode = HttpStatusCode.Unauthorized
        };

        _mockHttpMessageHandler.Protected()
            .Setup<Task<HttpResponseMessage>>(
                "SendAsync",
                ItExpr.IsAny<HttpRequestMessage>(),
                ItExpr.IsAny<CancellationToken>())
            .ReturnsAsync(httpResponse);

        // Act
        var (customer, error) = await _crmService.GetCustomerInfoAsync(customerId, token);

        // Assert
        customer.Should().BeNull();
        error.Should().NotBeNull();
    }

    [Fact]
    public async Task GetCustomerInfoAsync_WithException_ReturnsNull()
    {
        // Arrange
        var customerId = "12345";
        var token = "validtoken";

        _mockHttpMessageHandler.Protected()
            .Setup<Task<HttpResponseMessage>>(
                "SendAsync",
                ItExpr.IsAny<HttpRequestMessage>(),
                ItExpr.IsAny<CancellationToken>())
            .ThrowsAsync(new HttpRequestException("Network error"));

        // Act
        var (customer, error) = await _crmService.GetCustomerInfoAsync(customerId, token);

        // Assert
        customer.Should().BeNull();
        error.Should().NotBeNull();
    }

    [Fact]
    public async Task GetCustomerInfoAsync_SendsCorrectAuthorizationHeader()
    {
        // Arrange
        var customerId = "12345";
        var token = "mytoken123";
        HttpRequestMessage? capturedRequest = null;

        _mockHttpMessageHandler.Protected()
            .Setup<Task<HttpResponseMessage>>(
                "SendAsync",
                ItExpr.IsAny<HttpRequestMessage>(),
                ItExpr.IsAny<CancellationToken>())
            .Callback<HttpRequestMessage, CancellationToken>((req, ct) => capturedRequest = req)
            .ReturnsAsync(new HttpResponseMessage
            {
                StatusCode = HttpStatusCode.OK,
                Content = new StringContent("{\"customerId\":\"12345\"}")
            });

        // Act
        await _crmService.GetCustomerInfoAsync(customerId, token);

        // Assert
        capturedRequest.Should().NotBeNull();
        capturedRequest!.Headers.Authorization.Should().NotBeNull();
        capturedRequest.Headers.Authorization!.Scheme.Should().Be("Bearer");
        capturedRequest.Headers.Authorization.Parameter.Should().Be(token);
    }

    [Fact]
    public async Task GetCustomerInfoAsync_CallsCorrectUrl()
    {
        // Arrange
        var customerId = "12345";
        var token = "validtoken";
        HttpRequestMessage? capturedRequest = null;

        _mockHttpMessageHandler.Protected()
            .Setup<Task<HttpResponseMessage>>(
                "SendAsync",
                ItExpr.IsAny<HttpRequestMessage>(),
                ItExpr.IsAny<CancellationToken>())
            .Callback<HttpRequestMessage, CancellationToken>((req, ct) => capturedRequest = req)
            .ReturnsAsync(new HttpResponseMessage
            {
                StatusCode = HttpStatusCode.OK,
                Content = new StringContent("{\"customerId\":\"12345\"}")
            });

        // Act
        await _crmService.GetCustomerInfoAsync(customerId, token);

        // Assert
        capturedRequest.Should().NotBeNull();
        capturedRequest!.RequestUri.Should().NotBeNull();
        capturedRequest.RequestUri!.ToString().Should().Be("http://localhost/CRMbackend/api/Customer/info/12345");
    }

    [Fact]
    public async Task GetCustomerInfoAsync_UsesGetMethod()
    {
        // Arrange
        var customerId = "12345";
        var token = "validtoken";
        HttpRequestMessage? capturedRequest = null;

        _mockHttpMessageHandler.Protected()
            .Setup<Task<HttpResponseMessage>>(
                "SendAsync",
                ItExpr.IsAny<HttpRequestMessage>(),
                ItExpr.IsAny<CancellationToken>())
            .Callback<HttpRequestMessage, CancellationToken>((req, ct) => capturedRequest = req)
            .ReturnsAsync(new HttpResponseMessage
            {
                StatusCode = HttpStatusCode.OK,
                Content = new StringContent("{\"customerId\":\"12345\"}")
            });

        // Act
        await _crmService.GetCustomerInfoAsync(customerId, token);

        // Assert
        capturedRequest.Should().NotBeNull();
        capturedRequest!.Method.Should().Be(HttpMethod.Get);
    }

    [Fact]
    public async Task GetCustomerInfoAsync_LogsInformationOnSuccess()
    {
        // Arrange
        var customerId = "12345";
        var token = "validtoken";
        var expectedCustomer = new CustomerInfo { ClientId = customerId };

        _mockHttpMessageHandler.Protected()
            .Setup<Task<HttpResponseMessage>>(
                "SendAsync",
                ItExpr.IsAny<HttpRequestMessage>(),
                ItExpr.IsAny<CancellationToken>())
            .ReturnsAsync(new HttpResponseMessage
            {
                StatusCode = HttpStatusCode.OK,
                Content = new StringContent(JsonSerializer.Serialize(expectedCustomer))
            });

        // Act
        await _crmService.GetCustomerInfoAsync(customerId, token);

        // Assert
        _mockLogger.Verify(
            x => x.Log(
                LogLevel.Information,
                It.IsAny<EventId>(),
                It.Is<It.IsAnyType>((v, t) => v.ToString()!.Contains("Fetching customer info")),
                It.IsAny<Exception>(),
                It.IsAny<Func<It.IsAnyType, Exception?, string>>()),
            Times.Once);
    }

    [Fact]
    public async Task GetCustomerInfoAsync_LogsErrorOnException()
    {
        // Arrange
        var customerId = "12345";
        var token = "validtoken";

        _mockHttpMessageHandler.Protected()
            .Setup<Task<HttpResponseMessage>>(
                "SendAsync",
                ItExpr.IsAny<HttpRequestMessage>(),
                ItExpr.IsAny<CancellationToken>())
            .ThrowsAsync(new HttpRequestException("Network error"));

        // Act
        await _crmService.GetCustomerInfoAsync(customerId, token);

        // Assert
        _mockLogger.Verify(
            x => x.Log(
                LogLevel.Error,
                It.IsAny<EventId>(),
                It.Is<It.IsAnyType>((v, t) => v.ToString()!.Contains("HTTP error")),
                It.IsAny<Exception>(),
                It.IsAny<Func<It.IsAnyType, Exception?, string>>()),
            Times.Once);
    }

    [Theory]
    [InlineData("user1", "token1")]
    [InlineData("user2", "token2")]
    [InlineData("12345", "abc123")]
    public async Task GetCustomerInfoAsync_WorksWithDifferentCustomerIds(string customerId, string token)
    {
        // Arrange
        var expectedCustomer = new CustomerInfo { ClientId = customerId };

        _mockHttpMessageHandler.Protected()
            .Setup<Task<HttpResponseMessage>>(
                "SendAsync",
                ItExpr.IsAny<HttpRequestMessage>(),
                ItExpr.IsAny<CancellationToken>())
            .ReturnsAsync(new HttpResponseMessage
            {
                StatusCode = HttpStatusCode.OK,
                Content = new StringContent(JsonSerializer.Serialize(expectedCustomer))
            });

        // Act
        var (customer, error) = await _crmService.GetCustomerInfoAsync(customerId, token);

        // Assert
        customer.Should().NotBeNull();
        customer!.ClientId.Should().Be(customerId);
    }
}
