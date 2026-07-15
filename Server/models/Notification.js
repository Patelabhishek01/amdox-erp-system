const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
  department: { type: String, required: false },
  role: { type: String, required: false },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ["success", "warning", "error", "info"], default: "info" },
  isRead: { type: Boolean, default: false },
  readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // For broadcast tracking
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Notification", notificationSchema);
