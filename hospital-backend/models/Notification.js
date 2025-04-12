const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true // Indexing for faster lookups
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  symptom: {
    type: String,
    default: null
  },
  relatedId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Appointment",
    default: null
  },
  type: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Notification = mongoose.model("Notification", notificationSchema);
module.exports = Notification;