import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { FCInput, FCButton, LockIcon } from '@frankcrum/common-ui-shared-components';

export default function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const response = await authService.login({ username, password });

            if (response.success) {
                localStorage.setItem('authToken', response.token);
                localStorage.setItem('username', username);
                setSuccess('Login successful! Redirecting...');

                setTimeout(() => {
                    navigate('/customer');
                }, 1000);
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
        <div className="login-page">
            <div className="login-card">
                <h1 style={{ color: '#0f99d6' }}>CRM Customer Portal</h1>
                <p>Sign in to access your account</p>

                <form className="login-form" onSubmit={handleSubmit}>
                    {error && <div className="error-message">{error}</div>}
                    {success && <div className="success-message">{success}</div>}

                    <div>
                        <label htmlFor="username">📧 Email</label>
                        <FCInput
                            id="username"
                            type="email"
                            placeholder="Enter your email"
                            value={username}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                            onValidate={() => {}}
                            validationText=""
                        />
                    </div>

                    <div>
                        <label htmlFor="password"><LockIcon /> Password</label>
                        <FCInput
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                            onValidate={() => {}}
                            validationText=""
                        />
                    </div>

                    <FCButton
                        type="submit"
                        variant="primary"
                        disabled={loading}
                        text={loading ? 'Signing in...' : 'Sign In'}
                    />
                </form>
            </div>
        </div>
    );
}
