import React, { useState } from 'react';
import { FaBars, FaBell, FaUser, FaSearch } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext'; // Giả sử bạn có context xác thực

function AdminHeader({ isSidebarOpen, toggleSidebar }) {
  const [searchTerm, setSearchTerm] = useState('');
  const { currentUser } = useAuth(); // Lấy thông tin người dùng hiện tại

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Xử lý tìm kiếm
    console.log('Searching for:', searchTerm);
  };

  return (
    <header className="bg-white shadow-md p-4 flex items-center justify-between">
      {/* Left Section - Sidebar Toggle */}
      <div className="flex items-center">
        <button 
          onClick={toggleSidebar} 
          className="text-gray-600 hover:text-blue-600 mr-4"
        >
          <FaBars className="text-xl" />
        </button>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative flex-grow max-w-md">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </form>
      </div>

      {/* Right Section - Notifications and User */}
      <div className="flex items-center space-x-4">
        {/* Notification Icon */}
        <div className="relative">
          <FaBell className="text-gray-600 hover:text-blue-600 text-xl cursor-pointer" />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
            3
          </span>
        </div>

        {/* User Profile */}
        <div className="flex items-center space-x-2">
          <img 
            src={currentUser?.photoURL || 'https://via.placeholder.com/40'} 
            alt="User Profile" 
            className="w-8 h-8 rounded-full object-cover"
          />
          <div className="hidden md:block">
            <p className="text-sm font-medium text-gray-700">
              {currentUser?.displayName || 'Admin User'}
            </p>
            <p className="text-xs text-gray-500">
              {currentUser?.email}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;