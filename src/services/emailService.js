const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'khanhk66uet@gmail.com', // Email của bạn
    pass: 'iozv hjbd busk ibei' // Mật khẩu ứng dụng từ Google Account
  }
});

const sendConfirmationEmail = async (data) => {
  const mailOptions = {
    from: 'your-email@gmail.com', // Email của bạn
    to: data.email,
    subject: `Request Confirmation - ${data.projectTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Thank you for submitting your request</h2>
        <p>Dear User,</p>
        <p>We have received your request regarding ${data.projectTitle}. We will respond within 30 days.</p>
        
        <div style="background-color: #f5f5f5; padding: 15px; margin: 20px 0; border-radius: 5px;">
          <h3>Request Details:</h3>
          <ul>
            <li><strong>Request Type:</strong> ${data.requestType}</li>
            <li><strong>Subject:</strong> ${data.subject}</li>
            <li><strong>Description:</strong> ${data.description}</li>
          </ul>
        </div>
        
        <p>We will send our response to this email address: ${data.email}</p>
        
        <p>Best regards,<br/>The ${data.projectTitle} Team</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = { sendConfirmationEmail };