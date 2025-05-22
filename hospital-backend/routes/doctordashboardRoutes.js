const express = require("express");
const router = express.Router();
const isDoctor = require("../middleware/isdoctorMiddleware");
const Appointment = require("../models/Appointment");

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

// Route: GET /api/doctor/appointments/assigned
router.get("/assigned", isDoctor, async (req, res) => {
  try {
    console.log("Fetching assigned appointments");
    const assignedAppointments = await Appointment.find({ 
      status: "assigned" 
    }).sort({ assignedDate: 1 });

    console.log(`Found ${assignedAppointments.length} assigned appointments`);
    res.status(200).json(assignedAppointments);
  } catch (error) {
    console.error("Fetching assigned appointments error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching assigned appointments",
      error: error.message
    });
  }
});

// Route: GET /api/doctor/appointments/assigned/today
router.get("/assigned/today", isDoctor, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    console.log("Fetching today's appointments");
    console.log("Today's date range:", today.toISOString(), "to", tomorrow.toISOString());

    const todayAppointments = await Appointment.find({
      status: "assigned",
      assignedDate: {
        $gte: today,
        $lt: tomorrow
      }
    }).sort({ appointmentTime: 1 });

    console.log(`Found ${todayAppointments.length} appointments for today`);
    res.status(200).json(todayAppointments);
  } catch (error) {
    console.error("Fetching today's appointments error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching today's appointments",
      error: error.message
    });
  }
});

// Route: GET /api/doctor/appointments/search
router.get("/search", isDoctor, async (req, res) => {
  try {
    const { name } = req.query;
    
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Search query parameter 'name' is required"
      });
    }

    console.log(`Searching for appointments with name containing: ${name}`);
    const searchPattern = new RegExp(name, 'i');
    
    const searchResults = await Appointment.find({
      name: searchPattern,
      status: "assigned"
    }).sort({ assignedDate: 1 });

    console.log(`Found ${searchResults.length} matching appointments`);
    res.status(200).json(searchResults);
  } catch (error) {
    console.error("Appointment search error:", error);
    res.status(500).json({
      success: false,
      message: "Error searching appointments",
      error: error.message
    });
  }
});

// Route: POST /api/doctor/appointments/prescribe/:id
router.post("/prescribe/:id", isDoctor, async (req, res) => {
  try {
    const { prescription } = req.body;
    const { id } = req.params;
    
    console.log(`Adding prescription for appointment ${id}`);
    
    if (!prescription) {
      return res.status(400).json({
        success: false,
        message: "Prescription text is required"
      });
    }
    
    const appointment = await Appointment.findById(id);
    
    if (!appointment) {
      console.log(`Appointment not found with ID: ${id}`);
      return res.status(404).json({
        success: false,
        message: "Appointment not found"
      });
    }
    
    appointment.prescription = prescription;
    const updatedAppointment = await appointment.save();
    
    console.log(`Successfully added prescription for appointment: ${appointment._id}`);
    res.status(200).json({
      success: true,
      message: "Prescription added successfully",
      appointment: updatedAppointment
    });
  } catch (error) {
    console.error("Adding prescription error:", error);
    res.status(500).json({
      success: false,
      message: "Error adding prescription",
      error: error.message
    });
  }
});

module.exports = router;