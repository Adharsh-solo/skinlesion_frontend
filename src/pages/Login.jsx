import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

const Logo = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block' }}>
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </svg>
);

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login/', { email, password });
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);

      try {
        const tokenPayload = JSON.parse(atob(response.data.access.split('.')[1]));
        const fullName = `${tokenPayload.first_name || ''} ${tokenPayload.last_name || ''}`.trim();
        localStorage.setItem('user_name', fullName || tokenPayload.email || 'User');
      } catch (e) {
        localStorage.setItem('user_name', 'User');
      }

      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page" style={{ position: 'relative' }}>
      <div style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Logo />
        <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--accent)' }}>Skin Lesion Detection</span>
      </div>

      <div className="card auth-card">
        <div className="text-center mb-6">
          <Logo />
          <h2 className="mt-2" style={{ color: 'var(--accent)', fontSize: '1.5rem' }}>Welcome Back</h2>
          <p className="text-secondary mt-1" style={{ fontSize: '0.9rem' }}>Login to your account</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label style={{ color: '#fff', fontSize: '0.85rem' }}>Username or Email</label>
            <input
              type="text"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your registered email"
              style={{ fontWeight: '500', padding: '0.6rem 1rem' }}
            />
          </div>
          <div className="input-group">
            <label style={{ color: '#fff', fontSize: '0.85rem' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                style={{ fontWeight: '500', letterSpacing: showPassword ? 'normal' : '2px', padding: '0.6rem 2.5rem 0.6rem 1rem', width: '100%', boxSizing: 'border-box' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '0.8rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                )}
              </button>
            </div>
          </div>

          {error && <p className="text-danger text-center mt-2 mb-4" style={{ fontSize: '0.9rem' }}>{error}</p>}

          <button type="submit" className="btn mt-4" style={{ width: '100%', padding: '0.8rem', fontSize: '1.1rem', borderRadius: '0.5rem' }} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="text-center mt-6" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Don't have an account? <Link to="/register" className="link">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
