import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../../component/layouts/MainLayout";
import PageHeader from "../../../component/ui/PageHeader";
import ExpenseForm from "../Components/ExpenseForm";
import { createExpense } from "../services/expenseService";

const AddExpense = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleCreate = async (formData) => {
    try {
      setLoading(true);
      const response = await createExpense(formData);
      if (response) {
        navigate("/finance/expenses");
      }
    } catch (error) {
      console.error("Error creating expense:", error);
      alert("Failed to create expense");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <PageHeader
        title="Add Expense"
        subtitle="Log a company expenditure with description and receipt."
        backUrl="/finance/expenses"
      />

      <div style={{ marginTop: "24px" }}>
        <ExpenseForm
          onSubmit={handleCreate}
          loading={loading}
        />
      </div>
    </MainLayout>
  );
};

export default AddExpense;