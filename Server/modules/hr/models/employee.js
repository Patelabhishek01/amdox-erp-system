const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      required: true,
      unique: true,
    },

    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    department: {
      type: String,
      required: true,
      default: "Operations",
    },

    designation: {
      type: String,
      required: true,
      default: "Staff",
    },

    salary: {
      type: Number,
      required: true,
      default: 0,
    },

    joiningDate: {
      type: Date,
      required: true,
      default: Date.now,
    },

    status: {
      type: String,
      enum: ["Active", "Inactive", "Pending Approval"],
      default: "Active",
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    bankDetails: {
      accountNo: { type: String, default: "" },
      bankName: { type: String, default: "" },
      ifsc: { type: String, default: "" },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Employee", employeeSchema);