import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaChartLine, 
  FaProjectDiagram,
  FaSignOutAlt, 
  FaTimes, 
  FaBars
} from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';

const MENU_ITEMS = [
  { 
    name: 'Dashboard', 
    path: '/admin', 
    icon: FaChartLine 
  },
  { 
    name: 'Projects', 
    path: '/admin/projects', 
    icon: FaProjectDiagram 
  }
];

function AdminSidebar({ isOpen, toggleSidebar }) {
  const location = useLocation();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <div 
      className={`fixed inset-y-0 left-0 z-50 bg-blue-800 text-white transition-all duration-300 
        ${isOpen ? 'w-64' : 'w-20'} overflow-hidden shadow-lg`}
    >
      {/* Logo và Toggle Button */}
      <div className="flex items-center justify-between p-4 border-b border-blue-700">
        {isOpen ? (
          <div className="flex items-center">
            <img 
              src="/logo.png" 
              alt="Admin Logo" 
              className="w-10 h-10 rounded-full object-cover mr-2" 
            />
            <span className="font-bold text-lg">Admin Panel</span>
          </div>
        ) : (
          <img 
            src="/logo.png" 
            alt="Admin Logo" 
            className="w-10 h-10 rounded-full object-cover mx-auto" 
          />
        )}
        <button 
          onClick={toggleSidebar} 
          className="text-white hover:text-blue-200 focus:outline-none"
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Menu Items */}
      <nav className="mt-6">
        <ul>
          {MENU_ITEMS.map((item) => (
            <li key={item.path} className="mb-1">
              <Link 
                to={item.path}
                className={`flex items-center p-4 transition-colors duration-300 
                  ${location.pathname === item.path 
                    ? 'bg-blue-700 text-white' 
                    : 'hover:bg-blue-700 text-blue-200'
                  }`}
              >
                <item.icon className={`text-xl ${!isOpen && 'mx-auto'}`} />
                {isOpen && <span className="ml-4">{item.name}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="absolute bottom-0 w-full border-t border-blue-700">
        <button 
          onClick={handleLogout}
          className="flex items-center p-4 w-full hover:bg-blue-700 transition-colors"
        >
          <FaSignOutAlt className={`text-xl ${!isOpen && 'mx-auto'}`} />
          {isOpen && <span className="ml-4">Logout</span>}
        </button>
      </div>
    </div>
  );
}

export default AdminSidebar;