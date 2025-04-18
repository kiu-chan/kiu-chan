import React, { createContext, useContext } from 'react';
import { 
  ref, 
  uploadBytesResumable, 
  getDownloadURL,
  deleteObject,
  listAll 
} from 'firebase/storage';
import { storage } from '../firebase';

// Tạo context
const StorageContext = createContext();

// Hook để sử dụng StorageContext
export function useStorage() {
  return useContext(StorageContext);
}

// Provider component
export function StorageProvider({ children }) {
  // Tải lên file và theo dõi tiến trình
  const uploadFile = (file, path, progressCallback) => {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject("Không có file nào được chọn");
        return;
      }

      // Tạo đường dẫn để lưu file
      const filePath = `${path}/${file.name}`;
      const storageRef = ref(storage, filePath);
      
      // Bắt đầu tải lên
      const uploadTask = uploadBytesResumable(storageRef, file);

      // Lắng nghe sự kiện tiến trình tải lên
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Tính toán phần trăm tiến trình
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (progressCallback) {
            progressCallback(progress);
          }
        },
        (error) => {
          reject(error);
        },
        async () => {
          // Tải lên hoàn tất
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve({
              url: downloadURL,
              path: filePath,
              name: file.name,
              size: file.size,
              type: file.type
            });
          } catch (error) {
            reject(error);
          }
        }
      );
    });
  };

  // Xóa file
  const deleteFile = async (filePath) => {
    try {
      const fileRef = ref(storage, filePath);
      await deleteObject(fileRef);
      return true;
    } catch (error) {
      console.error("Lỗi khi xóa file:", error);
      throw error;
    }
  };

  // Lấy URL tải xuống của file
  const getFileURL = async (filePath) => {
    try {
      const fileRef = ref(storage, filePath);
      return await getDownloadURL(fileRef);
    } catch (error) {
      console.error("Lỗi khi lấy URL file:", error);
      throw error;
    }
  };

  // Liệt kê tất cả các file trong một thư mục
  const listFiles = async (folderPath) => {
    try {
      const folderRef = ref(storage, folderPath);
      const result = await listAll(folderRef);
      
      const files = await Promise.all(
        result.items.map(async (itemRef) => {
          const url = await getDownloadURL(itemRef);
          return {
            name: itemRef.name,
            path: itemRef.fullPath,
            url: url
          };
        })
      );
      
      return files;
    } catch (error) {
      console.error("Lỗi khi liệt kê file:", error);
      throw error;
    }
  };

  // Các giá trị được cung cấp bởi context
  const value = {
    uploadFile,
    deleteFile,
    getFileURL,
    listFiles
  };

  return (
    <StorageContext.Provider value={value}>
      {children}
    </StorageContext.Provider>
  );
}