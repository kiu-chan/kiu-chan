import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { auth } from '../firebase';

// Tạo context
const AuthContext = createContext();

// Hook để sử dụng AuthContext
export function useAuth() {
  return useContext(AuthContext);
}

// Provider component
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Đăng ký người dùng mới
  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  // Đăng nhập
  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  // Đăng xuất
  function logout() {
    return signOut(auth);
  }

  // Đặt lại mật khẩu
  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  // Cập nhật thông tin người dùng
  function updateUserProfile(user, data) {
    return updateProfile(user, data);
  }

  // Effect hook để theo dõi trạng thái xác thực
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Các giá trị được cung cấp bởi context
  const value = {
    currentUser,
    signup,
    login,
    logout,
    resetPassword,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}