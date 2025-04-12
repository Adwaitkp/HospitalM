const express = require("express");
const router = express.Router();
const isAdmin = require("../middleware/isadmin");
const Appointment = require("../models/Appointment");
const notificationService = require("../services/notificationService");

// Debug endpoint to test API connection
router.get("/debug", async (req, res) => {
  try {
    const count = await Appointment.countDocuments();
    res.json({ 
      message: "Debug endpoint working",
      appointmentCount: count,
      serverTime: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: "Debug error", details: error.message });
  }
});

// Get all appointments (admin only)
router.get("/all", isAdmin, async (req, res) => {
  try {
    console.log("Fetching all appointments");
    const appointments = await Appointment.find().sort({ date: -1 });
    console.log(`Found ${appointments.length} appointments`);
    res.json(appointments);
  } catch (error) {
    console.error("Error fetching all appointments:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

// Get appointments grouped by patient name and email (admin only)
router.get("/grouped", isAdmin, async (req, res) => {
  try {
    console.log("Fetching grouped appointments");
    const appointments = await Appointment.find().sort({ date: -1 });
    
    // Group appointments by patient name and email
    const grouped = appointments.reduce((groups, appointment) => {
      const key = `${appointment.name} (${appointment.email || 'no email'})`;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(appointment);
      return groups;
    }, {});
    
    console.log(`Grouped appointments into ${Object.keys(grouped).length} patients`);
    res.json(grouped);
  } catch (error) {
    console.error("Error fetching grouped appointments:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

// Get today's appointments (admin only)
router.get("/today", isAdmin, async (req, res) => {
  try {
    console.log("Fetching today's appointments");
    
    // Get start and end of today in the local timezone
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
    
    console.log("Today's date range:", startOfDay.toISOString(), "to", endOfDay.toISOString());
    
    // Find appointments for today's date
    // Note: This assumes your date field in the database is stored as a Date object or ISO string
    const appointments = await Appointment.find({
      date: { 
        $gte: startOfDay, 
        $lte: endOfDay 
      }
    }).sort({ date: 1 });
    
    // If dates are stored as strings in "YYYY-MM-DD" format, use this alternative approach:
    // const todayFormatted = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    // const appointments = await Appointment.find({
    //   date: { $regex: todayFormatted }
    // }).sort({ date: 1 });
    
    console.log(`Found ${appointments.length} appointments for today`);
    res.json(appointments);
  } catch (error) {
    console.error("Error fetching today's appointments:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

// Search appointments by name (admin only)
router.get("/search", isAdmin, async (req, res) => {
  try {
    const { name } = req.query;
    if (!name) {
      return res.status(400).json({ error: "Name parameter is required" });
    }

    console.log(`Searching for appointments with name containing: ${name}`);
    const appointments = await Appointment.find({
      name: { $regex: name, $options: "i" }
    }).sort({ date: -1 });
    
    console.log(`Found ${appointments.length} matching appointments`);
    res.json(appointments);
  } catch (error) {
    console.error("Error searching appointments:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

// Assign appointment time (admin only)
router.post("/assign/:id", isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { assignedDate, appointmentTime } = req.body;
    
    console.log(`Assigning time for appointment ${id}: ${assignedDate} at ${appointmentTime}`);
    
    if (!assignedDate || !appointmentTime) {
      return res.status(400).json({ 
        success: false, 
        msg: "Date and time are required" 
      });
    }

    // Find and update the appointment
    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { 
        assignedDate, 
        appointmentTime, 
        status: "assigned" 
      },
      { new: true }
    );

    if (!appointment) {
      console.log(`Appointment not found with ID: ${id}`);
      return res.status(404).json({ 
        success: false, 
        msg: "Appointment not found" 
      });
    }

    console.log(`Successfully assigned time for appointment: ${appointment._id}`);
    
    // Notify the patient using notification service
    try {
      const notificationResult = await notificationService.sendAppointmentConfirmation(appointment);
      console.log("Notification sent:", notificationResult);
    } catch (notifyError) {
      console.error("Error sending notification:", notifyError);
      // We still consider the assignment successful even if notification fails
    }

    res.json({ 
      success: true, 
      appointment,
      message: "Appointment time assigned successfully"
    });
  } catch (error) {
    console.error("Error assigning appointment time:", error);
    res.status(500).json({ 
      success: false, 
      msg: error.message || "Server error" 
    });
  }
});

module.exports = router;