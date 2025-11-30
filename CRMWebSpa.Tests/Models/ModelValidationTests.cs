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
            ClientId = "12345",
            Dba = "Test Company",
            ClientLegalName = "Test Company LLC",
            ComplianceHold = "N",
            Level = "Gold",
            PaymentTermID = "NET30",
            PaymentMethod = "ACH",
            Status = "Active"
        };

        // Assert
        customer.Should().NotBeNull();
        customer.ClientId.Should().Be("12345");
        customer.Dba.Should().Be("Test Company");
        customer.ClientLegalName.Should().Be("Test Company LLC");
        customer.ComplianceHold.Should().Be("N");
        customer.Level.Should().Be("Gold");
        customer.PaymentTermID.Should().Be("NET30");
        customer.PaymentMethod.Should().Be("ACH");
        customer.Status.Should().Be("Active");
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
    public void CustomerInfo_CanHaveEmptyProperties()
    {
        // Arrange & Act
        var customer = new CustomerInfo
        {
            ClientId = string.Empty,
            Dba = string.Empty,
            ClientLegalName = string.Empty,
            ComplianceHold = string.Empty,
            Level = string.Empty,
            PaymentTermID = string.Empty,
            PaymentMethod = string.Empty,
            Status = string.Empty
        };

        // Assert
        customer.Should().NotBeNull();
        customer.ClientId.Should().BeEmpty();
        customer.Dba.Should().BeEmpty();
        customer.ClientLegalName.Should().BeEmpty();
        customer.ComplianceHold.Should().BeEmpty();
        customer.Level.Should().BeEmpty();
        customer.PaymentTermID.Should().BeEmpty();
        customer.PaymentMethod.Should().BeEmpty();
        customer.Status.Should().BeEmpty();
    }
}
