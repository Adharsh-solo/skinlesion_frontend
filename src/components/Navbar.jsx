import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Logo = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block' }}>
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </svg>
);

function Navbar() {
  const navigate = useNavigate();
  const userName = localStorage.getItem('user_name') || 'Guest';

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => { document.removeEventListener("mousedown", handleClickOutside); };
  }, [dropdownRef]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_name');
    navigate('/login');
  };

  return (
    <nav style={{ background: 'var(--card-bg)', borderBottom: '1px solid var(--border)', padding: '1rem 0', backdropFilter: 'blur(10px)', position: 'sticky', top: 0, zIndex: 100 }}>
      <div className="container flex items-center justify-between" style={{ position: 'relative' }}>
        <Link to="/" className="link" style={{ fontSize: '1.25rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Logo />
          Skin Lesion Detection
        </Link>
        
        <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 12h18M3 6h18M3 18h18" /></svg>
        </button>

        <div className={`navbar-links ${mobileMenuOpen ? 'open' : ''}`}>
          <Link to="/" className="link" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
          <Link to="/predict" className="link" onClick={() => setMobileMenuOpen(false)}>Predict</Link>
          <Link to="/history" className="link" onClick={() => setMobileMenuOpen(false)}>History</Link>
          
          <div className="profile-dropdown" ref={dropdownRef} style={{ position: 'relative', marginLeft: window.innerWidth > 768 ? '1rem' : '0' }}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="btn btn-secondary flex items-center gap-2"
              style={{ padding: '0.4rem 1rem', borderRadius: '2rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)' }}
            >
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '14px' }}>
                {userName.charAt(0).toUpperCase()}
              </div>
              <span style={{ fontWeight: '500', color: 'var(--text-primary)' }}> {userName}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>

            {dropdownOpen && (
              <div className="dropdown-menu" style={{ position: 'absolute', top: '100%', right: 0, marginTop: '0.5rem', backgroundColor: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '0.5rem', padding: '0.5rem 0', minWidth: '180px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)', zIndex: 1000 }}>
                <div style={{ padding: '0.5rem 1rem', borderBottom: '1px solid var(--border)', marginBottom: '0.5rem' }}>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Signed in as</p>
                  <p style={{ fontWeight: 'bold' }}>{userName}</p>
                </div>
                <button onClick={handleLogout} style={{ width: '100%', textAlign: 'left', padding: '0.75rem 1rem', background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem' }} className="dropdown-item">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
