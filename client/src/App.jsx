import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Public Pages
import { Home } from './pages/public/Home';
import { About } from './pages/public/About';
import { Contact } from './pages/public/Contact';
import { Login } from './pages/public/Login';
import { Register } from './pages/public/Register';
import { Offers } from './pages/public/Offers';

// User Pages
import { Dashboard } from './pages/user/Dashboard';
import { Accounts } from './pages/user/Accounts';
import { TransferMoney } from './pages/user/TransferMoney';
import { Transactions } from './pages/user/Transactions';
import { Cards } from './pages/user/Cards';
import { Loans } from './pages/user/Loans';
import { Notifications } from './pages/user/Notifications';
import { Profile } from './pages/user/Profile';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { UserManagement } from './pages/admin/UserManagement';
import { AccountManagement } from './pages/admin/AccountManagement';
import { TransactionManagement } from './pages/admin/TransactionManagement';
import { LoanManagement } from './pages/admin/LoanManagement';
import { CardManagement } from './pages/admin/CardManagement';
import { BroadcastNotifications } from './pages/admin/BroadcastNotifications';
import { ContactInquiries } from './pages/admin/ContactInquiries';

// Layouts & Protection
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { UserLayout } from './components/layout/UserLayout';
import { AdminLayout } from './components/layout/AdminLayout';

export default function App() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/offers" element={<Offers />} />

      {/* User Banking Panel (Protected) */}
      <Route element={<ProtectedRoute adminOnly={false} />}>
        <Route path="/user" element={<UserLayout />}>
          <Route index element={<Navigate to="/user/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="accounts" element={<Accounts />} />
          <Route path="transfer" element={<TransferMoney />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="cards" element={<Cards />} />
          <Route path="loans" element={<Loans />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Route>

      {/* Admin Banking Panel (Protected & Admin Only) */}
      <Route element={<ProtectedRoute adminOnly={true} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="accounts" element={<AccountManagement />} />
          <Route path="transactions" element={<TransactionManagement />} />
          <Route path="loans" element={<LoanManagement />} />
          <Route path="cards" element={<CardManagement />} />
          <Route path="broadcast" element={<BroadcastNotifications />} />
          <Route path="inquiries" element={<ContactInquiries />} />
        </Route>
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
