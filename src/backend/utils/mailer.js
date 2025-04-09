import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config(); // .env values load karne ke liye

const sendMail = async (email, subject, message) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: subject,
    text: message,
  };

  transporter.sendMail(mailOptions, (error, emailResponse) => {
    if (error) {
      console.error("Error while sending mail:", error);
    } else {
      console.log("Email sent successfully!");
    }
  });
};

export default sendMail;
