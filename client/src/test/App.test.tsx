import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../components/Login';
import CustomerInfo from '../components/CustomerInfo';

// Create a test version of the App without the Router wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const token = localStorage.getItem('authToken');
    return token ? <>{children}</> : <Navigate to="/" replace />;
}

function TestApp() {
    return (
        <div className="app-container">
            <Routes>
                <Route path="/" element={<Login />} />
                <Route
                    path="/customer"
                    element={
                        <ProtectedRoute>
                            <CustomerInfo />
                        </ProtectedRoute>
                    }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </div>
    );
}

describe('App Component', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    describe('Routing', () => {
        it('should render Login component on root path', () => {
            render(
                <MemoryRouter initialEntries={['/']}>
                    <TestApp />
                </MemoryRouter>
            );

            expect(screen.getByText('Welcome Back')).toBeInTheDocument();
        });

        it('should redirect to login when accessing /customer without token', () => {
            render(
                <MemoryRouter initialEntries={['/customer']}>
                    <TestApp />
                </MemoryRouter>
            );

            expect(screen.getByText('Welcome Back')).toBeInTheDocument();
        });

        it('should render CustomerInfo component when accessing /customer with token', () => {
            localStorage.setItem('authToken', 'test-token');

            render(
                <MemoryRouter initialEntries={['/customer']}>
                    <TestApp />
                </MemoryRouter>
            );

            expect(screen.getByText('Customer Information')).toBeInTheDocument();
        });

        it('should redirect unknown routes to login', () => {
            render(
                <MemoryRouter initialEntries={['/unknown-route']}>
                    <TestApp />
                </MemoryRouter>
            );

            expect(screen.getByText('Welcome Back')).toBeInTheDocument();
        });
    });

    describe('Protected Route', () => {
        it('should protect /customer route when no token exists', () => {
            localStorage.removeItem('authToken');

            render(
                <MemoryRouter initialEntries={['/customer']}>
                    <TestApp />
                </MemoryRouter>
            );

            expect(screen.getByText('Welcome Back')).toBeInTheDocument();
        });

        it('should allow access to /customer route when token exists', () => {
            localStorage.setItem('authToken', 'valid-token');

            render(
                <MemoryRouter initialEntries={['/customer']}>
                    <TestApp />
                </MemoryRouter>
            );

            expect(screen.getByText('Customer Information')).toBeInTheDocument();
        });

        it('should render app container', () => {
            const { container } = render(
                <MemoryRouter initialEntries={['/']}>
                    <TestApp />
                </MemoryRouter>
            );

            expect(container.querySelector('.app-container')).toBeInTheDocument();
        });
    });
});
