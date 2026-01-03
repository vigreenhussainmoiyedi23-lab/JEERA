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
function sendMail(to,sub,msg) {
    transporter.sendMail({
        to,
        subject:sub,
        html:msg
    })
}

module.exports=sendMail