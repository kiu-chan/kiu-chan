function Menu() {
    return (
      <nav className="bg-gray-800 w-full">
        <div className="w-full px-4">
          <div className="flex items-center justify-between h-16">
            {/* Menu items bên trái */}
            <div className="flex items-center">
              <div className="flex space-x-4">
                <a href="/" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md">
                  Home
                </a>
                <a href="/about" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md">
                  About
                </a>
                <a href="/products" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md">
                  Products
                </a>
                <a href="/contact" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md">
                  Contact
                </a>
              </div>
            </div>
  
            {/* Auth buttons bên phải */}
            <div className="flex items-center space-x-4">
              <a href="/login" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md">
                Login
              </a>
              <a href="/signup" className="bg-blue-500 text-white hover:bg-blue-600 px-3 py-2 rounded-md">
                Sign Up
              </a>
            </div>
          </div>
        </div>
      </nav>
    );
  }
  
  export default Menu;