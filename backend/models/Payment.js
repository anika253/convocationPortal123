const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  email: String,
  paymentId: String,
  orderId: String,
  signature: String,
  status: { type: String, default: "completed" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Payment", paymentSchema);
