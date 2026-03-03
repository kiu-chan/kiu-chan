import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.jpg', '**/*.png', '**/*.svg'],
  server: {
    port: 8080, // Sử dụng port mặc định 8080
    strictPort: true, // Đảm bảo chỉ sử dụng port này
    host: true // Cho phép truy cập từ các địa chỉ khác
  }
})