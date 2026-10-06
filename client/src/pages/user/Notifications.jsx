import React, { useState } from 'react';
import { useNotification } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';
import {
  Bell,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  Banknote,
  ShieldCheck,
  Megaphone,
  Clock,
} from 'lucide-react';

export const Notifications = () => {
  const { notifications, unreadCount, markRead, markAllRead } = useNotification();
  const { user } = useAuth();
  const [filter, setFilter] = useState('all'); // 'all' | 'unread'

  const filtered = notifications.filter((n) => {
    const isUnread = !n.isRead && !n.readBy?.includes(user?.id || user?._id);
    if (filter === 'unread') return isUnread;
    return true;
  });

  const getIcon = (type) => {
    if (type === 'transaction') return <CheckCircle2 size={20} color="#10b981" />;
    if (type === 'loan') return <Banknote size={20} color="#00a4e4" />;
    if (type === 'card') return <CreditCard size={20} color="#6a1b9a" />;
    if (type === 'security') return <ShieldCheck size={20} color="#ef4444" />;
    return <Megaphone size={20} color="#f5a623" />;
  };

  return (
    <div className="page-body">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0f172a' }}>Notifications & Alerts</h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
            Direct banking alerts, security notifications and bank announcements ({unreadCount} unread)
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ display: 'flex', background: '#e2e8f0', padding: '3px', borderRadius: '8px' }}>
            <button
              onClick={() => setFilter('all')}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: 'none',
                background: filter === 'all' ? '#ffffff' : 'transparent',
                fontWeight: '700',
                fontSize: '0.8rem',
                cursor: 'pointer',
              }}
            >
              All Alerts
            </button>
            <button
              onClick={() => setFilter('unread')}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: 'none',
                background: filter === 'unread' ? '#ffffff' : 'transparent',
                fontWeight: '700',
                fontSize: '0.8rem',
                cursor: 'pointer',
              }}
            >
              Unread ({unreadCount})
            </button>
          </div>

          {unreadCount > 0 && (
            <button onClick={markAllRead} className="btn btn-secondary btn-sm">
              Mark All as Read
            </button>
          )}
        </div>
      </div>

      <div style={{ background: '#ffffff', borderRadius: '20px', border: '1px solid var(--border-light)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
        {filtered.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>
            <Bell size={40} style={{ margin: '0 auto 12px auto', opacity: 0.5 }} />
            <h4>No notifications found</h4>
          </div>
        ) : (
          filtered.map((n) => {
            const isUnread = !n.isRead && !n.readBy?.includes(user?.id || user?._id);
            return (
              <div
                key={n._id}
                onClick={() => markRead(n._id)}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '16px',
                  padding: '18px 24px',
                  borderBottom: '1px solid #f1f5f9',
                  background: isUnread ? '#f0fdf4' : '#ffffff',
                  cursor: 'pointer',
                  transition: 'var(--transition)',
                }}
              >
                <div style={{ marginTop: '2px' }}>{getIcon(n.type)}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontWeight: '700', fontSize: '0.925rem', color: isUnread ? '#1c2a8f' : '#1e293b' }}>
                      {n.title}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                      {new Date(n.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0, lineHeight: '1.5' }}>
                    {n.message}
                  </p>
                </div>
                {isUnread && (
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', marginTop: '6px' }} />
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
