import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import { DemoSwitcherBar } from '../../components/common/DemoSwitcherBar';
import {
  ShieldCheck,
  Zap,
  CreditCard,
  Banknote,
  Smartphone,
  ArrowRight,
  Calculator,
  Lock,
  Percent,
  CheckCircle2,
  Users,
  Building,
  Award,
} from 'lucide-react';

export const Home = () => {
  // Live Loan EMI Calculator State
  const [loanAmount, setLoanAmount] = useState(500000);
  const [tenureYears, setTenureYears] = useState(5);
  const [interestRate, setInterestRate] = useState(8.5);

  const calculateEmi = () => {
    const monthlyRate = interestRate / (12 * 100);
    const months = tenureYears * 12;
    const emi =
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);
    return Math.round(emi);
  };

  const monthlyEmi = calculateEmi();
  const totalRepayment = monthlyEmi * tenureYears * 12;
  const totalInterest = totalRepayment - loanAmount;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
      <DemoSwitcherBar />
      <Navbar />

      {/* Live Interest Rates Ticker */}
      <div style={{ background: '#12184a', color: '#ffffff', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden' }}>
        <div style={{ maxWidth: '1350px', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', fontSize: '0.825rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ background: '#00a4e4', color: '#ffffff', padding: '2px 8px', borderRadius: '4px', fontWeight: '800', fontSize: '0.7rem' }}>
              RATES TODAY
            </span>
            <span style={{ color: '#cbd5e1' }}>Fixed Deposit (400 Days): <strong style={{ color: '#ffd700' }}>7.10% p.a.</strong></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', color: '#cbd5e1' }}>
            <span>Home Loan starting at: <strong style={{ color: '#38bdf8' }}>8.40% p.a.</strong></span>
            <span>•</span>
            <span>Car Loan: <strong style={{ color: '#38bdf8' }}>8.75% p.a.</strong></span>
            <span>•</span>
            <span>Savings Deposit APY: <strong style={{ color: '#38bdf8' }}>3.50%</strong></span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section
        style={{
          background: 'linear-gradient(135deg, #0a0e29 0%, #1c2a8f 60%, #00a4e4 100%)',
          color: '#ffffff',
          padding: '80px 24px 100px 24px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ maxWidth: '1350px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '50px', alignItems: 'center' }}>
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(8px)',
                padding: '6px 14px',
                borderRadius: '999px',
                fontSize: '0.825rem',
                fontWeight: '600',
                marginBottom: '20px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <Zap size={15} color="#ffd700" />
              <span>Next-Gen Omnichannel Banking Experience</span>
            </div>

            <h1 style={{ fontSize: 'clamp(2.4rem, 4vw, 3.6rem)', lineHeight: '1.15', fontWeight: '800', color: '#ffffff', marginBottom: '20px' }}>
              The Banker to Every Indian, Now Completely Digital.
            </h1>

            <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#e0e7ff', marginBottom: '36px', maxWidth: '560px' }}>
              Manage accounts, execute instant 24x7 transfers (NEFT / RTGS / IMPS / UPI), configure cards with 3D controls, and access instant pre-approved loans with real-time double-entry settlement.
            </p>

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <Link to="/login?tab=customer" className="btn btn-cyan btn-lg" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span>Retail Customer Portal</span>
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/login?tab=admin"
                className="btn btn-sm"
                style={{
                  background: '#f5a623',
                  color: '#12184a',
                  fontWeight: '800',
                  padding: '14px 22px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.95rem',
                }}
              >
                <ShieldCheck size={20} />
                <span>Bank Admin Portal ⚡</span>
              </Link>
              <Link to="/register" className="btn btn-outline-white btn-lg">
                Open Account
              </Link>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginTop: '40px', fontSize: '0.825rem', color: '#cbd5e1' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={16} color="#34d399" />
                <span>Zero Paperwork</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={16} color="#34d399" />
                <span>Instant Virtual Visa Card</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={16} color="#34d399" />
                <span>256-Bit SSL Encryption</span>
              </div>
            </div>
          </div>

          {/* Hero Banking Card Mockup */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div
              style={{
                width: '100%',
                maxWidth: '440px',
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                borderRadius: '24px',
                padding: '28px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#cbd5e1', textTransform: 'uppercase' }}>Primary Account Balance</div>
                  <div style={{ fontSize: '2.2rem', fontWeight: '800', color: '#ffffff' }}>₹1,48,500.00</div>
                </div>
                <span className="badge badge-success">ACTIVE</span>
              </div>

              {/* Sample Quick Action Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
                <div style={{ background: 'rgba(255, 255, 255, 0.15)', padding: '12px', borderRadius: '12px', textAlign: 'center' }}>
                  <Smartphone size={20} color="#38bdf8" style={{ margin: '0 auto 6px auto' }} />
                  <div style={{ fontSize: '0.75rem', fontWeight: '600' }}>UPI Pay</div>
                </div>
                <div style={{ background: 'rgba(255, 255, 255, 0.15)', padding: '12px', borderRadius: '12px', textAlign: 'center' }}>
                  <CreditCard size={20} color="#f5a623" style={{ margin: '0 auto 6px auto' }} />
                  <div style={{ fontSize: '0.75rem', fontWeight: '600' }}>Cards</div>
                </div>
                <div style={{ background: 'rgba(255, 255, 255, 0.15)', padding: '12px', borderRadius: '12px', textAlign: 'center' }}>
                  <Banknote size={20} color="#34d399" style={{ margin: '0 auto 6px auto' }} />
                  <div style={{ fontSize: '0.75rem', fontWeight: '600' }}>Quick Loan</div>
                </div>
              </div>

              <div style={{ background: 'rgba(0, 0, 0, 0.2)', padding: '14px 18px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>
                  <div>A/C: •••• •••• 4619</div>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>IFSC: SecureBankN0001234</div>
                </div>
                <Link to="/login" className="btn btn-sm btn-cyan">
                  Explore Live
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Network Stats */}
      <section style={{ background: '#ffffff', borderBottom: '1px solid var(--border-light)', padding: '36px 24px' }}>
        <div style={{ maxWidth: '1350px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '30px', textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: '2.2rem', fontWeight: '800', color: '#1c2a8f' }}>500 Million+</div>
            <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Happy Banking Customers</div>
          </div>
          <div>
            <div style={{ fontSize: '2.2rem', fontWeight: '800', color: '#1c2a8f' }}>22,400+</div>
            <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Bank Branches Pan India</div>
          </div>
          <div>
            <div style={{ fontSize: '2.2rem', fontWeight: '800', color: '#1c2a8f' }}>62,000+</div>
            <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Nationwide ATM Network</div>
          </div>
          <div>
            <div style={{ fontSize: '2.2rem', fontWeight: '800', color: '#10b981' }}>99.98%</div>
            <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Digital System Uptime</div>
          </div>
        </div>
      </section>

      {/* Core Banking Products Showcase */}
      <section style={{ padding: '80px 24px', maxWidth: '1350px', margin: '0 auto', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <span className="badge badge-primary" style={{ marginBottom: '12px' }}>FLAGSHIP OFFERINGS</span>
          <h2 style={{ fontSize: '2.3rem', fontWeight: '800', color: '#0f172a' }}>
            Tailored Financial Products for Every Milestone
          </h2>
          <p style={{ color: '#64748b', maxWidth: '600px', margin: '12px auto 0 auto' }}>
            Experience the state-of-the-art digital infrastructure built for seamless wealth growth, smart payments, and instant credit.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '28px' }}>
          {/* Card 1 */}
          <div className="stat-card">
            <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: '#eff6ff', color: '#1c2a8f', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
              <Users size={26} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '10px' }}>Digital Savings Account</h3>
            <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: '1.6', flex: 1, marginBottom: '20px' }}>
              Zero balance Insta Plus savings account with complimentary Visa Platinum card, high APY, and paperless online video KYC verification.
            </p>
            <Link to="/register" style={{ color: '#1c2a8f', fontWeight: '700', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              Apply in 2 Minutes <ArrowRight size={16} />
            </Link>
          </div>

          {/* Card 2 */}
          <div className="stat-card">
            <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: '#fdf4ff', color: '#a21caf', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
              <CreditCard size={26} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '10px' }}>Cards & 3D Security</h3>
            <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: '1.6', flex: 1, marginBottom: '20px' }}>
              Manage physical and virtual RuPay & Visa cards. Toggle freeze, adjust daily ATM/e-commerce limits, or enable contactless payments on demand.
            </p>
            <Link to="/login" style={{ color: '#a21caf', fontWeight: '700', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              Explore Card Controls <ArrowRight size={16} />
            </Link>
          </div>

          {/* Card 3 */}
          <div className="stat-card">
            <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
              <Banknote size={26} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '10px' }}>Pre-Approved Loans</h3>
            <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: '1.6', flex: 1, marginBottom: '20px' }}>
              Instant personal, car, and home loans with flexible tenures, competitive interest rates starting at 8.4%, and automated fund disbursement.
            </p>
            <Link to="/login" style={{ color: '#059669', fontWeight: '700', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              Check Loan Eligibility <ArrowRight size={16} />
            </Link>
          </div>

          {/* Card 4 */}
          <div className="stat-card">
            <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: '#fffbeb', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
              <Percent size={26} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '10px' }}>Fixed & Recurring Deposits</h3>
            <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: '1.6', flex: 1, marginBottom: '20px' }}>
              Lock in guaranteed returns with SecureBank Amrit Kalash deposits yielding up to 7.6% APY with premature liquidity and auto-rollover facilities.
            </p>
            <Link to="/login" style={{ color: '#d97706', fontWeight: '700', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              Open e-Deposit <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Interactive Loan EMI Calculator Section */}
      <section style={{ background: '#f1f5f9', padding: '80px 24px', borderTop: '1px solid var(--border-light)', borderBottom: '1px solid var(--border-light)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span className="badge badge-cyan" style={{ marginBottom: '10px' }}>FINANCIAL TOOLS</span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#0f172a' }}>Interactive EMI Calculator</h2>
            <p style={{ color: '#64748b' }}>Calculate your monthly installment before applying for your dream loan</p>
          </div>

          <div
            style={{
              background: '#ffffff',
              borderRadius: '20px',
              padding: '40px',
              boxShadow: 'var(--shadow-lg)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '40px',
            }}
          >
            {/* Controls */}
            <div>
              {/* Amount Slider */}
              <div style={{ marginBottom: '28px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#334155' }}>Loan Amount:</span>
                  <span style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1c2a8f' }}>₹{loanAmount.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min="50000"
                  max="5000000"
                  step="50000"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#1c2a8f' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>
                  <span>₹50,000</span>
                  <span>₹50,00,000</span>
                </div>
              </div>

              {/* Interest Slider */}
              <div style={{ marginBottom: '28px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#334155' }}>Interest Rate (% p.a.):</span>
                  <span style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1c2a8f' }}>{interestRate}%</span>
                </div>
                <input
                  type="range"
                  min="6.5"
                  max="16.0"
                  step="0.25"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#1c2a8f' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>
                  <span>6.5%</span>
                  <span>16.0%</span>
                </div>
              </div>

              {/* Tenure Slider */}
              <div style={{ marginBottom: '28px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#334155' }}>Loan Tenure:</span>
                  <span style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1c2a8f' }}>{tenureYears} Years ({tenureYears * 12} Months)</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="30"
                  step="1"
                  value={tenureYears}
                  onChange={(e) => setTenureYears(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#1c2a8f' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>
                  <span>1 Year</span>
                  <span>30 Years</span>
                </div>
              </div>
            </div>

            {/* Results Box */}
            <div
              style={{
                background: 'linear-gradient(135deg, #1c2a8f 0%, #0a3d91 100%)',
                color: '#ffffff',
                borderRadius: '16px',
                padding: '32px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ fontSize: '0.85rem', color: '#93c5fd', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Monthly Loan EMI
                </div>
                <div style={{ fontSize: '2.6rem', fontWeight: '800', margin: '8px 0 24px 0' }}>
                  ₹{monthlyEmi.toLocaleString('en-IN')}
                </div>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '18px', display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.9rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#bfdbfe' }}>Principal Amount:</span>
                    <strong>₹{loanAmount.toLocaleString('en-IN')}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#bfdbfe' }}>Total Interest Payable:</span>
                    <strong>₹{Math.max(0, totalInterest).toLocaleString('en-IN')}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#bfdbfe' }}>Total Payment (Principal + Int):</span>
                    <strong>₹{Math.max(loanAmount, totalRepayment).toLocaleString('en-IN')}</strong>
                  </div>
                </div>
              </div>

              <Link to="/login" className="btn btn-cyan" style={{ marginTop: '28px', width: '100%' }}>
                Apply for Loan Online
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Security Assurance Banner */}
      <section style={{ padding: '70px 24px', background: '#ffffff', textAlign: 'center' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
            <Lock size={30} />
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '14px' }}>
            Safe, Certified & Governed Digital Banking
          </h2>
          <p style={{ color: '#64748b', fontSize: '1rem', lineHeight: '1.6', marginBottom: '30px' }}>
            Our infrastructure adheres to the Reserve Bank of India (RBI) master directions on digital payment security controls. Multi-factor authentication, masked credentials, end-to-end 256-bit encryption, and active fraud detection.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', flexWrap: 'wrap' }}>
            <span className="badge badge-success" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
              ✓ RBI Regulated Bank
            </span>
            <span className="badge badge-cyan" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
              ✓ ISO 27001 Certified
            </span>
            <span className="badge badge-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
              ✓ 256-Bit SSL Encryption
            </span>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
