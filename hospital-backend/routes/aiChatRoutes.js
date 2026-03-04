const express = require("express");
const router = express.Router();
const passport = require("passport");
const aiChatController = require("../controllers/aiChatController");

// Route: POST /ai/chat
// Description: Send a message to AI assistant
router.post(
  "/chat",
  passport.authenticate("jwt", { session: false }),
  aiChatController.handleChatMessage
);

// Route: POST /ai/book-appointment
// Description: Book appointment with AI-collected data
router.post(
  "/book-appointment",
  passport.authenticate("jwt", { session: false }),
  aiChatController.bookAppointmentFromAI
);

// Route: GET /ai/session
// Description: Get current chat session state
router.get(
  "/session",
  passport.authenticate("jwt", { session: false }),
  aiChatController.getSessionState
);

// Route: POST /ai/clear-session
// Description: Clear chat session
router.post(
  "/clear-session",
  passport.authenticate("jwt", { session: false }),
  aiChatController.clearSession
);

module.exports = router;
