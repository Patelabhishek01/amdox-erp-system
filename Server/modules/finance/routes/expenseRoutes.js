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
const { authMiddleware, checkRole } = require("../../../middleware/authMiddleware");

const protect = authMiddleware.protect || authMiddleware;
const financeRoles = checkRole(["admin", "finance"]);

router.get("/", protect, financeRoles, getExpenses);
router.post("/", protect, financeRoles, createExpense);
router.get("/:id", protect, financeRoles, getExpenseById);
router.put("/:id", protect, financeRoles, updateExpense);
router.delete("/:id", protect, financeRoles, deleteExpense);

module.exports = router;