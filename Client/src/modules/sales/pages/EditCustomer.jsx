import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";
import MainLayout from "../../../component/layouts/MainLayout";
import PageHeader from "../../../component/ui/PageHeader";
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
      <MainLayout>
        <div style={{ padding: "24px" }}>
          Loading...
        </div>
      </MainLayout>
    );
  }

  if (!customer || !customer._id) {
    return (
      <MainLayout>
        <div
          style={{
            padding: "24px",
            color: "red",
          }}
        >
          Customer not found.
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <PageHeader
        title="Edit Customer"
        subtitle={`Modify contact details for client: ${customer.name}`}
        backUrl="/sales/customers"
      />

      <div style={{ marginTop: "24px" }}>
        <CustomerForm
          initialData={customer}
          onSubmit={handleUpdate}
          loading={loading}
        />
      </div>
    </MainLayout>
  );
};

export default EditCustomer;