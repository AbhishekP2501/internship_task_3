const nodemailer = require('nodemailer');

let transporter = null;

const createTransporter = async () => {
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Verify connection
  try {
    await transporter.verify();
    console.log(`📧 SMTP ready — sending as ${process.env.EMAIL_USER}`);
  } catch (err) {
    console.error('📧 SMTP connection failed:', err.message);
    transporter = null;
    throw err;
  }

  return transporter;
};

module.exports = createTransporter;
