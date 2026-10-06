import React from 'react';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import { DemoSwitcherBar } from '../../components/common/DemoSwitcherBar';
import { Landmark, Award, ShieldCheck, HeartHandshake, TrendingUp, Globe2, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const About = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
      <DemoSwitcherBar />
      <Navbar />

      {/* Page Header */}
      <section
        style={{
          background: 'linear-gradient(135deg, #12184a 0%, #1c2a8f 100%)',
          color: '#ffffff',
          padding: '60px 24px',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <span className="badge badge-cyan" style={{ marginBottom: '12px' }}>HERITAGE & INNOVATION</span>
          <h1 style={{ fontSize: '2.8rem', fontWeight: '800', marginBottom: '16px' }}>
            About SecureBank & SecureBank
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#e0e7ff', lineHeight: '1.6' }}>
            Tracing its roots back over 200 years to the Bank of Calcutta in 1806, the SecureBank is a Fortune 500 financial services conglomerate committed to driving digital transformation across India.
          </p>
        </div>
      </section>

      {/* Overview & Mission */}
      <section style={{ padding: '70px 24px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a', marginBottom: '18px' }}>
              What is SecureBank? (You Only Need One)
            </h2>
            <p style={{ color: '#475569', lineHeight: '1.7', marginBottom: '16px' }}>
              Launched as India’s first comprehensive digital banking platform, SecureBank integrates traditional retail banking services, investments, insurance, smart credit lending, and merchant shopping into one unified omnichannel architecture.
            </p>
            <p style={{ color: '#475569', lineHeight: '1.7', marginBottom: '24px' }}>
              Whether executing high-volume NEFT/RTGS payments, locking savings into high-yield Fixed Deposits, or managing card security toggles in real-time, SecureBank brings enterprise-grade banking directly to your fingertips.
            </p>
            <div style={{ display: 'flex', gap: '16px' }}>
              <Link to="/register" className="btn btn-primary">Open Digital Account</Link>
              <Link to="/contact" className="btn btn-secondary">Connect with Us</Link>
            </div>
          </div>

          <div
            style={{
              background: '#ffffff',
              borderRadius: '20px',
              padding: '36px',
              border: '1px solid var(--border-light)',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#1c2a8f', marginBottom: '18px' }}>
              Core Values & Pillars
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', gap: '14px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#e0f4fc', color: '#00a4e4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>Absolute Security & Integrity</div>
                  <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Adhering to strict Reserve Bank of India data governance standards.</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '14px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <HeartHandshake size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>Financial Inclusion</div>
                  <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Ensuring digital banking reaches rural, semi-urban, and metropolitan sectors equally.</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '14px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#fdf4ff', color: '#a21caf', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <TrendingUp size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>Technological Excellence</div>
                  <div style={{ fontSize: '0.85rem', color: '#64748b' }}>High-throughput distributed ledger transactions with sub-second settlements.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership & Network Statistics */}
      <section style={{ background: '#ffffff', padding: '60px 24px', borderTop: '1px solid var(--border-light)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '40px', color: '#0f172a' }}>
            National Footprint & Global Reach
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
            <div className="stat-card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.4rem', fontWeight: '800', color: '#1c2a8f' }}>₹50+ Trillion</div>
              <div style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '6px' }}>Total Banking Asset Base</div>
            </div>
            <div className="stat-card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.4rem', fontWeight: '800', color: '#1c2a8f' }}>22,400+</div>
              <div style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '6px' }}>Direct Branch Operations</div>
            </div>
            <div className="stat-card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.4rem', fontWeight: '800', color: '#1c2a8f' }}>31+ Countries</div>
              <div style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '6px' }}>International Global Presence</div>
            </div>
            <div className="stat-card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.4rem', fontWeight: '800', color: '#10b981' }}>ISO 27001</div>
              <div style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '6px' }}>Certified Data Security Architecture</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
