import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import { useNotification } from '../../context/NotificationContext';
import { Megaphone, Send, Users, User, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const BroadcastNotifications = () => {
  const { showToast } = useNotification();
  const [users, setUsers] = useState([]);
  const [targetType, setTargetType] = useState('all'); // 'all' | 'specific'
  const [targetUserId, setTargetUserId] = useState('');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [notifType, setNotifType] = useState('system');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await api.getAdminUsers();
        setUsers(data.users || []);
        if (data.users?.length > 0) {
          setTargetUserId(data.users[0]._id);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchUsers();
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!title || !message) {
      alert('Please provide title and message');
      return;
    }

    setSending(true);
    try {
      const res = await api.sendBroadcastNotification({
        title,
        message,
        type: notifType,
        targetUserId: targetType === 'specific' ? targetUserId : null,
      });

      showToast(res.message, 'success');
      setTitle('');
      setMessage('');
    } catch (err) {
      alert(err.message || 'Failed to dispatch announcement');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="page-body">
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0f172a' }}>System Broadcasts & Announcements</h2>
        <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
          Dispatch high-priority notifications, planned maintenance alerts, or festive loan offers directly to customer dashboards
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '28px' }}>
        {/* Compose Form */}
        <div style={{ background: '#ffffff', borderRadius: '20px', padding: '32px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', marginBottom: '20px' }}>
            Compose Banking Announcement
          </h3>

          <form onSubmit={handleSend}>
            {/* Target Audience */}
            <div className="form-group">
              <label className="form-label">Target Audience</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setTargetType('all')}
                  style={{
                    padding: '11px',
                    borderRadius: '8px',
                    border: targetType === 'all' ? '2px solid #1c2a8f' : '1px solid var(--border-light)',
                    background: targetType === 'all' ? '#eef2ff' : '#ffffff',
                    color: targetType === 'all' ? '#1c2a8f' : '#64748b',
                    fontWeight: '700',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                >
                  <Users size={16} /> All Customers (Broadcast)
                </button>

                <button
                  type="button"
                  onClick={() => setTargetType('specific')}
                  style={{
                    padding: '11px',
                    borderRadius: '8px',
                    border: targetType === 'specific' ? '2px solid #1c2a8f' : '1px solid var(--border-light)',
                    background: targetType === 'specific' ? '#eef2ff' : '#ffffff',
                    color: targetType === 'specific' ? '#1c2a8f' : '#64748b',
                    fontWeight: '700',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                >
                  <User size={16} /> Targeted Customer
                </button>
              </div>
            </div>

            {targetType === 'specific' && (
              <div className="form-group">
                <label className="form-label">Select Customer</label>
                <select
                  className="form-control"
                  value={targetUserId}
                  onChange={(e) => setTargetUserId(e.target.value)}
                >
                  {users.map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.name} ({u.email})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-control"
                value={notifType}
                onChange={(e) => setNotifType(e.target.value)}
              >
                <option value="system">Bank Announcement / General Notice</option>
                <option value="security">Security Advisory / Fraud Caution</option>
                <option value="loan">Special Loan Campaign / Pre-Approved Credit</option>
                <option value="card">Card Benefit Updates</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Announcement Title</label>
              <input
                type="text"
                required
                className="form-control"
                placeholder="e.g. Scheduled Core Banking System Maintenance"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Announcement Message Body</label>
              <textarea
                required
                rows={4}
                className="form-control"
                placeholder="Enter complete message for customer notification popups..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={sending}
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px', marginTop: '10px' }}
            >
              <Megaphone size={16} />
              <span>{sending ? 'Dispatching...' : 'Publish Announcement'}</span>
            </button>
          </form>
        </div>

        {/* Quick Templates Box */}
        <div style={{ background: '#ffffff', borderRadius: '20px', padding: '32px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a', marginBottom: '16px' }}>
            Quick Announcement Templates
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div
              onClick={() => {
                setTitle('Festival Home Loan Interest Rate Slash to 8.25%');
                setMessage('SecureBank announces zero processing fee and special 8.25% p.a. interest rates for festive season applicants.');
                setNotifType('loan');
              }}
              style={{ padding: '14px', borderRadius: '10px', background: '#f8fafc', border: '1px solid var(--border-light)', cursor: 'pointer' }}
            >
              <div style={{ fontWeight: '700', fontSize: '0.875rem', color: '#1c2a8f' }}>🎉 Festive Home Loan Offer</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>Interest rates slashed to 8.25% with zero processing fee.</div>
            </div>

            <div
              onClick={() => {
                setTitle('Important Security Advisory: Never Share OTP or T-PIN');
                setMessage('SecureBank never asks for your 4-digit T-PIN, OTP, or CVV. Please do not click on unverified SMS or email links.');
                setNotifType('security');
              }}
              style={{ padding: '14px', borderRadius: '10px', background: '#f8fafc', border: '1px solid var(--border-light)', cursor: 'pointer' }}
            >
              <div style={{ fontWeight: '700', fontSize: '0.875rem', color: '#dc2626' }}>🛡️ Safe Banking & Fraud Prevention</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>Cautioning customers regarding unauthorized OTP/PIN disclosures.</div>
            </div>

            <div
              onClick={() => {
                setTitle('Weekend Scheduled NetBanking Maintenance Window');
                setMessage('NetBanking and UPI services will undergo scheduled routine maintenance on Sunday from 02:00 AM to 03:30 AM IST.');
                setNotifType('system');
              }}
              style={{ padding: '14px', borderRadius: '10px', background: '#f8fafc', border: '1px solid var(--border-light)', cursor: 'pointer' }}
            >
              <div style={{ fontWeight: '700', fontSize: '0.875rem', color: '#0284c7' }}>⚙️ Routine Server Maintenance</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>Inform customers about Sunday maintenance schedule.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
