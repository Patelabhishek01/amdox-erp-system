const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: [
      "Admin", "HR", "Sales", "Finance", "Inventory", "Employee", "Purchase", "CRM", "Project", "Helpdesk", "Asset",
      "admin", "hr", "sales", "finance", "inventory", "employee", "purchase", "crm", "project", "helpdesk", "asset"
    ],
    default: "Employee"
  },
  departmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
    default: null
  },
  phone: {
    type: String,
    default: ""
  },
  twoFactorEnabled: {
    type: Boolean,
    default: false
  },
  twoFactorSecret: {
    type: String,
    default: ""
  },
  profilePhoto: {
    type: String,
    default: ""
  },
  resume: {
    type: String,
    default: ""
  },
  designation: {
    type: String,
    default: "Staff Member"
  },
  department: {
    type: String,
    default: "Operations"
  },
  joiningDate: {
    type: Date,
    default: Date.now
  },
  employeeId: {
    type: String,
    default: ""
  },
  emergencyContact: {
    name: { type: String, default: "" },
    phone: { type: String, default: "" },
    relationship: { type: String, default: "" }
  },
  bio: {
    type: String,
    default: ""
  },
  skills: [{
    type: String
  }],
  socialLinks: {
    github: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    twitter: { type: String, default: "" }
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  active: {
    type: Boolean,
    default: true
  },
  isFirstLogin: {
    type: Boolean,
    default: false
  },
  failedLoginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: {
    type: Date,
    default: null
  },
  passwordHistory: [{
    type: String
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model("User", userSchema);