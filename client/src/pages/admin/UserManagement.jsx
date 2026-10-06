import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import { useNotification } from '../../context/NotificationContext';
import {
  Users,
  Search,
  Filter,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Eye,
  Lock,
  Unlock,
  Building,
  CreditCard,
  Banknote,
  X,
} from 'lucide-react';

export const UserManagement = () => {
  const { showToast } = useNotification();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [kycFilter, setKycFilter] = useState('all');

  // Deep dive modal
  const [selectedUser, setSelectedUser] = useState(null);
  const [deepDiveData, setDeepDiveData] = useState(null);
  const [loadingDeepDive, setLoadingDeepDive] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await api.getAdminUsers({
        search,
        status: statusFilter,
        kycStatus: kycFilter,
      });
      setUsers(data.users || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [statusFilter, kycFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleToggleStatus = async (user) => {
    const newStatus = user.status === 'blocked' ? 'active' : 'blocked';
    const confirm = window.confirm(`Are you sure you want to change ${user.name}'s status to ${newStatus}?`);
    if (!confirm) return;

    try {
      await api.updateUserStatus(user._id, newStatus);
      showToast(`User status updated to ${newStatus}`, 'info');
      fetchUsers();
    } catch (err) {
      alert(err.message || 'Failed to update user status');
    }
  };

  const handleUpdateKyc = async (user, kycStatus) => {
    try {
      await api.updateUserKyc(user._id, { kycStatus });
      showToast(`KYC status for ${user.name} set to ${kycStatus}`, 'success');
      fetchUsers();
      if (deepDiveData) {
        setDeepDiveData((prev) => ({ ...prev, user: { ...prev.user, kycStatus } }));
      }
    } catch (err) {
      alert(err.message || 'Failed to update KYC');
    }
  };

  const openDeepDive = async (user) => {
    setSelectedUser(user);
    setLoadingDeepDive(true);
    try {
      const data = await api.getUserDeepDive(user._id);
      setDeepDiveData(data);
    } catch (err) {
      alert('Failed to load user records');
    } finally {
      setLoadingDeepDive(false);
    }
  };

  return (
    <div className="page-body">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0f172a' }}>Customer Account Management</h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
            Inspect registered customer profiles, approve/reject KYC compliance, and govern access permissions ({users.length} customers)
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '18px 24px',
          border: '1px solid var(--border-light)',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '240px' }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Search by customer name, email, phone number..."
              style={{ paddingLeft: '38px', fontSize: '0.85rem' }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          </div>
          <button type="submit" className="btn btn-secondary btn-sm" style={{ padding: '9px 14px' }}>
            Filter
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <select
            className="form-control"
            style={{ width: 'auto', padding: '8px 12px', fontSize: '0.85rem' }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Access Statuses</option>
            <option value="active">Active Accounts</option>
            <option value="blocked">Blocked / Restricted</option>
          </select>

          <select
            className="form-control"
            style={{ width: 'auto', padding: '8px 12px', fontSize: '0.85rem' }}
            value={kycFilter}
            onChange={(e) => setKycFilter(e.target.value)}
          >
            <option value="all">All KYC Statuses</option>
            <option value="verified">KYC Verified</option>
            <option value="pending">KYC Pending</option>
            <option value="rejected">KYC Rejected</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="data-table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Primary Account</th>
              <th>Total Balance</th>
              <th>Accounts / Cards</th>
              <th>KYC Status</th>
              <th>Account Status</th>
              <th>Admin Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                  Loading customer database...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                  No customer records found.
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img
                        src={u.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                        alt=""
                        style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontWeight: '700', color: '#1e293b' }}>{u.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{u.email} • {u.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontFamily: 'monospace', fontWeight: '700', fontSize: '0.85rem' }}>
                      {u.primaryAccount ? u.primaryAccount.accountNumber : 'None'}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                      {u.primaryAccount?.branch || 'Branch'}
                    </div>
                  </td>
                  <td>
                    <strong style={{ fontSize: '1rem', color: '#1c2a8f' }}>
                      ₹{u.totalBalance?.toLocaleString('en-IN') || 0}
                    </strong>
                  </td>
                  <td style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    {u.accountsCount} Accounts • {u.cardsCount} Cards • {u.loansCount} Loans
                  </td>
                  <td>
                    <span className={`badge ${u.kycStatus === 'verified' ? 'badge-success' : u.kycStatus === 'pending' ? 'badge-warning' : 'badge-danger'}`}>
                      {u.kycStatus?.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${u.status === 'active' ? 'badge-success' : 'badge-danger'}`}>
                      {u.status?.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <button
                        onClick={() => openDeepDive(u)}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '5px 10px', fontSize: '0.75rem' }}
                        title="View Full Profile & Passbook"
                      >
                        <Eye size={14} /> View
                      </button>

                      <button
                        onClick={() => handleToggleStatus(u)}
                        className={`btn btn-sm ${u.status === 'active' ? 'btn-danger' : 'btn-primary'}`}
                        style={{ padding: '5px 10px', fontSize: '0.75rem' }}
                        title={u.status === 'active' ? 'Block Access' : 'Unblock Access'}
                      >
                        {u.status === 'active' ? <Lock size={14} /> : <Unlock size={14} />}
                      </button>

                      {u.kycStatus === 'pending' && (
                        <button
                          onClick={() => handleUpdateKyc(u, 'verified')}
                          className="btn btn-sm"
                          style={{ background: '#10b981', color: '#ffffff', padding: '5px 10px', fontSize: '0.75rem' }}
                          title="Approve KYC"
                        >
                          <CheckCircle2 size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Customer Deep Dive Modal */}
      {selectedUser && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '780px', padding: '32px' }}>
            <button
              onClick={() => {
                setSelectedUser(null);
                setDeepDiveData(null);
              }}
              style={{
                position: 'absolute',
                top: '18px',
                right: '18px',
                background: '#f1f5f9',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <X size={16} />
            </button>

            {loadingDeepDive ? (
              <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>
                Fetching customer banking records...
              </div>
            ) : deepDiveData ? (
              <div>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', borderBottom: '1px solid var(--border-light)', paddingBottom: '18px' }}>
                  <img
                    src={deepDiveData.user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                    alt=""
                    style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a' }}>
                        {deepDiveData.user?.name}
                      </h3>
                      <span className={`badge ${deepDiveData.user?.kycStatus === 'verified' ? 'badge-success' : 'badge-warning'}`}>
                        KYC: {deepDiveData.user?.kycStatus?.toUpperCase()}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.825rem', color: '#64748b' }}>
                      {deepDiveData.user?.email} • {deepDiveData.user?.phone} • Joined {new Date(deepDiveData.user?.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  {/* KYC Approval Action Buttons */}
                  {deepDiveData.user?.kycStatus === 'pending' && (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => handleUpdateKyc(deepDiveData.user, 'verified')}
                        className="btn btn-sm"
                        style={{ background: '#10b981', color: '#ffffff' }}
                      >
                        Approve KYC
                      </button>
                      <button
                        onClick={() => handleUpdateKyc(deepDiveData.user, 'rejected')}
                        className="btn btn-sm btn-danger"
                      >
                        Reject KYC
                      </button>
                    </div>
                  )}
                </div>

                {/* KYC Identity Verification Box */}
                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', marginBottom: '24px' }}>
                  <div style={{ fontWeight: '700', fontSize: '0.85rem', color: '#1c2a8f', marginBottom: '8px' }}>
                    KYC Documentation & Address
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', fontSize: '0.8rem', color: '#475569' }}>
                    <div>PAN: <strong>{deepDiveData.user?.kycDetails?.panNumber || 'Not submitted'}</strong></div>
                    <div>Aadhaar: <strong>{deepDiveData.user?.kycDetails?.aadharMasked || 'Not submitted'}</strong></div>
                    <div>City: <strong>{deepDiveData.user?.kycDetails?.city}, {deepDiveData.user?.kycDetails?.state}</strong></div>
                    <div>Address: <strong>{deepDiveData.user?.kycDetails?.address || 'N/A'}</strong></div>
                  </div>
                </div>

                {/* Linked Accounts */}
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ fontWeight: '700', fontSize: '0.95rem', color: '#0f172a', marginBottom: '10px' }}>
                    Linked Deposit Accounts ({deepDiveData.accounts?.length || 0})
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                    {deepDiveData.accounts?.map((acc) => (
                      <div key={acc._id} style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-light)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b' }}>
                          <span>{acc.accountType}</span>
                          <span style={{ color: acc.status === 'active' ? '#10b981' : '#ef4444', fontWeight: '700' }}>
                            {acc.status?.toUpperCase()}
                          </span>
                        </div>
                        <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1c2a8f', margin: '4px 0' }}>
                          ₹{acc.balance.toLocaleString('en-IN')}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#475569', fontFamily: 'monospace' }}>
                          A/C: {acc.accountNumber}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Transactions Feed */}
                <div>
                  <div style={{ fontWeight: '700', fontSize: '0.95rem', color: '#0f172a', marginBottom: '10px' }}>
                    Recent Transactions
                  </div>
                  <div style={{ maxHeight: '180px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {deepDiveData.recentTransactions?.map((t) => (
                      <div key={t._id} style={{ padding: '10px 14px', background: '#f8fafc', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                        <div>
                          <strong>{t.remarks || t.type}</strong>
                          <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                            {new Date(t.createdAt).toLocaleDateString()} • Ref: {t.referenceId}
                          </div>
                        </div>
                        <div style={{ fontWeight: '800', color: t.direction === 'debit' ? '#ef4444' : '#10b981' }}>
                          {t.direction === 'debit' ? '-' : '+'}₹{t.amount.toLocaleString('en-IN')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};
