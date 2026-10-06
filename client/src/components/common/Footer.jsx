import React from 'react';
import { Link } from 'react-router-dom';
import { Landmark, Shield, Phone, Mail, MapPin, ExternalLink, Lock } from 'lucide-react';

export const Footer = () => {
  return (
    <footer style={{ background: '#0a0e29', color: '#cbd5e1', paddingTop: '60px', paddingBottom: '30px', borderTop: '1px solid #1e293b' }}>
      <div style={{ maxWidth: '1350px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '40px', marginBottom: '50px' }}>
          {/* Col 1 */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #1c2a8f 0%, #00a4e4 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                }}
              >
                <Landmark size={20} />
              </div>
              <span style={{ fontSize: '1.4rem', fontWeight: '800', color: '#ffffff' }}>
                YONO <span style={{ color: '#00a4e4' }}>SBI</span>
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', lineHeight: '1.6', color: '#94a3b8', marginBottom: '20px' }}>
              SecureBank's flagship digital banking platform. Empowering over 500 million citizens with seamless financial inclusion, instant transfers, smart loans, and secure card operations.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontSize: '0.8rem', fontWeight: '600' }}>
              <Lock size={15} /> 256-Bit SSL Encrypted Banking
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1rem', fontWeight: '700', marginBottom: '18px' }}>Digital Services</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.875rem' }}>
              <li><Link to="/user/dashboard" style={{ color: '#94a3b8' }}>Savings & Current Accounts</Link></li>
              <li><Link to="/user/transfer" style={{ color: '#94a3b8' }}>Instant Funds Transfer (NEFT/RTGS/IMPS)</Link></li>
              <li><Link to="/user/cards" style={{ color: '#94a3b8' }}>RuPay & Visa Debit/Credit Cards</Link></li>
              <li><Link to="/user/loans" style={{ color: '#94a3b8' }}>Personal & Home Loans</Link></li>
              <li><Link to="/user/accounts" style={{ color: '#94a3b8' }}>e-Statements & Certificate</Link></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1rem', fontWeight: '700', marginBottom: '18px' }}>Quick Portals</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.875rem' }}>
              <li><Link to="/login" style={{ color: '#94a3b8' }}>NetBanking Customer Login</Link></li>
              <li><Link to="/register" style={{ color: '#94a3b8' }}>Online Account Opening</Link></li>
              <li><Link to="/admin/dashboard" style={{ color: '#00a4e4', fontWeight: '600' }}>Bank Administration Portal</Link></li>
              <li><Link to="/about" style={{ color: '#94a3b8' }}>About SecureBank</Link></li>
              <li><Link to="/contact" style={{ color: '#94a3b8' }}>Customer Grievance & Helpdesk</Link></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1rem', fontWeight: '700', marginBottom: '18px' }}>24x7 Customer Care</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.875rem', color: '#94a3b8' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Phone size={16} color="#00a4e4" />
                <span>1800 1234 / 1800 2100 (Toll Free)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Mail size={16} color="#00a4e4" />
                <span>support@securebank.com</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <MapPin size={16} color="#00a4e4" style={{ marginTop: '2px', flexShrink: 0 }} />
                <span>SecureBank Main Branch, Mumbai - 400021</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid #1e293b', paddingTop: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', fontSize: '0.8rem', color: '#64748b' }}>
          <div>
            © 2026 SecureBank. Digital Banking Dashboard Project. Built for MCA SEM 3.
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>RBI Safe Banking Guidelines</span>
            <span>Security Best Practices</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
