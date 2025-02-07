import { Menu, X } from 'lucide-react';
import NavMenu from '../Menu';

const Header = ({ isMenuOpen, setIsMenuOpen }) => {
  return (
    <header className="bg-blue-300 text-gray-800 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <img 
              src="https://raw.githubusercontent.com/iampavangandhi/iampavangandhi/master/gifs/Hi.gif" 
              alt="Hi" 
              className="w-8 h-8 mr-2"
            />
            <h1 className="text-xl font-bold">Hey there, I'm Khanh</h1>
          </div>
          
          <nav className="hidden md:block">
            <NavMenu />
          </nav>

          <button 
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4">
            <NavMenu />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;