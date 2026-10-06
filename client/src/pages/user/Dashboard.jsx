import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api/client';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Eye,
  EyeOff,
  Copy,
  Check,
  CreditCard,
  Banknote,
  Send,
  PlusCircle,
  FileText,
  Clock,
  ShieldCheck,
  ChevronRight,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card3D } from '../../components/common/Card3D';
import { ReceiptModal } from '../../components/common/ReceiptModal';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

export const Dashboard = () => {
  const { user, primaryAccount, refreshUser } = useAuth();
  const [showBalance, setShowBalance] = useState(true);
  const [copiedAcc, setCopiedAcc] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [cards, setCards] = useState([]);
  const [loans, setLoans] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [selectedTxn, setSelectedTxn] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [accRes, txnRes, cardRes, loanRes, anaRes] = await Promise.all([
          api.getMyAccounts(),
          api.getMyTransactions({ limit: 5 }),
          api.getMyCards(),
          api.getMyLoans(),
          api.getAnalytics(),
        ]);

        setAccounts(accRes.accounts || []);
        setTransactions(txnRes.transactions || []);
        setCards(cardRes.cards || []);
        setLoans(loanRes.loans || []);
        setAnalytics(anaRes);
      } catch (err) {
        console.error('Dashboard data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleCopyAcc = (num) => {
    navigator.clipboard.writeText(num);
    setCopiedAcc(true);
    setTimeout(() => setCopiedAcc(false), 2000);
  };

  const primaryAcc = accounts.find((a) => a.isPrimary) || accounts[0] || primaryAccount;
  const primaryCard = cards[0];
  const activeLoan = loans.find((l) => l.status === 'disbursed' || l.status === 'approved');

  // Cashflow Bar Chart Data
  const barData = {
    labels: analytics?.cashflow?.months || ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
    datasets: [
      {
        label: 'Credits (Income/Inflow)',
        data: analytics?.cashflow?.credits || [65000, 65000, 72000, 65000, 68000, 95000],
        backgroundColor: '#10b981',
        borderRadius: 6,
      },
      {
        label: 'Debits (Spends/Outflow)',
        data: analytics?.cashflow?.debits || [24500, 18200, 32400, 21900, 28500, 23915],
        backgroundColor: '#1c2a8f',
        borderRadius: 6,
      },
    ],
  };

  // Spending Categories Donut Data
  const donutData = {
    labels: ['Transfer', 'Bills', 'Dining & Food', 'Loan EMI', 'Others'],
    datasets: [
      {
        data: [5000, 1800, 3200, 13915, 2500],
        backgroundColor: ['#1c2a8f', '#00a4e4', '#f5a623', '#6a1b9a', '#94a3b8'],
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };

  return (
    <div className="page-body">
      {/* KYC Warning Banner if pending */}
      {user?.kycStatus === 'pending' && (
        <div
          style={{
            background: '#fffbeb',
            border: '1px solid #fde68a',
            borderRadius: '12px',
            padding: '14px 20px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertCircle size={20} color="#d97706" />
            <span style={{ fontSize: '0.875rem', color: '#92400e', fontWeight: '600' }}>
              Your KYC documents are currently under review by our branch administration.
            </span>
          </div>
          <Link to="/user/profile" className="btn btn-sm" style={{ background: '#d97706', color: '#ffffff' }}>
            View KYC Details
          </Link>
        </div>
      )}

      {/* Top Section: Balance Card & Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px', marginBottom: '28px' }}>
        {/* Primary Wealth Card */}
        <div
          style={{
            background: 'linear-gradient(135deg, #12184a 0%, #1c2a8f 60%, #00a4e4 100%)',
            color: '#ffffff',
            borderRadius: '20px',
            padding: '28px',
            boxShadow: 'var(--shadow-card)',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '230px',
          }}
        >
          {/* Subtle decoration */}
          <div
            style={{
              position: 'absolute',
              top: '-30px',
              right: '-30px',
              width: '160px',
              height: '160px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.08)',
              pointerEvents: 'none',
            }}
          />

          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.08em', color: '#93c5fd', textTransform: 'uppercase' }}>
                  {primaryAcc?.accountType || 'Savings'} Account
                </span>
                <span style={{ background: '#10b981', color: '#ffffff', fontSize: '0.65rem', padding: '1px 6px', borderRadius: '4px', fontWeight: '700' }}>
                  PRIMARY
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowBalance(!showBalance)}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '4px 8px',
                  color: '#ffffff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.75rem',
                }}
              >
                {showBalance ? <EyeOff size={14} /> : <Eye size={14} />}
                <span>{showBalance ? 'Hide' : 'Show'}</span>
              </button>
            </div>

            <div style={{ fontSize: '2.4rem', fontWeight: '800', letterSpacing: '-0.02em', margin: '4px 0' }}>
              {showBalance ? `₹${(primaryAcc?.balance || 0).toLocaleString('en-IN')}.00` : '₹ ••••••••'}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.825rem', color: '#cbd5e1' }}>
              <span>A/C: <strong>{primaryAcc?.accountNumber || '30918274619'}</strong></span>
              <button
                type="button"
                onClick={() => handleCopyAcc(primaryAcc?.accountNumber || '30918274619')}
                style={{ background: 'transparent', border: 'none', color: '#38bdf8', cursor: 'pointer', padding: 0 }}
                title="Copy Account Number"
              >
                {copiedAcc ? <Check size={14} color="#34d399" /> : <Copy size={14} />}
              </button>
              <span>•</span>
              <span>IFSC: {primaryAcc?.ifscCode || 'SecureBankN0001234'}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
            <Link to="/user/transfer" className="btn btn-cyan btn-sm" style={{ flex: 1 }}>
              <Send size={15} /> Send Money
            </Link>
            <Link to="/user/accounts" className="btn btn-outline-white btn-sm" style={{ flex: 1 }}>
              <FileText size={15} /> Statement
            </Link>
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '20px',
            padding: '26px',
            border: '1px solid var(--border-light)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a' }}>Quick Banking Actions</h3>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Fast Shortcuts</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
            <Link
              to="/user/transfer"
              style={{
                background: '#f8fafc',
                border: '1px solid var(--border-light)',
                borderRadius: '12px',
                padding: '14px 10px',
                textAlign: 'center',
                transition: 'var(--transition)',
              }}
              className="quick-tile"
            >
              <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#e0f4fc', color: '#00a4e4', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px auto' }}>
                <Send size={18} />
              </div>
              <span style={{ fontSize: '0.78rem', fontWeight: '700', color: '#334155' }}>Transfer</span>
            </Link>

            <Link
              to="/user/cards"
              style={{
                background: '#f8fafc',
                border: '1px solid var(--border-light)',
                borderRadius: '12px',
                padding: '14px 10px',
                textAlign: 'center',
                transition: 'var(--transition)',
              }}
            >
              <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#fdf4ff', color: '#a21caf', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px auto' }}>
                <CreditCard size={18} />
              </div>
              <span style={{ fontSize: '0.78rem', fontWeight: '700', color: '#334155' }}>Cards</span>
            </Link>

            <Link
              to="/user/loans"
              style={{
                background: '#f8fafc',
                border: '1px solid var(--border-light)',
                borderRadius: '12px',
                padding: '14px 10px',
                textAlign: 'center',
                transition: 'var(--transition)',
              }}
            >
              <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px auto' }}>
                <Banknote size={18} />
              </div>
              <span style={{ fontSize: '0.78rem', fontWeight: '700', color: '#334155' }}>Loans</span>
            </Link>

            <Link
              to="/user/accounts"
              style={{
                background: '#f8fafc',
                border: '1px solid var(--border-light)',
                borderRadius: '12px',
                padding: '14px 10px',
                textAlign: 'center',
                transition: 'var(--transition)',
              }}
            >
              <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#fffbeb', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px auto' }}>
                <PlusCircle size={18} />
              </div>
              <span style={{ fontSize: '0.78rem', fontWeight: '700', color: '#334155' }}>New FD</span>
            </Link>

            <Link
              to="/user/transactions"
              style={{
                background: '#f8fafc',
                border: '1px solid var(--border-light)',
                borderRadius: '12px',
                padding: '14px 10px',
                textAlign: 'center',
                transition: 'var(--transition)',
              }}
            >
              <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#eef2ff', color: '#1c2a8f', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px auto' }}>
                <Clock size={18} />
              </div>
              <span style={{ fontSize: '0.78rem', fontWeight: '700', color: '#334155' }}>Passbook</span>
            </Link>

            <Link
              to="/user/profile"
              style={{
                background: '#f8fafc',
                border: '1px solid var(--border-light)',
                borderRadius: '12px',
                padding: '14px 10px',
                textAlign: 'center',
                transition: 'var(--transition)',
              }}
            >
              <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#f1f5f9', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px auto' }}>
                <ShieldCheck size={18} />
              </div>
              <span style={{ fontSize: '0.78rem', fontWeight: '700', color: '#334155' }}>KYC / PIN</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Middle Section: Financial Analytics & Active Loan Widget */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px', marginBottom: '28px' }}>
        {/* Cashflow Inflow vs Outflow Bar Chart */}
        <div style={{ background: '#ffffff', borderRadius: '20px', padding: '24px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a' }}>Monthly Cashflow Trends</h3>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Credits vs Debits (Last 6 Months)</span>
            </div>
            <span className="badge badge-success">Live Ledger</span>
          </div>
          <div style={{ height: '220px' }}>
            <Bar
              data={barData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'top', labels: { boxWidth: 12, font: { size: 11 } } } },
                scales: { y: { ticks: { callback: (val) => `₹${val / 1000}k` } } },
              }}
            />
          </div>
        </div>

        {/* Spending Category Donut */}
        <div style={{ background: '#ffffff', borderRadius: '20px', padding: '24px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a' }}>Expense Breakdown</h3>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>By Category This Month</span>
            </div>
            <TrendingUp size={18} color="#1c2a8f" />
          </div>
          <div style={{ height: '220px', display: 'flex', justifyContent: 'center' }}>
            <Doughnut
              data={donutData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'right', labels: { boxWidth: 10, font: { size: 10 } } } },
              }}
            />
          </div>
        </div>
      </div>

      {/* Bottom Section: Recent Transactions & Card Glance */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
        {/* Recent Transactions Table */}
        <div style={{ background: '#ffffff', borderRadius: '20px', padding: '24px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a' }}>Recent Transactions</h3>
            <Link to="/user/transactions" style={{ fontSize: '0.8rem', color: '#1c2a8f', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
              View All <ChevronRight size={14} />
            </Link>
          </div>

          {transactions.length === 0 ? (
            <div style={{ padding: '30px', textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem' }}>
              No transactions recorded yet.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {transactions.map((t) => {
                const isDebit = t.direction === 'debit';
                return (
                  <div
                    key={t._id}
                    onClick={() => setSelectedTxn(t)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 14px',
                      borderRadius: '12px',
                      background: '#f8fafc',
                      cursor: 'pointer',
                      transition: 'var(--transition)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div
                        style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '10px',
                          background: isDebit ? '#fef2f2' : '#ecfdf5',
                          color: isDebit ? '#ef4444' : '#10b981',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {isDebit ? <ArrowUpRight size={18} /> : <ArrowDownLeft size={18} />}
                      </div>
                      <div>
                        <div style={{ fontSize: '0.875rem', fontWeight: '700', color: '#1e293b' }}>
                          {isDebit ? t.receiverName : t.senderName || 'Credit / Deposit'}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                          {new Date(t.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })} • {t.category}
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.95rem', fontWeight: '800', color: isDebit ? '#ef4444' : '#10b981' }}>
                        {isDebit ? '-' : '+'}₹{Number(t.amount).toLocaleString('en-IN')}
                      </div>
                      <span className={`badge ${t.status === 'completed' ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '0.65rem' }}>
                        {t.status?.toUpperCase()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Card Quick Preview & Active Loan */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {primaryCard ? (
            <div style={{ background: '#ffffff', borderRadius: '20px', padding: '24px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a' }}>Active Card</h3>
                <Link to="/user/cards" style={{ fontSize: '0.8rem', color: '#00a4e4', fontWeight: '700' }}>
                  Card Controls →
                </Link>
              </div>
              <Card3D card={primaryCard} />
            </div>
          ) : null}

          {/* Active Loan Snapshot */}
          {activeLoan && (
            <div style={{ background: '#ffffff', borderRadius: '20px', padding: '24px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span className="badge badge-plum">{activeLoan.loanType}</span>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Rate: {activeLoan.interestRate}% p.a.</span>
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a' }}>
                ₹{activeLoan.outstandingAmount.toLocaleString('en-IN')}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '12px' }}>
                Outstanding balance • Monthly EMI: ₹{activeLoan.monthlyEmi.toLocaleString('en-IN')}
              </div>
              <Link to="/user/loans" className="btn btn-primary btn-sm" style={{ width: '100%' }}>
                Pay EMI Installment
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Transaction Slip Receipt Modal */}
      <ReceiptModal
        isOpen={!!selectedTxn}
        onClose={() => setSelectedTxn(null)}
        transaction={selectedTxn}
      />
    </div>
  );
};
