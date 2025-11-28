import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';

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
                <div className="login-header">
                    <div className="login-logo">C</div>
                    <h1 className="login-title">Welcome Back</h1>
                    <p className="login-subtitle">Sign in to access CRM Customer Portal</p>
                </div>

                <form className="login-form" onSubmit={handleSubmit}>
                    {error && <div className="error-message">{error}</div>}
                    {success && <div className="success-message">{success}</div>}

                    <div className="form-group">
                        <label htmlFor="username" className="form-label">
                            Username
                        </label>
                        <input
                            id="username"
                            type="text"
                            className="form-input"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            autoFocus
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password" className="form-label">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            className="form-input"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="login-button"
                        disabled={loading}
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    );
}
