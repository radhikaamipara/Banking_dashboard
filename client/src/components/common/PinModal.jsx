import React, { useState } from 'react';
import { Lock, ShieldAlert, KeyRound } from 'lucide-react';

export const PinModal = ({ isOpen, onClose, onConfirm, amount, receiverName, title = 'Verify Transaction PIN' }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pin.length !== 4) {
      setError('Please enter a 4-digit PIN');
      return;
    }
    setError('');
    onConfirm(pin);
  };

  const handleKeyClick = (num) => {
    if (pin.length < 4) {
      setPin((prev) => prev + num);
      setError('');
    }
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '420px', textAlign: 'center', padding: '28px' }}>
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #1c2a8f 0%, #00a4e4 100%)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px auto',
            boxShadow: '0 8px 20px rgba(0, 164, 228, 0.35)',
          }}
        >
          <KeyRound size={28} />
        </div>

        <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', marginBottom: '6px' }}>
          {title}
        </h3>
        <p style={{ fontSize: '0.825rem', color: '#64748b', marginBottom: '20px' }}>
          Transferring <strong>₹{Number(amount).toLocaleString('en-IN')}</strong> to <strong>{receiverName}</strong>
        </p>

        {/* PIN Circles Display */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', marginBottom: '20px' }}>
          {[0, 1, 2, 3].map((index) => (
            <div
              key={index}
              style={{
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                border: '2px solid #1c2a8f',
                background: pin.length > index ? '#1c2a8f' : 'transparent',
                transition: 'var(--transition)',
              }}
            />
          ))}
        </div>

        {error && (
          <div style={{ color: '#ef4444', fontSize: '0.8rem', fontWeight: '600', marginBottom: '16px' }}>
            {error}
          </div>
        )}

        {/* Numeric Keypad Simulation */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', maxWidth: '280px', margin: '0 auto 24px auto' }}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => handleKeyClick(num.toString())}
              style={{
                padding: '14px',
                fontSize: '1.25rem',
                fontWeight: '700',
                borderRadius: '10px',
                border: '1px solid var(--border-light)',
                background: '#ffffff',
                color: '#1e293b',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              {num}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setPin('')}
            style={{
              padding: '14px',
              fontSize: '0.825rem',
              fontWeight: '700',
              borderRadius: '10px',
              border: '1px solid var(--border-light)',
              background: '#f8fafc',
              color: '#64748b',
              cursor: 'pointer',
            }}
          >
            CLEAR
          </button>
          <button
            type="button"
            onClick={() => handleKeyClick('0')}
            style={{
              padding: '14px',
              fontSize: '1.25rem',
              fontWeight: '700',
              borderRadius: '10px',
              border: '1px solid var(--border-light)',
              background: '#ffffff',
              color: '#1e293b',
              cursor: 'pointer',
            }}
          >
            0
          </button>
          <button
            type="button"
            onClick={handleBackspace}
            style={{
              padding: '14px',
              fontSize: '0.9rem',
              fontWeight: '700',
              borderRadius: '10px',
              border: '1px solid var(--border-light)',
              background: '#f8fafc',
              color: '#64748b',
              cursor: 'pointer',
            }}
          >
            ⌫
          </button>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary"
            style={{ flex: 1 }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="btn btn-primary"
            style={{ flex: 1 }}
            disabled={pin.length !== 4}
          >
            Confirm & Pay
          </button>
        </div>

        <div style={{ marginTop: '16px', fontSize: '0.72rem', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          <Lock size={12} /> Default Demo PIN: <strong>1234</strong>
        </div>
      </div>
    </div>
  );
};
