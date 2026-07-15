import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../../component/layouts/MainLayout";
import PageHeader from "../../../component/ui/PageHeader";
import CustomerForm from "../components/CustomerForm";
import { createCustomer } from "../services/customerService";

const AddCustomer = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleCreate = async (formData) => {
    try {
      setLoading(true);
      await createCustomer(formData);
      navigate("/sales/customers");
    } catch (error) {
      console.error("Error creating customer:", error);
      alert("Failed to create customer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <PageHeader
        title="Add Customer"
        subtitle="Catalog a new customer into the database."
        backUrl="/sales/customers"
      />

      <div style={{ marginTop: "24px" }}>
        <CustomerForm
          onSubmit={handleCreate}
          loading={loading}
        />
      </div>
    </MainLayout>
  );
};

export default AddCustomer;