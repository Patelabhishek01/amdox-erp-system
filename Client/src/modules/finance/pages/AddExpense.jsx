import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ExpenseForm from "../components/ExpenseForm";
import { createExpense } from "../services/expenseService";

const AddExpense = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleCreate = async (formData) => {
    try {
      setLoading(true);
      const response =
  await createExpense(formData);

    console.log(response);

    if (response) {
      navigate("/finance/services");
    }
    } catch (error) {
      console.error("Error creating expense:", error);
      alert("Failed to create expense");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "24px" }}>
      <h1
        style={{
          fontSize: "32px",
          fontWeight: "bold",
          marginBottom: "24px",
        }}
      >
        Add Expense
      </h1>

      <ExpenseForm
        onSubmit={handleCreate}
        loading={loading}
      />
      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={() =>
            navigate("/finance/expenses")
          }
          style={{
            backgroundColor: "#6b7280",
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

export default AddExpense;