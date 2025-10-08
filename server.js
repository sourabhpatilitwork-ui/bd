// server.js
require('dotenv').config();
console.log("MAIL_USER:", process.env.MAIL_USER);
console.log("MAIL_PASS:", process.env.MAIL_PASS ? "Loaded" : "Missing");


const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
//require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// ------------------ MIDDLEWARE ------------------
app.use(cors());
app.use(express.json()); // parse JSON requests

app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});


// ------------------ EMAIL SETUP ------------------
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.MAIL_USER,
//     pass: process.env.MAIL_PASS,
//   },
// });

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});




// Verify connection
transporter.verify((err, success) => {
  if (err) console.error("Email connection error:", err);
  else console.log("Email server ready to send messages");
});

// ------------------ TEST EMAIL ENDPOINT ------------------
app.post("/send-email", async (req, res) => {
  const { to, subject, text } = req.body;

  if (!to || !subject || !text) {
    return res.status(400).json({ success: false, error: "to, subject, and text are required" });
  }

  const mailOptions = {
    from: `"My Test App" <${process.env.MAIL_USER}>`,
    to: to,
    subject: subject,
    text: text,
    html: `<p>${text}</p>`, // optional HTML version
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    res.json({ success: true, messageId: info.messageId });
  } catch (err) {
    console.error("Email Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ------------------ START SERVER ------------------
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
