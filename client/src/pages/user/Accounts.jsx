import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import { useNotification } from '../../context/NotificationContext';
import {
  Wallet,
  PlusCircle,
  Download,
  Printer,
  CheckCircle2,
  AlertCircle,
  Building2,
  Calendar,
  Filter,
  FileSpreadsheet,
} from 'lucide-react';

export const Accounts = () => {
  const { showToast } = useNotification();
  const [accounts, setAccounts] = useState([]);
  const [selectedAcc, setSelectedAcc] = useState(null);
  const [statement, setStatement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showOpenModal, setShowOpenModal] = useState(false);

  // Open new account form
  const [newAccType, setNewAccType] = useState('Fixed Deposit');
  const [initialDeposit, setInitialDeposit] = useState(50000);
  const [nomineeName, setNomineeName] = useState('');
  const [opening, setOpening] = useState(false);

  // Statement Filters
  const [filterType, setFilterType] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchAccounts = async () => {
    try {
      const data = await api.getMyAccounts();
      setAccounts(data.accounts || []);
      if (data.accounts?.length > 0 && !selectedAcc) {
        setSelectedAcc(data.accounts[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  // Fetch statement when selected account changes
  useEffect(() => {
    if (!selectedAcc) return;
    const fetchStatement = async () => {
      try {
        const data = await api.getStatement(selectedAcc._id, {
          type: filterType,
          startDate,
          endDate,
        });
        setStatement(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStatement();
  }, [selectedAcc, filterType, startDate, endDate]);

  const handleOpenAccount = async (e) => {
    e.preventDefault();
    setOpening(true);
    try {
      await api.openAccount({
        accountType: newAccType,
        initialDeposit,
        nomineeName: nomineeName || 'Family Member',
      });
      showToast(`New ${newAccType} account opened successfully!`, 'success');
      setShowOpenModal(false);
      fetchAccounts();
    } catch (err) {
      alert(err.message || 'Failed to open account');
    } finally {
      setOpening(false);
    }
  };

  const handlePrintStatement = () => {
    window.print();
  };

  return (
    <div className="page-body">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0f172a' }}>My Bank Accounts</h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Manage your Savings, Current & Fixed Deposit accounts</p>
        </div>
        <button onClick={() => setShowOpenModal(true)} className="btn btn-primary">
          <PlusCircle size={18} /> Open New Account / FD
        </button>
      </div>

      {/* Account Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        {accounts.map((acc) => {
          const isSelected = selectedAcc?._id === acc._id;
          return (
            <div
              key={acc._id}
              onClick={() => setSelectedAcc(acc)}
              style={{
                background: isSelected ? 'linear-gradient(135deg, #1c2a8f 0%, #0a3d91 100%)' : '#ffffff',
                color: isSelected ? '#ffffff' : '#1e293b',
                borderRadius: '16px',
                padding: '24px',
                border: isSelected ? '2px solid #00a4e4' : '1px solid var(--border-light)',
                boxShadow: isSelected ? '0 10px 25px rgba(28, 42, 143, 0.2)' : 'var(--shadow-sm)',
                cursor: 'pointer',
                transition: 'var(--transition)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <span className={`badge ${isSelected ? 'badge-cyan' : 'badge-primary'}`}>
                  {acc.accountType}
                </span>
                {acc.isPrimary && (
                  <span style={{ fontSize: '0.68rem', fontWeight: '700', color: isSelected ? '#38bdf8' : '#10b981' }}>
                    ● PRIMARY
                  </span>
                )}
              </div>

              <div style={{ fontSize: '0.78rem', opacity: 0.8, textTransform: 'uppercase' }}>Available Balance</div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', margin: '4px 0 14px 0' }}>
                ₹{acc.balance.toLocaleString('en-IN')}.00
              </div>

              <div style={{ fontSize: '0.8rem', opacity: 0.9, display: 'flex', flexDirection: 'column', gap: '4px', borderTop: '1px solid rgba(128,128,128,0.2)', paddingTop: '10px' }}>
                <div>A/C Number: <strong>{acc.accountNumber}</strong></div>
                <div>IFSC: <strong>{acc.ifscCode}</strong></div>
                <div>Interest: <strong>{acc.interestRate}% p.a.</strong></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Account Details & Passbook Statement */}
      {selectedAcc && (
        <div style={{ background: '#ffffff', borderRadius: '20px', padding: '28px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
          {/* Header & Filter Controls */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a' }}>
                Passbook Statement: {selectedAcc.accountType} (•••{selectedAcc.accountNumber.slice(-4)})
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Branch: {selectedAcc.branch} • Nominee: {selectedAcc.nomineeName}</p>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={handlePrintStatement} className="btn btn-secondary btn-sm">
                <Printer size={15} /> Print / Save PDF
              </button>
            </div>
          </div>

          {/* Statement Filters */}
          <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: '600' }}>
              <Filter size={16} color="#1c2a8f" /> Filter:
            </div>

            <select
              className="form-control"
              style={{ width: 'auto', padding: '6px 12px', fontSize: '0.85rem' }}
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All Transactions</option>
              <option value="credit">Credits Only (Deposits/Income)</option>
              <option value="debit">Debits Only (Transfers/Payments)</option>
            </select>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
              <span>From:</span>
              <input
                type="date"
                className="form-control"
                style={{ width: 'auto', padding: '6px 10px', fontSize: '0.85rem' }}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
              <span>To:</span>
              <input
                type="date"
                className="form-control"
                style={{ width: 'auto', padding: '6px 10px', fontSize: '0.85rem' }}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          {/* Financial Summary Ribbon */}
          {statement && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              <div style={{ background: '#ecfdf5', padding: '14px', borderRadius: '10px', color: '#065f46' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: '700' }}>TOTAL CREDITS</div>
                <div style={{ fontSize: '1.25rem', fontWeight: '800' }}>+₹{statement.summary?.totalCredits.toLocaleString('en-IN') || 0}</div>
              </div>
              <div style={{ background: '#fef2f2', padding: '14px', borderRadius: '10px', color: '#991b1b' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: '700' }}>TOTAL DEBITS</div>
                <div style={{ fontSize: '1.25rem', fontWeight: '800' }}>-₹{statement.summary?.totalDebits.toLocaleString('en-IN') || 0}</div>
              </div>
              <div style={{ background: '#eff6ff', padding: '14px', borderRadius: '10px', color: '#1e40af' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: '700' }}>CLOSING BALANCE</div>
                <div style={{ fontSize: '1.25rem', fontWeight: '800' }}>₹{selectedAcc.balance.toLocaleString('en-IN')}</div>
              </div>
            </div>
          )}

          {/* Statement Transactions Table */}
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date & Time</th>
                  <th>Reference ID</th>
                  <th>Description / Remark</th>
                  <th>Mode</th>
                  <th>Debit (-)</th>
                  <th>Credit (+)</th>
                  <th>Balance After</th>
                </tr>
              </thead>
              <tbody>
                {!statement?.transactions || statement.transactions.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>
                      No transaction entries found for the selected period.
                    </td>
                  </tr>
                ) : (
                  statement.transactions.map((txn) => {
                    const isDebit = txn.direction === 'debit';
                    return (
                      <tr key={txn._id}>
                        <td style={{ fontSize: '0.8rem', color: '#64748b' }}>
                          {new Date(txn.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td style={{ fontFamily: 'monospace', fontWeight: '700', fontSize: '0.8rem' }}>
                          {txn.referenceId}
                        </td>
                        <td>
                          <div style={{ fontWeight: '600' }}>{txn.remarks || txn.category}</div>
                          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                            {isDebit ? `To: ${txn.receiverName}` : `From: ${txn.senderName || 'Bank'}`}
                          </div>
                        </td>
                        <td>
                          <span className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>
                            {txn.type?.replace('_', ' ').toUpperCase()}
                          </span>
                        </td>
                        <td style={{ color: '#ef4444', fontWeight: '700' }}>
                          {isDebit ? `₹${txn.amount.toLocaleString('en-IN')}` : '-'}
                        </td>
                        <td style={{ color: '#10b981', fontWeight: '700' }}>
                          {!isDebit ? `₹${txn.amount.toLocaleString('en-IN')}` : '-'}
                        </td>
                        <td style={{ fontWeight: '700', fontFamily: 'monospace' }}>
                          ₹{txn.balanceAfter.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Open Account Modal */}
      {showOpenModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ padding: '30px' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '8px' }}>Open New Banking Account</h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '20px' }}>
              Choose your product. The account will be active immediately upon confirmation.
            </p>

            <form onSubmit={handleOpenAccount}>
              <div className="form-group">
                <label className="form-label">Account Category</label>
                <select
                  className="form-control"
                  value={newAccType}
                  onChange={(e) => setNewAccType(e.target.value)}
                >
                  <option value="Fixed Deposit">Fixed Deposit (7.10% APY Guaranteed)</option>
                  <option value="Current">Current Account (For Business / Trade)</option>
                  <option value="Savings">Additional Secondary Savings Account</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Initial Opening Deposit (INR)</label>
                <input
                  type="number"
                  min="5000"
                  step="5000"
                  required
                  className="form-control"
                  value={initialDeposit}
                  onChange={(e) => setInitialDeposit(Number(e.target.value))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Nominee Name</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder="e.g. Anita Sharma (Spouse)"
                  value={nomineeName}
                  onChange={(e) => setNomineeName(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button type="button" onClick={() => setShowOpenModal(false)} className="btn btn-secondary" style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" disabled={opening} className="btn btn-primary" style={{ flex: 1 }}>
                  {opening ? 'Processing...' : 'Confirm & Open'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
