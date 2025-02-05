import { Link } from 'react-router-dom';

const NavMenu = () => {
  const menuItems = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/skills', label: 'Skills' },
    { path: '/projects', label: 'Projects' },
    { path: '/contact', label: 'Contact' }
  ];

  return (
    <ul className="md:flex md:space-x-6">
      {menuItems.map((item, index) => (
        <li key={index} className="py-2 md:py-0">
          <Link
            to={item.path}
            className="hover:text-blue-600 transition-colors duration-200"
          >
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default NavMenu;