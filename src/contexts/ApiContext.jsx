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

  // Utility function để tạo filename unique
  const generateUniqueFilename = (originalName) => {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const extension = originalName.split('.').pop();
    const nameWithoutExt = originalName.replace(/\.[^/.]+$/, "");
    const cleanName = nameWithoutExt.replace(/[^a-zA-Z0-9]/g, '');
    return `${timestamp}-${randomString}-${cleanName}.${extension}`;
  };

  // Nén ảnh với canvas
  const compressImage = (file, maxWidth = 1200, maxHeight = 1200, quality = 0.8) => {
    return new Promise((resolve, reject) => {
      if (!file || !file.type.startsWith('image/')) {
        reject(new Error('File không phải là hình ảnh'));
        return;
      }

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        try {
          // Tính toán kích thước mới giữ nguyên tỷ lệ
          let { width, height } = img;
          
          if (width > height) {
            if (width > maxWidth) {
              height = (height * maxWidth) / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = (width * maxHeight) / height;
              height = maxHeight;
            }
          }

          // Set canvas size
          canvas.width = width;
          canvas.height = height;

          // Enable high quality rendering
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          // Draw image
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to blob
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Không thể nén ảnh'));
                return;
              }

              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });

              console.log(`Image compressed: ${(file.size / 1024 / 1024).toFixed(2)}MB -> ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`);
              resolve(compressedFile);
            },
            'image/jpeg',
            quality
          );
        } catch (error) {
          reject(new Error('Lỗi khi xử lý ảnh: ' + error.message));
        }
      };

      img.onerror = () => {
        reject(new Error('Không thể load ảnh'));
      };

      img.src = URL.createObjectURL(file);
    });
  };

  // Validate file trước khi upload
  const validateFile = (file) => {
    if (!file) {
      throw new Error('Vui lòng chọn file');
    }

    if (!file.type.startsWith('image/')) {
      throw new Error('Chỉ chấp nhận file hình ảnh (jpg, png, gif, webp)');
    }

    // Giới hạn 10MB cho file gốc
    const maxOriginalSize = 10 * 1024 * 1024;
    if (file.size > maxOriginalSize) {
      throw new Error('File quá lớn. Kích thước tối đa là 10MB');
    }

    return true;
  };

  // Upload image với xử lý đầy đủ
  const uploadImage = async (file, progressCallback) => {
    return new Promise(async (resolve, reject) => {
      try {
        // Validate file
        validateFile(file);

        let fileToUpload = file;

        // Nén ảnh nếu file > 2MB hoặc kích thước lớn
        if (file.size > 2 * 1024 * 1024) {
          console.log('Compressing large image...');
          
          // Điều chỉnh quality dựa trên size
          let quality = 0.8;
          let maxDimension = 1200;
          
          if (file.size > 8 * 1024 * 1024) {
            quality = 0.6;
            maxDimension = 800;
          } else if (file.size > 5 * 1024 * 1024) {
            quality = 0.7;
            maxDimension = 1000;
          }

          fileToUpload = await compressImage(file, maxDimension, maxDimension, quality);

          // Nếu vẫn lớn, nén thêm
          if (fileToUpload.size > 3 * 1024 * 1024) {
            console.log('Still large, compressing more...');
            fileToUpload = await compressImage(fileToUpload, 600, 600, 0.5);
          }
        }

        // Tạo FormData
        const formData = new FormData();
        formData.append('image', fileToUpload);

        // Create XMLHttpRequest
        const xhr = new XMLHttpRequest();

        // Set timeout
        xhr.timeout = 120000; // 2 minutes

        // Progress handler
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable && progressCallback) {
            const progress = Math.round((e.loaded / e.total) * 100);
            progressCallback(progress);
          }
        });

        // Success handler
        xhr.addEventListener('load', () => {
          try {
            if (xhr.status === 200) {
              const response = JSON.parse(xhr.responseText);
              
              if (response.success) {
                const result = {
                  success: true,
                  url: response.url.startsWith('http') ? response.url : `${API_BASE_URL}${response.url}`,
                  filename: response.filename,
                  originalName: response.originalName || file.name,
                  size: fileToUpload.size,
                  type: fileToUpload.type
                };
                
                console.log('Upload successful:', result);
                resolve(result);
              } else {
                reject(new Error(response.message || 'Upload thất bại'));
              }
            } else {
              // Handle HTTP errors
              let errorMessage = 'Upload thất bại';
              
              switch (xhr.status) {
                case 413:
                  errorMessage = 'File quá lớn cho server. Vui lòng chọn ảnh nhỏ hơn';
                  break;
                case 415:
                  errorMessage = 'Định dạng file không được hỗ trợ';
                  break;
                case 500:
                  errorMessage = 'Lỗi server nội bộ. Vui lòng thử lại';
                  break;
                case 502:
                case 503:
                  errorMessage = 'Server đang bảo trì. Vui lòng thử lại sau';
                  break;
                default:
                  errorMessage = `Lỗi HTTP ${xhr.status}: ${xhr.statusText}`;
              }
              
              reject(new Error(errorMessage));
            }
          } catch (parseError) {
            reject(new Error('Lỗi xử lý phản hồi từ server'));
          }
        });

        // Error handlers
        xhr.addEventListener('error', () => {
          reject(new Error('Lỗi kết nối mạng. Vui lòng kiểm tra internet'));
        });

        xhr.addEventListener('timeout', () => {
          reject(new Error('Upload timeout. Vui lòng thử lại với ảnh nhỏ hơn'));
        });

        xhr.addEventListener('abort', () => {
          reject(new Error('Upload bị hủy'));
        });

        // Send request
        xhr.open('POST', `${API_BASE_URL}/api/upload-image`);
        
        // Set headers if needed
        // xhr.setRequestHeader('Accept', 'application/json');
        
        xhr.send(formData);

      } catch (error) {
        reject(error);
      }
    });
  };

  // Delete image
  const deleteImage = async (filename) => {
    try {
      if (!filename) {
        return true; // No file to delete
      }

      console.log('Deleting image:', filename);

      const response = await fetch(`${API_BASE_URL}/api/delete-image/${encodeURIComponent(filename)}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          console.warn('File not found on server, considering as deleted');
          return true;
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.success) {
        console.log('Image deleted successfully');
        return true;
      } else {
        throw new Error(result.message || 'Delete failed');
      }
    } catch (error) {
      console.error('Delete image error:', error);
      throw new Error('Không thể xóa ảnh: ' + error.message);
    }
  };

  // Check if image exists
  const checkImageExists = async (filename) => {
    try {
      if (!filename) return false;

      const response = await fetch(`${API_BASE_URL}/api/check-image/${encodeURIComponent(filename)}`, {
        method: 'HEAD',
      });

      return response.ok;
    } catch (error) {
      console.error('Check image exists error:', error);
      return false;
    }
  };

  // Get image URL with proper handling
  const getImageURL = (imageData) => {
    if (!imageData) return null;

    // If imageData is already a full URL
    if (typeof imageData === 'string' && imageData.startsWith('http')) {
      return imageData;
    }

    // If imageData is a filename or relative path
    let filename = imageData;
    if (typeof imageData === 'object' && imageData.filename) {
      filename = imageData.filename;
    }

    if (!filename) return null;

    // Handle relative paths
    if (filename.startsWith('/uploads/')) {
      return `${API_BASE_URL}${filename}`;
    }

    // Handle filename only
    return `${API_BASE_URL}/uploads/${filename}`;
  };

  // Get image info
  const getImageInfo = async (filename) => {
    try {
      if (!filename) return null;

      const response = await fetch(`${API_BASE_URL}/api/image-info/${encodeURIComponent(filename)}`);
      
      if (!response.ok) {
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error('Get image info error:', error);
      return null;
    }
  };

  const value = {
    uploadImage,
    deleteImage,
    checkImageExists,
    getImageURL,
    getImageInfo,
    compressImage,
    validateFile,
    API_BASE_URL
  };

  return (
    <ApiContext.Provider value={value}>
      {children}
    </ApiContext.Provider>
  );
}