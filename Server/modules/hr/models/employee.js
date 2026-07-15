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

    baseSalary: {
      type: Number,
      default: 0,
    },

    joiningDate: {
      type: Date,
      required: true,
      default: Date.now,
    },

    joinDate: {
      type: Date,
    },

    status: {
      type: String,
      enum: ["Active", "Inactive", "Pending Approval"],
      default: "Active",
    },

    activeStatus: {
      type: Boolean,
      default: true,
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

// Pre-validate synchronization to keep both the legacy and the new field names in sync
employeeSchema.pre("validate", function (next) {
  if (this.baseSalary !== undefined && this.baseSalary !== this.salary) {
    this.salary = this.baseSalary;
  } else if (this.salary !== undefined && this.salary !== this.baseSalary) {
    this.baseSalary = this.salary;
  }

  if (this.joinDate !== undefined && this.joinDate !== this.joiningDate) {
    this.joiningDate = this.joinDate;
  } else if (this.joiningDate !== undefined && this.joiningDate !== this.joinDate) {
    this.joinDate = this.joiningDate;
  }

  if (this.activeStatus !== undefined) {
    this.status = this.activeStatus ? "Active" : "Inactive";
  } else if (this.status !== undefined) {
    this.activeStatus = this.status === "Active";
  }

  next();
});

module.exports = mongoose.model("Employee", employeeSchema);