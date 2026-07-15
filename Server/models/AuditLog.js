const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  userName: { type: String, required: true },
  action: { type: String, required: true }, // e.g. "Create Employee", "Update Setting"
  module: { type: String, required: true }, // e.g. "HR", "System"
  details: { type: String }, // optional details
  ipAddress: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("AuditLog", auditLogSchema);
