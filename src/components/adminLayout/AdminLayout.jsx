import React, { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import AdminFooter from './AdminFooter';

function AdminLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <AdminSidebar isOpen={isSidebarOpen} />

      <div className="flex flex-col flex-1 min-w-0">
        <AdminHeader
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50/80">
          {children}
        </main>
        <AdminFooter />
      </div>
    </div>
  );
}

export default AdminLayout;
