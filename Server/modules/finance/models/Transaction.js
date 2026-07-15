const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    sourceModule: {
      type: String,
      enum: ["Sales", "Purchase", "HR"],
      required: true,
    },
    type: {
      type: String,
      enum: ["Credit", "Debit"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Transaction", transactionSchema);
