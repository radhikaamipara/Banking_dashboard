import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Landmark, UserPlus, Lock, Mail, Phone, User, KeyRound, AlertCircle, CheckCircle2, Shield } from 'lucide-react';
import { DemoSwitcherBar } from '../../components/common/DemoSwitcherBar';

export const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    tPin: '1234',
    initialDeposit: 25000,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.tPin.length !== 4) {
      setError('Transaction PIN (T-PIN) must be 4 digits.');
      setLoading(false);
      return;
    }

    try {
      await register(formData);
      navigate('/user/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed.');
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
            maxWidth: '540px',
            background: '#ffffff',
            borderRadius: '24px',
            boxShadow: '0 20px 40px rgba(15, 23, 42, 0.1)',
            border: '1px solid var(--border-light)',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div
            style={{
              background: 'linear-gradient(135deg, #1c2a8f 0%, #00a4e4 100%)',
              color: '#ffffff',
              padding: '30px 28px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px auto',
              }}
            >
              <Landmark size={26} />
            </div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: '800', margin: 0, color: '#ffffff' }}>
              Open Digital Savings Account
            </h2>
            <p style={{ fontSize: '0.825rem', color: '#e0e7ff', marginTop: '6px' }}>
              Instant account generation, Visa Platinum Card issuance & zero paperwork
            </p>
          </div>

          <div style={{ padding: '32px 28px' }}>
            {error && (
              <div style={{ background: '#fef2f2', color: '#991b1b', padding: '12px', borderRadius: '10px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                <AlertCircle size={18} color="#ef4444" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Full Legal Name (as on Aadhaar / PAN)</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="e.g. Rahul Sharma"
                    style={{ paddingLeft: '40px' }}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  <User size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="email"
                      required
                      className="form-control"
                      placeholder="name@example.com"
                      style={{ paddingLeft: '40px' }}
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                    <Mail size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Mobile Number</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="tel"
                      required
                      className="form-control"
                      placeholder="+91 98765 43210"
                      style={{ paddingLeft: '40px' }}
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                    <Phone size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Password (Min 6 chars)</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="password"
                      required
                      className="form-control"
                      placeholder="••••••••"
                      style={{ paddingLeft: '40px' }}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                    <Lock size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">4-Digit T-PIN (for transfers)</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="password"
                      maxLength={4}
                      required
                      className="form-control"
                      placeholder="1234"
                      style={{ paddingLeft: '40px' }}
                      value={formData.tPin}
                      onChange={(e) => setFormData({ ...formData, tPin: e.target.value })}
                    />
                    <KeyRound size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Initial Opening Balance Deposit (INR)</label>
                <input
                  type="number"
                  min="1000"
                  step="1000"
                  className="form-control"
                  value={formData.initialDeposit}
                  onChange={(e) => setFormData({ ...formData, initialDeposit: Number(e.target.value) })}
                />
                <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                  Complimentary starting deposit for testing transfers & card transactions.
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{ width: '100%', padding: '13px', fontSize: '1rem', marginTop: '10px' }}
              >
                <UserPlus size={18} />
                <span>{loading ? 'Creating Bank Account...' : 'Open Account Now'}</span>
              </button>
            </form>

            <div style={{ marginTop: '22px', textAlign: 'center', fontSize: '0.85rem', color: '#64748b' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#1c2a8f', fontWeight: '700' }}>
                Login Here
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
