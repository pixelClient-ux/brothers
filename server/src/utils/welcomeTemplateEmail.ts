export const welcomeEmailTemplate = (
  fullName: string,
  companyName = "GYM Fitness"
) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to ${companyName}</title>
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
      font-size: 22px;
      margin-bottom: 12px;
    }
    .content p {
      font-size: 15px;
      color: #4b5563;
      line-height: 1.6;
    }
    .button {
      display: inline-block;
      margin-top: 24px;
      padding: 12px 30px;
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
      <h1>Welcome to ${companyName}, ${fullName.split(" ")[0]}!</h1>
      <p>
        We’re excited to have you on board! Your account has been created successfully.
        You can now log in, explore your dashboard, and start your fitness journey with us.
      </p>
      <a href="https://harargegym.com/login" class="button">Go to Dashboard</a>
      <p style="margin-top:24px;">If you didn’t sign up for this account, please contact our support team immediately.</p>
    </div>
    <div class="footer">
      &copy; ${new Date().getFullYear()} ${companyName}. All rights reserved.<br/>
      Need help? <a href="mailto:support@harargegym.com">Contact Support</a>
    </div>
  </div>
</body>
</html>
`;
