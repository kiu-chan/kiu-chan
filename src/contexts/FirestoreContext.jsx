import React, { createContext, useContext } from 'react';
import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit 
} from 'firebase/firestore';
import { db } from '../firebase';

// Tạo context
const FirestoreContext = createContext();

// Hook để sử dụng FirestoreContext
export function useFirestore() {
  return useContext(FirestoreContext);
}

// Provider component
export function FirestoreProvider({ children }) {
  // Thêm dữ liệu mới vào collection
  const addDocument = async (collectionName, data) => {
    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: new Date().toISOString()
      });
      return { id: docRef.id, ...data };
    } catch (error) {
      console.error("Lỗi khi thêm dữ liệu:", error);
      throw error;
    }
  };

  // Lấy tất cả dữ liệu từ collection
  const getDocuments = async (collectionName, queryConstraints = []) => {
    try {
      const queryRef = query(collection(db, collectionName), ...queryConstraints);
      const querySnapshot = await getDocs(queryRef);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
      throw error;
    }
  };

  // Lấy một document theo ID
  const getDocument = async (collectionName, docId) => {
    try {
      const docRef = doc(db, collectionName, docId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        return null;
      }
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
      throw error;
    }
  };

  // Cập nhật document
  const updateDocument = async (collectionName, docId, data) => {
    try {
      const docRef = doc(db, collectionName, docId);
      await updateDoc(docRef, {
        ...data,
        updatedAt: new Date().toISOString()
      });
      return { id: docId, ...data };
    } catch (error) {
      console.error("Lỗi khi cập nhật dữ liệu:", error);
      throw error;
    }
  };

  // Xóa document
  const deleteDocument = async (collectionName, docId) => {
    try {
      const docRef = doc(db, collectionName, docId);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error("Lỗi khi xóa dữ liệu:", error);
      throw error;
    }
  };

  // Truy vấn tùy chỉnh
  const queryDocuments = async (collectionName, whereConditions = [], orderByField = null, limitCount = null) => {
    try {
      let queryConstraints = [];
      
      // Thêm điều kiện where
      whereConditions.forEach(condition => {
        queryConstraints.push(where(condition.field, condition.operator, condition.value));
      });
      
      // Thêm điều kiện sắp xếp
      if (orderByField) {
        queryConstraints.push(orderBy(orderByField.field, orderByField.direction || 'asc'));
      }
      
      // Thêm giới hạn kết quả
      if (limitCount) {
        queryConstraints.push(limit(limitCount));
      }
      
      return getDocuments(collectionName, queryConstraints);
    } catch (error) {
      console.error("Lỗi khi truy vấn dữ liệu:", error);
      throw error;
    }
  };

  // Các giá trị được cung cấp bởi context
  const value = {
    addDocument,
    getDocuments,
    getDocument,
    updateDocument,
    deleteDocument,
    queryDocuments
  };

  return (
    <FirestoreContext.Provider value={value}>
      {children}
    </FirestoreContext.Provider>
  );
}