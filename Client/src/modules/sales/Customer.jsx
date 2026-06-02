import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import MainLayout from "../../component/layouts/MainLayout";

import PageHeader from "../../component/ui/PageHeader";

import {
  getCustomers,
  deleteCustomer,
} from "../sales/services/customerService";

export default function Customer() {
  const navigate = useNavigate();

  const [customers, setCustomers] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  // ─────────────────────────────────────────────
  // Fetch Customers
  // ─────────────────────────────────────────────
  const fetchCustomers = async () => {
    try {
      setLoading(true);

      const response =
        await getCustomers();

      const data = response || [];

      setCustomers(data);
    } catch (error) {
      console.error(
        "Error fetching customers:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────────
  // Delete Customer
  // ─────────────────────────────────────────────
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Delete this customer?"
    );

    if (!confirmDelete) return;

    try {
      await deleteCustomer(id);

      fetchCustomers();
    } catch (error) {
      console.error(
        "Error deleting customer:",
        error
      );
    }
  };

  // ─────────────────────────────────────────────
  // Load Customers
  // ─────────────────────────────────────────────
  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <MainLayout>
      <PageHeader
        title="Customers"
        subtitle="Manage customer records and contact information"
        actionText="Add Customer"
        onAction={() =>
          navigate("/sales/customers/add")
        }
      />

      {/* Customer Table */}
      <div className="content-card">
        <h3
          style={{
            marginBottom: "20px",
          }}
        >
          Customer Directory
        </h3>

        {loading ? (
          <p>Loading customers...</p>
        ) : customers.length === 0 ? (
          <p>No customers found.</p>
        ) : (
          <div
            style={{
              overflowX: "auto",
            }}
          >
            <table className="erp-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Company</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {customers.map((customer) => (
                  <tr key={customer._id}>
                    <td>
                      {customer.name}
                    </td>

                    <td>
                      {customer.email}
                    </td>

                    <td>
                      {customer.phone}
                    </td>

                    <td>
                      {customer.company}
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
                              `/sales/customers/edit/${customer._id}`
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
                              customer._id
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