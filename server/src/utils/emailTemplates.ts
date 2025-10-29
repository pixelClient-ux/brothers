// utils/emailTemplates.ts

export const resetPasswordTemplate = (
  resetURL: string,
  companyName = "GYM Fitness"
) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Password Reset</title>
  <style>
    body {
      font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #f9fafb;
      color: #333;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      background: #fff;
      margin: 40px auto;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    }
    .header {
      background-color: #111827;
      color: #fff;
      text-align: center;
      padding: 24px;
    }
    .header img {
      width: 60px;
      margin-bottom: 12px;
    }
    .content {
      padding: 32px;
      text-align: center;
    }
    .content h1 {
      color: #111827;
      font-size: 20px;
    }
    .button {
      display: inline-block;
      margin-top: 20px;
      padding: 12px 28px;
      background-color: #2563eb;
      color: #fff !important;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
    }
    .footer {
      background: #f3f4f6;
      text-align: center;
      padding: 16px;
      font-size: 12px;
      color: #6b7280;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://i.ibb.co/nm5hTqG/gym-logo.png" alt="${companyName} Logo" />
      <h2>${companyName}</h2>
    </div>
    <div class="content">
      <h1>Password Reset Request</h1>
      <p>We received a request to reset your password. Click the button below to set a new password.</p>
      <a href="${resetURL}" class="button">Reset Password</a>
      <p style="margin-top:20px;">If you didn’t request this, you can safely ignore this email.</p>
    </div>
    <div class="footer">
      &copy; ${new Date().getFullYear()} ${companyName}. All rights reserved.<br/>
      Need help? <a href="mailto:support@harargegym.com">Contact Support</a>
    </div>
  </div>
</body>
</html>
`;
