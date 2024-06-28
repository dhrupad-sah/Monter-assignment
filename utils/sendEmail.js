// const nodemailer = require('nodemailer');
const postmark = require("postmark");

const sendEmail = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
        host: "smtp.rediffmailpro.com", 
        port:25, secureConnection: false,
        secure: false,
        tls: {
          ciphers: "SSLv3",
          rejectUnauthorized:false
        },
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: subject,
      text: text,
    });

    console.log("Email sent successfully");
  } catch (error) {
    console.error("Email not sent");
    console.error(error);
  }
};

module.exports = sendEmail;
