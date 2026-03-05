import React from 'react';
import { FaBars } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';

function AdminHeader({ toggleSidebar }) {
  const { currentUser } = useAuth();

  const displayName = currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Admin';
  const avatarUrl = currentUser?.photoURL;

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 flex-shrink-0">
      <button
        onClick={toggleSidebar}
        className="text-gray-500 hover:text-gray-700 p-1 rounded"
      >
        <FaBars />
      </button>

      <div className="flex items-center gap-3">
        {avatarUrl ? (
          <img src={avatarUrl} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold uppercase">
            {displayName[0]}
          </div>
        )}
        <div className="hidden sm:block">
          <p className="text-sm font-medium text-gray-700">{displayName}</p>
          {currentUser?.email && (
            <p className="text-xs text-gray-400">{currentUser.email}</p>
          )}
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;
