import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { customerService, type CustomerInfo as CustomerInfoType } from '../services/api';
import { FCInput, FCButton } from '@frankcrum/common-ui-shared-components';

const headerStyle = {
    backgroundColor: '#0f99d6',
    color: 'white',
    padding: '1rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
};

const flexRowStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
};

const flexRowEndStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem'
};

const mainStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem'
};

const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '2rem',
    marginBottom: '2rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
};

const errorStyle = {
    backgroundColor: '#f8d7da',
    border: '2px solid #dc3545',
    borderRadius: '8px',
    padding: '1.5rem 2rem',
    marginBottom: '2rem',
    color: '#721c24',
    fontSize: '1.1rem',
    fontWeight: '600',
    display: 'block',
    width: '100%',
    boxSizing: 'border-box' as const
};

const infoStyle = {
    backgroundColor: '#e3f2fd',
    border: '2px solid #2196f3',
    borderRadius: '8px',
    padding: '1.5rem 2rem',
    marginBottom: '2rem',
    color: '#1565c0',
    fontSize: '1.1rem',
    fontWeight: '600',
    display: 'block',
    width: '100%',
    boxSizing: 'border-box' as const
};

const spinnerCardStyle = {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '3rem',
    textAlign: 'center' as const,
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
};

const detailsCardStyle = {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '2rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
};

const detailsHeaderStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
    paddingBottom: '1.5rem',
    borderBottom: '2px solid #f0f0f0',
    marginBottom: '2rem'
};

const detailsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1.5rem'
};

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
            // Simplify error message - show user-friendly message only
            let errorMessage = 'Customer not found or unable to retrieve customer information';
            
            // Check if it's a 404 (not found)
            if (err.response?.status === 404) {
                errorMessage = 'Customer not found';
            } else if (err.response?.status === 503 || err.response?.status === 500) {
                errorMessage = 'Unable to retrieve customer information. Please try again later';
            }
            
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
        <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
            {/* Header */}
            <header style={headerStyle}>
                <div style={flexRowStyle}>
                    <h1 style={{
                        color: 'white',
                        fontSize: '1.5rem',
                        fontWeight: '700',
                        margin: 0
                    }}>
                        FrankCrum
                    </h1>
                    <div style={{
                        borderLeft: '2px solid rgba(255,255,255,0.3)',
                        paddingLeft: '1rem',
                        fontSize: '1.25rem',
                        fontWeight: '600'
                    }}>
                        CRM Portal
                    </div>
                </div>
                <div style={flexRowEndStyle}>
                    <span style={{ fontSize: '0.95rem' }}>Welcome, <strong>{username}</strong></span>
                    <FCButton
                        variant="secondary"
                        onClick={handleLogout}
                        text="Logout"
                    />
                </div>
            </header>

            {/* Main Content */}
            <main style={mainStyle}>
                {/* Page Title */}
                <div style={{ marginBottom: '2rem' }}>
                    <h1 style={{
                        color: '#0b0c0d',
                        fontSize: '2rem',
                        fontWeight: '600',
                        marginBottom: '0.5rem'
                    }}>
                        Customer Information
                    </h1>
                    <p style={{ color: '#7a868c', fontSize: '1rem', margin: 0 }}>
                        Search and view customer details
                    </p>
                </div>

                {/* Search Card */}
                <div style={cardStyle}>
                    <h2 style={{
                        color: '#0b0c0d',
                        fontSize: '1.25rem',
                        fontWeight: '600',
                        marginBottom: '1.5rem'
                    }}>
                        Search Customer
                    </h2>

                    <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
                        <div style={{ display: 'flex', flex: 1, maxWidth: '400px', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', width: '100%' }}>
                                <FCInput
                                    id="customerId"
                                    type="text"
                                    placeholder="Enter customer ID"
                                    value={customerId}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomerId(e.target.value)}
                                    onValidate={() => {}}
                                    validationText=""
                                    style={{ flex: 1 }}
                                />
                                <FCButton
                                    type="submit"
                                    variant="primary"
                                    disabled={loading || !customerId}
                                    text={loading ? 'Searching...' : 'Search'}
                                    style={{ marginLeft: '1rem', marginBottom: 0 }}
                                />
                            </div>
                            <label htmlFor="customerId" style={{
                                display: 'block',
                                marginTop: '0.5rem',
                                color: '#0b0c0d',
                                fontSize: '0.95rem',
                                fontWeight: '500'
                            }}>
                                Customer ID
                            </label>
                        </div>
                    </form>
                </div>

                {/* Error Message */}
                {error && (
                    <div style={errorStyle}>
                        <div style={{ marginBottom: '0.5rem', fontSize: '1.5rem' }}>⚠️</div>
                        <strong>Error:</strong> {error}
                    </div>
                )}

                {/* No Results Message */}
                {!loading && !error && !customer && searched && (
                    <div style={infoStyle}>
                        <div style={{ marginBottom: '0.5rem', fontSize: '1.5rem' }}>ℹ️</div>
                        <strong>Info:</strong> No customer found. Please try a different Customer ID.
                    </div>
                )}

                {/* Loading Spinner */}
                {loading && (
                    <div style={spinnerCardStyle}>
                        <div style={{
                            width: '50px',
                            height: '50px',
                            border: '4px solid #f3f3f3',
                            borderTop: '4px solid #0f99d6',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite',
                            margin: '0 auto 1rem'
                        }} />
                        <p style={{ color: '#7a868c', fontSize: '1rem', margin: 0 }}>
                            Loading customer information...
                        </p>
                    </div>
                )}

                {/* Customer Details Card */}
                {customer && !loading && (
                    <div style={detailsCardStyle}>
                        {/* Customer Header */}
                        <div style={detailsHeaderStyle}>
                            <div style={{
                                width: '80px',
                                height: '80px',
                                borderRadius: '50%',
                                backgroundColor: '#0f99d6',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '2rem',
                                fontWeight: '700'
                            }}>
                                {customer.clientLegalName.charAt(0).toUpperCase()}
                            </div>
                            <div style={{ flex: 1 }}>
                                <h2 style={{
                                    color: '#0b0c0d',
                                    fontSize: '1.75rem',
                                    fontWeight: '600',
                                    marginBottom: '0.25rem'
                                }}>
                                    {customer.clientLegalName}
                                </h2>
                                <p style={{
                                    color: '#7a868c',
                                    fontSize: '1rem',
                                    margin: 0
                                }}>
                                    Customer ID: <strong>{customer.clientId}</strong>
                                </p>
                            </div>
                            <div style={{
                                backgroundColor: customer.status === 'Active' ? '#d4edda' : '#f8d7da',
                                color: customer.status === 'Active' ? '#155724' : '#721c24',
                                padding: '0.5rem 1rem',
                                borderRadius: '20px',
                                fontSize: '0.9rem',
                                fontWeight: '600'
                            }}>
                                {customer.status}
                            </div>
                        </div>

                        {/* Customer Details Grid */}
                        <div style={detailsGridStyle}>
                            <div>
                                <div style={{
                                    color: '#0b0c0d',
                                    fontSize: '1rem',
                                    fontWeight: '500'
                                }}>
                                    {customer.dba || 'N/A'}
                                </div>
                                <div style={{
                                    color: '#7a868c',
                                    fontSize: '0.875rem',
                                    fontWeight: '600',
                                    marginTop: '0.5rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                }}>
                                    DBA
                                </div>
                            </div>

                            <div>
                                <div style={{
                                    color: '#0b0c0d',
                                    fontSize: '1rem',
                                    fontWeight: '500'
                                }}>
                                    {customer.editApproval || 'N/A'}
                                </div>
                                <div style={{
                                    color: '#7a868c',
                                    fontSize: '0.875rem',
                                    fontWeight: '600',
                                    marginTop: '0.5rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                }}>
                                    Edit Approval
                                </div>
                            </div>

                            <div>
                                <div style={{
                                    color: '#0b0c0d',
                                    fontSize: '1rem',
                                    fontWeight: '500'
                                }}>
                                    {customer.complianceHold || 'N/A'}
                                </div>
                                <div style={{
                                    color: '#7a868c',
                                    fontSize: '0.875rem',
                                    fontWeight: '600',
                                    marginTop: '0.5rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                }}>
                                    Compliance Hold
                                </div>
                            </div>

                            <div>
                                <div style={{
                                    color: '#0b0c0d',
                                    fontSize: '1rem',
                                    fontWeight: '500'
                                }}>
                                    {customer.level || 'N/A'}
                                </div>
                                <div style={{
                                    color: '#7a868c',
                                    fontSize: '0.875rem',
                                    fontWeight: '600',
                                    marginTop: '0.5rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                }}>
                                    Level
                                </div>
                            </div>

                            <div>
                                <div style={{
                                    color: '#0b0c0d',
                                    fontSize: '1rem',
                                    fontWeight: '500'
                                }}>
                                    {customer.paymentTermID || 'N/A'}
                                </div>
                                <div style={{
                                    color: '#7a868c',
                                    fontSize: '0.875rem',
                                    fontWeight: '600',
                                    marginTop: '0.5rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                }}>
                                    Payment Term ID
                                </div>
                            </div>

                            <div>
                                <div style={{
                                    color: '#0b0c0d',
                                    fontSize: '1rem',
                                    fontWeight: '500'
                                }}>
                                    {customer.paymentMethod || 'N/A'}
                                </div>
                                <div style={{
                                    color: '#7a868c',
                                    fontSize: '0.875rem',
                                    fontWeight: '600',
                                    marginTop: '0.5rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                }}>
                                    Payment Method
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
