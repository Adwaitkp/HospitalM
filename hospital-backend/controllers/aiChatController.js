const aiAppointmentService = require("../services/aiAppointmentService");
const Appointment = require("../models/Appointment");

// Handle chat message from user
exports.handleChatMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user.id;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    // Get AI response using the rule-based system (or OpenAI if API key is set)
    const aiResponse = await aiAppointmentService.generateResponse(userId, message);

    res.status(200).json({
      success: true,
      response: aiResponse.response,
      readyToBook: aiResponse.readyToBook,
      appointmentData: aiResponse.appointmentData,
    });
  } catch (error) {
    console.error("AI Chat error:", error);
    res.status(500).json({
      success: false,
      message: "Error processing your message",
      error: error.message,
    });
  }
};

// Book appointment from AI-collected data
exports.bookAppointmentFromAI = async (req, res) => {
  try {
    const { appointmentData, paymentId, orderId, amount } = req.body;
    const userId = req.user.id;
    const userEmail = req.user.email;

    if (!appointmentData || !paymentId || !orderId || !amount) {
      return res.status(400).json({
        success: false,
        message: "Missing required appointment or payment information",
      });
    }

    const { name, age, gender, phone, symptom, date } = appointmentData;

    if (!name || !age || !gender || !phone || !symptom || !date) {
      return res.status(400).json({
        success: false,
        message: "Incomplete appointment data",
      });
    }

    const newAppointment = new Appointment({
      userId,
      name,
      age,
      gender,
      phone,
      email: userEmail,
      symptom,
      date,
      paymentDetails: {
        paymentId,
        orderId,
        amount,
      },
      status: "Waiting",
    });

    await newAppointment.save();

    // Clear the AI session after successful booking
    aiAppointmentService.clearSession(userId);

    res.status(201).json({
      success: true,
      message: "Appointment booked successfully via AI assistant!",
      appointment: newAppointment,
    });
  } catch (error) {
    console.error("AI Appointment booking error:", error);
    res.status(500).json({
      success: false,
      message: "Error booking appointment",
      error: error.message,
    });
  }
};

// Get current session state
exports.getSessionState = async (req, res) => {
  try {
    const userId = req.user.id;
    const session = aiAppointmentService.getSession(userId);

    res.status(200).json({
      success: true,
      session: {
        stage: session.stage,
        appointmentData: session.appointmentData,
        messageCount: session.messages.length,
      },
    });
  } catch (error) {
    console.error("Get session error:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving session",
      error: error.message,
    });
  }
};

// Reset/clear chat session
exports.clearSession = async (req, res) => {
  try {
    const userId = req.user.id;
    aiAppointmentService.clearSession(userId);

    res.status(200).json({
      success: true,
      message: "Chat session cleared",
    });
  } catch (error) {
    console.error("Clear session error:", error);
    res.status(500).json({
      success: false,
      message: "Error clearing session",
      error: error.message,
    });
  }
};
