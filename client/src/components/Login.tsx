import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { FCInput, FCButton, LockIcon } from '@frankcrum/common-ui-shared-components';

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await authService.login({
                username: email,
                password: password,
            });

            if (response.success && response.token) {
                localStorage.setItem('authToken', response.token);
                localStorage.setItem('username', email);
                navigate('/customer');
            } else {
                setError(response.message || 'Login failed');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'An error occurred during login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f5f5f5',
            padding: '2rem'
        }}>
            <div style={{
                backgroundColor: '#fcf8f7',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.07)',
                borderTop: '4px solid #e0e0e0',
                padding: '3rem',
                width: '100%',
                maxWidth: '450px',
                marginTop: '2rem',
            }}>
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 style={{
                        color: '#0f99d6',
                        fontSize: '2.5rem',
                        fontWeight: '700',
                        margin: 0
                    }}>
                        FrankCrum
                    </h1>
                </div>

                <h1 style={{
                    color: '#0f99d6',
                    fontSize: '1.75rem',
                    fontWeight: '600',
                    textAlign: 'center',
                    marginBottom: '0.5rem'
                }}>
                    CRM Customer Portal
                </h1>

                <p style={{
                    color: '#7a868c',
                    textAlign: 'center',
                    marginBottom: '2rem',
                    fontSize: '0.95rem'
                }}>
                    Sign in to access customer information
                </p>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <FCInput
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                            onValidate={() => {}}
                            validationText=""
                        />
                        <label htmlFor="email" style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            marginTop: '0.5rem',
                            fontSize: '0.85rem',
                            color: '#a0a0a0',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            lineHeight: 1.1,
                        }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="4" width="20" height="16" rx="2" />
                                <path d="M22 7l-10 7L2 7" />
                            </svg>
                            Email Address
                        </label>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <FCInput
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                            onValidate={() => {}}
                            validationText=""
                        />
                        <label htmlFor="password" style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            marginTop: '0.5rem',
                            fontSize: '0.85rem',
                            color: '#a0a0a0',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            lineHeight: 1.1,
                        }}>
                            <LockIcon width={16} height={16} />
                            Password
                        </label>
                    </div>

                    {error && (
                        <div style={{
                            backgroundColor: '#fff3cd',
                            border: '1px solid #ffc107',
                            borderRadius: '4px',
                            padding: '0.75rem 1rem',
                            marginBottom: '1.5rem',
                            color: '#856404',
                            fontSize: '0.9rem'
                        }}>
                            <strong>⚠️</strong> {error}
                        </div>
                    )}

                    <div style={{ width: '100%' }}>
                        <FCButton
                            type="submit"
                            variant="primary"
                            disabled={loading}
                            text={loading ? 'Signing in...' : 'Sign In'}
                        />
                    </div>
                </form>

                <div style={{
                    marginTop: '2rem',
                    paddingTop: '1.5rem',
                    borderTop: '1px solid #e0e0e0',
                    textAlign: 'center'
                }}>
                    <p style={{
                        color: '#7a868c',
                        fontSize: '0.85rem',
                        margin: 0
                    }}>
                        © 2025 Frank Crum. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
}
