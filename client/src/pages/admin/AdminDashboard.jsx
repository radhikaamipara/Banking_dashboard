import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import {
  Users,
  Building2,
  ReceiptText,
  Banknote,
  CreditCard,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle2,
  XCircle,
  FileCheck2,
  Clock,
  ShieldCheck,
  TrendingUp,
  ExternalLink,
} from 'lucide-react';
import { Link } from 'react-router-dom';
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

export const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await api.getAdminStats();
      setData(res);
    } catch (err) {
      console.error('Failed to fetch admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 10000); // 10s auto refresh for live sync
    return () => clearInterval(interval);
  }, []);

  const stats = data?.stats;

  // Account Distribution Chart Data
  const distData = {
    labels: ['Savings Accounts', 'Fixed Deposits', 'Current Accounts'],
    datasets: [
      {
        data: [
          data?.accountDistribution?.savings || 3,
          data?.accountDistribution?.fixedDeposit || 1,
          data?.accountDistribution?.current || 1,
        ],
        backgroundColor: ['#1c2a8f', '#f5a623', '#00a4e4'],
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };

  // Transaction Trends
  const trendData = {
    labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Today'],
    datasets: [
      {
        label: 'System Transaction Volume (INR)',
        data: [120000, 185000, 240000, 95000, 310000, 180000, stats?.totalVolume || 380000],
        backgroundColor: '#6a1b9a',
        borderRadius: 6,
      },
    ],
  };

  return (
    <div className="page-body">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-plum" style={{ fontSize: '0.75rem' }}>OFFICIAL CONSOLE</span>
            <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: '700' }}>● Real-Time Database Sync</span>
          </div>
          <h2 style={{ fontSize: '1.7rem', fontWeight: '800', color: '#0f172a', margin: '4px 0' }}>
            Bank Administration & Governance
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
            System-wide liquidity, real-time customer ledger, loan underwriting and risk monitoring
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <Link to="/admin/loans" className="btn btn-primary btn-sm">
            <FileCheck2 size={16} /> Pending Loans ({stats?.pendingLoans || 0})
          </Link>
          <Link to="/admin/broadcast" className="btn btn-secondary btn-sm">
            Broadcast Alert
          </Link>
        </div>
      </div>

      {/* Primary KPI Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px', marginBottom: '28px' }}>
        {/* Metric 1 */}
        <div className="stat-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Total Bank Deposits</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#e0f4fc', color: '#00a4e4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Building2 size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a' }}>
            ₹{(stats?.totalDeposits || 0).toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: '600', marginTop: '4px' }}>
            Across {stats?.totalAccounts || 0} customer accounts
          </div>
        </div>

        {/* Metric 2 */}
        <div className="stat-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Registered Customers</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#eff6ff', color: '#1c2a8f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a' }}>
            {stats?.totalUsers || 0} Users
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
            {stats?.pendingKycUsers || 0} Pending KYC verification
          </div>
        </div>

        {/* Metric 3 */}
        <div className="stat-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Transaction Volume</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ReceiptText size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a' }}>
            ₹{(stats?.totalVolume || 0).toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
            {stats?.totalTransactions || 0} Total ledger records
          </div>
        </div>

        {/* Metric 4 */}
        <div className="stat-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Loan Sanctions</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#fdf4ff', color: '#a21caf', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Banknote size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a' }}>
            {stats?.pendingLoans || 0} Pending
          </div>
          <div style={{ fontSize: '0.75rem', color: stats?.pendingLoans > 0 ? '#d97706' : '#64748b', fontWeight: '600', marginTop: '4px' }}>
            {stats?.activeLoans || 0} Active loans disbursed
          </div>
        </div>
      </div>

      {/* Visual Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px', marginBottom: '28px' }}>
        {/* System Transaction Volume Trends */}
        <div style={{ background: '#ffffff', borderRadius: '20px', padding: '24px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a' }}>System Transaction Volume</h3>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Aggregate Settlement Activity</span>
            </div>
            <TrendingUp size={18} color="#6a1b9a" />
          </div>
          <div style={{ height: '220px' }}>
            <Bar
              data={trendData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { y: { ticks: { callback: (val) => `₹${val / 1000}k` } } },
              }}
            />
          </div>
        </div>

        {/* Account Types Distribution */}
        <div style={{ background: '#ffffff', borderRadius: '20px', padding: '24px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a' }}>Account Portfolio Mix</h3>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Deposits by Account Type</span>
            </div>
            <span className="badge badge-primary">{stats?.totalAccounts || 0} Accounts</span>
          </div>
          <div style={{ height: '220px', display: 'flex', justifyContent: 'center' }}>
            <Doughnut
              data={distData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'right', labels: { boxWidth: 10, font: { size: 11 } } } },
              }}
            />
          </div>
        </div>
      </div>

      {/* Action Queues Row: Pending Loans Needing Immediate Decision & Recent Transactions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
        {/* Pending Loan Applications Queue */}
        <div style={{ background: '#ffffff', borderRadius: '20px', padding: '24px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a' }}>Underwriting Queue</h3>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Submitted loan requests awaiting decision</span>
            </div>
            <Link to="/admin/loans" style={{ fontSize: '0.8rem', color: '#1c2a8f', fontWeight: '700' }}>
              Review All →
            </Link>
          </div>

          {!data?.recentLoans || data.recentLoans.length === 0 ? (
            <div style={{ padding: '30px', textAlign: 'center', color: '#94a3b8' }}>
              No loan applications in queue.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {data.recentLoans.map((loan) => (
                <div
                  key={loan._id}
                  style={{
                    padding: '14px',
                    borderRadius: '12px',
                    background: '#f8fafc',
                    border: '1px solid var(--border-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '0.875rem' }}>{loan.userId?.name || 'Applicant'}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      {loan.loanType} • ₹{loan.amount?.toLocaleString('en-IN')} ({loan.tenureMonths} Mo)
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className={`badge ${loan.status === 'pending' ? 'badge-warning' : loan.status === 'disbursed' ? 'badge-success' : 'badge-danger'}`}>
                      {loan.status?.toUpperCase()}
                    </span>
                    <Link to="/admin/loans" className="btn btn-secondary btn-sm" style={{ padding: '4px 8px', fontSize: '0.72rem' }}>
                      Act
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Global Live Transaction Feed */}
        <div style={{ background: '#ffffff', borderRadius: '20px', padding: '24px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a' }}>Global Live Ledger</h3>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Latest user transactions across entire bank</span>
            </div>
            <Link to="/admin/transactions" style={{ fontSize: '0.8rem', color: '#1c2a8f', fontWeight: '700' }}>
              Full Ledger →
            </Link>
          </div>

          {!data?.recentTransactions || data.recentTransactions.length === 0 ? (
            <div style={{ padding: '30px', textAlign: 'center', color: '#94a3b8' }}>
              No transactions logged yet.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {data.recentTransactions.map((t) => (
                <div
                  key={t._id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    background: '#f8fafc',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '0.825rem', color: '#1e293b' }}>
                      {t.senderName || 'Origin'} ➔ {t.receiverName}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', fontFamily: 'monospace' }}>
                      {t.referenceId} • {t.type?.replace('_', ' ')}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: '800', fontSize: '0.875rem', color: '#1c2a8f' }}>
                      ₹{Number(t.amount).toLocaleString('en-IN')}
                    </div>
                    <span className="badge badge-success" style={{ fontSize: '0.62rem' }}>
                      {t.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
