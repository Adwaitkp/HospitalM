const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const passport = require("passport");

// Create payment order
router.post(
  "/create-order", 
  passport.authenticate("jwt", { session: false }),
  paymentController.createOrder
);

// Verify payment after completion
router.post(
  "/verify-payment",
  passport.authenticate("jwt", { session: false }),
  paymentController.verifyPayment
);

module.exports = router;