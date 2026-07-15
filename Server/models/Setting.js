const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema({
  companyName: { type: String, default: "Amdox ERP" },
  email: { type: String, default: "admin@erp.com" },
  language: { type: String, default: "English" },
  timezone: { type: String, default: "Asia/Kolkata" },
  notifications: { type: Boolean, default: true },
  darkMode: { type: Boolean, default: false },
  twoFactorAuth: { type: Boolean, default: false },
  smtpHost: { type: String, default: "" },
  smtpPort: { type: Number, default: 587 },
  smtpUser: { type: String, default: "" },
  smtpPass: { type: String, default: "" },
  llmProvider: { type: String, default: "mock" }, // 'openai' | 'gemini' | 'mock'
  llmApiKey: { type: String, default: "" },
  rolePermissions: {
    type: Map,
    of: [String], // array of permission keys
    default: {}
  }
}, { timestamps: true });

module.exports = mongoose.model("Setting", settingSchema);
