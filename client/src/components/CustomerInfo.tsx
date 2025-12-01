import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { customerService, type CustomerInfo as CustomerInfoType } from '../services/api';
import { FCInput, FCButton } from '@frankcrum/common-ui-shared-components';

export default function CustomerInfo() {
    const navigate = useNavigate();
    const [customerId, setCustomerId] = useState('');
    const [customer, setCustomer] = useState<CustomerInfoType | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [searched, setSearched] = useState(false);
    const username = localStorage.getItem('username') || 'User';

    const handleSearch = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setCustomer(null);
        setSearched(true);
        setLoading(true);

        try {
            const data = await customerService.getCustomer(customerId);
            setCustomer(data);
            setError('');
        } catch (err: any) {
            console.error('Error fetching customer:', err);
            const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch customer information';
            setError(errorMessage);
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

    return (
        <div className="customer-page">
            <nav className="navbar" style={{ backgroundColor: '#0f99d6', color: 'white', padding: '1rem 2rem' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                    <span>CRM Portal</span>
                </div>
                <div className="navbar-actions" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <span style={{ color: 'white' }}>Welcome, {username}</span>
                    <FCButton
                        variant="secondary"
                        onClick={handleLogout}
                        text="Logout"
                    />
                </div>
            </nav>

            <div className="customer-container">
                <div>
                    <h1>Customer Information</h1>
                    <p>Search and view customer details</p>
                </div>

                <div className="search-card">
                    <form className="search-form" onSubmit={handleSearch}>
                        <div className="search-input-wrapper">
                            <label htmlFor="customerId">
                                Customer ID
                            </label>
                            <FCInput
                                id="customerId"
                                type="text"
                                placeholder="Enter customer ID"
                                value={customerId}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomerId(e.target.value)}
                                onValidate={() => {}}
                                validationText=""
                            />
                        </div>
                        <FCButton
                            type="submit"
                            variant="primary"
                            disabled={loading}
                            text={loading ? 'Searching...' : 'Search Customer'}
                        />
                    </form>
                </div>

                {error && (
                    <div className="error-message">
                        <strong>⚠️ Error:</strong> {error}
                    </div>
                )}

                {!loading && !error && !customer && searched && (
                    <div className="error-message" style={{ background: '#e3f2fd', border: '2px solid #2196f3', color: '#1565c0' }}>
                        <strong>ℹ️ Info:</strong> No customer found. Try a different Customer ID.
                    </div>
                )}

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
                                {customer.clientLegalName.charAt(0).toUpperCase()}
                            </div>
                            <div className="customer-header-info">
                                <h2 className="customer-name">
                                    {customer.clientLegalName}
                                </h2>
                                <p className="customer-id">ID: {customer.clientId}</p>
                            </div>
                            <div className="status-badge">{customer.status}</div>
                        </div>

                        <div className="customer-details">
                            <div className="detail-item">
                                <div className="detail-label">DBA</div>
                                <div className="detail-value">{customer.dba}</div>
                            </div>

                            <div className="detail-item">
                                <div className="detail-label">Edit Approval</div>
                                <div className="detail-value">{customer.editApproval}</div>
                            </div>

                            <div className="detail-item">
                                <div className="detail-label">Compliance Hold</div>
                                <div className="detail-value">{customer.complianceHold}</div>
                            </div>

                            <div className="detail-item">
                                <div className="detail-label">Level</div>
                                <div className="detail-value">{customer.level}</div>
                            </div>

                            <div className="detail-item">
                                <div className="detail-label">Payment Term ID</div>
                                <div className="detail-value">{customer.paymentTermID}</div>
                            </div>

                            <div className="detail-item">
                                <div className="detail-label">Payment Method</div>
                                <div className="detail-value">{customer.paymentMethod}</div>
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
