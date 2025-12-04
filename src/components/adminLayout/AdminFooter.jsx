import React from 'react';

function AdminFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white shadow-md p-4 text-center">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm">© {currentYear} Khanh. All rights reserved.</p>
          <p className="text-sm mt-2 sm:mt-0">
            <span>Designed with </span>
            <span className="text-red-300">❤</span>
            <span> by Khanh</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default AdminFooter;