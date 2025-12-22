import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../Components/AdminSidebar';
import AdminHeader from '../Components/AdminHeader';
import AdminNotifications from '../Components/AdminNotifications';
import { NotificationProvider } from '../context/NotificationContext';

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <NotificationProvider>
      <div className='bg-slate-50 h-screen flex'>
        {/* The Sidebar is always rendered */}
        <AdminSidebar isOpen={isSidebarOpen} />

        {/* This is the main content area */}
        <div
          className={`
            flex-grow transition-all duration-300 ease-in-out
            ${isSidebarOpen ? 'ml-64' : 'ml-20'} 
          `}
        >
          <AdminHeader toggleSidebar={toggleSidebar} isOpen={isSidebarOpen} />
          <AdminNotifications />
          
          <main className='p-4 sm:p-6 overflow-y-auto h-[calc(100vh-64px)]'>
            {/* All child pages (like AdminContactInquiries) will be rendered here */}
            <Outlet />
          </main>
        </div>
      </div>
    </NotificationProvider>
  );
}