const BASE_URL = '/api';

const getToken = () => {
  try {
    return sessionStorage.getItem('yono_token') || localStorage.getItem('yono_token');
  } catch (e) {
    return null;
  }
};

// Helper for fetch with JSON and auth token
async function request(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const config = {
    ...options,
    headers,
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  let response;
  try {
    response = await fetch(`${BASE_URL}${endpoint}`, config);
  } catch (netErr) {
    const error = new Error('Cannot connect to backend server. Please make sure the backend is running on http://localhost:5000');
    error.isNetworkError = true;
    throw error;
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || 'An error occurred during banking request');
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  // Auth
  login: (credentials) => request('/auth/login', { method: 'POST', body: credentials }),
  register: (userData) => request('/auth/register', { method: 'POST', body: userData }),
  getMe: () => request('/auth/me'),
  updateProfile: (profileData) => request('/auth/profile', { method: 'PUT', body: profileData }),
  setTPin: (pinData) => request('/auth/tpin', { method: 'POST', body: pinData }),
  changePassword: (passwords) => request('/auth/change-password', { method: 'PUT', body: passwords }),

  // Accounts
  getMyAccounts: () => request('/accounts'),
  getAccountById: (id) => request(`/accounts/${id}`),
  openAccount: (accountData) => request('/accounts/open', { method: 'POST', body: accountData }),
  getStatement: (id, params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/accounts/${id}/statement${query ? `?${query}` : ''}`);
  },

  // Transactions
  transfer: (transferData) => request('/transactions/transfer', { method: 'POST', body: transferData }),
  getMyTransactions: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/transactions${query ? `?${query}` : ''}`);
  },
  getTransactionById: (id) => request(`/transactions/${id}`),
  getAnalytics: () => request('/transactions/analytics'),
  getBeneficiaries: () => request('/transactions/beneficiaries'),
  addBeneficiary: (data) => request('/transactions/beneficiaries', { method: 'POST', body: data }),
  deleteBeneficiary: (id) => request(`/transactions/beneficiaries/${id}`, { method: 'DELETE' }),

  // Cards
  getMyCards: () => request('/cards'),
  toggleCardFreeze: (id) => request(`/cards/${id}/toggle-freeze`, { method: 'PUT' }),
  updateCardSettings: (id, settings) => request(`/cards/${id}/settings`, { method: 'PUT', body: settings }),
  setCardPin: (id, pin) => request(`/cards/${id}/pin`, { method: 'PUT', body: { pin } }),
  applyCard: (cardData) => request('/cards/apply', { method: 'POST', body: cardData }),

  // Loans
  calculateEmi: (data) => request('/loans/calculate', { method: 'POST', body: data }),
  applyLoan: (loanData) => request('/loans/apply', { method: 'POST', body: loanData }),
  getMyLoans: () => request('/loans'),
  payEmi: (id) => request(`/loans/${id}/pay-emi`, { method: 'POST' }),

  // Notifications
  getNotifications: () => request('/notifications'),
  markNotificationRead: (id) => request(`/notifications/${id}/read`, { method: 'PUT' }),
  markAllNotificationsRead: () => request('/notifications/read-all', { method: 'PUT' }),

  // Contact
  submitInquiry: (data) => request('/contact', { method: 'POST', body: data }),
  getAllInquiries: () => request('/contact/all'),
  updateInquiryStatus: (id, data) => request(`/contact/${id}`, { method: 'PUT', body: data }),

  // Admin
  getAdminStats: () => request('/admin/dashboard-stats'),
  getAdminUsers: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/admin/users${query ? `?${query}` : ''}`);
  },
  getUserDeepDive: (id) => request(`/admin/users/${id}`),
  updateUserStatus: (id, status) => request(`/admin/users/${id}/status`, { method: 'PUT', body: { status } }),
  updateUserKyc: (id, data) => request(`/admin/users/${id}/kyc`, { method: 'PUT', body: data }),
  getAdminAccounts: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/admin/accounts${query ? `?${query}` : ''}`);
  },
  toggleAccountFreeze: (id) => request(`/admin/accounts/${id}/freeze`, { method: 'PUT' }),
  adjustAccountBalance: (id, data) => request(`/admin/accounts/${id}/adjust`, { method: 'POST', body: data }),
  getAdminTransactions: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/admin/transactions${query ? `?${query}` : ''}`);
  },
  toggleFlagTransaction: (id, data) => request(`/admin/transactions/${id}/flag`, { method: 'PUT', body: data }),
  getAdminLoans: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/admin/loans${query ? `?${query}` : ''}`);
  },
  reviewLoan: (id, data) => request(`/admin/loans/${id}/review`, { method: 'PUT', body: data }),
  getAdminCards: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/admin/cards${query ? `?${query}` : ''}`);
  },
  updateAdminCardStatus: (id, status) => request(`/admin/cards/${id}/status`, { method: 'PUT', body: { status } }),
  sendBroadcastNotification: (data) => request('/admin/broadcast', { method: 'POST', body: data }),
};
