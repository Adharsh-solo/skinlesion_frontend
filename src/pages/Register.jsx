import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

const Logo = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block' }}>
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </svg>
);

function Register() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirm_password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await api.post('/auth/register/', {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        password: formData.password
      });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.email?.[0] || 'Registration failed. Please try again.');
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
          <h2 className="mt-2" style={{ color: 'var(--accent)', fontSize: '1.5rem' }}>Create an Account</h2>
          <p className="text-secondary mt-1" style={{ fontSize: '0.9rem' }}>Sign up for Skin Lesion Detection</p>
        </div>

        <form onSubmit={handleRegister}>
          <div className="flex" style={{ gap: '0.75rem', marginBottom: '1rem' }}>
            <div className="input-group" style={{ flex: 1, margin: 0 }}>
              <label style={{ color: '#fff', fontSize: '0.85rem' }}>First Name</label>
              <input type="text" name="first_name" required value={formData.first_name} onChange={handleChange} style={{ fontWeight: '500', padding: '0.6rem 1rem' }} />
            </div>
            <div className="input-group" style={{ flex: 1, margin: 0 }}>
              <label style={{ color: '#fff', fontSize: '0.85rem' }}>Last Name</label>
              <input type="text" name="last_name" required value={formData.last_name} onChange={handleChange} style={{ fontWeight: '500', padding: '0.6rem 1rem' }} />
            </div>
          </div>
          <div className="input-group">
            <label style={{ color: '#fff', fontSize: '0.85rem' }}>Email</label>
            <input type="email" name="email" required value={formData.email} onChange={handleChange} style={{ fontWeight: '500', padding: '0.6rem 1rem' }} />
          </div>
          <div className="input-group">
            <label style={{ color: '#fff', fontSize: '0.85rem' }}>Password</label>
            <input type="password" name="password" required value={formData.password} onChange={handleChange} style={{ fontWeight: '500', letterSpacing: '2px', padding: '0.6rem 1rem' }} />
          </div>
          <div className="input-group">
            <label style={{ color: '#fff', fontSize: '0.85rem' }}>Confirm Password</label>
            <input type="password" name="confirm_password" required value={formData.confirm_password} onChange={handleChange} style={{ fontWeight: '500', letterSpacing: '2px', padding: '0.6rem 1rem' }} />
          </div>

          {error && <p className="text-danger text-center mt-2 mb-4" style={{ fontSize: '0.9rem' }}>{error}</p>}

          <button type="submit" className="btn mt-4" style={{ width: '100%', padding: '0.8rem', fontSize: '1.1rem', borderRadius: '0.5rem' }} disabled={loading}>
            {loading ? 'Registering...' : 'Sign up'}
          </button>
        </form>
        <p className="text-center mt-6" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Already have an account? <Link to="/login" className="link">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
