import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FaChartLine,
  FaProjectDiagram,
  FaNewspaper,
  FaHome,
  FaUser,
  FaCode,
  FaEnvelope,
  FaSignOutAlt,
} from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';

const MENU_ITEMS = [
  { name: 'Dashboard',    path: '/admin',          icon: FaChartLine },
  { name: 'Projects',     path: '/admin/projects', icon: FaProjectDiagram },
  { name: 'Posts',        path: '/admin/posts',    icon: FaNewspaper },
  { name: 'Home Page',    path: '/admin/home',     icon: FaHome },
  { name: 'About Page',   path: '/admin/about',    icon: FaUser },
  { name: 'Skills Page',  path: '/admin/skills',   icon: FaCode },
  { name: 'Contact Page', path: '/admin/contact',  icon: FaEnvelope },
];

function AdminSidebar({ isOpen }) {
  const location = useLocation();
  const { logout } = useAuth();

  const isActive = (path) =>
    path === '/admin'
      ? location.pathname === '/admin'
      : location.pathname.startsWith(path);

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <aside
      className={`${isOpen ? 'w-56' : 'w-16'} bg-white border-r border-gray-200 flex flex-col flex-shrink-0 transition-all duration-200`}
    >
      {/* Brand */}
      <div className="flex items-center h-14 px-3 border-b border-gray-200 gap-2 flex-shrink-0">
        <img src="/logo.png" alt="Logo" className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
        {isOpen && <span className="font-semibold text-sm text-gray-800 truncate">Admin Panel</span>}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 overflow-y-auto">
        {MENU_ITEMS.map(({ name, path, icon: Icon }) => (
          <Link
            key={path}
            to={path}
            title={!isOpen ? name : undefined}
            className={`flex items-center gap-3 mx-2 px-3 py-2.5 rounded-lg mb-0.5 text-sm transition-colors ${
              isActive(path)
                ? 'bg-blue-50 text-blue-600 font-medium'
                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
            }`}
          >
            <Icon className="text-base flex-shrink-0" />
            {isOpen && <span className="truncate">{name}</span>}
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="border-t border-gray-200 p-3 flex-shrink-0">
        <button
          onClick={handleLogout}
          title={!isOpen ? 'Logout' : undefined}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <FaSignOutAlt className="text-base flex-shrink-0" />
          {isOpen && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}

export default AdminSidebar;
