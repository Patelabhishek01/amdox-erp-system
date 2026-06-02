import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import MainLayout from "../../../component/layouts/MainLayout";

import PageHeader from "../../../component/ui/PageHeader";

import {
  getExpenses,
  deleteExpense,
} from "../services/expenseService";

export default function Expenses() {
  const navigate = useNavigate();

  const [expenses, setExpenses] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  // ─────────────────────────────────────────────
  // Fetch Expenses
  // ─────────────────────────────────────────────
  const fetchExpenses = async () => {
    try {
      setLoading(true);

      const response =
        await getExpenses();

      const data =
        response.data || response || [];

      setExpenses(data);
    } catch (error) {
      console.error(
        "Error fetching expenses:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────────
  // Delete Expense
  // ─────────────────────────────────────────────
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Delete this expense?"
    );

    if (!confirmDelete) return;

    try {
      await deleteExpense(id);

      fetchExpenses();
    } catch (error) {
      console.error(
        "Error deleting expense:",
        error
      );
    }
  };

  // ─────────────────────────────────────────────
  // Load Data
  // ─────────────────────────────────────────────
  useEffect(() => {
    fetchExpenses();
  }, []);

  return (
    <MainLayout>
      <PageHeader
        title="Expenses"
        subtitle="Track and manage business expenses"
        actionText="Add Expense"
        onAction={() =>
          navigate("/finance/expenses/add")
        }
      />

      {/* Expense Table */}
      <div className="content-card">
        <h3
          style={{
            marginBottom: "20px",
          }}
        >
          Expense Records
        </h3>

        {loading ? (
          <p>Loading expenses...</p>
        ) : expenses.length === 0 ? (
          <p>No expenses found.</p>
        ) : (
          <div
            style={{
              overflowX: "auto",
            }}
          >
            <table className="erp-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {expenses.map((expense) => (
                  <tr key={expense._id}>
                    <td>
                      {expense.title}
                    </td>

                    <td>
                      {expense.category}
                    </td>

                    <td>
                      ₹{expense.amount}
                    </td>

                    <td>
                      {expense.date
                        ? new Date(
                            expense.date
                          ).toLocaleDateString()
                        : "-"}
                    </td>

                    <td>
                      <div
                        style={{
                          display: "flex",
                          gap: "10px",
                        }}
                      >
                        {/* Edit */}
                        <button
                          className="btn btn-secondary"
                          onClick={() =>
                            navigate(
                              `/finance/expenses/edit/${expense._id}`
                            )
                          }
                        >
                          Edit
                        </button>

                        {/* Delete */}
                        <button
                          className="btn btn-danger"
                          onClick={() =>
                            handleDelete(
                              expense._id
                            )
                          }
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </MainLayout>
  );
}