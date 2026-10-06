import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import { useNotification } from '../../context/NotificationContext';
import {
  CreditCard,
  Search,
  Filter,
  Lock,
  Unlock,
  ShieldAlert,
  Wifi,
  Globe,
} from 'lucide-react';

export const CardManagement = () => {
  const { showToast } = useNotification();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [cardTypeFilter, setCardTypeFilter] = useState('all');

  const fetchCards = async () => {
    setLoading(true);
    try {
      const data = await api.getAdminCards({
        status: statusFilter,
        cardType: cardTypeFilter,
      });
      setCards(data.cards || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, [statusFilter, cardTypeFilter]);

  const handleUpdateStatus = async (card, newStatus) => {
    const confirm = window.confirm(`Change card ending in ${card.cardNumber.slice(-4)} to ${newStatus}?`);
    if (!confirm) return;

    try {
      await api.updateAdminCardStatus(card._id, newStatus);
      showToast(`Card status updated to ${newStatus}`, 'info');
      fetchCards();
    } catch (err) {
      alert(err.message || 'Failed to update card status');
    }
  };

  return (
    <div className="page-body">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0f172a' }}>Card Governance & Fraud Controls</h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
            Inspect issued Visa, RuPay and Mastercard debit/credit cards across the bank ({cards.length} total)
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
          gap: '12px',
          flexWrap: 'wrap',
        }}
      >
        <select
          className="form-control"
          style={{ width: 'auto', padding: '8px 12px', fontSize: '0.85rem' }}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Card Statuses</option>
          <option value="active">Active</option>
          <option value="frozen">Frozen by Customer</option>
          <option value="blocked">Blocked / Suspended</option>
        </select>

        <select
          className="form-control"
          style={{ width: 'auto', padding: '8px 12px', fontSize: '0.85rem' }}
          value={cardTypeFilter}
          onChange={(e) => setCardTypeFilter(e.target.value)}
        >
          <option value="all">All Card Types</option>
          <option value="Debit">Debit Cards</option>
          <option value="Credit">Credit Cards</option>
        </select>
      </div>

      {/* Cards Table */}
      <div className="data-table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Card Details</th>
              <th>Cardholder</th>
              <th>Type / Tier</th>
              <th>Linked Account</th>
              <th>Daily Limits</th>
              <th>Channels</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                  Loading issued cards directory...
                </td>
              </tr>
            ) : cards.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                  No cards found.
                </td>
              </tr>
            ) : (
              cards.map((c) => (
                <tr key={c._id}>
                  <td>
                    <div style={{ fontFamily: 'monospace', fontWeight: '800', fontSize: '0.9rem', color: '#1c2a8f' }}>
                      {c.cardNumber}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                      Exp: {c.expiryMonth}/{c.expiryYear?.slice(-2)}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: '700', color: '#1e293b' }}>{c.cardHolderName}</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{c.userId?.email}</div>
                  </td>
                  <td>
                    <span className="badge badge-primary">{c.cardType}</span>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>{c.network} ({c.variant})</div>
                  </td>
                  <td>
                    <div style={{ fontFamily: 'monospace', fontWeight: '600', fontSize: '0.825rem' }}>
                      A/C: {c.accountId?.accountNumber || 'Primary'}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.78rem' }}>ATM: ₹{c.dailyAtmLimit?.toLocaleString('en-IN')}</div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Online: ₹{c.dailyOnlineLimit?.toLocaleString('en-IN')}</div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {c.onlineEnabled && <span className="badge badge-cyan" title="E-Commerce Enabled">E-Com</span>}
                      {c.internationalEnabled && <span className="badge badge-primary" title="International Enabled">Global</span>}
                      {c.contactlessEnabled && <span className="badge badge-success" title="Contactless Enabled">NFC</span>}
                    </div>
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        c.status === 'active'
                          ? 'badge-success'
                          : c.status === 'frozen'
                          ? 'badge-warning'
                          : 'badge-danger'
                      }`}
                    >
                      {c.status?.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {c.status !== 'blocked' ? (
                        <button
                          onClick={() => handleUpdateStatus(c, 'blocked')}
                          className="btn btn-danger btn-sm"
                          style={{ padding: '4px 8px', fontSize: '0.72rem' }}
                        >
                          <Lock size={12} /> Block
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUpdateStatus(c, 'active')}
                          className="btn btn-primary btn-sm"
                          style={{ padding: '4px 8px', fontSize: '0.72rem' }}
                        >
                          <Unlock size={12} /> Activate
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
