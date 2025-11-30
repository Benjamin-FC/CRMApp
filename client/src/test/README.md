# Frontend Testing with Vitest

This document describes the comprehensive test suite for the CRM WebSpa React frontend application.

## Test Framework

- **Vitest**: Fast unit test framework powered by Vite
- **React Testing Library**: For testing React components
- **@testing-library/user-event**: For simulating user interactions
- **@testing-library/jest-dom**: For additional DOM matchers

## Running Tests

```bash
# Run tests in watch mode (interactive)
npm test

# Run tests once
npm run test:run

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

## Test Coverage

### Component Tests

#### 1. App Component (`src/test/App.test.tsx`)
- **7 tests** covering routing and protected routes
- Tests:
  - ✅ Rendering Login component on root path
  - ✅ Redirecting to login when accessing /customer without token
  - ✅ Rendering CustomerInfo component when accessing /customer with token
  - ✅ Redirecting unknown routes to login
  - ✅ Protecting /customer route when no token exists
  - ✅ Allowing access to /customer route when token exists
  - ✅ Rendering app container

#### 2. Login Component (`src/test/Login.test.tsx`)
- **13 tests** covering rendering, form interaction, and submission
- Tests:
  - ✅ Rendering login form with all elements
  - ✅ Rendering logo
  - ✅ Username input focused on mount
  - ✅ Updating username input value
  - ✅ Updating password input value
  - ✅ Requiring username and password fields
  - ✅ Password input type
  - ✅ Successfully logging in and redirecting
  - ✅ Showing loading state during login
  - ✅ Displaying error message on login failure
  - ✅ Displaying error message on network error
  - ✅ Displaying generic error message when no specific error is provided
  - ✅ Clearing previous error messages on new submission

#### 3. CustomerInfo Component (`src/test/CustomerInfo.test.tsx`)
- **15 tests** covering rendering, search, display, and logout
- Tests:
  - ✅ Rendering navbar with brand and user info
  - ✅ Rendering page header
  - ✅ Rendering search form
  - ✅ Displaying default username when not in localStorage
  - ✅ Updating customer ID input value
  - ✅ Successfully searching and displaying customer information
  - ✅ Displaying loading state during search
  - ✅ Displaying error message when customer not found
  - ✅ Displaying generic error message on network error
  - ✅ Clearing previous customer data on error
  - ✅ Requiring customer ID field
  - ✅ Displaying all customer fields correctly
  - ✅ Displaying customer avatar with first letter of legal name
  - ✅ Clearing localStorage and navigating to login on logout
  - ✅ Clearing error message on new search

## Test Results Summary

```
✅ Test Files: 3 passed (3)
✅ Tests: 35 passed (35)
✅ Duration: ~6 seconds
```

## Test Configuration

### vitest.config.ts
- Environment: jsdom (browser-like environment)
- Globals: enabled (no need to import `describe`, `it`, `expect`)
- Setup file: `src/test/setup.ts`
- CSS: enabled
- Coverage provider: v8

### Setup File (`src/test/setup.ts`)
- Extends Vitest expect with jest-dom matchers
- Mocks localStorage (required for jsdom environment)
- Mocks window.matchMedia
- Cleans up after each test

## Mocking Strategy

### localStorage Mock
Since jsdom doesn't provide localStorage by default, we've implemented a custom mock that:
- Stores data in memory
- Provides getItem, setItem, removeItem, and clear methods
- Resets between tests

### API Service Mocking
Components that use the API service (authService, customerService) are tested with mocked implementations using Vitest's `vi.mock()`.

## Best Practices

1. **Isolation**: Each test is isolated and doesn't affect others
2. **Cleanup**: Automatic cleanup after each test (localStorage, mocks, DOM)
3. **User-centric**: Tests focus on user behavior rather than implementation details
4. **Accessibility**: Uses accessible queries (getByRole, getByLabelText) where possible
5. **Async Handling**: Proper use of waitFor for async operations

## Writing New Tests

When adding new components or features, follow this pattern:

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import YourComponent from '../components/YourComponent';

describe('YourComponent', () => {
  beforeEach(() => {
    // Setup code
  });

  it('should do something', async () => {
    const user = userEvent.setup();
    render(<YourComponent />);
    
    // Your test code
    expect(screen.getByText('Something')).toBeInTheDocument();
  });
});
```

## Troubleshooting

### Common Issues

1. **localStorage errors**: Ensure the setup file is properly configured in vitest.config.ts
2. **Router errors**: When testing components with routing, wrap them in MemoryRouter
3. **Async timeouts**: Increase waitFor timeout if needed: `waitFor(() => {...}, { timeout: 5000 })`

## Future Improvements

- [ ] Add integration tests for complete user flows
- [ ] Add visual regression tests
- [ ] Increase test coverage to 90%+
- [ ] Add performance tests
- [ ] Add accessibility (a11y) tests with jest-axe
