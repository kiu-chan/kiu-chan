import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import fs from 'fs';
import formidable from 'formidable';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = 3001;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_APP_PASSWORD = process.env.EMAIL_APP_PASSWORD;

// Tạo thư mục uploads nếu chưa tồn tại
const uploadsDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'https://monlycute.id.vn'],
  credentials: true
}));

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files với headers để tránh cache
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads'), {
  setHeaders: (res, filePath) => {
    // Disable caching để đảm bảo ảnh mới được load
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }
}));

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_APP_PASSWORD
  }
});

console.log('EMAIL_USER:', EMAIL_USER);
console.log('EMAIL_APP_PASSWORD được cấu hình:', EMAIL_APP_PASSWORD ? 'Có' : 'Không');

// API upload ảnh
app.post('/api/upload-image', (req, res) => {
  const form = new formidable.IncomingForm();
  form.uploadDir = uploadsDir;
  form.keepExtensions = true;
  form.maxFileSize = 10 * 1024 * 1024; // 10MB

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error('Upload error:', err);
      return res.status(500).json({ 
        success: false, 
        message: 'Lỗi khi upload file' 
      });
    }

    const file = files.image;
    if (!file) {
      return res.status(400).json({ 
        success: false, 
        message: 'Không có file được upload' 
      });
    }

    // Kiểm tra loại file
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.mimetype)) {
      return res.status(400).json({
        success: false,
        message: 'Chỉ chấp nhận file ảnh (JPG, PNG, GIF, WebP)'
      });
    }

    // Tạo tên file mới với timestamp và random string
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const originalName = file.originalFilename || 'image';
    const extension = path.extname(originalName);
    const cleanName = path.basename(originalName, extension).replace(/[^a-zA-Z0-9]/g, '');
    const newFileName = `${timestamp}-${randomStr}-${cleanName}${extension}`;
    const newFilePath = path.join(uploadsDir, newFileName);

    // Di chuyển file
    fs.rename(file.filepath, newFilePath, (err) => {
      if (err) {
        console.error('File move error:', err);
        return res.status(500).json({ 
          success: false, 
          message: 'Lỗi khi lưu file' 
        });
      }

      // Verify file exists after move
      if (!fs.existsSync(newFilePath)) {
        return res.status(500).json({
          success: false,
          message: 'File không được lưu thành công'
        });
      }

      const imageUrl = `/uploads/${newFileName}`;
      
      console.log(`Image uploaded successfully: ${newFileName}`);
      
      res.json({
        success: true,
        url: imageUrl,
        filename: newFileName,
        originalName: originalName,
        size: fs.statSync(newFilePath).size
      });
    });
  });
});

// API xóa ảnh
app.delete('/api/delete-image/:filename', (req, res) => {
  const { filename } = req.params;
  
  // Validate filename để tránh path traversal
  if (!filename || filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
    return res.status(400).json({
      success: false,
      message: 'Tên file không hợp lệ'
    });
  }

  const filePath = path.join(uploadsDir, filename);

  // Kiểm tra file có tồn tại không
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({
      success: false,
      message: 'File không tồn tại'
    });
  }

  fs.unlink(filePath, (err) => {
    if (err) {
      console.error('Delete error:', err);
      return res.status(500).json({ 
        success: false, 
        message: 'Lỗi khi xóa file' 
      });
    }

    console.log(`Image deleted successfully: ${filename}`);
    
    res.json({
      success: true,
      message: 'File đã được xóa thành công'
    });
  });
});

// API kiểm tra file tồn tại
app.get('/api/check-image/:filename', (req, res) => {
  const { filename } = req.params;
  
  // Validate filename
  if (!filename || filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
    return res.status(400).json({ exists: false });
  }

  const filePath = path.join(uploadsDir, filename);
  
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    res.json({ 
      exists: true,
      size: stats.size,
      modified: stats.mtime
    });
  } else {
    res.status(404).json({ exists: false });
  }
});

// API get thông tin file
app.get('/api/image-info/:filename', (req, res) => {
  const { filename } = req.params;
  
  if (!filename || filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
    return res.status(400).json({
      success: false,
      message: 'Tên file không hợp lệ'
    });
  }

  const filePath = path.join(uploadsDir, filename);
  
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({
      success: false,
      message: 'File không tồn tại'
    });
  }

  try {
    const stats = fs.statSync(filePath);
    res.json({
      success: true,
      filename: filename,
      size: stats.size,
      created: stats.birthtime,
      modified: stats.mtime,
      url: `/uploads/${filename}`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thông tin file'
    });
  }
});

// API serve ảnh trực tiếp với headers chống cache
app.get('/uploads/:filename', (req, res) => {
  const { filename } = req.params;
  
  if (!filename || filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
    return res.status(400).send('Invalid filename');
  }

  const filePath = path.join(uploadsDir, filename);
  
  if (!fs.existsSync(filePath)) {
    return res.status(404).send('File not found');
  }

  // Set headers to prevent caching
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  
  // Set proper content type
  const ext = path.extname(filename).toLowerCase();
  const contentTypes = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp'
  };
  
  if (contentTypes[ext]) {
    res.setHeader('Content-Type', contentTypes[ext]);
  }

  // Send file
  res.sendFile(filePath);
});

// Route API để xử lý gửi email từ form liên hệ
app.post('/api/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ success: false, message: 'Vui lòng điền đầy đủ thông tin.' });
  }

  const mailOptions = {
    from: `"Contact Form" <${EMAIL_USER}>`,
    to: EMAIL_USER,
    replyTo: email,
    subject: `Portfolio Contact: ${subject}`,
    html: `
      <h3>Tin nhắn mới từ trang web Portfolio</h3>
      <p><strong>Họ tên:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Chủ đề:</strong> ${subject}</p>
      <p><strong>Nội dung:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
    `
  };

  const autoReplyOptions = {
    from: `"Khanh - Software Engineer" <${EMAIL_USER}>`,
    to: email,
    subject: `Thank you for contacting me - ${name}`,
    html: `
      <h3>Thank you for reaching out!</h3>
      <p>Dear ${name},</p>
      <p>Thank you for contacting me. I have received your message regarding "${subject}".</p>
      <p>I will review your message and get back to you as soon as possible.</p>
      <p>Best regards,</p>
      <p><strong>Khanh</strong></p>
      <p>Software Engineer at GIS Research Center</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Đã gửi email thông báo thành công');
    
    await transporter.sendMail(autoReplyOptions);
    console.log('Đã gửi email phản hồi tự động thành công');
    
    res.status(200).json({ success: true, message: 'Tin nhắn đã được gửi thành công.' });
  } catch (error) {
    console.error('Lỗi gửi email:', error);
    res.status(500).json({ success: false, message: 'Có lỗi xảy ra khi gửi email. Vui lòng thử lại sau.' });
  }
});

app.get('/', (req, res) => {
  res.send('Email Server đang chạy trên cổng 3001!');
});

app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
  console.log('Sử dụng file .env để cấu hình email');
  console.log(`Uploads directory: ${uploadsDir}`);
});