// const express = require("express");
// const router = express.Router();

// const {
//   getExpenses,
//   getExpenseById,
//   createExpense,
//   updateExpense,
//   deleteExpense,
// } = require("../controllers/expenseController");

// const { protect } = require("../../../middleware/authMiddleware");

// // Protect all routes
// router.use(protect);

// // GET all expenses
// // POST new expense
// router.route("/")
//   .get(getExpenses)
//   .post(createExpense);

// // GET one expense
// // PUT update expense
// // DELETE expense
// router.route("/:id")
//   .get(getExpenseById)
//   .put(updateExpense)
//   .delete(deleteExpense);

const Expense = require("../models/expense");

// Get all expenses
const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ date: -1 });
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get single expense by ID
const getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({
        message: "Expense not found",
      });
    }

    res.status(200).json(expense);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Create expense
const createExpense = async (req, res) => {
  try {
    const expense = await Expense.create(req.body);

    res.status(201).json(expense);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// Update expense
const updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!expense) {
      return res.status(404).json({
        message: "Expense not found",
      });
    }

    res.status(200).json(expense);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// Delete expense
const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(
      req.params.id
    );

    if (!expense) {
      return res.status(404).json({
        message: "Expense not found",
      });
    }

    res.status(200).json({
      message: "Expense deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
};