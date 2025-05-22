const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Doctor = require("../models/Doctor");
const isdoctorMiddleware = require("../middleware/isdoctorMiddleware");
const dotenv = require('dotenv');
dotenv.config();
const router = express.Router();

// Doctor Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const doctor = await Doctor.findOne({ email });
    if (!doctor) return res.status(403).json({ message: "Doctor not found" });

    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: doctor._id, role: "doctor" }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ token, role: "doctor" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;