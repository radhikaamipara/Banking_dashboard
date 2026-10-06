import React, { useState } from 'react';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import { DemoSwitcherBar } from '../../components/common/DemoSwitcherBar';
import { Phone, Mail, MapPin, Send, CheckCircle2, AlertCircle, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { api } from '../../api/client';
import { useNotification } from '../../context/NotificationContext';

export const Contact = () => {
  const { showToast } = useNotification();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [openFaq, setOpenFaq] = useState(0);

  const faqs = [
    {
      q: 'How do I activate my NetBanking and Transaction PIN (T-PIN)?',
      a: 'Upon registering for an online savings account, you will set up a 4-digit Transaction PIN (T-PIN). You can reset or update your T-PIN anytime from your Profile & Security settings.',
    },
    {
      q: 'What is the daily fund transfer limit for retail customers?',
      a: 'Standard verified retail accounts have a default daily transfer limit of ₹1,00,000 for IMPS, NEFT, and Intra-Bank transactions. KYC verified accounts can request higher thresholds.',
    },
    {
      q: 'What should I do if my debit or credit card is lost or stolen?',
      a: 'You can immediately freeze or block your card directly from the Cards & Controls dashboard with a single click. Alternatively, call our 24x7 toll-free helpline at 1800 1234.',
    },
    {
      q: 'How quickly are loan applications processed and disbursed?',
      a: 'Online loan applications submitted via the SecureBank portal are reviewed by bank underwriters in the Admin Panel. Once approved, the funds are automatically disbursed into your primary savings account immediately.',
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage('');

    try {
      await api.submitInquiry(formData);
      setSubmitted(true);
      showToast('Inquiry submitted successfully! A branch officer will connect shortly.', 'success');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      setErrorMessage(err.message || 'Failed to submit inquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
      <DemoSwitcherBar />
      <Navbar />

      {/* Header */}
      <section
        style={{
          background: 'linear-gradient(135deg, #12184a 0%, #1c2a8f 100%)',
          color: '#ffffff',
          padding: '60px 24px',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <span className="badge badge-cyan" style={{ marginBottom: '12px' }}>WE ARE HERE TO HELP</span>
          <h1 style={{ fontSize: '2.8rem', fontWeight: '800', marginBottom: '16px' }}>
            Customer Support & Grievance Redressal
          </h1>
          <p style={{ fontSize: '1.05rem', color: '#e0e7ff', lineHeight: '1.6' }}>
            Reach out to our dedicated 24x7 customer support desk, submit an inquiry directly into our bank ledger, or locate our administrative branch.
          </p>
        </div>
      </section>

      {/* Support Cards */}
      <section style={{ padding: '40px 24px 20px 24px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          <div className="stat-card" style={{ display: 'flex', flexDirection: 'row', gap: '16px', alignItems: 'center' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: '#eff6ff', color: '#1c2a8f', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Phone size={24} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>TOLL FREE HELPLINE</div>
              <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a' }}>1800 1234 / 1800 2100</div>
              <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: '600' }}>Available 24x7x365</div>
            </div>
          </div>

          <div className="stat-card" style={{ display: 'flex', flexDirection: 'row', gap: '16px', alignItems: 'center' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: '#fdf4ff', color: '#a21caf', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Mail size={24} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>OFFICIAL EMAIL</div>
              <div style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a' }}>support@securebank.com</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Response within 24 business hours</div>
            </div>
          </div>

          <div className="stat-card" style={{ display: 'flex', flexDirection: 'row', gap: '16px', alignItems: 'center' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <MapPin size={24} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>CENTRAL HEADQUARTERS</div>
              <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0f172a' }}>State Bank Bhavan, Mumbai</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Nariman Point, 400021</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid: Form & FAQs */}
      <section style={{ padding: '30px 24px 70px 24px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '40px' }}>
          {/* Inquiry Form */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: '20px',
              padding: '36px',
              border: '1px solid var(--border-light)',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>
              Send an Official Inquiry
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '24px' }}>
              Your message will be logged directly into the bank's database for admin officer review.
            </p>

            {submitted && (
              <div style={{ background: '#ecfdf5', color: '#065f46', padding: '14px', borderRadius: '10px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem' }}>
                <CheckCircle2 size={20} color="#10b981" />
                <span>Inquiry saved! The administration will attend to your request.</span>
              </div>
            )}

            {errorMessage && (
              <div style={{ background: '#fef2f2', color: '#991b1b', padding: '14px', borderRadius: '10px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem' }}>
                <AlertCircle size={20} color="#ef4444" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder="e.g. Rahul Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    required
                    className="form-control"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    required
                    className="form-control"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Inquiry Subject</label>
                <select
                  required
                  className="form-control"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                >
                  <option value="">-- Select Subject Category --</option>
                  <option value="Account Opening / KYC Query">Account Opening / KYC Query</option>
                  <option value="Home / Personal Loan Inquiry">Home / Personal Loan Inquiry</option>
                  <option value="Debit / Credit Card Services">Debit / Credit Card Services</option>
                  <option value="Fund Transfer / NEFT / RTGS Assistance">Fund Transfer / NEFT / RTGS Assistance</option>
                  <option value="NetBanking Login Issues">NetBanking Login Issues</option>
                  <option value="Other General Grievance">Other General Grievance</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Message Details</label>
                <textarea
                  required
                  rows={4}
                  className="form-control"
                  placeholder="Please describe your banking inquiry or request in detail..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary"
                style={{ width: '100%', padding: '12px' }}
              >
                <Send size={16} />
                <span>{submitting ? 'Submitting...' : 'Submit Banking Inquiry'}</span>
              </button>
            </form>
          </div>

          {/* FAQs Accordion */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <HelpCircle size={22} color="#1c2a8f" />
              <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a' }}>
                Frequently Asked Questions
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  style={{
                    background: '#ffffff',
                    borderRadius: '14px',
                    border: '1px solid var(--border-light)',
                    overflow: 'hidden',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    style={{
                      width: '100%',
                      padding: '16px 20px',
                      background: 'none',
                      border: 'none',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontWeight: '700',
                      fontSize: '0.925rem',
                      color: '#1e293b',
                      cursor: 'pointer',
                    }}
                  >
                    <span>{faq.q}</span>
                    {openFaq === idx ? <ChevronUp size={18} color="#1c2a8f" /> : <ChevronDown size={18} color="#94a3b8" />}
                  </button>

                  {openFaq === idx && (
                    <div style={{ padding: '0 20px 18px 20px', fontSize: '0.85rem', color: '#64748b', lineHeight: '1.6', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
