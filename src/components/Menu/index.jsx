import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MENU_ITEMS } from './constants';

const NavMenu = () => {
  const location = useLocation();

  return (
    <div className="flex flex-col md:flex-row justify-end">
      {MENU_ITEMS.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`
              px-4 py-2 md:px-5 md:py-4
              text-base font-medium
              transition-all duration-300
              ${isActive 
                ? 'text-blue-600' 
                : 'text-gray-600 hover:text-blue-500'
              }
              relative
            `}
          >
            {item.label}
            {isActive && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600" />
            )}
          </Link>
        );
      })}
    </div>
  );
};

export default NavMenu;