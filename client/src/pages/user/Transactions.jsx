import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import { ReceiptModal } from '../../components/common/ReceiptModal';
import {
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  FileText,
  Printer,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTxn, setSelectedTxn] = useState(null);

  // Filters
  const [search, setSearch] = useState('');
  const [direction, setDirection] = useState('all');
  const [category, setCategory] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  //paging and sorting
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const data = await api.getMyTransactions({
        search,
        direction,
        category,
        page,
        limit: 5,
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
  }, [direction, category, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchTransactions();
  };

  return (
    <div className="page-body">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0f172a' }}>Transaction History & Passbook</h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
            Comprehensive ledger of all incoming credits, outgoing transfers & automated debits ({totalCount} records)
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
              placeholder="Search by payee name, reference ID, remarks..."
              style={{ paddingLeft: '38px', fontSize: '0.85rem' }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          </div>
          <button type="submit" className="btn btn-secondary btn-sm" style={{ padding: '9px 14px' }}>
            Search
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <select
            className="form-control"
            style={{ width: 'auto', padding: '8px 12px', fontSize: '0.85rem' }}
            value={direction}
            onChange={(e) => {
              setDirection(e.target.value);
              setPage(1);
            }}
          >
            <option value="all">All Flow (Debit & Credit)</option>
            <option value="credit">Credits Only (+)</option>
            <option value="debit">Debits Only (-)</option>
          </select>

          <select
            className="form-control"
            style={{ width: 'auto', padding: '8px 12px', fontSize: '0.85rem' }}
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
          >
            <option value="all">All Categories</option>
            <option value="Transfer">Transfer</option>
            <option value="Bills & Utilities">Bills & Utilities</option>
            <option value="Food & Dining">Food & Dining</option>
            <option value="Shopping">Shopping</option>
            <option value="Salary">Salary</option>
            <option value="Loan">Loan Repayment</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="data-table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Reference ID</th>
              <th>Transaction Details</th>
              <th>Category</th>
              <th>Channel</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                  Loading passbook ledger entries...
                </td>
              </tr>
            ) : transactions.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                  No transactions matching criteria found.
                </td>
              </tr>
            ) : (
              transactions.map((t) => {
                const isDebit = t.direction === 'debit';
                return (
                  <tr key={t._id}>
                    <td style={{ fontSize: '0.8rem', color: '#64748b', whiteSpace: 'nowrap' }}>
                      {new Date(t.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td style={{ fontFamily: 'monospace', fontWeight: '700', fontSize: '0.8rem', color: '#1c2a8f' }}>
                      {t.referenceId}
                    </td>
                    <td>
                      <div style={{ fontWeight: '700', color: '#1e293b' }}>
                        {isDebit ? t.receiverName : t.senderName || 'Self / Bank'}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                        {t.remarks || t.type?.replace('_', ' ').toUpperCase()}
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>
                        {t.category}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.78rem', color: '#64748b' }}>
                      {t.channel || 'SecureBank Web'}
                    </td>
                    <td>
                      <div style={{ fontWeight: '800', fontSize: '0.95rem', color: isDebit ? '#ef4444' : '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {isDebit ? <ArrowUpRight size={15} /> : <ArrowDownLeft size={15} />}
                        <span>{isDebit ? '-' : '+'}₹{Number(t.amount).toLocaleString('en-IN')}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${t.status === 'completed' ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '0.65rem' }}>
                        {t.status?.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => setSelectedTxn(t)}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                      >
                        <FileText size={13} /> Advice
                      </button>
                    </td>
                  </tr>
                );
              })
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

      {/* Transaction Receipt Slip Modal */}
      <ReceiptModal
        isOpen={!!selectedTxn}
        onClose={() => setSelectedTxn(null)}
        transaction={selectedTxn}
      />
    </div>
  );
};
