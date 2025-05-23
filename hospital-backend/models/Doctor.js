
const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "doctor" },
}, { collection: "doctors" }); // Explicit collection name

const Doctor = mongoose.model("Doctor", doctorSchema);
module.exports = Doctor;