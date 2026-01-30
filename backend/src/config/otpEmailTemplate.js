const createOTPEmailTemplate = (otp, username) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>JEERA - OTP Verification</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f8f9fa;
        }
        .container {
          background: white;
          border-radius: 12px;
          padding: 30px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 2px solid #f0f0f0;
        }
        .logo {
          font-size: 28px;
          font-weight: bold;
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 10px;
        }
        .title {
          font-size: 24px;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 20px;
        }
        .otp-box {
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
          color: white;
          font-size: 32px;
          font-weight: bold;
          padding: 20px;
          text-align: center;
          border-radius: 8px;
          letter-spacing: 8px;
          margin: 20px 0;
          box-shadow: 0 4px 6px rgba(251, 191, 36, 0.3);
        }
        .content {
          color: #4b5563;
          margin-bottom: 25px;
        }
        .footer {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #f0f0f0;
          text-align: center;
          color: #9ca3af;
          font-size: 14px;
        }
        .warning {
          background-color: #fef3c7;
          padding: 15px;
          border-radius: 8px;
          margin: 20px 0;
          border-left: 4px solid #f59e0b;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">JEERA</div>
          <div style="color: #6b7280; font-size: 14px;">Professional Collaboration Platform</div>
        </div>
        
        <div class="title">OTP Verification</div>
        
        <div class="content">
          <p>Hello <strong>${username || 'there'}</strong>,</p>
          
          <p>Your One-Time Password (OTP) for JEERA account verification is:</p>
          
          <div class="otp-box">${otp}</div>
          
          <p>This OTP is valid for <strong>5 minutes</strong> only.</p>
          
          <div class="warning">
            <strong>⚠️ Security Notice:</strong><br>
            Never share this OTP with anyone. Our team will never ask for your OTP via email or phone.
          </div>
        </div>
        
        <div class="footer">
          <p>If you didn't request this OTP, please ignore this email.</p>
          <p style="margin-top: 5px;">© 2024 JEERA. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

module.exports = createOTPEmailTemplate;
