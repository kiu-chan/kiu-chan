import React, { useState, useEffect } from 'react';
import { FaLeaf, FaShoppingCart, FaPhone, FaSignOutAlt, FaExclamationCircle, FaUserCog } from 'react-icons/fa';
import logo from '/logo.png';
import { db, auth } from '../../firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

function DefaultLayout({ children }) {
  const [contactInfo, setContactInfo] = useState({
    phoneNumber: '',
    facebook: '',
    address: '',
    email: ''
  });
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userDoc, setUserDoc] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Theo dõi trạng thái đăng nhập của người dùng
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Lấy thông tin người dùng từ Firestore
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDocSnap = await getDoc(userDocRef);
          
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            setUserDoc(userData);
            // Kiểm tra xem người dùng có role admin không
            setIsAdmin(userData.role === 'admin');
          }
        } catch (error) {
          console.error("Lỗi khi lấy thông tin người dùng:", error);
        }
      }
      
      setCurrentUser(user);
      setLoading(false);
    });

    // Cleanup subscription khi component unmount
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Hàm để lấy dữ liệu contact từ Firestore
    const fetchContactInfo = async () => {
      try {
        // Truy cập trực tiếp vào document "contact" trong collection "configs"
        const contactRef = doc(db, 'configs', 'contact');
        const contactSnap = await getDoc(contactRef);
        
        // Kiểm tra xem document có tồn tại không
        if (contactSnap.exists()) {
          const contactData = contactSnap.data();
          setContactInfo(prevInfo => ({
            ...prevInfo,
            phoneNumber: contactData.phoneNumber || prevInfo.phoneNumber,
            facebook: contactData.facebook || prevInfo.facebook,
            address: contactData.address || prevInfo.address,
            email: contactData.email || prevInfo.email
          }));
        }
      } catch (error) {
        console.error("Error fetching contact info:", error);
      }
    };

    fetchContactInfo();
  }, []);

  // Hàm xử lý đăng xuất
  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Chuyển hướng về trang chủ sau khi đăng xuất
      navigate('/');
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
    }
  };

  // Hàm chuyển hướng đến trang admin
  const navigateToAdmin = () => {
    navigate('/admin');
  };

  // Kiểm tra xem người dùng có được xác thực không
  const isUserVerified = () => {
    // Nếu là tài khoản Google hoặc đã xác thực email
    return userDoc?.signInMethod === 'google' || 
           (currentUser && currentUser.emailVerified);
  };

  return (
    <div className="min-h-screen flex flex-col w-full bg-blue-50">
      {/* Header Section */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <img 
              src={logo} 
              alt="Logo HTX Phú Quý" 
              className="h-12 w-12 mr-3 rounded-full object-cover"
            />
            <h1 className="text-2xl md:text-3xl font-bold text-blue-800">Pi's Farm</h1>
          </div>
          <nav className="flex flex-wrap items-center space-x-2 md:space-x-4 text-blue-700">
            <a href="/" className="px-3 py-2 rounded-md font-medium hover:bg-blue-100">Trang chủ</a>
            <a href="/products" className="px-3 py-2 rounded-md font-medium hover:bg-blue-100">Sản phẩm</a>
            <a href="/services" className="px-3 py-2 rounded-md font-medium hover:bg-blue-100">Dịch vụ</a>
            <a href="/contact" className="px-3 py-2 rounded-md font-medium hover:bg-blue-100">Liên hệ</a>
            
            {/* Các nút đăng nhập/đăng ký hoặc đăng xuất */}
            {!loading && (
              <>
                {currentUser ? (
                  <div className="flex items-center space-x-2">
                    {/* Hiển thị email và trạng thái xác thực */}
                    <div className="flex items-center">
                      <span className="text-blue-800 font-medium hidden md:inline mr-2">
                        {currentUser.email}
                      </span>
                      {!isUserVerified() && (
                        <div 
                          className="flex items-center text-yellow-600 text-sm"
                          title="Tài khoản chưa được xác thực"
                        >
                          <FaExclamationCircle className="mr-1" />
                          <span className="hidden md:inline">Chưa xác thực</span>
                        </div>
                      )}
                    </div>
                    <button 
                      onClick={handleLogout}
                      className="flex items-center px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                    >
                      <FaSignOutAlt className="mr-1" />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 mt-3 md:mt-0">
                    <a 
                      href="/login" 
                      className="px-3 py-2 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50 transition-colors"
                    >
                      Đăng nhập
                    </a>
                    <a 
                      href="/signup" 
                      className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                    >
                      Đăng ký
                    </a>
                  </div>
                )}
              </>
            )}
            
            {/* Hiển thị nút Admin nếu người dùng có role admin */}
            {!loading && currentUser && isAdmin && (
              <button 
                onClick={navigateToAdmin}
                className="flex items-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                <FaUserCog className="mr-1" />
                <span>Quản trị</span>
              </button>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow w-full">
        <div className="max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-blue-800 text-white">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">HTX Phú Quý - Pi's Farm</h3>
              <p className="text-blue-100">
                HTX Nông nghiệp công nghệ cao, thương mại và dịch vụ Phú Quý cam kết mang đến những sản phẩm chăn nuôi và thú y chất lượng cao nhất.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Liên Hệ</h3>
              <p className="text-blue-100 mb-2">Địa chỉ: {contactInfo.address}</p>
              <p className="text-blue-100 mb-2">Điện thoại: {contactInfo.phoneNumber}</p>
              <p className="text-blue-100">Email: {contactInfo.email}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Theo Dõi</h3>
              <div className="flex space-x-4">
                <a href={contactInfo.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-100 hover:text-white transition-colors">Facebook</a>
                <a href="#" className="text-blue-100 hover:text-white transition-colors">Youtube</a>
                <a href="#" className="text-blue-100 hover:text-white transition-colors">Zalo</a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-4 border-t border-blue-700 text-center text-blue-200">
            <p>© {new Date().getFullYear()} HTX Phú Quý - Pi's Farm. Tất cả các quyền được bảo lưu.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default DefaultLayout;