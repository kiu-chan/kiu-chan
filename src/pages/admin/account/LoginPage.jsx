import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { googleProvider } from '../../../firebase';
import { FaGoogle } from 'react-icons/fa';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const auth = getAuth();
  const db = getFirestore();

  const checkUserAccess = async (user) => {
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);
    
    if (!userDoc.exists()) {
      await auth.signOut();
      throw new Error('Account not found. Please contact administrator.');
    }
    
    const userData = userDoc.data();
    
    if (userData?.role !== 'admin') {
      await auth.signOut();
      throw new Error('Access denied. Admin rights required.');
    }
    
    return userData;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await checkUserAccess(userCredential.user);
      window.location.href = '/admin';
    } catch (error) {
      switch (error.code) {
        case 'auth/invalid-credential':
          setError('Invalid email or password');
          break;
        case 'auth/user-not-found':
          setError('No user found with this email');
          break;
        case 'auth/wrong-password':
          setError('Incorrect password');
          break;
        default:
          setError(error.message || 'Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setIsGoogleLoading(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      await checkUserAccess(result.user);
      window.location.href = '/admin';
    } catch (error) {
      if (error.code === 'auth/popup-closed-by-user') {
        setError('Login cancelled');
      } else {
        setError(error.message || 'Google login failed. Please try again.');
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 px-4">
      <div className="w-full max-w-md">
        <form 
          onSubmit={handleLogin} 
          className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4"
        >
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-blue-600">Admin Login</h2>
            <p className="text-gray-600 mt-2">Enter your credentials</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label 
              className="block text-gray-700 text-sm font-bold mb-2" 
              htmlFor="email"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 
                         leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
          </div>

          <div className="mb-6">
            <label 
              className="block text-gray-700 text-sm font-bold mb-2" 
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 
                         mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />
          </div>

          <div className="space-y-3">
            <button
              type="submit"
              disabled={isLoading || isGoogleLoading}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 
                         rounded focus:outline-none focus:shadow-outline transition-colors
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading || isGoogleLoading}
              className="w-full bg-white hover:bg-gray-50 text-gray-700 font-bold py-2 px-4 
                         rounded border border-gray-300 focus:outline-none focus:shadow-outline 
                         transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                         flex items-center justify-center"
            >
              <FaGoogle className="mr-2 text-red-500" />
              {isGoogleLoading ? 'Signing in...' : 'Sign in with Google'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;