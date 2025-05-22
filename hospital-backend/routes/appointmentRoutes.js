const express = require("express");
const router = express.Router();
const passport = require("passport");
const Appointment = require("../models/Appointment");
const notificationService = require("../services/notificationService");

// Route: POST /appointment
// Description: Book a new appointment with payment details
router.post(
  "/appointment",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { name, age, gender, symptom, date, paymentId, orderId, amount, phone } = req.body;

      if (!name || !gender || !symptom || !date || !paymentId || !orderId || !amount || !phone) {
        return res.status(400).json({
          success: false,
          message: "All required fields must be filled"
        });
      }

      const userEmail = req.user.email; // ✅ get email from user model

      const newAppointment = new Appointment({
        userId: req.user.id,
        name,
        age,
        gender,
        symptom,
        date,
        phone,
        email: userEmail, // ✅ save user's email
        paymentDetails: {
          paymentId,
          orderId,
          amount
        },
        status: "Waiting"
      });

      await newAppointment.save();

      res.status(201).json({
        success: true,
        message: "Appointment booked successfully!",
        appointment: newAppointment
      });
    } catch (error) {
      console.error("Appointment booking error:", error);
      res.status(500).json({
        success: false,
        message: "Error booking appointment",
        error: error.message
      });
    }
  }
);

// Route: GET /appointments
// Description: Get all appointments for the logged-in user
router.get(
  "/appointments",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const appointments = await Appointment.find({ userId: req.user.id }).sort({ date: -1 });

      res.status(200).json({
        success: true,
        appointments
      });
    } catch (error) {
      console.error("Fetching appointments error:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching appointments",
        error: error.message
      });
    }
  }
);

// Route: POST /admin/appointments/assign/:id
// Description: Admin endpoint to assign date and time for an appointment
router.post(
  "/admin/appointments/assign/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      // Check if user is admin
      if (req.user.role !== "admin") {
        return res.status(403).json({
          success: false,
          message: "Not authorized to perform this action"
        });
      }

      const { assignedDate, appointmentTime } = req.body;
      
      if (!assignedDate || !appointmentTime) {
        return res.status(400).json({ 
          success: false, 
          message: "Please provide both date and time" 
        });
      }
      
      const appointment = await Appointment.findById(req.params.id);
      
      if (!appointment) {
        return res.status(404).json({ 
          success: false, 
          message: "Appointment not found" 
        });
      }
      
      // Update the appointment with assigned date and time
      appointment.assignedDate = assignedDate;
      appointment.appointmentTime = appointmentTime;
      appointment.status = "assigned";
      
      // Save the updated appointment
      const updatedAppointment = await appointment.save();
      
      // Send notification email to the patient
      await notificationService.sendAppointmentConfirmation(updatedAppointment);
      
      return res.json({ 
        success: true, 
        message: "Appointment time assigned and notification sent",
        appointment: updatedAppointment
      });
    } catch (error) {
      console.error("Error assigning appointment time:", error);
      res.status(500).json({ 
        success: false, 
        message: "Server error", 
        error: error.message 
      });
    }
  }
);

module.exports = router;