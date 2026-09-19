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
    enum: require("../../../config/roles").ALL_ROLES,
    default: "Employee"
  },
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
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
  }],
  bio: {
    type: String,
    default: ""
  },
  skills: [{
    type: String
  }],
  resume: {
    type: String,
    default: ""
  },
  emergencyContact: {
    name: { type: String, default: "" },
    phone: { type: String, default: "" },
    relationship: { type: String, default: "" }
  },
  socialLinks: {
    github: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    twitter: { type: String, default: "" }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("User", userSchema);