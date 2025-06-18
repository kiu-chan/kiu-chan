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
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

// Sửa lỗi: createTransport thay vì createTransporter
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

    // Tạo tên file mới
    const timestamp = Date.now();
    const originalName = file.originalFilename || 'image';
    const extension = path.extname(originalName);
    const newFileName = `${timestamp}-${Math.random().toString(36).substring(7)}${extension}`;
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

      const imageUrl = `/uploads/${newFileName}`;
      
      res.json({
        success: true,
        url: imageUrl,
        filename: newFileName,
        originalName: originalName
      });
    });
  });
});

// API xóa ảnh
app.delete('/api/delete-image/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(uploadsDir, filename);

  fs.unlink(filePath, (err) => {
    if (err) {
      console.error('Delete error:', err);
      return res.status(500).json({ 
        success: false, 
        message: 'Lỗi khi xóa file' 
      });
    }

    res.json({
      success: true,
      message: 'File đã được xóa thành công'
    });
  });
});

// API kiểm tra file tồn tại
app.get('/api/check-image/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(uploadsDir, filename);
  
  if (fs.existsSync(filePath)) {
    res.json({ exists: true });
  } else {
    res.status(404).json({ exists: false });
  }
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
});