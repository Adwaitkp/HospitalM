const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    name: {
      type: String,
      required: true
    },
    age: {
      type: Number,
      required: true
    },
    gender: {
      type: String,
      required: true,
      enum: ["Male", "Female", "Other"]
    },
    phone: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    symptom: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    // New fields for assigned date and time
    assignedDate: {
      type: Date,
      default: null
    },
    appointmentTime: {
      type: String,
      default: null
    },
    paymentDetails: {
      paymentId: { type: String },
      orderId: { type: String },
      amount: { type: Number },
      paymentDate: { type: Date, default: Date.now }
    },
  },
  { timestamps: true }
);

const Appointment = mongoose.model("Appointment", appointmentSchema);
module.exports = Appointment;