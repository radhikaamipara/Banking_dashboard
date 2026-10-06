import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Wallet,
  ArrowLeftRight,
  ReceiptText,
  CreditCard,
  Banknote,
  Bell,
  User,
  ShieldCheck,
  Users,
  Building2,
  FileCheck2,
  Megaphone,
  MessageSquareText,
  LogOut,
  Landmark,
  Layers,
} from 'lucide-react';

export const Sidebar = ({ isOpen, closeSidebar, role }) => {
  const { user, isAdmin, logout } = useAuth();

  const userNavItems = [
    { to: '/user/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/user/accounts', icon: Wallet, label: 'My Accounts' },
    { to: '/user/transfer', icon: ArrowLeftRight, label: 'Transfer Money' },
    { to: '/user/transactions', icon: ReceiptText, label: 'Transactions' },
    { to: '/user/cards', icon: CreditCard, label: 'Cards & Controls' },
    { to: '/user/loans', icon: Banknote, label: 'Loans & EMI' },
    { to: '/user/notifications', icon: Bell, label: 'Notifications' },
    { to: '/user/profile', icon: User, label: 'Profile & KYC' },
  ];

  const adminNavItems = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Admin Overview' },
    { to: '/admin/users', icon: Users, label: 'Customer Accounts' },
    { to: '/admin/accounts', icon: Building2, label: 'Bank Ledger & Accounts' },
    { to: '/admin/transactions', icon: ReceiptText, label: 'Live Transactions' },
    { to: '/admin/loans', icon: FileCheck2, label: 'Loan Underwriting' },
    { to: '/admin/cards', icon: CreditCard, label: 'Card Governance' },
    { to: '/admin/broadcast', icon: Megaphone, label: 'System Broadcasts' },
    { to: '/admin/inquiries', icon: MessageSquareText, label: 'Customer Inquiries' },
  ];

  const isCurrentAdmin = role === 'admin' || (role !== 'user' && isAdmin);
  const navItems = isCurrentAdmin ? adminNavItems : userNavItems;

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={closeSidebar}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 95,
            display: 'block',
          }}
        />
      )}

      <aside
        style={{
          width: '260px',
          background: isCurrentAdmin ? 'linear-gradient(180deg, #18082e 0%, #0d1233 100%)' : 'linear-gradient(180deg, #111640 0%, #0a0e29 100%)',
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
          borderRight: '1px solid rgba(255, 255, 255, 0.08)',
          position: 'sticky',
          top: 0,
          height: '100vh',
          zIndex: 98,
          transition: 'transform 0.3s ease',
        }}
      >
        {/* Brand Banner */}
        <div style={{ padding: '24px 22px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: isCurrentAdmin
                  ? 'linear-gradient(135deg, #6a1b9a 0%, #00a4e4 100%)'
                  : 'linear-gradient(135deg, #1c2a8f 0%, #00a4e4 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0, 164, 228, 0.4)',
              }}
            >
              {isCurrentAdmin ? <ShieldCheck size={22} color="#ffffff" /> : <Landmark size={22} color="#ffffff" />}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: '800', letterSpacing: '-0.02em', color: '#ffffff' }}>
                  SecureBank
                </span>
                <span style={{ fontSize: '1.25rem', fontWeight: '800', color: '#00a4e4' }}>
                  
                </span>
              </div>
              <div
                style={{
                  fontSize: '0.65rem',
                  fontWeight: '700',
                  color: isCurrentAdmin ? '#d8b4fe' : '#94a3b8',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                {isCurrentAdmin ? 'ADMIN CONSOLE' : 'DIGITAL BANKING'}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto' }}>
          <div style={{ fontSize: '0.68rem', fontWeight: '700', color: '#64748b', padding: '6px 12px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {isAdmin ? 'Management Modules' : 'Banking Services'}
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={closeSidebar}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '11px 14px',
                  borderRadius: '10px',
                  fontSize: '0.875rem',
                  fontWeight: isActive ? '700' : '500',
                  color: isActive ? '#ffffff' : '#94a3b8',
                  background: isActive
                    ? isAdmin
                      ? 'linear-gradient(90deg, #6a1b9a 0%, #3b0d5c 100%)'
                      : 'linear-gradient(90deg, #1c2a8f 0%, #2435b0 100%)'
                    : 'transparent',
                  borderLeft: isActive ? '3px solid #00a4e4' : '3px solid transparent',
                  transition: 'var(--transition)',
                })}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom User Card & Quick Logout */}
        <div style={{ padding: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', background: 'rgba(0, 0, 0, 0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                alt=""
                style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <div style={{ overflow: 'hidden', lineHeight: '1.2' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#ffffff', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                  {user?.name || 'Customer'}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                  {isAdmin ? 'System Admin' : 'Retail Customer'}
                </div>
              </div>
            </div>

            <button
              onClick={logout}
              style={{
                background: 'rgba(239, 68, 68, 0.15)',
                border: 'none',
                color: '#ef4444',
                padding: '6px',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>

          <div style={{ marginBottom: '10px' }}>
            {isCurrentAdmin ? (
              <a
                href="/login?tab=customer"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  background: 'rgba(0, 164, 228, 0.15)',
                  border: '1px solid rgba(0, 164, 228, 0.3)',
                  color: '#38bdf8',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  textDecoration: 'none',
                  transition: 'var(--transition)',
                }}
              >
                <Landmark size={14} />
                <span>Open Customer Panel (New Tab) ↗</span>
              </a>
            ) : (
              <a
                href="/login?tab=admin"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  background: 'rgba(168, 85, 247, 0.15)',
                  border: '1px solid rgba(168, 85, 247, 0.3)',
                  color: '#d8b4fe',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  textDecoration: 'none',
                  transition: 'var(--transition)',
                }}
              >
                <ShieldCheck size={14} />
                <span>Open Admin Portal (New Tab) ↗</span>
              </a>
            )}
          </div>

          <div style={{ fontSize: '0.68rem', color: '#64748b', textAlign: 'center' }}>
            SecureBank • SecureBank v2.4
          </div>
        </div>
      </aside>
    </>
  );
};
