import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import { useNotification } from '../../context/NotificationContext';
import { ReceiptModal } from '../../components/common/ReceiptModal';
import {
  ReceiptText,
  Search,
  Filter,
  Flag,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownLeft,
  ChevronLeft,
  ChevronRight,
  FileText,
} from 'lucide-react';

export const TransactionManagement = () => {
  const { showToast } = useNotification();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [directionFilter, setDirectionFilter] = useState('all');
  const [flaggedFilter, setFlaggedFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [selectedTxn, setSelectedTxn] = useState(null);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const data = await api.getAdminTransactions({
        search,
        type: typeFilter,
        direction: directionFilter,
        isFlagged: flaggedFilter === 'flagged' ? 'true' : undefined,
        page,
        limit: 20,
      });
      setTransactions(data.transactions || []);
      setTotalPages(data.pages || 1);
      setTotalCount(data.total || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [typeFilter, directionFilter, flaggedFilter, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchTransactions();
  };

  const handleToggleFlag = async (txn) => {
    let reason = '';
    if (!txn.isFlagged) {
      reason = window.prompt('Enter audit flag reason (e.g. Unusual high-value velocity / AML check):');
      if (reason === null) return;
    }

    try {
      const res = await api.toggleFlagTransaction(txn._id, { flagReason: reason });
      showToast(res.message, txn.isFlagged ? 'info' : 'warning');
      fetchTransactions();
    } catch (err) {
      alert(err.message || 'Action failed');
    }
  };

  return (
    <div className="page-body">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0f172a' }}>Global Transactions & Audit Ledger</h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
            Live central bank ledger of all retail transfers, loan disbursements and adjustments ({totalCount} total entries)
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
              placeholder="Search by reference ID, sender/receiver name, account..."
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
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="all">All Types</option>
            <option value="transfer_intra">Intra-Bank</option>
            <option value="transfer_neft">NEFT</option>
            <option value="transfer_rtgs">RTGS</option>
            <option value="transfer_upi">UPI</option>
            <option value="loan_disbursement">Loan Disbursement</option>
            <option value="loan_repayment">Loan EMI</option>
            <option value="admin_adjustment">Admin Adjustment</option>
          </select>

          <select
            className="form-control"
            style={{ width: 'auto', padding: '8px 12px', fontSize: '0.85rem' }}
            value={directionFilter}
            onChange={(e) => {
              setDirectionFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="all">All Flows</option>
            <option value="credit">Credits (+)</option>
            <option value="debit">Debits (-)</option>
          </select>

          <select
            className="form-control"
            style={{ width: 'auto', padding: '8px 12px', fontSize: '0.85rem' }}
            value={flaggedFilter}
            onChange={(e) => {
              setFlaggedFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="all">Audit Status: All</option>
            <option value="flagged">Flagged Only ⚠️</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="data-table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Reference ID</th>
              <th>Sender</th>
              <th>Receiver / Payee</th>
              <th>Mode / Category</th>
              <th>Amount</th>
              <th>Audit Flag</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                  Loading central transaction ledger...
                </td>
              </tr>
            ) : transactions.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                  No transaction entries found.
                </td>
              </tr>
            ) : (
              transactions.map((t) => (
                <tr key={t._id} style={{ background: t.isFlagged ? '#fffbeb' : undefined }}>
                  <td style={{ fontSize: '0.8rem', color: '#64748b', whiteSpace: 'nowrap' }}>
                    {new Date(t.createdAt).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td style={{ fontFamily: 'monospace', fontWeight: '800', fontSize: '0.8rem', color: '#1c2a8f' }}>
                    {t.referenceId}
                  </td>
                  <td>
                    <div style={{ fontWeight: '700', color: '#1e293b' }}>{t.senderName || 'N/A'}</div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{t.senderUserId?.email || 'External / System'}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: '700', color: '#1e293b' }}>{t.receiverName}</div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', fontFamily: 'monospace' }}>
                      {t.receiverAccountNumber ? `A/C: ${t.receiverAccountNumber}` : ''}
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>
                      {t.type?.replace('_', ' ').toUpperCase()}
                    </span>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '2px' }}>{t.category}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: '800', fontSize: '1rem', color: t.direction === 'debit' ? '#ef4444' : '#10b981' }}>
                      {t.direction === 'debit' ? '-' : '+'}₹{Number(t.amount).toLocaleString('en-IN')}
                    </div>
                  </td>
                  <td>
                    {t.isFlagged ? (
                      <span className="badge badge-warning" title={t.flagReason}>
                        <AlertTriangle size={12} /> FLAGGED
                      </span>
                    ) : (
                      <span className="badge badge-success">CLEARED</span>
                    )}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        onClick={() => setSelectedTxn(t)}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '4px 8px', fontSize: '0.72rem' }}
                      >
                        <FileText size={13} /> Advice
                      </button>
                      <button
                        onClick={() => handleToggleFlag(t)}
                        className={`btn btn-sm ${t.isFlagged ? 'btn-danger' : 'btn-secondary'}`}
                        style={{ padding: '4px 8px', fontSize: '0.72rem' }}
                        title={t.isFlagged ? 'Clear Audit Flag' : 'Flag for Audit'}
                      >
                        <Flag size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-light)', background: '#f8fafc' }}>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
              Showing page {page} of {totalPages}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="btn btn-secondary btn-sm"
              >
                <ChevronLeft size={14} /> Previous
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="btn btn-secondary btn-sm"
              >
                Next <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Transaction Slip Modal */}
      <ReceiptModal
        isOpen={!!selectedTxn}
        onClose={() => setSelectedTxn(null)}
        transaction={selectedTxn}
      />
    </div>
  );
};
