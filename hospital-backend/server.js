const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const passport = require("passport");
require("./passportConfig");
const Razorpay = require("razorpay");

// ✅ Initialize Express App
const app = express();

// ✅ Middleware
app.use(cors({ origin: "https://utkarsha.onrender.com", credentials: true }));
app.use(express.json());
app.use(passport.initialize());

// ✅ MongoDB Connection
mongoose
  .connect("mongodb+srv://adwaitlkshs:dqgMpLOgvYnqvh9X@cluster0.qbv5xha.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
    
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ✅ Routes Import
const authRoutes = require("./routes/authRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const adminloginRoutes = require("./routes/adminloginRoutes");
const doctorloginRoutes = require("./routes/doctorloginRoutes");
const admindashboardRoutes = require("./routes/admindashboardRoutes");
const doctordashboardRoutes = require("./routes/doctordashboardRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

// ✅ Use Routes
app.use("/api/auth", authRoutes);
app.use("/api/book", appointmentRoutes);
app.use("/api/admin", adminloginRoutes);
app.use("/api/doctor", doctorloginRoutes);
app.use("/api/admin/appointments", admindashboardRoutes);
app.use("/api/doctor/appointments", doctordashboardRoutes);
app.use("/api/payment", paymentRoutes);

// ✅ Default Route
app.get("/", (req, res) => res.send("🏥 Hospital Management API Running..."));

// ✅ Start Server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Trying another port...`);
    setTimeout(() => {
      server.close();
      server.listen(0); // 0 means a random available port
    }, 1000);
  } else {
    throw err;
  }
});
