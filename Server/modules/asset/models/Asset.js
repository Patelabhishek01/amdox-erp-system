const mongoose = require("mongoose");

const assetSchema = new mongoose.Schema(
  {
    assetName: {
      type: String,
      required: true,
      trim: true,
    },
    serialNumber: {
      type: String,
      trim: true,
      default: "",
    },
    category: {
      type: String,
      trim: true,
      default: "",
    },
    cost: {
      type: Number,
      default: 0,
    },
    purchaseCost: {
      type: Number,
      default: 0,
    },
    purchaseDate: {
      type: Date,
    },
    assignedToEmployeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      default: null,
    },
    assignedTo: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      enum: ["Available", "Assigned", "Under Maintenance", "Retired"],
      default: "Available",
    },
    condition: {
      type: String,
      enum: ["Good", "Needs Repair", "Broken"],
      default: "Good",
    },
    description: {
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
assetSchema.pre("validate", function (next) {
  if (this.cost !== undefined && this.cost !== this.purchaseCost) {
    this.purchaseCost = this.cost;
  } else if (this.purchaseCost !== undefined && this.purchaseCost !== this.cost) {
    this.cost = this.purchaseCost;
  }

  next();
});

module.exports = mongoose.model("Asset", assetSchema);