import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Landmark, Lock, Mail, ShieldCheck, AlertCircle, ArrowRight, UserCheck } from 'lucide-react';
import { DemoSwitcherBar } from '../../components/common/DemoSwitcherBar';

export const Login = () => {
  const [searchParams] = useSearchParams();
  const requestedTab = searchParams.get('tab') === 'admin' ? 'admin' : 'customer';

  const [email, setEmail] = useState(requestedTab === 'admin' ? 'admin@sbi.com' : 'rahul.sharma@example.com');
  const [password, setPassword] = useState(requestedTab === 'admin' ? 'Admin@123' : 'User@123');
  const [activeTab, setActiveTab] = useState(requestedTab); // 'customer' | 'admin'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'admin') {
      setActiveTab('admin');
      setEmail('admin@sbi.com');
      setPassword('Admin@123');
    } else if (tabParam === 'customer') {
      setActiveTab('customer');
      setEmail('rahul.sharma@example.com');
      setPassword('User@123');
    }
  }, [searchParams]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setError('');
    if (tab === 'admin') {
      setEmail('admin@sbi.com');
      setPassword('Admin@123');
    } else {
      setEmail('rahul.sharma@example.com');
      setPassword('User@123');
    }
  };

  const handleQuickFill = (demoEmail, demoPass, tab = 'customer') => {
    setActiveTab(tab);
    setEmail(demoEmail);
    setPassword(demoPass);
    setError('');
  };

  const handleDirectDemoLogin = async (demoEmail, demoPass, tab) => {
    setActiveTab(tab);
    setEmail(demoEmail);
    setPassword(demoPass);
    setLoading(true);
    setError('');

    try {
      const data = await login(demoEmail, demoPass);
      if (data.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/user/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Invalid credentials or connection error.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await login(email, password);
      if (data.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/user/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Invalid credentials or connection error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
      <DemoSwitcherBar />

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
        <div
          style={{
            width: '100%',
            maxWidth: '480px',
            background: '#ffffff',
            borderRadius: '24px',
            boxShadow: '0 20px 40px rgba(15, 23, 42, 0.1)',
            border: '1px solid var(--border-light)',
            overflow: 'hidden',
          }}
        >
          {/* Header Banner */}
          <div
            style={{
              background: activeTab === 'admin'
                ? 'linear-gradient(135deg, #2c0a4d 0%, #1c2a8f 100%)'
                : 'linear-gradient(135deg, #1c2a8f 0%, #00a4e4 100%)',
              color: '#ffffff',
              padding: '32px 28px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px auto',
              }}
            >
              {activeTab === 'admin' ? <ShieldCheck size={28} /> : <Landmark size={28} />}
            </div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#ffffff', margin: 0 }}>
              {activeTab === 'admin' ? 'Bank Admin Portal' : 'SecureBank NetBanking Login'}
            </h2>
            <p style={{ fontSize: '0.825rem', color: '#e0e7ff', marginTop: '6px' }}>
              {activeTab === 'admin'
                ? 'Official governance, underwriting & system control'
                : 'Secure personal retail banking & fund management'}
            </p>
          </div>

          {/* Tab Selector */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border-light)', background: '#f8fafc' }}>
            <button
              type="button"
              onClick={() => handleTabChange('customer')}
              style={{
                flex: 1,
                padding: '14px',
                border: 'none',
                background: activeTab === 'customer' ? '#ffffff' : 'transparent',
                fontWeight: '700',
                fontSize: '0.875rem',
                color: activeTab === 'customer' ? '#1c2a8f' : '#64748b',
                borderBottom: activeTab === 'customer' ? '2px solid #1c2a8f' : '2px solid transparent',
                cursor: 'pointer',
              }}
            >
              Retail Customer
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('admin')}
              style={{
                flex: 1,
                padding: '14px',
                border: 'none',
                background: activeTab === 'admin' ? '#ffffff' : 'transparent',
                fontWeight: '700',
                fontSize: '0.875rem',
                color: activeTab === 'admin' ? '#6a1b9a' : '#64748b',
                borderBottom: activeTab === 'admin' ? '2px solid #6a1b9a' : '2px solid transparent',
                cursor: 'pointer',
              }}
            >
              Bank Admin
            </button>
          </div>

          {/* Form Body */}
          <div style={{ padding: '32px 28px' }}>
            {/* Quick autofill pill buttons for evaluation convenience */}
            <div style={{ marginBottom: '22px', background: '#f1f5f9', padding: '14px', borderRadius: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: '800', color: '#334155', textTransform: 'uppercase' }}>
                  ⚡ Instant 1-Click Demo Login:
                </span>
                <span style={{ fontSize: '0.68rem', color: '#64748b' }}>Click to sign in immediately</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => handleDirectDemoLogin('rahul.sharma@example.com', 'User@123', 'customer')}
                  style={{
                    background: '#1c2a8f',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '6px 12px',
                    fontSize: '0.78rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                  title="Log in directly as Rahul (Customer)"
                >
                  <UserCheck size={13} />
                  <span>Rahul (User) ➔</span>
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => handleDirectDemoLogin('priya.patel@example.com', 'User@123', 'customer')}
                  style={{
                    background: '#0284c7',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '6px 12px',
                    fontSize: '0.78rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                  title="Log in directly as Priya (Customer)"
                >
                  <UserCheck size={13} />
                  <span>Priya (User) ➔</span>
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => handleDirectDemoLogin('admin@sbi.com', 'Admin@123', 'admin')}
                  style={{
                    background: '#6a1b9a',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '6px 12px',
                    fontSize: '0.78rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                  title="Log in directly as Chief Administrator"
                >
                  <ShieldCheck size={13} />
                  <span>Chief Admin ➔</span>
                </button>
              </div>
            </div>

            {error && (
              <div style={{ background: '#fef2f2', color: '#991b1b', padding: '12px', borderRadius: '10px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                <AlertCircle size={18} color="#ef4444" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Registered Email</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="email"
                    required
                    className="form-control"
                    style={{ paddingLeft: '40px' }}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Mail size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="password"
                    required
                    className="form-control"
                    style={{ paddingLeft: '40px' }}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Lock size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`btn ${activeTab === 'admin' ? 'btn-primary' : 'btn-cyan'}`}
                style={{
                  width: '100%',
                  padding: '13px',
                  fontSize: '1rem',
                  marginTop: '8px',
                  ...(activeTab === 'admin' ? { background: 'linear-gradient(135deg, #6a1b9a 0%, #3b0d5c 100%)' } : {}),
                }}
              >
                <span>{loading ? 'Authenticating...' : `Log In to ${activeTab === 'admin' ? 'Admin Panel' : 'User Panel'}`}</span>
                <ArrowRight size={18} />
              </button>
            </form>

            <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.85rem', color: '#64748b' }}>
              Don't have an online banking account?{' '}
              <Link to="/register" style={{ color: '#1c2a8f', fontWeight: '700' }}>
                Open Digital Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
