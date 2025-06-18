import React, { createContext, useContext } from 'react';

const ApiContext = createContext();

export function useApi() {
  return useContext(ApiContext);
}

export function ApiProvider({ children }) {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Upload ảnh lên server
  const uploadImage = async (file, progressCallback) => {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject("Không có file nào được chọn");
        return;
      }

      const formData = new FormData();
      formData.append('image', file);

      const xhr = new XMLHttpRequest();

      // Theo dõi tiến trình upload
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const progress = (e.loaded / e.total) * 100;
          if (progressCallback) {
            progressCallback(progress);
          }
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          try {
            const response = JSON.parse(xhr.responseText);
            if (response.success) {
              resolve({
                url: `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'}${response.url}`,
                filename: response.filename,
                originalName: response.originalName,
                name: file.name,
                size: file.size,
                type: file.type
              });
            } else {
              reject(response.message || 'Upload failed');
            }
          } catch (error) {
            reject('Error parsing response');
          }
        } else {
          reject('Upload failed');
        }
      });

      xhr.addEventListener('error', () => {
        reject('Network error');
      });

      xhr.open('POST', `${API_BASE_URL}/upload-image`);
      xhr.send(formData);
    });
  };

  // Xóa ảnh từ server
  const deleteImage = async (filename) => {
    try {
      const response = await fetch(`${API_BASE_URL}/delete-image/${filename}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Delete failed');
      }

      return true;
    } catch (error) {
      console.error("Lỗi khi xóa file:", error);
      throw error;
    }
  };

  // Lấy URL đầy đủ của ảnh
  const getImageURL = (filename) => {
    if (!filename) return null;
    
    // Nếu filename đã là URL đầy đủ
    if (filename.startsWith('http')) {
      return filename;
    }
    
    // Nếu filename bắt đầu bằng /uploads/
    if (filename.startsWith('/uploads/')) {
      return `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'}${filename}`;
    }
    
    // Nếu chỉ là tên file
    return `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'}/uploads/${filename}`;
  };

  const value = {
    uploadImage,
    deleteImage,
    getImageURL
  };

  return (
    <ApiContext.Provider value={value}>
      {children}
    </ApiContext.Provider>
  );
}