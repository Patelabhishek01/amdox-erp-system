import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";
import CustomerForm from "../components/CustomerForm";
import {
  getCustomerById,
  updateCustomer,
} from "../services/customerService";

const EditCustomer = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response =
          await getCustomerById(id);

        const customerData =
          response.data || response || null;

        setCustomer(customerData);
      } catch (error) {
        console.error(
          "Error fetching customer:",
          error
        );
        setCustomer(null);
      } finally {
        setFetching(false);
      }
    };

    fetchCustomer();
  }, [id]);

  const handleUpdate = async (formData) => {
    try {
      setLoading(true);
      await updateCustomer(id, formData);
      navigate("/sales/customers");
    } catch (error) {
      console.error(
        "Error updating customer:",
        error
      );
      alert("Failed to update customer");
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

  if (!customer || !customer._id) {
    return (
      <div
        style={{
          padding: "24px",
          color: "red",
        }}
      >
        Customer not found.
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
        Edit Customer
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
        initialData={customer}
        onSubmit={handleUpdate}
        loading={loading}
      />
    </div>
  );
};

export default EditCustomer;