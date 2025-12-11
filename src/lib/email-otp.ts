import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD
  }
});

export async function sendEmailOTP(email: string, otp: string) {
  try {
    const mailOptions = {
      from: `"Xe Ghép - Tài Xế" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Mã OTP Đăng Nhập Tài Xế',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; padding: 40px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
            .header { text-align: center; margin-bottom: 30px; }
            .logo { font-size: 24px; font-weight: bold; color: #f59e0b; }
            .otp-box { background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%); color: white; padding: 20px; border-radius: 8px; text-align: center; margin: 30px 0; }
            .otp-code { font-size: 36px; font-weight: bold; letter-spacing: 8px; margin: 10px 0; }
            .info { color: #666; font-size: 14px; line-height: 1.6; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #999; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🚗 Xe Ghép</div>
              <p style="color: #666; margin-top: 10px;">Xác thực tài khoản tài xế</p>
            </div>
            
            <div class="otp-box">
              <p style="margin: 0; font-size: 14px;">Mã OTP của bạn là:</p>
              <div class="otp-code">${otp}</div>
              <p style="margin: 0; font-size: 12px; opacity: 0.9;">Có hiệu lực trong 5 phút</p>
            </div>
            
            <div class="info">
              <p><strong>Lưu ý:</strong></p>
              <ul>
                <li>Không chia sẻ mã OTP này với bất kỳ ai</li>
                <li>Mã OTP chỉ có hiệu lực trong 5 phút</li>
                <li>Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email</li>
              </ul>
            </div>
            
            <div class="footer">
              <p>Email này được gửi tự động, vui lòng không trả lời.</p>
              <p>© 2024 Xe Ghép. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('[Email] OTP sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('[Email] Error sending OTP:', error);
    throw new Error('Failed to send email OTP');
  }
}
