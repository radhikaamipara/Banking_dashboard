import React, { useState } from 'react';
import { Wifi, Copy, Check, Eye, EyeOff, Shield, RotateCw } from 'lucide-react';

export const Card3D = ({ card, onToggleFreeze }) => {
  const [flipped, setFlipped] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showCvv, setShowCvv] = useState(false);

  if (!card) return null;

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(card.cardNumber.replace(/\s+/g, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isFrozen = card.status === 'frozen';
  const isBlocked = card.status === 'blocked';

  // Card themes based on card type / network
  const getCardBg = () => {
    if (isBlocked) return 'linear-gradient(135deg, #374151 0%, #1f2937 100%)';
    if (isFrozen) return 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)';
    if (card.cardType === 'Credit') return 'linear-gradient(135deg, #2c0a4d 0%, #1a103c 50%, #0f1538 100%)';
    return 'linear-gradient(135deg, #1c2a8f 0%, #0a3d91 60%, #00a4e4 100%)';
  };

  return (
    <div className="card-container-3d" style={{ width: '100%', maxWidth: '380px', margin: '0 auto' }}>
      <div
        className={`card-flip-inner ${flipped ? 'flipped' : ''}`}
        style={{
          height: '220px',
          filter: isFrozen ? 'grayscale(0.6)' : 'none',
        }}
        onClick={() => setFlipped(!flipped)}
      >
        {/* FRONT */}
        <div
          className="card-flip-front"
          style={{
            background: getCardBg(),
            color: '#ffffff',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Subtle decorative circles */}
          <div
            style={{
              position: 'absolute',
              top: '-40px',
              right: '-40px',
              width: '160px',
              height: '160px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.07)',
              pointerEvents: 'none',
            }}
          />

          {/* Top Row: Bank Name & Status */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1rem', fontWeight: '800', letterSpacing: '0.04em' }}>STATE BANK OF INDIA</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {isFrozen && (
                <span style={{ background: '#f59e0b', color: '#ffffff', fontSize: '0.65rem', padding: '2px 8px', borderRadius: '4px', fontWeight: '700' }}>
                  FROZEN
                </span>
              )}
              {isBlocked && (
                <span style={{ background: '#ef4444', color: '#ffffff', fontSize: '0.65rem', padding: '2px 8px', borderRadius: '4px', fontWeight: '700' }}>
                  BLOCKED
                </span>
              )}
              <span style={{ fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.06em', opacity: 0.9 }}>
                {card.cardType?.toUpperCase()}
              </span>
            </div>
          </div>

          {/* EMV Chip & Contactless */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', margin: '14px 0 8px 0', zIndex: 1 }}>
            <div
              style={{
                width: '42px',
                height: '32px',
                borderRadius: '6px',
                background: 'linear-gradient(135deg, #ffd700 0%, #e6be8a 50%, #d4af37 100%)',
                border: '1px solid rgba(0,0,0,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div style={{ width: '28px', height: '18px', border: '1px solid rgba(0,0,0,0.3)', borderRadius: '3px' }} />
            </div>
            <Wifi size={22} style={{ transform: 'rotate(90deg)', opacity: 0.85 }} />
          </div>

          {/* Card Number */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 1 }}>
            <div style={{ fontSize: '1.25rem', fontFamily: 'monospace', fontWeight: '700', letterSpacing: '0.12em' }}>
              {card.cardNumber}
            </div>
            <button
              type="button"
              onClick={handleCopy}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                borderRadius: '6px',
                padding: '4px 6px',
                color: '#ffffff',
                cursor: 'pointer',
              }}
              title="Copy Card Number"
            >
              {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
            </button>
          </div>

          {/* Bottom Row */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', zIndex: 1, marginTop: '8px' }}>
            <div>
              <div style={{ fontSize: '0.62rem', opacity: 0.7, textTransform: 'uppercase' }}>Card Holder</div>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', letterSpacing: '0.04em' }}>
                {card.cardHolderName}
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.62rem', opacity: 0.7, textTransform: 'uppercase' }}>Expires</div>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', fontFamily: 'monospace' }}>
                {card.expiryMonth}/{card.expiryYear?.slice(-2)}
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: '900', fontStyle: 'italic', letterSpacing: '0.02em', color: '#ffffff' }}>
                {card.network}
              </div>
            </div>
          </div>
        </div>

        {/* BACK */}
        <div
          className="card-flip-back"
          style={{
            background: getCardBg(),
            color: '#ffffff',
            padding: '16px 0',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          {/* Black Magnetic Strip */}
          <div style={{ width: '100%', height: '42px', background: '#0a0a0a', marginTop: '10px' }} />

          {/* Signature & CVV Panel */}
          <div style={{ padding: '0 24px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                flex: 1,
                height: '36px',
                background: '#ffffff',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                padding: '0 10px',
                color: '#334155',
                fontFamily: 'cursive',
                fontSize: '0.85rem',
              }}
            >
              Authorized Signature
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.65rem', opacity: 0.8, textTransform: 'uppercase' }}>CVV</div>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setShowCvv(!showCvv);
                }}
                style={{
                  background: '#ffffff',
                  color: '#0f172a',
                  padding: '4px 10px',
                  borderRadius: '4px',
                  fontWeight: '800',
                  fontFamily: 'monospace',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <span>{showCvv ? card.cvv : '•••'}</span>
                {showCvv ? <EyeOff size={13} /> : <Eye size={13} />}
              </div>
            </div>
          </div>

          {/* Support Helpline & Disclaimers */}
          <div style={{ padding: '0 24px', fontSize: '0.68rem', opacity: 0.75, textAlign: 'center', lineHeight: '1.4' }}>
            This card is the property of SecureBank. 24x7 Customer Helpline: 1800 1234. If found, please return to any SecureBank branch.
          </div>
        </div>
      </div>

      {/* Helper Flip Hint */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.75rem', color: '#64748b', marginTop: '8px' }}>
        <RotateCw size={12} /> Click card to flip & view CVV
      </div>
    </div>
  );
};
