import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import './firebase'; // Import file firebase đã tạo

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)