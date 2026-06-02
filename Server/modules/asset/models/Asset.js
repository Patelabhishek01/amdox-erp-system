const mongoose = require("mongoose");

const assetSchema = new mongoose.Schema(
  {
    assetName: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      trim: true,
      default: "",
    },
    assignedTo: {
      type: String,
      trim: true,
      default: "",
    },
    purchaseDate: {
      type: Date,
    },
    purchaseCost: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: [
        "Available",
        "Assigned",
        "Under Maintenance",
        "Retired",
      ],
      default: "Available",
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

module.exports = mongoose.model("Asset", assetSchema);