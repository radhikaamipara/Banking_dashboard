import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import {
  Banknote,
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  Percent,
  Calendar,
  DollarSign,
  Send,
  Building,
} from 'lucide-react';

export const Loans = () => {
  const { user, refreshUser } = useAuth();
  const { showToast } = useNotification();
  const [loans, setLoans] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [payingEmiId, setPayingEmiId] = useState(null);

  // Apply Form State
  const [applyForm, setApplyForm] = useState({
    loanType: 'Personal Loan',
    amount: 250000,
    tenureMonths: 24,
    purpose: 'Home improvements & renovations',
    employmentType: 'Salaried',
    monthlyIncome: 65000,
    accountId: '',
  });

  // Real-time EMI calculation preview
  const [emiPreview, setEmiPreview] = useState(null);

  const fetchLoansData = async () => {
    try {
      const [loanRes, accRes] = await Promise.all([
        api.getMyLoans(),
        api.getMyAccounts(),
      ]);
      setLoans(loanRes.loans || []);
      setAccounts(accRes.accounts || []);
      if (accRes.accounts?.length > 0 && !applyForm.accountId) {
        setApplyForm((prev) => ({ ...prev, accountId: accRes.accounts[0]._id }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoansData();
  }, []);

  // Recalculate EMI whenever amount, type or tenure changes
  useEffect(() => {
    const calc = async () => {
      try {
        let rate = 8.5;
        if (applyForm.loanType === 'Home Loan') rate = 8.4;
        else if (applyForm.loanType === 'Car Loan') rate = 8.75;
        else if (applyForm.loanType === 'Education Loan') rate = 7.9;
        else if (applyForm.loanType === 'Personal Loan') rate = 10.5;

        const res = await api.calculateEmi({
          amount: applyForm.amount,
          interestRate: rate,
          tenureMonths: applyForm.tenureMonths,
        });
        setEmiPreview(res);
      } catch (err) {
        // ignore preview err
      }
    };
    calc();
  }, [applyForm.amount, applyForm.loanType, applyForm.tenureMonths]);

  const handleApply = async (e) => {
    e.preventDefault();
    try {
      await api.applyLoan(applyForm);
      showToast('Loan application submitted! Awaiting Admin approval.', 'success');
      setShowApplyModal(false);
      fetchLoansData();
    } catch (err) {
      alert(err.message || 'Failed to submit loan application');
    }
  };

  const handlePayEmi = async (loanId) => {
    setPayingEmiId(loanId);
    try {
      const res = await api.payEmi(loanId);
      showToast(res.message, 'success');
      fetchLoansData();
      refreshUser();
    } catch (err) {
      alert(err.message || 'Payment failed');
    } finally {
      setPayingEmiId(null);
    }
  };

  return (
    <div className="page-body">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0f172a' }}>Loans & Lending Facilities</h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Track active loans, pay monthly installments, and apply for pre-approved credit</p>
        </div>
        <button onClick={() => setShowApplyModal(true)} className="btn btn-primary">
          <PlusCircle size={16} /> Apply for New Loan
        </button>
      </div>

      {/* Active Loans Section */}
      <div style={{ marginBottom: '36px' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0f172a', marginBottom: '16px' }}>
          My Loan Portfolio
        </h3>

        {loans.length === 0 ? (
          <div style={{ background: '#ffffff', borderRadius: '16px', padding: '40px', textAlign: 'center', border: '1px solid var(--border-light)' }}>
            <Banknote size={44} color="#94a3b8" style={{ margin: '0 auto 12px auto' }} />
            <h4 style={{ fontSize: '1.1rem', fontWeight: '700' }}>No Active Loans Found</h4>
            <p style={{ fontSize: '0.85rem', color: '#64748b', maxWidth: '400px', margin: '6px auto 16px auto' }}>
              You do not have any active or pending loans. Apply today with competitive interest rates starting at 8.40% p.a.
            </p>
            <button onClick={() => setShowApplyModal(true)} className="btn btn-cyan btn-sm">
              Apply for Loan Online
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            {loans.map((loan) => {
              const isDisbursed = loan.status === 'disbursed';
              const isPending = loan.status === 'pending';
              const isRejected = loan.status === 'rejected';
              const isClosed = loan.status === 'closed';

              return (
                <div
                  key={loan._id}
                  style={{
                    background: '#ffffff',
                    borderRadius: '16px',
                    padding: '24px',
                    border: '1px solid var(--border-light)',
                    boxShadow: 'var(--shadow-sm)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <span className="badge badge-plum">{loan.loanType}</span>
                      <span
                        className={`badge ${
                          isDisbursed
                            ? 'badge-success'
                            : isPending
                            ? 'badge-warning'
                            : isRejected
                            ? 'badge-danger'
                            : 'badge-primary'
                        }`}
                      >
                        {loan.status?.toUpperCase()}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Sanction Amount</div>
                    <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0f172a', margin: '2px 0 14px 0' }}>
                      ₹{loan.amount.toLocaleString('en-IN')}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.825rem', borderTop: '1px solid #f1f5f9', paddingTop: '12px', marginBottom: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#64748b' }}>Outstanding Balance:</span>
                        <strong style={{ color: '#ef4444' }}>₹{loan.outstandingAmount.toLocaleString('en-IN')}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#64748b' }}>Monthly EMI:</span>
                        <strong>₹{loan.monthlyEmi.toLocaleString('en-IN')}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#64748b' }}>Interest Rate:</span>
                        <strong>{loan.interestRate}% p.a.</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#64748b' }}>Installments Paid:</span>
                        <strong>{loan.emisPaidCount} of {loan.tenureMonths} Months</strong>
                      </div>
                    </div>
                  </div>

                  {isDisbursed && loan.outstandingAmount > 0 && (
                    <button
                      onClick={() => handlePayEmi(loan._id)}
                      disabled={payingEmiId === loan._id}
                      className="btn btn-primary"
                      style={{ width: '100%' }}
                    >
                      <Banknote size={16} />
                      <span>{payingEmiId === loan._id ? 'Processing...' : `Pay Monthly EMI (₹${loan.monthlyEmi.toLocaleString('en-IN')})`}</span>
                    </button>
                  )}

                  {isPending && (
                    <div style={{ background: '#fffbeb', color: '#92400e', padding: '10px', borderRadius: '8px', fontSize: '0.75rem', textAlign: 'center' }}>
                      ⏳ Under review by bank underwriters in the Admin Panel.
                    </div>
                  )}

                  {isRejected && (
                    <div style={{ background: '#fef2f2', color: '#991b1b', padding: '10px', borderRadius: '8px', fontSize: '0.75rem', textAlign: 'center' }}>
                      Reason: {loan.adminComment || 'Did not meet underwriting criteria.'}
                    </div>
                  )}

                  {isClosed && (
                    <div style={{ background: '#ecfdf5', color: '#065f46', padding: '10px', borderRadius: '8px', fontSize: '0.75rem', textAlign: 'center', fontWeight: '700' }}>
                      ✓ Loan Fully Repaid and Closed
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Apply Loan Modal */}
      {showApplyModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '620px', padding: '32px' }}>
            <h3 style={{ fontSize: '1.35rem', fontWeight: '800', marginBottom: '6px' }}>Apply for a Banking Loan</h3>
            <p style={{ fontSize: '0.825rem', color: '#64748b', marginBottom: '20px' }}>
              Submit your credit application for branch administration review & disbursement.
            </p>

            <form onSubmit={handleApply}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Loan Product</label>
                  <select
                    className="form-control"
                    value={applyForm.loanType}
                    onChange={(e) => setApplyForm({ ...applyForm, loanType: e.target.value })}
                  >
                    <option value="Personal Loan">Personal Loan (10.5% APY)</option>
                    <option value="Home Loan">Home Loan (8.40% APY)</option>
                    <option value="Car Loan">Car Loan (8.75% APY)</option>
                    <option value="Education Loan">Education Loan (7.90% APY)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Disburse To Account</label>
                  <select
                    className="form-control"
                    value={applyForm.accountId}
                    onChange={(e) => setApplyForm({ ...applyForm, accountId: e.target.value })}
                  >
                    {accounts.map((a) => (
                      <option key={a._id} value={a._id}>
                        {a.accountType} (•••{a.accountNumber.slice(-4)})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Requested Loan Amount (INR)</label>
                  <input
                    type="number"
                    min="10000"
                    step="10000"
                    required
                    className="form-control"
                    value={applyForm.amount}
                    onChange={(e) => setApplyForm({ ...applyForm, amount: Number(e.target.value) })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Tenure (Months)</label>
                  <input
                    type="number"
                    min="6"
                    max="240"
                    required
                    className="form-control"
                    value={applyForm.tenureMonths}
                    onChange={(e) => setApplyForm({ ...applyForm, tenureMonths: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Employment Type</label>
                  <select
                    className="form-control"
                    value={applyForm.employmentType}
                    onChange={(e) => setApplyForm({ ...applyForm, employmentType: e.target.value })}
                  >
                    <option value="Salaried">Salaried (Corporate / Govt)</option>
                    <option value="Self-Employed">Self-Employed / Professional</option>
                    <option value="Business Owner">Business Owner</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Monthly In-Hand Income (INR)</label>
                  <input
                    type="number"
                    min="15000"
                    step="5000"
                    required
                    className="form-control"
                    value={applyForm.monthlyIncome}
                    onChange={(e) => setApplyForm({ ...applyForm, monthlyIncome: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Purpose of Loan</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder="e.g. Higher education, medical treatment, home extension"
                  value={applyForm.purpose}
                  onChange={(e) => setApplyForm({ ...applyForm, purpose: e.target.value })}
                />
              </div>

              {/* Real-time EMI Preview Box */}
              {emiPreview && (
                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#166534', fontWeight: '700' }}>ESTIMATED MONTHLY EMI</div>
                      <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#14532d' }}>
                        ₹{emiPreview.monthlyEmi.toLocaleString('en-IN')}/mo
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', fontSize: '0.78rem', color: '#166534' }}>
                      <div>Total Repayable: <strong>₹{emiPreview.totalRepayment.toLocaleString('en-IN')}</strong></div>
                      <div>Interest: <strong>₹{emiPreview.totalInterest.toLocaleString('en-IN')}</strong></div>
                    </div>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="button" onClick={() => setShowApplyModal(false)} className="btn btn-secondary" style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  Submit for Approval
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
