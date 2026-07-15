import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";
import MainLayout from "../../../component/layouts/MainLayout";
import PageHeader from "../../../component/ui/PageHeader";
import ExpenseForm from "../Components/ExpenseForm";
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
      <MainLayout>
        <div style={{ padding: "24px" }}>
          Loading...
        </div>
      </MainLayout>
    );
  }

  if (!expense || !expense._id) {
    return (
      <MainLayout>
        <div
          style={{
            padding: "24px",
            color: "red",
          }}
        >
          Expense not found.
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <PageHeader
        title="Edit Expense"
        subtitle={`Modify expense details for record: ${expense.title}`}
        backUrl="/finance/expenses"
      />

      <div style={{ marginTop: "24px" }}>
        <ExpenseForm
          initialData={expense}
          onSubmit={handleUpdate}
          loading={loading}
        />
      </div>
    </MainLayout>
  );
};

export default EditExpense;