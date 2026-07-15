const Transaction = require("../models/Transaction");

// Create Transaction
const createTransaction = async (req, res) => {
  try {
    const { sourceModule, type, amount, referenceId, date } = req.body;

    if (!sourceModule || !type || amount === undefined || !referenceId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const transaction = new Transaction({
      sourceModule,
      type,
      amount,
      referenceId,
      date: date || Date.now()
    });

    await transaction.save();

    res.status(201).json({
      message: "Transaction logged successfully",
      transaction
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get Dashboard Metrics
const getDashboardMetrics = async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ date: -1 });

    let totalCredits = 0;
    let totalDebits = 0;
    let salesTotal = 0;
    let purchaseTotal = 0;
    let hrTotal = 0;

    transactions.forEach(t => {
      if (t.type === "Credit") {
        totalCredits += t.amount;
        if (t.sourceModule === "Sales") salesTotal += t.amount;
      } else if (t.type === "Debit") {
        totalDebits += t.amount;
        if (t.sourceModule === "Purchase") purchaseTotal += t.amount;
        if (t.sourceModule === "HR") hrTotal += t.amount;
      }
    });

    const netProfit = totalCredits - totalDebits;

    res.json({
      totalCredits,
      totalDebits,
      netProfit,
      breakdown: {
        sales: salesTotal,
        purchase: purchaseTotal,
        payroll: hrTotal
      },
      history: transactions.slice(0, 10), // Limit to last 10
      allTransactionsCount: transactions.length
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createTransaction,
  getDashboardMetrics
};
