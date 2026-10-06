import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '../common/Sidebar';
import { Topbar } from '../common/Topbar';
import { DemoSwitcherBar } from '../common/DemoSwitcherBar';

export const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('users')) return 'Customer Accounts Governance';
    if (path.includes('accounts')) return 'Master Bank Accounts Ledger';
    if (path.includes('transactions')) return 'Global Transactions & Audit';
    if (path.includes('loans')) return 'Loan Underwriting & Sanctions';
    if (path.includes('cards')) return 'Card Governance & Limits';
    if (path.includes('broadcast')) return 'System Broadcasts';
    if (path.includes('inquiries')) return 'Customer Support Inquiries';
    return 'Bank Administration Portal';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <DemoSwitcherBar />
      <div className="app-container">
        <Sidebar isOpen={sidebarOpen} closeSidebar={() => setSidebarOpen(false)} role="admin" />
        <div className="main-content">
          <Topbar title={getPageTitle()} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
          <Outlet />
        </div>
      </div>
    </div>
  );
};
