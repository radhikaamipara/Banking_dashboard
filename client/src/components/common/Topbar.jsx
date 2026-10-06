import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import {
  Bell,
  Search,
  LogOut,
  User,
  ShieldCheck,
  CheckCircle2,
  Menu,
  ChevronDown,
  Building2,
  Clock,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const Topbar = ({ title = 'Banking Dashboard', toggleSidebar }) => {
  const { user, primaryAccount, logout, isAdmin } = useAuth();
  const { notifications, unreadCount, markRead, markAllRead } = useNotification();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const notifRef = useRef(null);
  const userRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
      if (userRef.current && !userRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header
      style={{
        background: '#ffffff',
        borderBottom: '1px solid var(--border-light)',
        padding: '14px 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 80,
      }}
    >
      {/* Left side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          onClick={toggleSidebar}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '6px',
            borderRadius: '6px',
            color: '#475569',
            display: 'flex',
            alignItems: 'center',
          }}
          title="Toggle Navigation"
        >
          <Menu size={22} />
        </button>

        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a' }}>{title}</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.775rem', color: '#64748b' }}>
            <Building2 size={13} />
            <span>Branch: {primaryAccount?.branch || 'Nariman Point, Mumbai (SecureBankN0001234)'}</span>
            <span>•</span>
            <span style={{ color: '#10b981', fontWeight: '600' }}>● System Live</span>
          </div>
        </div>
      </div>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
        {/* Notifications */}
        <div style={{ position: 'relative' }} ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            style={{
              position: 'relative',
              background: '#f1f5f9',
              border: 'none',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#334155',
              transition: 'var(--transition)',
            }}
          >
            <Bell size={19} />
            {unreadCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-2px',
                  right: '-2px',
                  background: '#ef4444',
                  color: '#ffffff',
                  fontSize: '0.7rem',
                  fontWeight: '800',
                  width: '19px',
                  height: '19px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid #ffffff',
                }}
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div
              style={{
                position: 'absolute',
                top: '50px',
                right: 0,
                width: '360px',
                background: '#ffffff',
                borderRadius: '14px',
                boxShadow: '0 15px 35px rgba(15, 23, 42, 0.15)',
                border: '1px solid var(--border-light)',
                overflow: 'hidden',
                zIndex: 100,
                animation: 'fadeIn 0.2s ease-out',
              }}
            >
              <div
                style={{
                  padding: '14px 18px',
                  borderBottom: '1px solid var(--border-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: '#f8fafc',
                }}
              >
                <div style={{ fontWeight: '700', fontSize: '0.925rem', color: '#0f172a' }}>
                  Notifications ({unreadCount} unread)
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#00a4e4',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                    }}
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div style={{ maxHeight: '340px', overflowY: 'auto' }}>
                {notifications.length === 0 ? (
                  <div style={{ padding: '30px 20px', textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem' }}>
                    No notifications yet
                  </div>
                ) : (
                  notifications.slice(0, 10).map((n) => {
                    const isUnread = !n.isRead && !n.readBy?.includes(user?.id || user?._id);
                    return (
                      <div
                        key={n._id}
                        onClick={() => markRead(n._id)}
                        style={{
                          padding: '12px 18px',
                          borderBottom: '1px solid #f1f5f9',
                          cursor: 'pointer',
                          background: isUnread ? '#f0fdf4' : '#ffffff',
                          transition: 'var(--transition)',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3px' }}>
                          <span style={{ fontWeight: '700', fontSize: '0.825rem', color: isUnread ? '#1c2a8f' : '#334155' }}>
                            {n.title}
                          </span>
                          <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                            {new Date(n.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                        <p style={{ fontSize: '0.775rem', color: '#64748b', margin: 0, lineHeight: '1.4' }}>
                          {n.message}
                        </p>
                      </div>
                    );
                  })
                )}
              </div>

              <div style={{ padding: '10px', textAlign: 'center', background: '#f8fafc', borderTop: '1px solid #f1f5f9' }}>
                <Link
                  to={isAdmin ? '/admin/dashboard' : '/user/notifications'}
                  onClick={() => setShowNotifications(false)}
                  style={{ fontSize: '0.8rem', color: '#1c2a8f', fontWeight: '700' }}
                >
                  View All Notifications →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Pill & Dropdown */}
        <div style={{ position: 'relative' }} ref={userRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            style={{
              background: '#f8fafc',
              border: '1px solid var(--border-light)',
              borderRadius: '999px',
              padding: '4px 14px 4px 6px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer',
            }}
          >
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
              alt={user?.name}
              style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover' }}
            />
            <div style={{ textAlign: 'left', lineHeight: '1.2' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#0f172a' }}>{user?.name || 'Customer'}</div>
              <div style={{ fontSize: '0.72rem', color: isAdmin ? '#6a1b9a' : '#00a4e4', fontWeight: '700' }}>
                {isAdmin ? 'ADMINISTRATOR' : `A/C ...${primaryAccount?.accountNumber?.slice(-4) || 'SecureBank'}`}
              </div>
            </div>
            <ChevronDown size={14} color="#64748b" />
          </button>

          {/* User Menu Dropdown */}
          {showUserMenu && (
            <div
              style={{
                position: 'absolute',
                top: '50px',
                right: 0,
                width: '240px',
                background: '#ffffff',
                borderRadius: '14px',
                boxShadow: '0 15px 35px rgba(15, 23, 42, 0.15)',
                border: '1px solid var(--border-light)',
                padding: '8px 0',
                zIndex: 100,
                animation: 'fadeIn 0.2s ease-out',
              }}
            >
              <div style={{ padding: '12px 18px', borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: '700', color: '#0f172a' }}>{user?.name}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{user?.email}</div>
                <div style={{ marginTop: '6px' }}>
                  <span className={`badge ${user?.kycStatus === 'verified' ? 'badge-success' : 'badge-warning'}`}>
                    KYC: {user?.kycStatus?.toUpperCase() || 'PENDING'}
                  </span>
                </div>
              </div>

              {!isAdmin && (
                <>
                  <Link
                    to="/user/profile"
                    onClick={() => setShowUserMenu(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 18px',
                      fontSize: '0.85rem',
                      color: '#334155',
                    }}
                  >
                    <User size={16} /> My Profile & KYC
                  </Link>
                  <Link
                    to="/user/accounts"
                    onClick={() => setShowUserMenu(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 18px',
                      fontSize: '0.85rem',
                      color: '#334155',
                    }}
                  >
                    <Building2 size={16} /> Account Statements
                  </Link>
                </>
              )}

              {isAdmin ? (
                <>
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setShowUserMenu(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 18px',
                      fontSize: '0.85rem',
                      color: '#6a1b9a',
                      fontWeight: '700',
                    }}
                  >
                    <ShieldCheck size={16} /> Bank Admin Portal
                  </Link>
                  <Link
                    to="/user/dashboard"
                    onClick={() => setShowUserMenu(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 18px',
                      fontSize: '0.85rem',
                      color: '#0284c7',
                      fontWeight: '700',
                    }}
                  >
                    <Building2 size={16} /> Retail Customer View
                  </Link>
                </>
              ) : (
                <Link
                  to="/admin/dashboard"
                  onClick={() => setShowUserMenu(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 18px',
                    fontSize: '0.85rem',
                    color: '#6a1b9a',
                    fontWeight: '700',
                  }}
                >
                  <ShieldCheck size={16} /> Switch to Admin Console
                </Link>
              )}

              <div style={{ borderTop: '1px solid #f1f5f9', marginTop: '4px', paddingTop: '4px' }}>
                <button
                  onClick={handleLogout}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 18px',
                    fontSize: '0.85rem',
                    color: '#ef4444',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontWeight: '600',
                  }}
                >
                  <LogOut size={16} /> Secure Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
