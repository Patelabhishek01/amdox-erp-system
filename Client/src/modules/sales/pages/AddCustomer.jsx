import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
    <div style={{ padding: "24px" }}>
      <h1
        style={{
          fontSize: "32px",
          fontWeight: "bold",
          marginBottom: "24px",
        }}
      >
        Add Customer
      </h1>

      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={() =>
            navigate("/sales/customers")
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

      <CustomerForm
        onSubmit={handleCreate}
        loading={loading}
      />
    </div>
  );
};

export default AddCustomer;