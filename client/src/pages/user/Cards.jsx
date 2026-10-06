import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import { useNotification } from '../../context/NotificationContext';
import { Card3D } from '../../components/common/Card3D';
import {
  CreditCard,
  Lock,
  Unlock,
  Shield,
  Sliders,
  KeyRound,
  PlusCircle,
  CheckCircle2,
  Globe,
  ShoppingBag,
  Wifi,
} from 'lucide-react';

export const Cards = () => {
  const { showToast } = useNotification();
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showPinModal, setShowPinModal] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [newPin, setNewPin] = useState('');

  // Apply card form
  const [accounts, setAccounts] = useState([]);
  const [applyData, setApplyData] = useState({
    accountId: '',
    cardType: 'Debit',
    network: 'Visa Platinum',
    variant: 'Platinum',
  });

  const fetchCards = async () => {
    try {
      const [cardRes, accRes] = await Promise.all([
        api.getMyCards(),
        api.getMyAccounts(),
      ]);
      setCards(cardRes.cards || []);
      setAccounts(accRes.accounts || []);
      if (cardRes.cards?.length > 0 && !selectedCard) {
        setSelectedCard(cardRes.cards[0]);
      }
      if (accRes.accounts?.length > 0 && !applyData.accountId) {
        setApplyData((prev) => ({ ...prev, accountId: accRes.accounts[0]._id }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const handleToggleFreeze = async () => {
    if (!selectedCard) return;
    try {
      const res = await api.toggleCardFreeze(selectedCard._id);
      showToast(res.message, 'info');
      setSelectedCard(res.card);
      fetchCards();
    } catch (err) {
      alert(err.message || 'Action failed');
    }
  };

  const handleUpdateSetting = async (field, value) => {
    if (!selectedCard) return;
    try {
      const updated = { ...selectedCard, [field]: value };
      setSelectedCard(updated);
      await api.updateCardSettings(selectedCard._id, { [field]: value });
      showToast('Card preference updated', 'success');
      fetchCards();
    } catch (err) {
      alert(err.message || 'Failed to update setting');
    }
  };

  const handleChangePin = async (e) => {
    e.preventDefault();
    if (newPin.length !== 4) {
      alert('PIN must be 4 digits');
      return;
    }
    try {
      await api.setCardPin(selectedCard._id, newPin);
      showToast('Card ATM/POS PIN updated successfully!', 'success');
      setShowPinModal(false);
      setNewPin('');
    } catch (err) {
      alert(err.message || 'Failed to update PIN');
    }
  };

  const handleApplyCard = async (e) => {
    e.preventDefault();
    try {
      await api.applyCard(applyData);
      showToast('Congratulations! Your new card is active.', 'success');
      setShowApplyModal(false);
      fetchCards();
    } catch (err) {
      alert(err.message || 'Failed to apply for card');
    }
  };

  return (
    <div className="page-body">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0f172a' }}>Cards & Security Controls</h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Manage your Debit & Credit cards with 3D security toggles</p>
        </div>
        <button onClick={() => setShowApplyModal(true)} className="btn btn-primary">
          <PlusCircle size={16} /> Apply for New Card
        </button>
      </div>

      {cards.length === 0 ? (
        <div style={{ background: '#ffffff', padding: '50px', borderRadius: '16px', textAlign: 'center' }}>
          <CreditCard size={48} color="#94a3b8" style={{ margin: '0 auto 16px auto' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>No Active Cards Issued Yet</h3>
          <button onClick={() => setShowApplyModal(true)} className="btn btn-primary" style={{ marginTop: '16px' }}>
            Request Virtual Debit Card
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '32px' }}>
          {/* Left: 3D Interactive Card & Card Switcher */}
          <div>
            <div style={{ background: '#ffffff', borderRadius: '20px', padding: '30px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <span className="badge badge-primary">
                  {selectedCard?.cardType} Card ({selectedCard?.network})
                </span>
                <span className={`badge ${selectedCard?.status === 'active' ? 'badge-success' : 'badge-warning'}`}>
                  {selectedCard?.status?.toUpperCase()}
                </span>
              </div>

              {selectedCard && <Card3D card={selectedCard} />}

              {/* Card Switcher Pills */}
              {cards.length > 1 && (
                <div style={{ display: 'flex', gap: '8px', marginTop: '24px', overflowX: 'auto', paddingBottom: '4px' }}>
                  {cards.map((c) => (
                    <button
                      key={c._id}
                      onClick={() => setSelectedCard(c)}
                      style={{
                        padding: '8px 14px',
                        borderRadius: '8px',
                        border: selectedCard?._id === c._id ? '2px solid #1c2a8f' : '1px solid var(--border-light)',
                        background: selectedCard?._id === c._id ? '#eef2ff' : '#ffffff',
                        color: selectedCard?._id === c._id ? '#1c2a8f' : '#64748b',
                        fontWeight: '700',
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {c.cardType} •••• {c.cardNumber.slice(-4)}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions Under Card */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <button
                onClick={handleToggleFreeze}
                className={`btn ${selectedCard?.status === 'frozen' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ width: '100%', padding: '12px' }}
              >
                {selectedCard?.status === 'frozen' ? (
                  <>
                    <Unlock size={16} /> Unfreeze Card
                  </>
                ) : (
                  <>
                    <Lock size={16} /> Freeze Card
                  </>
                )}
              </button>

              <button
                onClick={() => setShowPinModal(true)}
                className="btn btn-secondary"
                style={{ width: '100%', padding: '12px' }}
              >
                <KeyRound size={16} /> Change PIN
              </button>
            </div>
          </div>

          {/* Right: Security & Limit Controls */}
          {selectedCard && (
            <div
              style={{
                background: '#ffffff',
                borderRadius: '20px',
                padding: '30px',
                border: '1px solid var(--border-light)',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', marginBottom: '6px' }}>
                Instant Security Toggles
              </h3>
              <p style={{ fontSize: '0.825rem', color: '#64748b', marginBottom: '24px' }}>
                Changes apply instantly across all POS, ATM & Online payment gateways.
              </p>

              {/* Toggles List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Online Payments */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#eff6ff', color: '#1c2a8f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ShoppingBag size={20} />
                    </div>
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>Domestic E-Commerce / Online Usage</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Allow Amazon, Flipkart & online checkout transactions</div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedCard.onlineEnabled}
                    onChange={(e) => handleUpdateSetting('onlineEnabled', e.target.checked)}
                    style={{ width: '22px', height: '22px', accentColor: '#1c2a8f', cursor: 'pointer' }}
                  />
                </div>

                {/* International Usage */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#fdf4ff', color: '#a21caf', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Globe size={20} />
                    </div>
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>International Usage</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Enable overseas transactions & foreign currency POS</div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedCard.internationalEnabled}
                    onChange={(e) => handleUpdateSetting('internationalEnabled', e.target.checked)}
                    style={{ width: '22px', height: '22px', accentColor: '#1c2a8f', cursor: 'pointer' }}
                  />
                </div>

                {/* Contactless */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Wifi size={20} />
                    </div>
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>Contactless (Tap & Pay)</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>NFC tap payments up to ₹5,000 without PIN</div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedCard.contactlessEnabled}
                    onChange={(e) => handleUpdateSetting('contactlessEnabled', e.target.checked)}
                    style={{ width: '22px', height: '22px', accentColor: '#1c2a8f', cursor: 'pointer' }}
                  />
                </div>

                {/* ATM Limit Slider */}
                <div style={{ paddingTop: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: '700' }}>Daily ATM Withdrawal Limit</span>
                    <strong style={{ color: '#1c2a8f' }}>₹{selectedCard.dailyAtmLimit?.toLocaleString('en-IN') || '40,000'}</strong>
                  </div>
                  <input
                    type="range"
                    min="10000"
                    max="100000"
                    step="5000"
                    value={selectedCard.dailyAtmLimit || 40000}
                    onChange={(e) => handleUpdateSetting('dailyAtmLimit', Number(e.target.value))}
                    style={{ width: '100%', accentColor: '#1c2a8f' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#94a3b8', marginTop: '4px' }}>
                    <span>₹10,000</span>
                    <span>₹1,00,000</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Change PIN Modal */}
      {showPinModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ padding: '30px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '6px' }}>Set New Card ATM/POS PIN</h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '20px' }}>
              Enter a new 4-digit secret PIN for card ending in {selectedCard?.cardNumber.slice(-4)}.
            </p>

            <form onSubmit={handleChangePin}>
              <div className="form-group">
                <label className="form-label">New 4-Digit PIN</label>
                <input
                  type="password"
                  maxLength={4}
                  required
                  className="form-control"
                  placeholder="••••"
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                <button type="button" onClick={() => setShowPinModal(false)} className="btn btn-secondary" style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  Update PIN
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Apply New Card Modal */}
      {showApplyModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ padding: '30px' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '6px' }}>Apply for a Banking Card</h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '20px' }}>
              Select your preferred card network and link to your account.
            </p>

            <form onSubmit={handleApplyCard}>
              <div className="form-group">
                <label className="form-label">Link to Account</label>
                <select
                  className="form-control"
                  value={applyData.accountId}
                  onChange={(e) => setApplyData({ ...applyData, accountId: e.target.value })}
                >
                  {accounts.map((a) => (
                    <option key={a._id} value={a._id}>
                      {a.accountType} - •••{a.accountNumber.slice(-4)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Card Type</label>
                <select
                  className="form-control"
                  value={applyData.cardType}
                  onChange={(e) => setApplyData({ ...applyData, cardType: e.target.value })}
                >
                  <option value="Debit">Debit Card (Zero Annual Fee)</option>
                  <option value="Credit">Credit Card (Pre-approved ₹1,50,000 Limit)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Card Network & Tier</label>
                <select
                  className="form-control"
                  value={applyData.network}
                  onChange={(e) => setApplyData({ ...applyData, network: e.target.value })}
                >
                  <option value="Visa Platinum">Visa Platinum (Complimentary Airport Lounge)</option>
                  <option value="RuPay Global">RuPay Global (UPI on Credit Card Enabled)</option>
                  <option value="Mastercard World">Mastercard World (Global Zero Forex Markup)</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button type="button" onClick={() => setShowApplyModal(false)} className="btn btn-secondary" style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  Issue Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
