const Razorpay = require("razorpay");
require("dotenv").config();

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_ID_KEY,
  key_secret: process.env.RAZORPAY_SECRET_KEY
});

// Create a new payment order
const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    const options = {
      amount: amount * 100, // Razorpay amount is in paisa
      currency: "INR",
      receipt: `receipt_${Date.now()}`
    };

    razorpayInstance.orders.create(options, (err, order) => {
      if (err) {
        console.error("Razorpay Order Error:", err);
        return res.status(400).send({
          success: false,
          msg: "Something went wrong with payment processing"
        });
      }
      
      return res.status(200).send({
        success: true,
        msg: "Order Created",
        order_id: order.id,
        amount: options.amount,
        key_id: process.env.RAZORPAY_ID_KEY,
      });
    });
  } catch (error) {
    console.error("Create Order Error:", error.message);
    res.status(500).send({
      success: false,
      msg: "Server error while processing payment"
    });
  }
};

// Verify payment after completion
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    
    // Create a signature using the order_id and payment_id
    const crypto = require('crypto');
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_SECRET_KEY)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest('hex');
    
    // Compare signatures
    if (generatedSignature === razorpay_signature) {
      // Payment is successful
      return res.status(200).send({
        success: true,
        msg: "Payment verified successfully"
      });
    } else {
      return res.status(400).send({
        success: false,
        msg: "Payment verification failed"
      });
    }
  } catch (error) {
    console.error("Verify Payment Error:", error.message);
    res.status(500).send({
      success: false,
      msg: "Server error during payment verification"
    });
  }
};

module.exports = {
  createOrder,
  verifyPayment
};