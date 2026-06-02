import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";
import ExpenseForm from "../components/ExpenseForm";
import {
  getExpenseById,
  updateExpense,
} from "../services/expenseService";

const EditExpense = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const response =
          await getExpenseById(id);

        const expenseData =
          response.data || response || null;

        setExpense(expenseData);
      } catch (error) {
        console.error(
          "Error fetching expense:",
          error
        );
        setExpense(null);
      } finally {
        setFetching(false);
      }
    };

    fetchExpense();
  }, [id]);

  const handleUpdate = async (formData) => {
    try {
      setLoading(true);
      await updateExpense(id, formData);
      navigate("/finance/expenses");
    } catch (error) {
      console.error(
        "Error updating expense:",
        error
      );
      alert("Failed to update expense");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div style={{ padding: "24px" }}>
        Loading...
      </div>
    );
  }

  if (!expense || !expense._id) {
    return (
      <div
        style={{
          padding: "24px",
          color: "red",
        }}
      >
        Expense not found.
      </div>
    );
  }

  return (
    <div style={{ padding: "24px" }}>
      <h1
        style={{
          fontSize: "32px",
          fontWeight: "bold",
          marginBottom: "24px",
        }}
      >
        Edit Expense
      </h1>

      <ExpenseForm
        initialData={expense}
        onSubmit={handleUpdate}
        loading={loading}
      />
      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={() =>
            navigate("/finance/expenses")
          }
          style={{
            backgroundColor: "#3a8c1a",
            color: "#ffffff",
            border: "none",
            padding: "8px 14px",
            borderRadius: "6px",
            cursor: "pointer",
            marginBottom: "20px",
          }}
        >
          ⬅ Back
        </button>
      </div>
    </div>
  );
};

export default EditExpense;