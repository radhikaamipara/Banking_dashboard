import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { PinModal } from '../../components/common/PinModal';
import { ReceiptModal } from '../../components/common/ReceiptModal';
import {
  ArrowRightLeft,
  Send,
  Building,
  Smartphone,
  Repeat,
  UserPlus,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Users,
} from 'lucide-react';

export const TransferMoney = () => {
  const { user, primaryAccount, refreshUser } = useAuth();
  const { showToast } = useNotification();

  const [accounts, setAccounts] = useState([]);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [transferType, setTransferType] = useState('intra'); // 'intra' | 'neft' | 'imps' | 'upi' | 'own'

  // Form fields
  const [sourceAccountId, setSourceAccountId] = useState('');
  const [receiverAccountNumber, setReceiverAccountNumber] = useState('30988716254'); // Default Priya's SecureBank A/C
  const [receiverIfsc, setReceiverIfsc] = useState('SecureBankN0001234');
  const [receiverName, setReceiverName] = useState('Priya Patel');
  const [receiverUpiId, setReceiverUpiId] = useState('');
  const [targetAccountId, setTargetAccountId] = useState(''); // for self transfer
  const [amount, setAmount] = useState('5000');
  const [category, setCategory] = useState('Transfer');
  const [remarks, setRemarks] = useState('Quarterly project reimbursement');

  // Modals & execution state
  const [showPinModal, setShowPinModal] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [completedTxn, setCompletedTxn] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Add Beneficiary State
  const [showAddBenModal, setShowAddBenModal] = useState(false);
  const [newBen, setNewBen] = useState({
    name: '',
    accountNumber: '',
    bankName: 'SecureBank',
    ifscCode: 'SecureBankN0001234',
    transferType: 'Intra-Bank',
    nickname: '',
  });

  const fetchData = async () => {
    try {
      const [accRes, benRes] = await Promise.all([
        api.getMyAccounts(),
        api.getBeneficiaries(),
      ]);
      setAccounts(accRes.accounts || []);
      setBeneficiaries(benRes.beneficiaries || []);
      if (accRes.accounts?.length > 0 && !sourceAccountId) {
        setSourceAccountId(accRes.accounts[0]._id);
      }
      if (accRes.accounts?.length > 1 && !targetAccountId) {
        setTargetAccountId(accRes.accounts[1]._id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleBeneficiarySelect = (ben) => {
    if (!ben) return;
    setReceiverName(ben.name);
    setReceiverAccountNumber(ben.accountNumber);
    setReceiverIfsc(ben.ifscCode);
    if (ben.transferType === 'UPI') {
      setTransferType('upi');
      setReceiverUpiId(ben.upiId || ben.accountNumber);
    } else if (ben.transferType === 'Inter-Bank') {
      setTransferType('neft');
    } else {
      setTransferType('intra');
    }
  };

  const handleInitiateTransfer = (e) => {
    e.preventDefault();
    setError('');

    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) {
      setError('Please enter a valid amount.');
      return;
    }

    const currentSource = accounts.find((a) => a._id === sourceAccountId);
    if (currentSource && currentSource.balance < numAmount) {
      setError(`Insufficient balance. Current balance is ₹${currentSource.balance.toLocaleString('en-IN')}`);
      return;
    }

    // Open T-PIN confirmation dialog
    setShowPinModal(true);
  };

  const handleConfirmPin = async (tPin) => {
    setShowPinModal(false);
    setLoading(true);
    setError('');

    try {
      const payload = {
        senderAccountId: sourceAccountId,
        transferType,
        receiverAccountNumber,
        receiverIfsc,
        receiverName: receiverName || (transferType === 'upi' ? receiverUpiId : 'Beneficiary'),
        receiverUpiId,
        targetAccountId,
        amount: Number(amount),
        category,
        remarks,
        tPin,
      };

      const res = await api.transfer(payload);
      setCompletedTxn(res.transaction);
      setShowReceipt(true);
      showToast('Transfer completed successfully!', 'success');

      // Refresh accounts & user balance
      fetchData();
      refreshUser();
    } catch (err) {
      setError(err.message || 'Transfer failed. Check your details or T-PIN.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddBeneficiary = async (e) => {
    e.preventDefault();
    try {
      await api.addBeneficiary(newBen);
      showToast('Beneficiary registered successfully!', 'success');
      setShowAddBenModal(false);
      setNewBen({
        name: '',
        accountNumber: '',
        bankName: 'SecureBank',
        ifscCode: 'SecureBankN0001234',
        transferType: 'Intra-Bank',
        nickname: '',
      });
      fetchData();
    } catch (err) {
      alert(err.message || 'Failed to add beneficiary');
    }
  };

  return (
    <div className="page-body">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0f172a' }}>Fund Transfer (Pay & Remit)</h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Instant 24x7 RTGS, NEFT, IMPS, Intra-Bank and UPI Payments</p>
        </div>
        <button onClick={() => setShowAddBenModal(true)} className="btn btn-secondary">
          <UserPlus size={16} /> Add New Beneficiary
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '28px' }}>
        {/* Transfer Form Box */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '20px',
            padding: '32px',
            border: '1px solid var(--border-light)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          {/* Transfer Type Tabs */}
          <div style={{ display: 'flex', background: '#f1f5f9', padding: '4px', borderRadius: '12px', marginBottom: '24px', overflowX: 'auto' }}>
            <button
              type="button"
              onClick={() => setTransferType('intra')}
              style={{
                flex: 1,
                padding: '9px 12px',
                border: 'none',
                borderRadius: '8px',
                background: transferType === 'intra' ? '#1c2a8f' : 'transparent',
                color: transferType === 'intra' ? '#ffffff' : '#475569',
                fontWeight: '700',
                fontSize: '0.825rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              Intra-Bank (SecureBank)
            </button>
            <button
              type="button"
              onClick={() => setTransferType('neft')}
              style={{
                flex: 1,
                padding: '9px 12px',
                border: 'none',
                borderRadius: '8px',
                background: transferType === 'neft' ? '#1c2a8f' : 'transparent',
                color: transferType === 'neft' ? '#ffffff' : '#475569',
                fontWeight: '700',
                fontSize: '0.825rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              Inter-Bank (NEFT)
            </button>
            <button
              type="button"
              onClick={() => setTransferType('upi')}
              style={{
                flex: 1,
                padding: '9px 12px',
                border: 'none',
                borderRadius: '8px',
                background: transferType === 'upi' ? '#1c2a8f' : 'transparent',
                color: transferType === 'upi' ? '#ffffff' : '#475569',
                fontWeight: '700',
                fontSize: '0.825rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              UPI Quick Pay
            </button>
            <button
              type="button"
              onClick={() => setTransferType('own')}
              style={{
                flex: 1,
                padding: '9px 12px',
                border: 'none',
                borderRadius: '8px',
                background: transferType === 'own' ? '#1c2a8f' : 'transparent',
                color: transferType === 'own' ? '#ffffff' : '#475569',
                fontWeight: '700',
                fontSize: '0.825rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              Self-Transfer
            </button>
          </div>

          {error && (
            <div style={{ background: '#fef2f2', color: '#991b1b', padding: '12px', borderRadius: '10px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
              <AlertCircle size={18} color="#ef4444" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleInitiateTransfer}>
            {/* Source Account */}
            <div className="form-group">
              <label className="form-label">Debit From Account</label>
              <select
                className="form-control"
                value={sourceAccountId}
                onChange={(e) => setSourceAccountId(e.target.value)}
              >
                {accounts.map((a) => (
                  <option key={a._id} value={a._id}>
                    {a.accountType} - •••{a.accountNumber.slice(-4)} (Available: ₹{a.balance.toLocaleString('en-IN')})
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Pick Beneficiary */}
            {transferType !== 'own' && beneficiaries.length > 0 && (
              <div className="form-group">
                <label className="form-label">Choose Saved Beneficiary (Optional)</label>
                <select
                  className="form-control"
                  onChange={(e) => {
                    const found = beneficiaries.find((b) => b._id === e.target.value);
                    if (found) handleBeneficiarySelect(found);
                  }}
                >
                  <option value="">-- Or enter payee details manually below --</option>
                  {beneficiaries.map((b) => (
                    <option key={b._id} value={b._id}>
                      {b.name} ({b.nickname || b.transferType}) - A/C: {b.accountNumber}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* If Self-Transfer */}
            {transferType === 'own' && (
              <div className="form-group">
                <label className="form-label">Credit to Own Account</label>
                <select
                  className="form-control"
                  value={targetAccountId}
                  onChange={(e) => setTargetAccountId(e.target.value)}
                >
                  {accounts
                    .filter((a) => a._id !== sourceAccountId)
                    .map((a) => (
                      <option key={a._id} value={a._id}>
                        {a.accountType} - •••{a.accountNumber.slice(-4)} (Bal: ₹{a.balance.toLocaleString('en-IN')})
                      </option>
                    ))}
                </select>
              </div>
            )}

            {/* If UPI */}
            {transferType === 'upi' && (
              <div className="form-group">
                <label className="form-label">Virtual Payment Address (UPI ID) or Mobile Number</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder="e.g. priya@okaxis or 9876543210@upi"
                  value={receiverUpiId}
                  onChange={(e) => setReceiverUpiId(e.target.value)}
                />
              </div>
            )}

            {/* If Intra or Inter bank */}
            {transferType !== 'own' && transferType !== 'upi' && (
              <>
                <div className="form-group">
                  <label className="form-label">Payee / Beneficiary Name</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="e.g. Priya Patel"
                    value={receiverName}
                    onChange={(e) => setReceiverName(e.target.value)}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">
                      {transferType === 'intra' ? 'SecureBank Account Number' : 'Destination Account Number'}
                    </label>
                    <input
                      type="text"
                      required
                      className="form-control"
                      placeholder="e.g. 30988716254"
                      value={receiverAccountNumber}
                      onChange={(e) => setReceiverAccountNumber(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Bank IFSC Code</label>
                    <input
                      type="text"
                      required
                      className="form-control"
                      placeholder="SecureBankN0001234"
                      value={receiverIfsc}
                      onChange={(e) => setReceiverIfsc(e.target.value)}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Amount & Category */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">Transfer Amount (INR)</label>
                <input
                  type="number"
                  min="1"
                  required
                  className="form-control"
                  placeholder="₹ 5000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Expense Category</label>
                <select
                  className="form-control"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="Transfer">General Transfer</option>
                  <option value="Bills & Utilities">Bills & Utilities</option>
                  <option value="Food & Dining">Food & Dining</option>
                  <option value="Shopping">Shopping & Retail</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Investments">Investments</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Remarks / Description</label>
              <input
                type="text"
                className="form-control"
                placeholder="Optional remarks (e.g. Monthly rent)"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: '10px' }}
            >
              <ShieldCheck size={18} />
              <span>{loading ? 'Processing Transfer...' : 'Proceed to T-PIN Verification'}</span>
            </button>
          </form>
        </div>

        {/* Right Info Box: Beneficiaries & Quick Help */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Saved Beneficiaries Card */}
          <div style={{ background: '#ffffff', borderRadius: '20px', padding: '24px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users size={18} color="#1c2a8f" />
                <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a' }}>Saved Beneficiaries</h3>
              </div>
              <span className="badge badge-primary">{beneficiaries.length} Saved</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {beneficiaries.map((b) => (
                <div
                  key={b._id}
                  onClick={() => handleBeneficiarySelect(b)}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '10px',
                    background: '#f8fafc',
                    border: '1px solid var(--border-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'var(--transition)',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '0.875rem' }}>{b.name}</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                      {b.bankName} • A/C: •••{b.accountNumber.slice(-4)}
                    </div>
                  </div>
                  <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>
                    {b.transferType}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Security & Limits Tip Box */}
          <div
            style={{
              background: 'linear-gradient(135deg, #12184a 0%, #1c2a8f 100%)',
              color: '#ffffff',
              borderRadius: '20px',
              padding: '24px',
              boxShadow: 'var(--shadow-card)',
            }}
          >
            <h4 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={18} color="#38bdf8" /> Safe Banking Guidelines
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem', color: '#e0e7ff', lineHeight: '1.5' }}>
              <li>✓ Fund transfers are settled via RBI RTGS / NEFT / IMPS network instantly.</li>
              <li>✓ Default daily retail limit: ₹1,00,000 per customer account.</li>
              <li>✓ Never disclose your 4-digit T-PIN, NetBanking password, or OTP to anyone.</li>
              <li>✓ Intra-bank transfers credit the beneficiary account in real time.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* T-PIN Verification Modal */}
      <PinModal
        isOpen={showPinModal}
        onClose={() => setShowPinModal(false)}
        onConfirm={handleConfirmPin}
        amount={amount}
        receiverName={receiverName || (transferType === 'upi' ? receiverUpiId : 'Beneficiary')}
      />

      {/* Official Printable Transaction Advice Receipt */}
      <ReceiptModal
        isOpen={showReceipt}
        onClose={() => setShowReceipt(false)}
        transaction={completedTxn}
      />

      {/* Add Beneficiary Modal */}
      {showAddBenModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ padding: '30px' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '6px' }}>Add Beneficiary</h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '20px' }}>
              Save beneficiary for instant 1-click repetitive fund transfers.
            </p>

            <form onSubmit={handleAddBeneficiary}>
              <div className="form-group">
                <label className="form-label">Beneficiary Full Name</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder="e.g. Priya Patel"
                  value={newBen.name}
                  onChange={(e) => setNewBen({ ...newBen, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Transfer Type</label>
                <select
                  className="form-control"
                  value={newBen.transferType}
                  onChange={(e) => setNewBen({ ...newBen, transferType: e.target.value })}
                >
                  <option value="Intra-Bank">Intra-Bank (SecureBank Account)</option>
                  <option value="Inter-Bank">Inter-Bank (Other Bank NEFT/IMPS)</option>
                  <option value="UPI">UPI ID / Mobile</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Account Number / UPI ID</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder="Account Number or name@upi"
                  value={newBen.accountNumber}
                  onChange={(e) => setNewBen({ ...newBen, accountNumber: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Bank Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newBen.bankName}
                    onChange={(e) => setNewBen({ ...newBen, bankName: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">IFSC Code</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newBen.ifscCode}
                    onChange={(e) => setNewBen({ ...newBen, ifscCode: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Nickname (Optional)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Priya SecureBank"
                  value={newBen.nickname}
                  onChange={(e) => setNewBen({ ...newBen, nickname: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                <button type="button" onClick={() => setShowAddBenModal(false)} className="btn btn-secondary" style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  Save Beneficiary
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
