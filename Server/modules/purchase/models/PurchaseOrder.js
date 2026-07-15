const mongoose = require("mongoose");

const purchaseOrderSchema = new mongoose.Schema(
  {
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: [true, "Vendor is required"],
    },

    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
    },

    orderNumber: {
      type: String,
      required: [true, "Order number is required"],
      unique: true,
      trim: true,
    },

    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },

        productName: {
          type: String,
          required: true,
          trim: true,
        },

        quantity: {
          type: Number,
          required: true,
          min: 1,
        },

        price: {
          type: Number,
          required: true,
          min: 0,
        },

        cost: {
          type: Number,
          min: 0,
        },
      },
    ],

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: ["Pending", "Approved", "Received", "Cancelled"],
      default: "Pending",
    },

    expectedDeliveryDate: {
      type: Date,
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
purchaseOrderSchema.pre("validate", function (next) {
  if (this.vendorId && !this.vendor) this.vendor = this.vendorId;
  if (this.vendor && !this.vendorId) this.vendorId = this.vendor;

  if (this.items && this.items.length > 0) {
    this.items.forEach((item) => {
      if (item.cost !== undefined && item.price === 0) {
        item.price = item.cost;
      } else if (item.price !== undefined && item.cost === undefined) {
        item.cost = item.price;
      }
    });
  }

  next();
});

module.exports = mongoose.model("PurchaseOrder", purchaseOrderSchema);