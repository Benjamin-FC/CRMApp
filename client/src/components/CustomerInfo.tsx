import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { customerService, type CustomerInfo as CustomerInfoType } from '../services/api';

export default function CustomerInfo() {
    const navigate = useNavigate();
    const [customerId, setCustomerId] = useState('');
    const [customer, setCustomer] = useState<CustomerInfoType | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const username = localStorage.getItem('username') || 'User';

    const handleSearch = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data = await customerService.getCustomer(customerId);
            setCustomer(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch customer information');
            setCustomer(null);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('username');
        navigate('/');
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    };

    return (
        <div className="customer-page">
            <nav className="navbar">
                <div className="navbar-brand">
                    <span>🔷</span>
                    CRM Portal
                </div>
                <div className="navbar-actions">
                    <span className="user-info">Welcome, {username}</span>
                    <button className="logout-button" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </nav>

            <div className="customer-container">
                <div className="page-header">
                    <h1 className="page-title">Customer Information</h1>
                    <p className="page-subtitle">Search and view customer details</p>
                </div>

                <div className="search-card">
                    <form className="search-form" onSubmit={handleSearch}>
                        <div className="search-input-wrapper form-group">
                            <label htmlFor="customerId" className="form-label">
                                Customer ID
                            </label>
                            <input
                                id="customerId"
                                type="text"
                                className="form-input"
                                placeholder="Enter customer ID"
                                value={customerId}
                                onChange={(e) => setCustomerId(e.target.value)}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="search-button"
                            disabled={loading}
                        >
                            {loading ? 'Searching...' : 'Search Customer'}
                        </button>
                    </form>

                    {error && <div className="error-message" style={{ marginTop: '1rem' }}>{error}</div>}
                </div>

                {loading && (
                    <div className="loading-spinner">
                        <div className="spinner"></div>
                        <p>Loading customer information...</p>
                    </div>
                )}

                {customer && !loading && (
                    <div className="customer-info-card">
                        <div className="customer-header">
                            <div className="customer-avatar">
                                {getInitials(customer.firstName, customer.lastName)}
                            </div>
                            <div className="customer-header-info">
                                <h2 className="customer-name">
                                    {customer.firstName} {customer.lastName}
                                </h2>
                                <p className="customer-id">ID: {customer.id}</p>
                            </div>
                            <div className="status-badge">{customer.status}</div>
                        </div>

                        <div className="customer-details">
                            <div className="detail-item">
                                <div className="detail-label">Email Address</div>
                                <div className="detail-value">{customer.email}</div>
                            </div>

                            <div className="detail-item">
                                <div className="detail-label">Phone Number</div>
                                <div className="detail-value">{customer.phone}</div>
                            </div>

                            <div className="detail-item">
                                <div className="detail-label">Street Address</div>
                                <div className="detail-value">{customer.address}</div>
                            </div>

                            <div className="detail-item">
                                <div className="detail-label">City</div>
                                <div className="detail-value">{customer.city}</div>
                            </div>

                            <div className="detail-item">
                                <div className="detail-label">State</div>
                                <div className="detail-value">{customer.state}</div>
                            </div>

                            <div className="detail-item">
                                <div className="detail-label">Zip Code</div>
                                <div className="detail-value">{customer.zipCode}</div>
                            </div>

                            <div className="detail-item">
                                <div className="detail-label">Customer Since</div>
                                <div className="detail-value">{formatDate(customer.createdDate)}</div>
                            </div>

                            <div className="detail-item">
                                <div className="detail-label">Account Status</div>
                                <div className="detail-value">{customer.status}</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
