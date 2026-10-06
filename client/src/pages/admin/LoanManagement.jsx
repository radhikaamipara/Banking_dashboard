import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import { useNotification } from '../../context/NotificationContext';
import {
  Banknote,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  Building,
  DollarSign,
  AlertCircle,
  FileCheck2,
  Search,
  Filter,
  X,
} from 'lucide-react';

export const LoanManagement = () => {
  const { showToast } = useNotification();
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // Review modal
  const [reviewLoanObj, setReviewLoanObj] = useState(null);
  const [adminComment, setAdminComment] = useState('');
  const [customRate, setCustomRate] = useState('');
  const [reviewing, setReviewing] = useState(false);

  const fetchLoans = async () => {
    setLoading(true);
    try {
      const data = await api.getAdminLoans({
        status: statusFilter,
        loanType: typeFilter,
      });
      setLoans(data.loans || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, [statusFilter, typeFilter]);

  const handleDecision = async (decision) => {
    if (!reviewLoanObj) return;
    setReviewing(true);

    try {
      const res = await api.reviewLoan(reviewLoanObj._id, {
        decision,
        adminComment: adminComment || (decision === 'approved' ? 'Credit underwriting verified. Sanctioned.' : 'Criteria unmet.'),
        customInterestRate: customRate ? Number(customRate) : undefined,
      });

      showToast(res.message, decision === 'approved' ? 'success' : 'info');
      setReviewLoanObj(null);
      setAdminComment('');
      setCustomRate('');
      fetchLoans();
    } catch (err) {
      alert(err.message || 'Underwriting action failed');
    } finally {
      setReviewing(false);
    }
  };

  return (
    <div className="page-body">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0f172a' }}>Loan Underwriting & Sanctions</h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
            Assess customer creditworthiness, approve applications, and auto-disburse funds into accounts ({loans.length} applications)
          </p>
        </div>
      </div>

      {/* Filter Ribbon */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '16px 24px',
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <select
            className="form-control"
            style={{ width: 'auto', padding: '8px 12px', fontSize: '0.85rem' }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Application Statuses</option>
            <option value="pending">Pending Approval (Action Required) ⏳</option>
            <option value="disbursed">Disbursed / Active</option>
            <option value="rejected">Rejected</option>
            <option value="closed">Closed</option>
          </select>

          <select
            className="form-control"
            style={{ width: 'auto', padding: '8px 12px', fontSize: '0.85rem' }}
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="all">All Loan Products</option>
            <option value="Personal Loan">Personal Loan</option>
            <option value="Home Loan">Home Loan</option>
            <option value="Car Loan">Car Loan</option>
            <option value="Education Loan">Education Loan</option>
          </select>
        </div>
      </div>

      {/* Loans Table */}
      <div className="data-table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Applicant</th>
              <th>Product</th>
              <th>Sanction Amount</th>
              <th>Tenure / EMI</th>
              <th>Monthly Income</th>
              <th>Status</th>
              <th>Underwriting Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                  Loading credit applications...
                </td>
              </tr>
            ) : loans.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                  No loan applications found matching criteria.
                </td>
              </tr>
            ) : (
              loans.map((loan) => (
                <tr key={loan._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img
                        src={loan.userId?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                        alt=""
                        style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontWeight: '700', color: '#1e293b' }}>{loan.userId?.name || 'Applicant'}</div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{loan.userId?.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-plum">{loan.loanType}</span>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>{loan.purpose}</div>
                  </td>
                  <td>
                    <strong style={{ fontSize: '1.05rem', color: '#1c2a8f' }}>
                      ₹{loan.amount?.toLocaleString('en-IN')}
                    </strong>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Rate: {loan.interestRate}% p.a.</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: '600' }}>{loan.tenureMonths} Months</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>EMI: ₹{loan.monthlyEmi?.toLocaleString('en-IN')}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: '700', color: '#0f172a' }}>
                      ₹{loan.monthlyIncome?.toLocaleString('en-IN')}/mo
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{loan.employmentType}</div>
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        loan.status === 'disbursed'
                          ? 'badge-success'
                          : loan.status === 'pending'
                          ? 'badge-warning'
                          : loan.status === 'rejected'
                          ? 'badge-danger'
                          : 'badge-primary'
                      }`}
                    >
                      {loan.status?.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    {loan.status === 'pending' ? (
                      <button
                        onClick={() => {
                          setReviewLoanObj(loan);
                          setCustomRate(loan.interestRate);
                        }}
                        className="btn btn-primary btn-sm"
                        style={{ padding: '6px 12px' }}
                      >
                        <FileCheck2 size={14} /> Review & Disburse
                      </button>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        {loan.status === 'disbursed' ? 'Funds Disbursed' : 'Decision Finalized'}
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Loan Underwriting Review Modal */}
      {reviewLoanObj && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '640px', padding: '32px' }}>
            <button
              onClick={() => setReviewLoanObj(null)}
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

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <Banknote size={24} color="#1c2a8f" />
              <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                Credit Sanction & Disbursement
              </h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '20px' }}>
              Reviewing <strong>{reviewLoanObj.loanType}</strong> application for <strong>{reviewLoanObj.userId?.name}</strong>.
            </p>

            {/* Applicant Summary Card */}
            <div style={{ background: '#f8fafc', padding: '18px', borderRadius: '12px', marginBottom: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', fontSize: '0.85rem' }}>
                <div>Requested Principal: <strong style={{ color: '#1c2a8f' }}>₹{reviewLoanObj.amount?.toLocaleString('en-IN')}</strong></div>
                <div>Tenure: <strong>{reviewLoanObj.tenureMonths} Months</strong></div>
                <div>Monthly In-Hand Income: <strong>₹{reviewLoanObj.monthlyIncome?.toLocaleString('en-IN')}</strong></div>
                <div>Employment: <strong>{reviewLoanObj.employmentType}</strong></div>
                <div>Calculated EMI: <strong>₹{reviewLoanObj.monthlyEmi?.toLocaleString('en-IN')}/mo</strong></div>
                <div>Credit Account: <strong>•••{reviewLoanObj.accountId?.accountNumber?.slice(-4)}</strong></div>
              </div>
              <div style={{ marginTop: '10px', fontSize: '0.8rem', color: '#475569', borderTop: '1px solid #e2e8f0', paddingTop: '8px' }}>
                Purpose: <em>{reviewLoanObj.purpose}</em>
              </div>
            </div>

            {/* Interest Rate Adjustment (Optional) */}
            <div className="form-group">
              <label className="form-label">Approved Interest Rate (% p.a.)</label>
              <input
                type="number"
                step="0.05"
                className="form-control"
                value={customRate}
                onChange={(e) => setCustomRate(e.target.value)}
              />
            </div>

            {/* Admin Audit Comment */}
            <div className="form-group">
              <label className="form-label">Underwriter Assessment / Decision Notes</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. CIBIL verified 780+, stable cashflow, sanction approved"
                value={adminComment}
                onChange={(e) => setAdminComment(e.target.value)}
              />
            </div>

            <div style={{ background: '#ecfdf5', padding: '12px', borderRadius: '8px', fontSize: '0.78rem', color: '#065f46', marginBottom: '22px' }}>
              ⚡ <strong>Instant Disbursement:</strong> Approving this loan will automatically credit <strong>₹{reviewLoanObj.amount?.toLocaleString('en-IN')}</strong> directly into {reviewLoanObj.userId?.name}'s account #{reviewLoanObj.accountId?.accountNumber}.
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                disabled={reviewing}
                onClick={() => handleDecision('rejected')}
                className="btn btn-danger"
                style={{ flex: 1 }}
              >
                <XCircle size={16} /> Reject Application
              </button>
              <button
                type="button"
                disabled={reviewing}
                onClick={() => handleDecision('approved')}
                className="btn btn-primary"
                style={{ flex: 1.5 }}
              >
                <CheckCircle2 size={16} /> {reviewing ? 'Disbursing...' : 'Approve & Disburse Funds'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
