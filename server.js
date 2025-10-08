// // server.js
// require('dotenv').config();
// console.log("MAIL_USER:", process.env.MAIL_USER);
// console.log("MAIL_PASS:", process.env.MAIL_PASS ? "Loaded" : "Missing");


// const express = require("express");
// const cors = require("cors");
// const nodemailer = require("nodemailer");
// //require("dotenv").config();

// const app = express();
// const PORT = process.env.PORT || 3000;

// // ------------------ MIDDLEWARE ------------------
// app.use(cors());
// app.use(express.json()); // parse JSON requests

// app.get("/", (req, res) => {
//   res.send("Server is running 🚀");
// });


// // ------------------ EMAIL SETUP ------------------
// // const transporter = nodemailer.createTransport({
// //   service: "gmail",
// //   auth: {
// //     user: process.env.MAIL_USER,
// //     pass: process.env.MAIL_PASS,
// //   },
// // });

// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 465,
//   secure: true,
//   auth: {
//     user: process.env.MAIL_USER,
//     pass: process.env.MAIL_PASS,
//   },
// });




// // Verify connection
// transporter.verify((err, success) => {
//   if (err) console.error("Email connection error:", err);
//   else console.log("Email server ready to send messages");
// });

// // ------------------ TEST EMAIL ENDPOINT ------------------
// app.post("/send-email", async (req, res) => {
//   const { to, subject, text } = req.body;

//   if (!to || !subject || !text) {
//     return res.status(400).json({ success: false, error: "to, subject, and text are required" });
//   }

//   const mailOptions = {
//     from: `"My Test App" <${process.env.MAIL_USER}>`,
//     to: to,
//     subject: subject,
//     text: text,
//     html: `<p>${text}</p>`, // optional HTML version
//   };

//   try {
//     const info = await transporter.sendMail(mailOptions);
//     res.json({ success: true, messageId: info.messageId });
//   } catch (err) {
//     console.error("Email Error:", err);
//     res.status(500).json({ success: false, error: err.message });
//   }
// });

// // ------------------ START SERVER ------------------
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Debug check
console.log("BREVO_API_KEY:", process.env.BREVO_API_KEY ? "Loaded" : "Missing");
console.log("MAIL_USER:", process.env.MAIL_USER);

// Root test
app.get("/", (req, res) => {
  res.send("Brevo email server is running 🚀");
});

// Send email route
app.post("/send-email", async (req, res) => {
  const { to, subject, text } = req.body;

  if (!to || !subject || !text) {
    return res.status(400).json({ success: false, error: "to, subject, text required" });
  }

  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: { email: process.env.MAIL_USER },
        to: [{ email: to }],
        subject,
        textContent: text,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
          accept: "application/json",
        },
      }
    );

    res.json({ success: true, data: response.data });
  } catch (err) {
    console.error("Brevo Error:", err.response?.data || err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
