const nodemailer = require("nodemailer");
require("dotenv").config()

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, 
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendMail(to, sub, msg) {
  try {
    const info = await transporter.sendMail({
      to,
      subject: sub,
      html: msg
    });
    console.log("Email sent successfully:", info.messageId);
    return true;
  } catch (error) {
    console.error("Failed to send email:", error);
    return false;
  }
}

module.exports = sendMail;