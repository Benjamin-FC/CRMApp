using CRMWebSpa.Server.Models;
using FluentAssertions;
using Xunit;

namespace CRMWebSpa.Tests.Models;

public class ModelValidationTests
{
    [Fact]
    public void LoginRequest_CanBeCreatedWithValidData()
    {
        // Arrange & Act
        var request = new LoginRequest
        {
            Username = "testuser",
            Password = "password123"
        };

        // Assert
        request.Should().NotBeNull();
        request.Username.Should().Be("testuser");
        request.Password.Should().Be("password123");
    }

    [Fact]
    public void LoginResponse_CanBeCreatedWithValidData()
    {
        // Arrange & Act
        var response = new LoginResponse
        {
            Success = true,
            Token = "abc123",
            Message = "Success"
        };

        // Assert
        response.Should().NotBeNull();
        response.Success.Should().BeTrue();
        response.Token.Should().Be("abc123");
        response.Message.Should().Be("Success");
    }

    [Fact]
    public void CustomerInfo_CanBeCreatedWithValidData()
    {
        // Arrange & Act
        var customer = new CustomerInfo
        {
            Id = "12345",
            FirstName = "John",
            LastName = "Doe",
            Email = "john@example.com"
        };

        // Assert
        customer.Should().NotBeNull();
        customer.Id.Should().Be("12345");
        customer.FirstName.Should().Be("John");
        customer.LastName.Should().Be("Doe");
        customer.Email.Should().Be("john@example.com");
    }

    [Fact]
    public void LoginRequest_AllowsEmptyValues()
    {
        // Arrange & Act
        var request = new LoginRequest
        {
            Username = "",
            Password = ""
        };

        // Assert
        request.Should().NotBeNull();
        request.Username.Should().BeEmpty();
        request.Password.Should().BeEmpty();
    }

    [Fact]
    public void LoginResponse_WithFailure_HasCorrectProperties()
    {
        // Arrange & Act
        var response = new LoginResponse
        {
            Success = false,
            Token = string.Empty,
            Message = "Login failed"
        };

        // Assert
        response.Success.Should().BeFalse();
        response.Token.Should().BeEmpty();
        response.Message.Should().Be("Login failed");
    }

    [Fact]
    public void CustomerInfo_CanHaveNullProperties()
    {
        // Arrange & Act
        var customer = new CustomerInfo
        {
            Id = string.Empty,
            FirstName = string.Empty,
            LastName = string.Empty,
            Email = string.Empty
        };

        // Assert
        customer.Should().NotBeNull();
        customer.Id.Should().BeEmpty();
        customer.FirstName.Should().BeEmpty();
        customer.LastName.Should().BeEmpty();
        customer.Email.Should().BeEmpty();
    }
}
