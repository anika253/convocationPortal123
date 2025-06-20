// Add at the top
const crypto = require("crypto");
const Payment = require("../models/Payment"); // You'll create this model
const Student = require("../models/Student"); // Import Student model
const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");

// VERIFY & SAVE PAYMENT
router.post("/verify", async (req, res) => {
  const { paymentId, orderId, signature, email } = req.body;

  // Step 1: Verify signature
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(orderId + "|" + paymentId)
    .digest("hex");

  if (expectedSignature !== signature) {
    return res.status(400).json({ msg: "Invalid signature" });
  }

  // Step 2: Save to DB
  try {
    const newPayment = new Payment({
      email,
      paymentId,
      orderId,
      signature,
      status: "completed",
    });
    await newPayment.save();
    // Update student's paymentDone status
    await Student.findOneAndUpdate(
      { email },
      { $set: { paymentDone: true } }
    );
    res.status(200).json({ msg: "Payment saved" });
  } catch (err) {
    console.error("DB Save error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Create Razorpay order
router.post("/create-order", async (req, res) => {
  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });

    const options = {
      amount: 120000, // amount in paise (₹1200)
      currency: "INR",
      receipt: "receipt_order_74394",
    };

    const order = await instance.orders.create(options);
    res.status(200).json({ orderId: order.id });
  } catch (err) {
    console.error("Order creation error:", err);
    res.status(500).json({ msg: "Failed to create order" });
  }
});

module.exports = router;
