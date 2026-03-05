import React from 'react';

function AdminFooter() {
  return (
    <footer className="bg-white border-t border-gray-200 px-6 py-3 flex items-center justify-between text-xs text-gray-400">
      <span>© {new Date().getFullYear()} Khanh. All rights reserved.</span>
      <span>Designed with ❤ by Khanh</span>
    </footer>
  );
}

export default AdminFooter;
