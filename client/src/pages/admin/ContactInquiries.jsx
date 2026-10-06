import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import { useNotification } from '../../context/NotificationContext';
import {
  MessageSquareText,
  Search,
  CheckCircle2,
  Clock,
  Mail,
  Phone,
  User,
  Filter,
} from 'lucide-react';

export const ContactInquiries = () => {
  const { showToast } = useNotification();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const data = await api.getAllInquiries();
      setInquiries(data.inquiries || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.updateInquiryStatus(id, { status });
      showToast(`Inquiry marked as ${status}`, 'success');
      fetchInquiries();
    } catch (err) {
      alert('Failed to update inquiry status');
    }
  };

  return (
    <div className="page-body">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0f172a' }}>Public Inquiries & Helpdesk</h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
            Messages and inquiries submitted by visitors from the public Contact Us portal ({inquiries.length} total)
          </p>
        </div>
      </div>

      <div className="data-table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Visitor Details</th>
              <th>Subject</th>
              <th>Message Content</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                  Loading inquiries...
                </td>
              </tr>
            ) : inquiries.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                  No customer inquiries in database.
                </td>
              </tr>
            ) : (
              inquiries.map((inq) => (
                <tr key={inq._id}>
                  <td style={{ fontSize: '0.8rem', color: '#64748b', whiteSpace: 'nowrap' }}>
                    {new Date(inq.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td>
                    <div style={{ fontWeight: '700', color: '#1e293b' }}>{inq.name}</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{inq.email}</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{inq.phone}</div>
                  </td>
                  <td>
                    <span className="badge badge-primary" style={{ fontSize: '0.75rem' }}>
                      {inq.subject}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.825rem', color: '#334155', maxWidth: '360px', lineHeight: '1.4' }}>
                      {inq.message}
                    </div>
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        inq.status === 'resolved'
                          ? 'badge-success'
                          : inq.status === 'in_progress'
                          ? 'badge-warning'
                          : 'badge-cyan'
                      }`}
                    >
                      {inq.status?.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {inq.status !== 'resolved' && (
                        <button
                          onClick={() => handleUpdateStatus(inq._id, 'resolved')}
                          className="btn btn-sm"
                          style={{ background: '#10b981', color: '#ffffff', padding: '4px 8px', fontSize: '0.72rem' }}
                        >
                          <CheckCircle2 size={13} /> Resolve
                        </button>
                      )}
                      {inq.status === 'new' && (
                        <button
                          onClick={() => handleUpdateStatus(inq._id, 'in_progress')}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '4px 8px', fontSize: '0.72rem' }}
                        >
                          In Progress
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
