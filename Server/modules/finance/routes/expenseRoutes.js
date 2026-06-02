// Server/modules/finance/routes/expenseRoutes.js

const express = require("express");
const router = express.Router();

const {
  getExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
} = require("../controllers/expenseController");

// ✅ Correct path + correct destructuring
const { authMiddleware } = require("../../../middleware/authMiddleware");

router.get("/", authMiddleware, getExpenses);
router.post("/", authMiddleware, createExpense);
router.get("/:id", authMiddleware, getExpenseById);
router.put("/:id", authMiddleware, updateExpense);
router.delete("/:id", authMiddleware, deleteExpense);

module.exports = router;