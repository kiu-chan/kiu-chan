// src/components/Layout/AdminLayout.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  getAuth, 
  onAuthStateChanged, 
  signOut 
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  getFirestore 
} from 'firebase/firestore';
import { 
  FaHome, 
  FaBoxOpen, 
  FaUsers, 
  FaChartLine, 
  FaCog, 
  FaSignOutAlt, 
  FaBars, 
  FaTimes,
  FaShoppingCart,
  FaImage,
  FaComments,
  FaEdit,
  FaBell
} from 'react-icons/fa';
import logo from '/logo.png'; // Đảm bảo rằng file logo.png tồn tại trong thư mục public

function AdminLayout({ children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userDoc, setUserDoc] = useState(null);
  const navigate = useNavigate();
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const user = auth.currentUser;
        
        if (!user) {
          // Không đăng nhập
          setLoading(false);
          navigate('/login');
          return;
        }

        // Kiểm tra vai trò admin từ Firestore
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        const userData = userDoc.data();

        // Kiểm tra vai trò
        const isAdminUser = userData?.role === 'admin';
        
        if (!isAdminUser) {
          // Không phải admin, chuyển hướng về trang chủ
          navigate('/');
          return;
        }

        setUserDoc(userData);
        setCurrentUser(user);
      } catch (error) {
        console.error("Lỗi kiểm tra quyền admin:", error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    // Nếu user đã đăng nhập, kiểm tra ngay
    if (auth.currentUser) {
      checkAdminStatus();
    } else {
      // Theo dõi trạng thái đăng nhập
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          checkAdminStatus();
        } else {
          setLoading(false);
          navigate('/login');
        }
      });

      // Cleanup subscription
      return () => unsubscribe();
    }
  }, [auth, db, navigate]);

  // Xử lý đăng xuất
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error("Lỗi đăng xuất:", error);
    }
  };

  // Toggle menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Đang tải
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-blue-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${isMenuOpen ? 'w-64' : 'w-20'} bg-blue-800 text-white transition-all duration-300 ease-in-out h-screen fixed left-0 top-0 shadow-lg`}>
        {/* Logo và toggle button */}
        <div className="flex items-center justify-between p-4 border-b border-blue-700">
          {isMenuOpen ? (
            <div className="flex items-center">
              <img src={logo} alt="Logo" className="w-10 h-10 rounded-full object-cover" />
              <span className="ml-2 font-bold text-lg">Pi's Farm Admin</span>
            </div>
          ) : (
            <img src={logo} alt="Logo" className="w-10 h-10 rounded-full object-cover mx-auto" />
          )}
          <button 
            onClick={toggleMenu} 
            className="text-white hover:text-blue-200 focus:outline-none"
          >
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Menu Items */}
        <nav className="mt-6">
          <ul>
            <li className="mb-2">
              <Link to="/admin" className="flex items-center p-4 hover:bg-blue-700 transition-colors">
                <FaChartLine className={`text-xl ${!isMenuOpen && 'mx-auto'}`} />
                {isMenuOpen && <span className="ml-4">Tổng quan</span>}
              </Link>
            </li>
            <li className="mb-2">
              <Link to="/admin/products" className="flex items-center p-4 bg-blue-700 hover:bg-blue-600 transition-colors">
                <FaBoxOpen className={`text-xl ${!isMenuOpen && 'mx-auto'}`} />
                {isMenuOpen && <span className="ml-4">Sản phẩm</span>}
              </Link>
            </li>
            <li className="mb-2">
              <Link to="/admin/categories" className="flex items-center p-4 hover:bg-blue-700 transition-colors">
                <FaShoppingCart className={`text-xl ${!isMenuOpen && 'mx-auto'}`} />
                {isMenuOpen && <span className="ml-4">Danh mục</span>}
              </Link>
            </li>
            <li className="mb-2">
              <Link to="/admin/banners" className="flex items-center p-4 hover:bg-blue-700 transition-colors">
                <FaImage className={`text-xl ${!isMenuOpen && 'mx-auto'}`} />
                {isMenuOpen && <span className="ml-4">Banner</span>}
              </Link>
            </li>
            <li className="mb-2">
              <Link to="/admin/orders" className="flex items-center p-4 hover:bg-blue-700 transition-colors">
                <FaShoppingCart className={`text-xl ${!isMenuOpen && 'mx-auto'}`} />
                {isMenuOpen && <span className="ml-4">Đơn hàng</span>}
              </Link>
            </li>
            <li className="mb-2">
              <Link to="/admin/users" className="flex items-center p-4 hover:bg-blue-700 transition-colors">
                <FaUsers className={`text-xl ${!isMenuOpen && 'mx-auto'}`} />
                {isMenuOpen && <span className="ml-4">Người dùng</span>}
              </Link>
            </li>
            <li className="mb-2">
              <Link to="/admin/feedback" className="flex items-center p-4 hover:bg-blue-700 transition-colors">
                <FaComments className={`text-xl ${!isMenuOpen && 'mx-auto'}`} />
                {isMenuOpen && <span className="ml-4">Phản hồi</span>}
              </Link>
            </li>
            <li className="mb-2">
              <Link to="/admin/content" className="flex items-center p-4 hover:bg-blue-700 transition-colors">
                <FaEdit className={`text-xl ${!isMenuOpen && 'mx-auto'}`} />
                {isMenuOpen && <span className="ml-4">Nội dung</span>}
              </Link>
            </li>
            <li className="mb-2">
              <Link to="/admin/settings" className="flex items-center p-4 hover:bg-blue-700 transition-colors">
                <FaCog className={`text-xl ${!isMenuOpen && 'mx-auto'}`} />
                {isMenuOpen && <span className="ml-4">Cài đặt</span>}
              </Link>
            </li>
          </ul>
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 w-full border-t border-blue-700 p-4">
          <button 
            onClick={handleLogout} 
            className="flex items-center text-white hover:text-red-200 transition-colors"
          >
            <FaSignOutAlt className={`text-xl ${!isMenuOpen && 'mx-auto'}`} />
            {isMenuOpen && <span className="ml-2">Đăng xuất</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 ${isMenuOpen ? 'ml-64' : 'ml-20'} transition-all duration-300 ease-in-out`}>
        {/* Header */}
        <header className="bg-white shadow-md p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-blue-800">Bảng quản trị</h1>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <FaBell className="text-blue-800 text-xl cursor-pointer" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">3</span>
              </div>
              <div className="flex items-center">
                <img 
                  src={currentUser?.photoURL || 'https://via.placeholder.com/40'} 
                  alt="Avatar" 
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="ml-2 font-medium text-blue-800">{currentUser?.email}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;