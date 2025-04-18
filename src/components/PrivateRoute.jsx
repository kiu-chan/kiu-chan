import React, { useState, useEffect } from 'react';
import { 
  getAuth, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  getFirestore 
} from 'firebase/firestore';

function PrivateRoute({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const user = auth.currentUser;
        
        if (!user) {
          // Không đăng nhập
          setIsAdmin(false);
          setIsLoading(false);
          window.location.href = '/login';
          return;
        }

        // Kiểm tra vai trò admin từ Firestore
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        const userData = userDoc.data();

        // Kiểm tra vai trò và email đã xác thực
        const isAdminUser = userData?.role === 'admin';
        
        if (!isAdminUser) {
          // Không phải admin, chuyển hướng về trang chủ
          window.location.href = '/';
        }

        setIsAdmin(isAdminUser);
      } catch (error) {
        console.error("Lỗi kiểm tra quyền admin:", error);
        setIsAdmin(false);
        window.location.href = '/';
      } finally {
        setIsLoading(false);
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
          setIsAdmin(false);
          setIsLoading(false);
          window.location.href = '/login';
        }
      });

      // Cleanup subscription
      return () => unsubscribe();
    }
  }, [auth, db]);

  // Đang tải
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-blue-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Nếu là admin, hiển thị nội dung
  return isAdmin ? children : null;
}

export default PrivateRoute;