const axios = require("axios");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");

const User = require("./models/User");

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect("mongodb://127.0.0.1:27017/multilingualDB")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// OTP storage
let currentOtp = "";

/* =========================
   EMAIL CONFIG (OPTIONAL)
   ========================= */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "YOUR_EMAIL@gmail.com",
    pass: "YOUR_APP_PASSWORD"
  }
});

/* =========================
   SEND OTP
   ========================= */
app.post("/send-otp", async (req, res) => {
  try {
    const { email, mobile } = req.body;

    currentOtp = Math.floor(100000 + Math.random() * 900000).toString();

    const response = await axios.post(
  "https://www.fast2sms.com/dev/bulkV2",
  new URLSearchParams({
    route: "q",
    message: `Your OTP is ${currentOtp}`,
    language: "english",
    numbers: mobile
  }),
  {
    headers: {
      authorization: "fhLf0mg0EENYBKVZ7JywLSOXZnwMhcm2UtiUKHOmJuyuixq0y5j6c69SW5ng"
    }
  }
);

console.log("SMS Sent:", response.data);

    // EMAIL OTP (simulation-safe fallback)
    try {
      await transporter.sendMail({
        from: "YOUR_EMAIL@gmail.com",
        to: email,
        subject: "Your OTP Code",
        text: `Your OTP is ${currentOtp}`
      });
      console.log("Email OTP sent");
    } catch (err) {
      console.log("Email sending skipped:", err.message);
    }

    // MOBILE OTP (SIMULATED)
    console.log("SMS OTP sent to mobile:", mobile, "OTP:", currentOtp);

    res.json({
      success: true,
      message: "OTP sent to email and mobile (simulated)"
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "OTP sending failed"
    });
  }
});

/* =========================
   VERIFY OTP
   ========================= */
app.post("/verify-otp", async (req, res) => {
  try {
    const { otp, email, mobile, language } = req.body;

    if (otp === currentOtp) {
      const user = new User({
        email,
        mobile,
        language,
        verified: true
      });

      await user.save();

      console.log("User saved:", user);

      return res.json({
        success: true,
        message: "OTP verified"
      });
    }

    res.json({
      success: false,
      message: "Invalid OTP"
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

/* =========================
   START SERVER
   ========================= */
app.listen(5000, () => {
  console.log("Server running on port 5000");
});