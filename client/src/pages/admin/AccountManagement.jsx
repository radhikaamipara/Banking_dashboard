import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import { useNotification } from '../../context/NotificationContext';
import {
  Building2,
  Search,
  Filter,
  Lock,
  Unlock,
  DollarSign,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle2,
  X,
  PlusCircle,
  MinusCircle,
} from 'lucide-react';

export const AccountManagement = () => {
  const { showToast } = useNotification();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Adjustment Modal
  const [adjustAcc, setAdjustAcc] = useState(null);
  const [adjustType, setAdjustType] = useState('credit');
  const [adjustAmount, setAdjustAmount] = useState('5000');
  const [adjustRemarks, setAdjustRemarks] = useState('Quarterly interest subsidy credit');
  const [submittingAdj, setSubmittingAdj] = useState(false);

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const data = await api.getAdminAccounts({
        search,
        accountType: typeFilter,
        status: statusFilter,
      });
      setAccounts(data.accounts || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, [typeFilter, statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchAccounts();
  };

  const handleToggleFreeze = async (acc) => {
    const newStatus = acc.status === 'frozen' ? 'active' : 'frozen';
    const confirm = window.confirm(`Change status of account #${acc.accountNumber} to ${newStatus}?`);
    if (!confirm) return;

    try {
      await api.toggleAccountFreeze(acc._id);
      showToast(`Account #${acc.accountNumber.slice(-4)} marked as ${newStatus}`, 'info');
      fetchAccounts();
    } catch (err) {
      alert(err.message || 'Failed to update account status');
    }
  };

  const handleAdjustBalance = async (e) => {
    e.preventDefault();
    setSubmittingAdj(true);
    try {
      await api.adjustAccountBalance(adjustAcc._id, {
        type: adjustType,
        amount: Number(adjustAmount),
        remarks: adjustRemarks,
      });
      showToast(`Successfully processed ${adjustType} of ₹${adjustAmount}`, 'success');
      setAdjustAcc(null);
      fetchAccounts();
    } catch (err) {
      alert(err.message || 'Adjustment failed');
    } finally {
      setSubmittingAdj(false);
    }
  };

  return (
    <div className="page-body">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0f172a' }}>Bank Accounts Master Ledger</h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
            Inspect, freeze, and manually adjust balances for all customer accounts across branches ({accounts.length} total)
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
              placeholder="Search by account number, customer name, branch..."
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
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="all">All Account Types</option>
            <option value="Savings">Savings</option>
            <option value="Fixed Deposit">Fixed Deposit</option>
            <option value="Current">Current</option>
          </select>

          <select
            className="form-control"
            style={{ width: 'auto', padding: '8px 12px', fontSize: '0.85rem' }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Operational Statuses</option>
            <option value="active">Active Accounts</option>
            <option value="frozen">Frozen Accounts</option>
          </select>
        </div>
      </div>

      {/* Accounts Table */}
      <div className="data-table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Account Number</th>
              <th>Account Holder</th>
              <th>Type</th>
              <th>Available Balance</th>
              <th>Branch / IFSC</th>
              <th>Status</th>
              <th>Admin Controls</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                  Loading bank master ledger...
                </td>
              </tr>
            ) : accounts.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                  No accounts found.
                </td>
              </tr>
            ) : (
              accounts.map((acc) => (
                <tr key={acc._id}>
                  <td>
                    <div style={{ fontFamily: 'monospace', fontWeight: '800', fontSize: '0.9rem', color: '#1c2a8f' }}>
                      {acc.accountNumber}
                    </div>
                    {acc.isPrimary && (
                      <span className="badge badge-success" style={{ fontSize: '0.62rem', padding: '1px 5px' }}>
                        PRIMARY
                      </span>
                    )}
                  </td>
                  <td>
                    <div style={{ fontWeight: '700', color: '#1e293b' }}>{acc.userId?.name || 'Customer'}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{acc.userId?.email}</div>
                  </td>
                  <td>
                    <span className="badge badge-primary">{acc.accountType}</span>
                  </td>
                  <td>
                    <div style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a' }}>
                      ₹{acc.balance.toLocaleString('en-IN')}.00
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Rate: {acc.interestRate}% p.a.</div>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.8rem', fontWeight: '600' }}>{acc.branch}</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', fontFamily: 'monospace' }}>{acc.ifscCode}</div>
                  </td>
                  <td>
                    <span className={`badge ${acc.status === 'active' ? 'badge-success' : 'badge-danger'}`}>
                      {acc.status?.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        onClick={() => handleToggleFreeze(acc)}
                        className={`btn btn-sm ${acc.status === 'active' ? 'btn-secondary' : 'btn-primary'}`}
                        style={{ padding: '5px 10px', fontSize: '0.75rem' }}
                        title={acc.status === 'active' ? 'Freeze Account' : 'Unfreeze Account'}
                      >
                        {acc.status === 'active' ? <Lock size={13} /> : <Unlock size={13} />}
                        <span>{acc.status === 'active' ? 'Freeze' : 'Unfreeze'}</span>
                      </button>

                      <button
                        onClick={() => setAdjustAcc(acc)}
                        className="btn btn-sm btn-cyan"
                        style={{ padding: '5px 10px', fontSize: '0.75rem' }}
                        title="Manual Balance Adjustment"
                      >
                        <DollarSign size={13} /> Adjust
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Manual Balance Adjustment Modal */}
      {adjustAcc && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ padding: '30px' }}>
            <button
              onClick={() => setAdjustAcc(null)}
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

            <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '6px' }}>
              Administrative Balance Adjustment
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '20px' }}>
              Adjust balance for <strong>{adjustAcc.userId?.name}</strong> (A/C: {adjustAcc.accountNumber}). Current balance: <strong>₹{adjustAcc.balance.toLocaleString('en-IN')}</strong>
            </p>

            <form onSubmit={handleAdjustBalance}>
              <div className="form-group">
                <label className="form-label">Adjustment Direction</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setAdjustType('credit')}
                    style={{
                      padding: '10px',
                      borderRadius: '8px',
                      border: adjustType === 'credit' ? '2px solid #10b981' : '1px solid var(--border-light)',
                      background: adjustType === 'credit' ? '#ecfdf5' : '#ffffff',
                      color: adjustType === 'credit' ? '#065f46' : '#64748b',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                    }}
                  >
                    <PlusCircle size={16} /> Credit (+)
                  </button>

                  <button
                    type="button"
                    onClick={() => setAdjustType('debit')}
                    style={{
                      padding: '10px',
                      borderRadius: '8px',
                      border: adjustType === 'debit' ? '2px solid #ef4444' : '1px solid var(--border-light)',
                      background: adjustType === 'debit' ? '#fef2f2' : '#ffffff',
                      color: adjustType === 'debit' ? '#991b1b' : '#64748b',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                    }}
                  >
                    <MinusCircle size={16} /> Debit (-)
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Adjustment Amount (INR)</label>
                <input
                  type="number"
                  min="1"
                  required
                  className="form-control"
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Audit Reason / Remarks</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder="e.g. Quarterly interest bonus, Service fee reversal, Compliance audit"
                  value={adjustRemarks}
                  onChange={(e) => setAdjustRemarks(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button type="button" onClick={() => setAdjustAcc(null)} className="btn btn-secondary" style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" disabled={submittingAdj} className="btn btn-primary" style={{ flex: 1 }}>
                  {submittingAdj ? 'Processing...' : 'Execute Adjustment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
