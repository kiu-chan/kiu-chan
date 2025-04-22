// Sử dụng ES modules thay vì CommonJS
import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

// Lấy đường dẫn hiện tại
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Nạp biến môi trường từ file .env
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
// Sử dụng cổng 3001 cố định thay vì từ biến môi trường
const PORT = 3001;
const EMAIL_USER = process.env.EMAIL_USER || 'khanhk66uet@gmail.com';
const EMAIL_APP_PASSWORD = process.env.EMAIL_APP_PASSWORD;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Cấu hình transporter cho nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_APP_PASSWORD // Mật khẩu ứng dụng Gmail
  }
});

// Kiểm tra xem đã đọc được thông tin xác thực email chưa
console.log('EMAIL_USER:', EMAIL_USER);
console.log('EMAIL_APP_PASSWORD được cấu hình:', EMAIL_APP_PASSWORD ? 'Có' : 'Không');

// Route API để xử lý gửi email từ form liên hệ
app.post('/api/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;

  // Kiểm tra dữ liệu đầu vào
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ success: false, message: 'Vui lòng điền đầy đủ thông tin.' });
  }

  // Cấu hình email
  const mailOptions = {
    from: `"Contact Form" <${EMAIL_USER}>`,
    to: EMAIL_USER, // Email nhận (có thể thay đổi)
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

  // Cấu hình email tự động phản hồi
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
    // Gửi email cho chủ website
    await transporter.sendMail(mailOptions);
    console.log('Đã gửi email thông báo thành công');
    
    // Gửi email phản hồi tự động cho người gửi
    await transporter.sendMail(autoReplyOptions);
    console.log('Đã gửi email phản hồi tự động thành công');
    
    res.status(200).json({ success: true, message: 'Tin nhắn đã được gửi thành công.' });
  } catch (error) {
    console.error('Lỗi gửi email:', error);
    res.status(500).json({ success: false, message: 'Có lỗi xảy ra khi gửi email. Vui lòng thử lại sau.' });
  }
});

// Route kiểm tra server
app.get('/', (req, res) => {
  res.send('Email Server đang chạy trên cổng 3001!');
});

// Khởi động server
app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
  console.log('Sử dụng file .env để cấu hình email');
});