const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    contactPerson: {
      type: String,
      trim: true,
    },
    company: {
      type: String,
      trim: true,
      default: "",
    },
    companyName: {
      type: String,
      trim: true,
      default: "",
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    dealValue: {
      type: Number,
      default: 0,
    },
    estimatedValue: {
      type: Number,
      default: 0,
    },
    stage: {
      type: String,
      enum: ["New", "Contacted", "Qualified", "Won", "Lost", "Proposal"],
      default: "New",
    },
    status: {
      type: String,
      enum: ["New", "Contacted", "Qualified", "Won", "Lost", "Proposal"],
      default: "New",
    },
    assignedSalesRepId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    notes: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Pre-validate synchronization to keep both the legacy and the new field names in sync
leadSchema.pre("validate", function (next) {
  if (this.contactPerson && !this.name) this.name = this.contactPerson;
  if (this.name && !this.contactPerson) this.contactPerson = this.name;
  
  if (this.companyName && !this.company) this.company = this.companyName;
  if (this.company && !this.companyName) this.companyName = this.company;
  
  if (this.estimatedValue !== undefined && this.dealValue === 0) this.dealValue = this.estimatedValue;
  if (this.dealValue !== undefined && this.estimatedValue === 0) this.estimatedValue = this.dealValue;
  
  if (this.status && !this.stage) this.stage = this.status;
  if (this.stage && !this.status) this.status = this.stage;
  
  next();
});

module.exports = mongoose.model("Lead", leadSchema);