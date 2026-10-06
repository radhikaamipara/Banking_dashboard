import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '../common/Sidebar';
import { Topbar } from '../common/Topbar';
import { DemoSwitcherBar } from '../common/DemoSwitcherBar';

export const UserLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('accounts')) return 'My Bank Accounts';
    if (path.includes('transfer')) return 'Transfer Money';
    if (path.includes('transactions')) return 'Transaction Passbook';
    if (path.includes('cards')) return 'Cards & Security';
    if (path.includes('loans')) return 'Loans & Credit';
    if (path.includes('notifications')) return 'Notifications & Alerts';
    if (path.includes('profile')) return 'Profile & Security';
    return 'Retail Banking Dashboard';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <DemoSwitcherBar />
      <div className="app-container">
        <Sidebar isOpen={sidebarOpen} closeSidebar={() => setSidebarOpen(false)} role="user" />
        <div className="main-content">
          <Topbar title={getPageTitle()} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
          <Outlet />
        </div>
      </div>
    </div>
  );
};
