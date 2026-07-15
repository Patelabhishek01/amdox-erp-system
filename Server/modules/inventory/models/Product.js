const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    sku: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    quantity: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    stockLevel: {
      type: Number,
      default: 0,
      min: 0,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    unitPrice: {
      type: Number,
      default: 0,
      min: 0,
    },

    supplier: {
      type: String,
      default: "",
      trim: true,
    },

    reorderLevel: {
      type: Number,
      default: 10,
      min: 0,
    },

    minThreshold: {
      type: Number,
      default: 10,
      min: 0,
    },

    location: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-validate synchronization to keep both the legacy and the new field names in sync
productSchema.pre("validate", function (next) {
  if (this.stockLevel !== undefined && this.stockLevel !== this.quantity) {
    this.quantity = this.stockLevel;
  } else if (this.quantity !== undefined && this.quantity !== this.stockLevel) {
    this.stockLevel = this.quantity;
  }

  if (this.minThreshold !== undefined && this.minThreshold !== this.reorderLevel) {
    this.reorderLevel = this.minThreshold;
  } else if (this.reorderLevel !== undefined && this.reorderLevel !== this.minThreshold) {
    this.minThreshold = this.reorderLevel;
  }

  if (this.unitPrice !== undefined && this.unitPrice !== this.price) {
    this.price = this.unitPrice;
  } else if (this.price !== undefined && this.price !== this.unitPrice) {
    this.unitPrice = this.price;
  }

  next();
});

module.exports = mongoose.model("Product", productSchema);