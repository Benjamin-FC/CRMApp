import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Login from '../components/Login';
import * as api from '../services/api';

// Mock the API service
vi.mock('../services/api', () => ({
    authService: {
        login: vi.fn(),
    },
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

describe('Login Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    const renderLogin = () => {
        return render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        );
    };

    describe('Rendering', () => {
        it('should render login form with all elements', () => {
            renderLogin();

            expect(screen.getByText('Welcome Back')).toBeInTheDocument();
            expect(screen.getByText('Sign in to access CRM Customer Portal')).toBeInTheDocument();
            expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
        });

        it('should render logo', () => {
            renderLogin();
            expect(screen.getByText('C')).toBeInTheDocument();
        });

        it('should have username input focused on mount', () => {
            renderLogin();
            const usernameInput = screen.getByLabelText(/username/i);
            expect(usernameInput).toHaveFocus();
        });
    });

    describe('Form Interaction', () => {
        it('should update username input value', async () => {
            const user = userEvent.setup();
            renderLogin();

            const usernameInput = screen.getByLabelText(/username/i) as HTMLInputElement;
            await user.type(usernameInput, 'testuser');

            expect(usernameInput.value).toBe('testuser');
        });

        it('should update password input value', async () => {
            const user = userEvent.setup();
            renderLogin();

            const passwordInput = screen.getByLabelText(/password/i) as HTMLInputElement;
            await user.type(passwordInput, 'password123');

            expect(passwordInput.value).toBe('password123');
        });

        it('should require username and password fields', () => {
            renderLogin();

            const usernameInput = screen.getByLabelText(/username/i);
            const passwordInput = screen.getByLabelText(/password/i);

            expect(usernameInput).toBeRequired();
            expect(passwordInput).toBeRequired();
        });

        it('should have password input type', () => {
            renderLogin();
            const passwordInput = screen.getByLabelText(/password/i);
            expect(passwordInput).toHaveAttribute('type', 'password');
        });
    });

    describe('Form Submission - Success', () => {
        it('should successfully login and redirect', async () => {
            const user = userEvent.setup();
            const mockLoginResponse = {
                success: true,
                token: 'mock-token-123',
                message: 'Login successful',
            };

            vi.mocked(api.authService.login).mockResolvedValue(mockLoginResponse);

            renderLogin();

            const usernameInput = screen.getByLabelText(/username/i);
            const passwordInput = screen.getByLabelText(/password/i);
            const submitButton = screen.getByRole('button', { name: /sign in/i });

            await user.type(usernameInput, 'testuser');
            await user.type(passwordInput, 'password123');
            await user.click(submitButton);

            await waitFor(() => {
                expect(api.authService.login).toHaveBeenCalledWith({
                    username: 'testuser',
                    password: 'password123',
                });
            });

            await waitFor(() => {
                expect(localStorage.getItem('authToken')).toBe('mock-token-123');
                expect(localStorage.getItem('username')).toBe('testuser');
            });

            await waitFor(() => {
                expect(screen.getByText(/login successful/i)).toBeInTheDocument();
            });

            // Wait for navigation (after 1 second timeout)
            await waitFor(
                () => {
                    expect(mockNavigate).toHaveBeenCalledWith('/customer');
                },
                { timeout: 1500 }
            );
        });

        it('should show loading state during login', async () => {
            const user = userEvent.setup();

            // Create a promise that we can control
            let resolveLogin: (value: any) => void;
            const loginPromise = new Promise((resolve) => {
                resolveLogin = resolve;
            });

            vi.mocked(api.authService.login).mockReturnValue(loginPromise as any);

            renderLogin();

            const usernameInput = screen.getByLabelText(/username/i);
            const passwordInput = screen.getByLabelText(/password/i);
            const submitButton = screen.getByRole('button', { name: /sign in/i });

            await user.type(usernameInput, 'testuser');
            await user.type(passwordInput, 'password123');
            await user.click(submitButton);

            // Check loading state
            await waitFor(() => {
                expect(screen.getByText(/signing in/i)).toBeInTheDocument();
                expect(submitButton).toBeDisabled();
            });

            // Resolve the promise
            resolveLogin!({
                success: true,
                token: 'mock-token',
                message: 'Success',
            });
        });
    });

    describe('Form Submission - Failure', () => {
        it('should display error message on login failure', async () => {
            const user = userEvent.setup();
            const mockLoginResponse = {
                success: false,
                token: '',
                message: 'Invalid credentials',
            };

            vi.mocked(api.authService.login).mockResolvedValue(mockLoginResponse);

            renderLogin();

            const usernameInput = screen.getByLabelText(/username/i);
            const passwordInput = screen.getByLabelText(/password/i);
            const submitButton = screen.getByRole('button', { name: /sign in/i });

            await user.type(usernameInput, 'wronguser');
            await user.type(passwordInput, 'wrongpass');
            await user.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
            });

            expect(mockNavigate).not.toHaveBeenCalled();
        });

        it('should display error message on network error', async () => {
            const user = userEvent.setup();
            const mockError = {
                response: {
                    data: {
                        message: 'Network error occurred',
                    },
                },
            };

            vi.mocked(api.authService.login).mockRejectedValue(mockError);

            renderLogin();

            const usernameInput = screen.getByLabelText(/username/i);
            const passwordInput = screen.getByLabelText(/password/i);
            const submitButton = screen.getByRole('button', { name: /sign in/i });

            await user.type(usernameInput, 'testuser');
            await user.type(passwordInput, 'password123');
            await user.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText(/network error occurred/i)).toBeInTheDocument();
            });
        });

        it('should display generic error message when no specific error is provided', async () => {
            const user = userEvent.setup();
            vi.mocked(api.authService.login).mockRejectedValue(new Error('Unknown error'));

            renderLogin();

            const usernameInput = screen.getByLabelText(/username/i);
            const passwordInput = screen.getByLabelText(/password/i);
            const submitButton = screen.getByRole('button', { name: /sign in/i });

            await user.type(usernameInput, 'testuser');
            await user.type(passwordInput, 'password123');
            await user.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText(/an error occurred during login/i)).toBeInTheDocument();
            });
        });

        it('should clear previous error messages on new submission', async () => {
            const user = userEvent.setup();

            // First submission - error
            vi.mocked(api.authService.login).mockResolvedValue({
                success: false,
                token: '',
                message: 'First error',
            });

            renderLogin();

            const usernameInput = screen.getByLabelText(/username/i);
            const passwordInput = screen.getByLabelText(/password/i);
            const submitButton = screen.getByRole('button', { name: /sign in/i });

            await user.type(usernameInput, 'user1');
            await user.type(passwordInput, 'pass1');
            await user.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText(/first error/i)).toBeInTheDocument();
            });

            // Second submission - success
            vi.mocked(api.authService.login).mockResolvedValue({
                success: true,
                token: 'token',
                message: 'Success',
            });

            await user.clear(usernameInput);
            await user.clear(passwordInput);
            await user.type(usernameInput, 'user2');
            await user.type(passwordInput, 'pass2');
            await user.click(submitButton);

            await waitFor(() => {
                expect(screen.queryByText(/first error/i)).not.toBeInTheDocument();
            });
        });
    });
});
