import React from 'react';

function AdminFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white shadow-md p-4 text-center">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm text-gray-600 mb-2 md:mb-0">
          © {currentYear} Admin Dashboard. All rights reserved.
        </p>
        <div className="flex space-x-4 text-sm text-gray-500">
          <a 
            href="/admin/privacy" 
            className="hover:text-blue-600 transition-colors"
          >
            Privacy Policy
          </a>
          <a 
            href="/admin/terms" 
            className="hover:text-blue-600 transition-colors"
          >
            Terms of Service
          </a>
          <a 
            href="/admin/support" 
            className="hover:text-blue-600 transition-colors"
          >
            Support
          </a>
        </div>
      </div>
    </footer>
  );
}

export default AdminFooter;