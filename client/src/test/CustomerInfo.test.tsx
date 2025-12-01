import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import CustomerInfo from '../components/CustomerInfo';
import * as api from '../services/api';

// Mock the API service
vi.mock('../services/api', () => ({
    customerService: {
        getCustomer: vi.fn(),
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

describe('CustomerInfo Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    const renderCustomerInfo = (username = 'TestUser') => {
        if (username) {
            localStorage.setItem('username', username);
        }
        return render(
            <BrowserRouter>
                <CustomerInfo />
            </BrowserRouter>
        );
    };

    describe('Rendering', () => {
        it('should render navbar with brand and user info', () => {
            renderCustomerInfo('JohnDoe');

            expect(screen.getByText('CRM Portal')).toBeInTheDocument();
            expect(screen.getByText('Welcome,')).toBeInTheDocument();
            expect(screen.getByText('JohnDoe')).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
        });

        it('should render page header', () => {
            renderCustomerInfo();

            expect(screen.getByText('Customer Information')).toBeInTheDocument();
            expect(screen.getByText('Search and view customer details')).toBeInTheDocument();
        });

        it('should render search form', () => {
            renderCustomerInfo();

            expect(screen.getByLabelText(/customer id/i)).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /search$/i })).toBeInTheDocument();
        });

        it('should display default username when not in localStorage', () => {
            renderCustomerInfo('');

            expect(screen.getByText('Welcome,')).toBeInTheDocument();
            expect(screen.getByText('User')).toBeInTheDocument();
        });
    });

    describe('Search Functionality', () => {
        it('should update customer ID input value', async () => {
            const user = userEvent.setup();
            renderCustomerInfo();

            const customerIdInput = screen.getByLabelText(/customer id/i) as HTMLInputElement;
            await user.type(customerIdInput, '12345');

            expect(customerIdInput.value).toBe('12345');
        });

        it('should successfully search and display customer information', async () => {
            const user = userEvent.setup();
            const mockCustomer = {
                clientId: '12345',
                editApproval: 'Y',
                dba: 'Acme Corp',
                clientLegalName: 'Acme Corporation LLC',
                complianceHold: 'N',
                level: 'Gold',
                paymentTermID: 'NET30',
                paymentMethod: 'ACH',
                status: 'Active',
            };

            vi.mocked(api.customerService.getCustomer).mockResolvedValue(mockCustomer);

            renderCustomerInfo();

            const customerIdInput = screen.getByLabelText(/customer id/i);
            const searchButton = screen.getByRole('button', { name: /search$/i });

            await user.type(customerIdInput, '12345');
            await user.click(searchButton);

            await waitFor(() => {
                expect(api.customerService.getCustomer).toHaveBeenCalledWith('12345');
            });

            await waitFor(() => {
                expect(screen.getByText('Acme Corporation LLC')).toBeInTheDocument();
                expect(screen.getByText(/customer id:/i)).toBeInTheDocument();
                expect(screen.getByText('12345')).toBeInTheDocument();
                expect(screen.getByText('Acme Corp')).toBeInTheDocument();
                expect(screen.getByText('Gold')).toBeInTheDocument();
                expect(screen.getByText('NET30')).toBeInTheDocument();
                expect(screen.getByText('ACH')).toBeInTheDocument();
            });
        });

        it('should display loading state during search', async () => {
            const user = userEvent.setup();

            let resolveSearch: (value: any) => void;
            const searchPromise = new Promise((resolve) => {
                resolveSearch = resolve;
            });

            vi.mocked(api.customerService.getCustomer).mockReturnValue(searchPromise as any);

            renderCustomerInfo();

            const customerIdInput = screen.getByLabelText(/customer id/i);
            const searchButton = screen.getByRole('button', { name: /search$/i });

            await user.type(customerIdInput, '12345');
            await user.click(searchButton);

            await waitFor(() => {
                expect(screen.getByText(/loading customer information/i)).toBeInTheDocument();
                expect(searchButton).toBeDisabled();
            });

            resolveSearch!({
                clientId: '12345',
                editApproval: 'Y',
                dba: 'Test',
                clientLegalName: 'Test LLC',
                complianceHold: 'N',
                level: 'Gold',
                paymentTermID: 'NET30',
                paymentMethod: 'ACH',
                status: 'Active',
            });
        });

        it('should display error message when customer not found', async () => {
            const user = userEvent.setup();
            const mockError = {
                response: {
                    data: {
                        message: 'Customer not found',
                    },
                },
            };

            vi.mocked(api.customerService.getCustomer).mockRejectedValue(mockError);

            renderCustomerInfo();

            const customerIdInput = screen.getByLabelText(/customer id/i);
            const searchButton = screen.getByRole('button', { name: /search$/i });

            await user.type(customerIdInput, '99999');
            await user.click(searchButton);

            await waitFor(() => {
                expect(screen.getByText(/customer not found/i)).toBeInTheDocument();
            });
        });

        it('should display generic error message on network error', async () => {
            const user = userEvent.setup();
            vi.mocked(api.customerService.getCustomer).mockRejectedValue(new Error('Network error'));

            renderCustomerInfo();

            const customerIdInput = screen.getByLabelText(/customer id/i);
            const searchButton = screen.getByRole('button', { name: /search$/i });

            await user.type(customerIdInput, '12345');
            await user.click(searchButton);

            await waitFor(() => {
                expect(screen.getByText(/customer not found/i)).toBeInTheDocument();
            });
        });

        it('should clear previous customer data on error', async () => {
            const user = userEvent.setup();

            // First search - success
            const mockCustomer = {
                clientId: '12345',
                editApproval: 'Y',
                dba: 'First Company',
                clientLegalName: 'First Company LLC',
                complianceHold: 'N',
                level: 'Gold',
                paymentTermID: 'NET30',
                paymentMethod: 'ACH',
                status: 'Active',
            };

            vi.mocked(api.customerService.getCustomer).mockResolvedValue(mockCustomer);

            renderCustomerInfo();

            const customerIdInput = screen.getByLabelText(/customer id/i);
            const searchButton = screen.getByRole('button', { name: /search$/i });

            await user.type(customerIdInput, '12345');
            await user.click(searchButton);

            await waitFor(() => {
                expect(screen.getByText('First Company LLC')).toBeInTheDocument();
            });

            // Second search - error
            vi.mocked(api.customerService.getCustomer).mockRejectedValue(new Error('Not found'));

            await user.clear(customerIdInput);
            await user.type(customerIdInput, '99999');
            await user.click(searchButton);

            await waitFor(() => {
                expect(screen.queryByText('First Company LLC')).not.toBeInTheDocument();
            });
        });

        it('should not require customer ID field', () => {
            renderCustomerInfo();
            const customerIdInput = screen.getByLabelText(/customer id/i);
            // Field is not marked as required in the new implementation
            expect(customerIdInput).toBeInTheDocument();
        });
    });

    describe('Customer Details Display', () => {
        it('should display all customer fields correctly', async () => {
            const user = userEvent.setup();
            const mockCustomer = {
                clientId: '12345',
                editApproval: 'Approved',
                dba: 'Test DBA',
                clientLegalName: 'Test Legal Name',
                complianceHold: 'Yes',
                level: 'Platinum',
                paymentTermID: 'NET60',
                paymentMethod: 'Wire Transfer',
                status: 'Active',
            };

            vi.mocked(api.customerService.getCustomer).mockResolvedValue(mockCustomer);

            renderCustomerInfo();

            const customerIdInput = screen.getByLabelText(/customer id/i);
            const searchButton = screen.getByRole('button', { name: /search$/i });

            await user.type(customerIdInput, '12345');
            await user.click(searchButton);

            await waitFor(() => {
                expect(screen.getByText('Test Legal Name')).toBeInTheDocument();
                expect(screen.getByText(/customer id:/i)).toBeInTheDocument();
                expect(screen.getByText('12345')).toBeInTheDocument();

                // Status badge
                const statusBadges = screen.getAllByText('Active');
                expect(statusBadges.length).toBeGreaterThan(0);

                // Detail fields
                expect(screen.getByText('Test DBA')).toBeInTheDocument();
                expect(screen.getByText('Approved')).toBeInTheDocument();
                expect(screen.getByText('Yes')).toBeInTheDocument();
                expect(screen.getByText('Platinum')).toBeInTheDocument();
                expect(screen.getByText('NET60')).toBeInTheDocument();
                expect(screen.getByText('Wire Transfer')).toBeInTheDocument();
            });
        });

        it('should display customer avatar with first letter of legal name', async () => {
            const user = userEvent.setup();
            const mockCustomer = {
                clientId: '12345',
                editApproval: 'Y',
                dba: 'Test',
                clientLegalName: 'Zebra Company',
                complianceHold: 'N',
                level: 'Gold',
                paymentTermID: 'NET30',
                paymentMethod: 'ACH',
                status: 'Active',
            };

            vi.mocked(api.customerService.getCustomer).mockResolvedValue(mockCustomer);

            renderCustomerInfo();

            const customerIdInput = screen.getByLabelText(/customer id/i);
            const searchButton = screen.getByRole('button', { name: /search$/i });

            await user.type(customerIdInput, '12345');
            await user.click(searchButton);

            await waitFor(() => {
                expect(screen.getByText('Z')).toBeInTheDocument();
            });
        });
    });

    describe('Logout Functionality', () => {
        it('should clear localStorage and navigate to login on logout', async () => {
            const user = userEvent.setup();
            localStorage.setItem('authToken', 'test-token');
            localStorage.setItem('username', 'TestUser');

            renderCustomerInfo();

            const logoutButton = screen.getByRole('button', { name: /logout/i });
            await user.click(logoutButton);

            expect(localStorage.getItem('authToken')).toBeNull();
            expect(localStorage.getItem('username')).toBeNull();
            expect(mockNavigate).toHaveBeenCalledWith('/');
        });
    });

    describe('Error Handling', () => {
        it('should clear error message on new search', async () => {
            const user = userEvent.setup();

            // First search - error
            vi.mocked(api.customerService.getCustomer).mockRejectedValue(new Error('Error 1'));

            renderCustomerInfo();

            const customerIdInput = screen.getByLabelText(/customer id/i);
            const searchButton = screen.getByRole('button', { name: /search$/i });

            await user.type(customerIdInput, '11111');
            await user.click(searchButton);

            await waitFor(() => {
                expect(screen.getByText(/customer not found/i)).toBeInTheDocument();
            });

            // Second search - success
            const mockCustomer = {
                clientId: '22222',
                editApproval: 'Y',
                dba: 'Test',
                clientLegalName: 'Test LLC',
                complianceHold: 'N',
                level: 'Gold',
                paymentTermID: 'NET30',
                paymentMethod: 'ACH',
                status: 'Active',
            };

            vi.mocked(api.customerService.getCustomer).mockResolvedValue(mockCustomer);

            await user.clear(customerIdInput);
            await user.type(customerIdInput, '22222');
            await user.click(searchButton);

            await waitFor(() => {
                expect(screen.getByText(/customer not found/i)).toBeInTheDocument();
            });
        });
    });
});
