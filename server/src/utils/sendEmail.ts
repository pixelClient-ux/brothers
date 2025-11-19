import nodemailer from "nodemailer";

const sendEmail = async (options: {
  email: string;
  subject: string;
  html: string;
  text?: string;
  attachments?: Array<{
    filename: string;
    content: Buffer;
    contentType?: string;
  }>;
}) => {
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_HOST,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const mailOptions: nodemailer.SendMailOptions = {
    from: `"GYM Fitness" <${process.env.EMAIL_USERNAME}>`,
    to: options.email,
    subject: options.subject,
    text: options.text,
    html: options.html,
    attachments: options.attachments,
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;
