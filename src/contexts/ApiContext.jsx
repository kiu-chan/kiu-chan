import React, { createContext, useContext } from 'react';

const ApiContext = createContext();

export function useApi() {
  return useContext(ApiContext);
}

export function ApiProvider({ children }) {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

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
                url: `${API_BASE_URL}${response.url}`,
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
          reject(`Upload failed with status: ${xhr.status}`);
        }
      });

      xhr.addEventListener('error', () => {
        reject('Network error');
      });

      xhr.open('POST', `${API_BASE_URL}/api/upload-image`);
      xhr.send(formData);
    });
  };

  // Xóa ảnh từ server
  const deleteImage = async (filename) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/delete-image/${filename}`, {
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

  // Kiểm tra file có tồn tại không
  const checkImageExists = async (filename) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/check-image/${filename}`);
      const result = await response.json();
      return result.exists;
    } catch (error) {
      return false;
    }
  };

  // Lấy URL đầy đủ của ảnh với fallback
  const getImageURL = (filename) => {
    if (!filename) return null;
    
    if (filename.startsWith('http')) {
      return filename;
    }
    
    if (filename.startsWith('/uploads/')) {
      return `${API_BASE_URL}${filename}`;
    }
    
    return `${API_BASE_URL}/uploads/${filename}`;
  };

  const value = {
    uploadImage,
    deleteImage,
    checkImageExists,
    getImageURL
  };

  return (
    <ApiContext.Provider value={value}>
      {children}
    </ApiContext.Provider>
  );
}