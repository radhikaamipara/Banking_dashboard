import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Landmark, Shield, LogIn, UserPlus, LayoutDashboard } from 'lucide-react';

export const Navbar = () => {
  const location = useLocation();
  const { isAuthenticated, isAdmin, user } = useAuth();

  const isActive = (path) => location.pathname === path;

  return (
    <header style={{ background: '#ffffff', borderBottom: '1px solid var(--border-light)', position: 'sticky', top: 0, zIndex: 90 }}>
      <div style={{ maxWidth: '1350px', margin: '0 auto', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #1c2a8f 0%, #00a4e4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 10px rgba(0, 164, 228, 0.35)',
            }}
          >
            <Landmark size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '1.35rem', fontWeight: '800', letterSpacing: '-0.03em', color: '#1c2a8f' }}>
                SecureBank
              </span>
              <span style={{ fontSize: '1.35rem', fontWeight: '800', color: '#00a4e4' }}>
                Digital
              </span>
            </div>
            <div style={{ fontSize: '0.68rem', fontWeight: '700', letterSpacing: '0.08em', color: '#64748b', textTransform: 'uppercase' }}>
              Trusted Digital Banking
            </div>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
          <Link
            to="/"
            style={{
              fontSize: '0.925rem',
              fontWeight: isActive('/') ? '700' : '500',
              color: isActive('/') ? '#1c2a8f' : '#475569',
              borderBottom: isActive('/') ? '2px solid #1c2a8f' : '2px solid transparent',
              paddingBottom: '4px',
              transition: 'var(--transition)',
            }}
          >
            Home
          </Link>
          <Link
            to="/about"
            style={{
              fontSize: '0.925rem',
              fontWeight: isActive('/about') ? '700' : '500',
              color: isActive('/about') ? '#1c2a8f' : '#475569',
              borderBottom: isActive('/about') ? '2px solid #1c2a8f' : '2px solid transparent',
              paddingBottom: '4px',
              transition: 'var(--transition)',
            }}
          >
            About Us
          </Link>
          <Link
            to="/contact"
            style={{
              fontSize: '0.925rem',
              fontWeight: isActive('/contact') ? '700' : '500',
              color: isActive('/contact') ? '#1c2a8f' : '#475569',
              borderBottom: isActive('/contact') ? '2px solid #1c2a8f' : '2px solid transparent',
              paddingBottom: '4px',
              transition: 'var(--transition)',
            }}
          >
            Contact Us
          </Link>
          <Link
            to={isAuthenticated ? (isAdmin ? '/admin/dashboard' : '/login?tab=admin') : '/login?tab=admin'}
            style={{
              fontSize: '0.85rem',
              fontWeight: '700',
              color: '#6a1b9a',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '20px',
              background: 'rgba(106, 27, 154, 0.08)',
              border: '1px solid rgba(106, 27, 154, 0.25)',
              textDecoration: 'none',
              transition: 'var(--transition)',
            }}
          >
            <Shield size={14} color="#6a1b9a" />
            <span>Bank Administration</span>
          </Link>
        </nav>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {isAuthenticated ? (
            <>
              <Link
                to={isAdmin ? '/admin/dashboard' : '/user/dashboard'}
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <LayoutDashboard size={18} />
                <span>Go to {isAdmin ? 'Admin Panel' : 'User Dashboard'}</span>
              </Link>
              {isAdmin && (
                <Link
                  to="/user/dashboard"
                  className="btn btn-secondary"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}
                >
                  <span>Customer View</span>
                </Link>
              )}
            </>
          ) : (
            <>
              <Link to="/login?tab=customer" className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <LogIn size={17} />
                <span>Customer Login</span>
              </Link>
              <Link
                to="/login?tab=admin"
                className="btn"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'linear-gradient(135deg, #6a1b9a 0%, #3b0d5c 100%)',
                  color: '#ffffff',
                }}
              >
                <Shield size={17} />
                <span>Admin Login</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
