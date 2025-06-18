import React, { createContext, useContext } from 'react';

const ApiContext = createContext();

export function useApi() {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
}

export function ApiProvider({ children }) {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

  // Nén ảnh
  const compressImage = (file, maxWidth = 1200, quality = 0.8) => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        let { width, height } = img;
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          },
          'image/jpeg',
          quality
        );
      };

      img.onerror = () => reject(new Error('Không thể load ảnh'));
      img.src = URL.createObjectURL(file);
    });
  };

  // Upload ảnh
  const uploadImage = async (file, progressCallback) => {
    return new Promise(async (resolve, reject) => {
      try {
        if (!file || !file.type.startsWith('image/')) {
          reject(new Error('Chỉ chấp nhận file hình ảnh'));
          return;
        }

        if (file.size > 10 * 1024 * 1024) {
          reject(new Error('File quá lớn. Tối đa 10MB'));
          return;
        }

        let fileToUpload = file;
        if (file.size > 2 * 1024 * 1024) {
          fileToUpload = await compressImage(file, 1200, 0.8);
        }

        const formData = new FormData();
        formData.append('image', fileToUpload);

        const xhr = new XMLHttpRequest();
        xhr.timeout = 60000;

        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable && progressCallback) {
            progressCallback(Math.round((e.loaded / e.total) * 100));
          }
        });

        xhr.addEventListener('load', () => {
          if (xhr.status === 200) {
            try {
              const response = JSON.parse(xhr.responseText);
              if (response.success) {
                resolve({
                  url: response.url.startsWith('http') ? response.url : `${API_BASE_URL}${response.url}`,
                  filename: response.filename,
                  originalName: response.originalName || file.name
                });
              } else {
                reject(new Error(response.message || 'Upload thất bại'));
              }
            } catch (error) {
              reject(new Error('Lỗi phản hồi từ server'));
            }
          } else {
            reject(new Error(`Upload thất bại: ${xhr.status}`));
          }
        });

        xhr.addEventListener('error', () => {
          reject(new Error('Lỗi kết nối'));
        });

        xhr.addEventListener('timeout', () => {
          reject(new Error('Upload timeout'));
        });

        xhr.open('POST', `${API_BASE_URL}/api/upload-image`);
        xhr.send(formData);
      } catch (error) {
        reject(error);
      }
    });
  };

  // Xóa ảnh
  const deleteImage = async (filename) => {
    try {
      if (!filename) return true;

      const response = await fetch(`${API_BASE_URL}/api/delete-image/${encodeURIComponent(filename)}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        const result = await response.json();
        return result.success;
      }
      return false;
    } catch (error) {
      console.error('Delete error:', error);
      return false;
    }
  };

  // Lấy URL ảnh - KHÔNG dùng cache busting
  const getImageURL = (imageData) => {
    if (!imageData) return null;

    let url = null;
    
    // Nếu đã là URL đầy đủ
    if (typeof imageData === 'string' && imageData.startsWith('http')) {
      return imageData; // Trả về ngay không thêm gì
    }
    
    // Xử lý filename
    let filename = imageData;
    if (typeof imageData === 'object' && imageData.filename) {
      filename = imageData.filename;
    }

    if (!filename) return null;

    // Xây dựng URL đơn giản
    if (filename.startsWith('/uploads/')) {
      url = `${API_BASE_URL}${filename}`;
    } else {
      url = `${API_BASE_URL}/uploads/${filename}`;
    }

    return url;
  };

  // Kiểm tra ảnh tồn tại
  const checkImageExists = async (filename) => {
    try {
      if (!filename) return false;
      
      const url = getImageURL(filename);
      if (!url) return false;
      
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok;
    } catch (error) {
      return false;
    }
  };

  // Force refresh component khi cần
  const refreshImageCache = () => {
    // Trigger re-render của components sử dụng ảnh
    window.dispatchEvent(new CustomEvent('refreshImages'));
  };

  const value = {
    uploadImage,
    deleteImage,
    getImageURL,
    checkImageExists,
    refreshImageCache,
    API_BASE_URL
  };

  return (
    <ApiContext.Provider value={value}>
      {children}
    </ApiContext.Provider>
  );
}