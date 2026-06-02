const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },

    category: {
      type: String,
      required: true
    },

    amount: {
      type: Number,
      required: true
    },

    date: {
      type: Date,
      required: true
    },

    description: {
      type: String
    },

    notes: {          
      type: String,
    },
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Expense", expenseSchema);