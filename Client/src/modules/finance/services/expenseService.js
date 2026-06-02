import axios from "axios";

// ─────────────────────────────────────────────
// API Base URL
// ─────────────────────────────────────────────
const API =
  "http://localhost:5000/api/expenses";

// ─────────────────────────────────────────────
// Get Auth Token
// ─────────────────────────────────────────────
const getAuthConfig = () => {
  const token =
    localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// ─────────────────────────────────────────────
// Get All Expenses
// ─────────────────────────────────────────────
export const getExpenses = async () => {
  const res = await axios.get(
    API,
    getAuthConfig()
  );

  return res.data;
};

// ─────────────────────────────────────────────
// Get Single Expense
// ─────────────────────────────────────────────
export const getExpenseById = async (
  id
) => {
  const res = await axios.get(
    `${API}/${id}`,
    getAuthConfig()
  );

  return res.data;
};

// ─────────────────────────────────────────────
// Create Expense
// ─────────────────────────────────────────────
export const createExpense = async (
  data
) => {
  const res = await axios.post(
    API,
    data,
    getAuthConfig()
  );

  return res.data;
};

// ─────────────────────────────────────────────
// Update Expense
// ─────────────────────────────────────────────
export const updateExpense = async (
  id,
  data
) => {
  const res = await axios.put(
    `${API}/${id}`,
    data,
    getAuthConfig()
  );

  return res.data;
};

// ─────────────────────────────────────────────
// Delete Expense
// ─────────────────────────────────────────────
export const deleteExpense = async (
  id
) => {
  const res = await axios.delete(
    `${API}/${id}`,
    getAuthConfig()
  );

  return res.data;
};