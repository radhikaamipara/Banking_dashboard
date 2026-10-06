import React from 'react';
import { Landmark, Printer, CheckCircle2, X } from 'lucide-react';

export const ReceiptModal = ({ isOpen, onClose, transaction }) => {
  if (!isOpen || !transaction) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '520px', padding: '32px' }}>
        {/* Close Button */}
        <button
          onClick={onClose}
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

        {/* Printable Area */}
        <div id="printable-receipt">
          {/* Bank Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid #1c2a8f', paddingBottom: '16px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #1c2a8f 0%, #00a4e4 100%)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Landmark size={18} />
              </div>
              <div>
                <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#1c2a8f' }}>
                  STATE BANK OF INDIA
                </div>
                <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '600' }}>
                  SecureBank Digital Banking • Transaction Advice
                </div>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span className="badge badge-success" style={{ fontSize: '0.8rem' }}>
                <CheckCircle2 size={13} /> SUCCESS
              </span>
            </div>
          </div>

          {/* Amount Box */}
          <div
            style={{
              background: '#f8fafc',
              border: '1px solid var(--border-light)',
              borderRadius: '12px',
              padding: '18px',
              textAlign: 'center',
              marginBottom: '22px',
            }}
          >
            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>
              Total Amount Transferred
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a', margin: '4px 0' }}>
              ₹{Number(transaction.amount).toLocaleString('en-IN')}.00
            </div>
            <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: '600' }}>
              Transaction Processed & Settled
            </div>
          </div>

          {/* Details Table */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #e2e8f0', paddingBottom: '8px' }}>
              <span style={{ color: '#64748b' }}>Reference ID / UTR:</span>
              <strong style={{ fontFamily: 'monospace', color: '#0f172a' }}>{transaction.referenceId}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #e2e8f0', paddingBottom: '8px' }}>
              <span style={{ color: '#64748b' }}>Date & Time:</span>
              <strong>{new Date(transaction.createdAt || Date.now()).toLocaleString()}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #e2e8f0', paddingBottom: '8px' }}>
              <span style={{ color: '#64748b' }}>Transfer Mode:</span>
              <span style={{ textTransform: 'uppercase', fontWeight: '700', color: '#1c2a8f' }}>
                {transaction.type?.replace('_', ' ')}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #e2e8f0', paddingBottom: '8px' }}>
              <span style={{ color: '#64748b' }}>Beneficiary Name:</span>
              <strong>{transaction.receiverName}</strong>
            </div>

            {transaction.receiverAccountNumber && (
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #e2e8f0', paddingBottom: '8px' }}>
                <span style={{ color: '#64748b' }}>Beneficiary Account:</span>
                <strong style={{ fontFamily: 'monospace' }}>
                  •••• •••• {transaction.receiverAccountNumber.slice(-4)}
                </strong>
              </div>
            )}

            {transaction.remarks && (
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #e2e8f0', paddingBottom: '8px' }}>
                <span style={{ color: '#64748b' }}>Remarks:</span>
                <span>{transaction.remarks}</span>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px' }}>
              <span style={{ color: '#64748b' }}>Channel:</span>
              <strong>SecureBank Digital Banking</strong>
            </div>
          </div>

          <div style={{ marginTop: '24px', padding: '10px', background: '#f0fdf4', borderRadius: '8px', fontSize: '0.72rem', color: '#065f46', textAlign: 'center' }}>
            This is a computer-generated receipt and does not require a physical signature.
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
          <button onClick={handlePrint} className="btn btn-secondary" style={{ flex: 1 }}>
            <Printer size={16} /> Print Receipt
          </button>
          <button onClick={onClose} className="btn btn-primary" style={{ flex: 1 }}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
