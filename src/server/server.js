import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { google } from 'googleapis';
const OAuth2 = google.auth.OAuth2;

// Lấy đường dẫn hiện tại
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load biến môi trường
dotenv.config({ path: join(__dirname, '../../.env') });

const app = express();

// CORS config
app.use(cors({
  origin: ['https://monlycute.id.vn', 'http://localhost:5173'],
  credentials: true
}));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));
app.use(express.json());

// Tạo transporter với Gmail
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
  debug: true, // Hiện thông tin debug
});

// API endpoint để gửi email
app.post('/api/send-confirmation', async (req, res) => {
  const { email, projectTitle, requestType, subject, description } = req.body;

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: `Request Confirmation - ${projectTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Thank you for submitting your request</h2>
        <p>Dear User,</p>
        <p>We have received your request regarding ${projectTitle}. We will respond within 30 days.</p>
        
        <div style="background-color: #f5f5f5; padding: 15px; margin: 20px 0; border-radius: 5px;">
          <h3>Request Details:</h3>
          <ul>
            <li><strong>Request Type:</strong> ${requestType}</li>
            <li><strong>Subject:</strong> ${subject}</li>
            <li><strong>Description:</strong> ${description}</li>
          </ul>
        </div>
        
        <p>We will send our response to this email address: ${email}</p>
        
        <p>Best regards,<br/>The ${projectTitle} Team</p>
      </div>
    `
  };

  try {
    // Log thông tin trước khi gửi
    console.log('Attempting to send email with config:', {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject
    });

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.response);
    res.json({ 
      success: true, 
      message: 'Email sent successfully',
      messageId: info.messageId 
    });
  } catch (error) {
    console.error('Detailed error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to send email. Please try again later.',
      details: error.message
    });
  }
});

const PORT = process.env.PORT || 3001;

// Test kết nối SMTP trước khi khởi động server
transporter.verify(function (error, success) {
  if (error) {
    console.error('SMTP connection error:', error);
  } else {
    console.log("SMTP server is ready");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Email service configured with: ${process.env.GMAIL_USER}`);
    });
  }
});