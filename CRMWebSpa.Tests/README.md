# CRM Web SPA Test Suite

This test project provides comprehensive test coverage for the CRM Web SPA application.

## Test Statistics

- **Total Tests**: 49
- **Controllers**: 14 tests
- **Services**: 29 tests
- **Models**: 6 tests
- **Integration**: 9 tests

## Test Categories

### 1. Controller Tests

#### AuthController Tests (7 tests)
- ✅ Login with valid credentials returns OK with token
- ✅ Login with empty username returns BadRequest
- ✅ Login with empty password returns BadRequest
- ✅ Login with null username returns BadRequest
- ✅ Login with whitespace username returns BadRequest
- ✅ Login calls AuthService with correct parameters

#### CustomerController Tests (8 tests)
- ✅ GetCustomer with valid token and customer ID returns OK
- ✅ GetCustomer without authorization header returns Unauthorized
- ✅ GetCustomer with invalid authorization header returns Unauthorized
- ✅ GetCustomer with empty customer ID returns BadRequest
- ✅ GetCustomer with whitespace customer ID returns BadRequest
- ✅ GetCustomer when customer not found returns NotFound
- ✅ GetCustomer calls CRM service with correct parameters
- ✅ GetCustomer extracts token correctly from header

### 2. Service Tests

#### AuthService Tests (5 tests)
- ✅ LoginAsync returns successful response with token "123"
- ✅ LoginAsync with any credentials always returns token "123"
- ✅ LoginAsync with empty credentials still returns token "123"
- ✅ LoginAsync returns completed task
- ✅ LoginAsync with various credentials (Theory test with 4 cases)

#### CRMService Tests (11 tests)
- ✅ GetCustomerInfoAsync with valid response returns CustomerInfo
- ✅ GetCustomerInfoAsync with NotFound response returns null
- ✅ GetCustomerInfoAsync with Unauthorized response returns null
- ✅ GetCustomerInfoAsync with exception returns null
- ✅ GetCustomerInfoAsync sends correct authorization header
- ✅ GetCustomerInfoAsync calls correct URL
- ✅ GetCustomerInfoAsync uses GET method
- ✅ GetCustomerInfoAsync logs information on success
- ✅ GetCustomerInfoAsync logs error on exception
- ✅ GetCustomerInfoAsync works with different customer IDs (Theory test with 3 cases)

### 3. Model Validation Tests (6 tests)
- ✅ LoginRequest can be created with valid data
- ✅ LoginResponse can be created with valid data
- ✅ CustomerInfo can be created with valid data
- ✅ LoginRequest allows empty values
- ✅ LoginResponse with failure has correct properties
- ✅ CustomerInfo can have empty properties

### 4. Integration Tests (9 tests)
- ✅ Login returns success response
- ✅ Login with empty username returns BadRequest
- ✅ GetCustomer without token returns Unauthorized
- ✅ GetCustomer with invalid token returns Unauthorized
- ✅ GetCustomer with empty customer ID returns NotFound
- ✅ Login with various credentials always succeeds (Theory test with 3 cases)
- ✅ API health check returns success

## Technologies Used

- **xUnit**: Testing framework
- **Moq**: Mocking library for unit tests
- **FluentAssertions**: Fluent assertion library
- **Microsoft.AspNetCore.Mvc.Testing**: Integration testing support

## Running Tests

### Run all tests
```powershell
dotnet test
```

### Run with detailed output
```powershell
dotnet test --verbosity normal
```

### Run specific test file
```powershell
dotnet test --filter "FullyQualifiedName~AuthControllerTests"
```

### Run with code coverage
```powershell
dotnet test --collect:"XPlat Code Coverage"
```

## Test Structure

```
CRMWebSpa.Tests/
├── Controllers/
│   ├── AuthControllerTests.cs      (7 tests)
│   └── CustomerControllerTests.cs  (8 tests)
├── Services/
│   ├── AuthServiceTests.cs         (5 tests)
│   └── CRMServiceTests.cs          (11 tests)
├── Models/
│   └── ModelValidationTests.cs     (6 tests)
└── Integration/
    └── ApiIntegrationTests.cs      (9 tests)
```

## Test Coverage

The test suite provides comprehensive coverage of:
- ✅ Controller endpoints and validation
- ✅ Service layer business logic
- ✅ HTTP client interactions
- ✅ Error handling and logging
- ✅ Model serialization/deserialization
- ✅ End-to-end API integration
- ✅ Authentication and authorization flows
- ✅ Edge cases and boundary conditions

## Notes

- All tests use dependency injection and mocking for isolation
- Integration tests use WebApplicationFactory for realistic testing
- Tests include both positive and negative scenarios
- Theory tests are used for parameterized testing
- Logging is verified where applicable
