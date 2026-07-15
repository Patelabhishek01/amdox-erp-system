import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../component/layouts/MainLayout";
import PageHeader from "../../component/ui/PageHeader";
import ExportActions from "../../component/ui/ExportActions";
import RecordComments from "../../component/ui/RecordComments";
import RecordAttachments from "../../component/ui/RecordAttachments";
import RecordTimeline from "../../component/ui/RecordTimeline";
import { TableSkeleton } from "../../component/ui/SkeletonLoader";
import { MessageSquare, X } from "lucide-react";
import { getCustomers, deleteCustomer } from "../sales/services/customerService";

export default function Customer() {
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Fetch Customers
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await getCustomers();
      const data = response || [];
      setCustomers(data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  };

  // Delete Customer
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this customer?");
    if (!confirmDelete) return;

    try {
      await deleteCustomer(id);
      if (selectedRecord && selectedRecord._id === id) {
        setSelectedRecord(null);
      }
      fetchCustomers();
    } catch (error) {
      console.error("Error deleting customer:", error);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Filter logic
  const filteredCustomers = customers.filter(cust => {
    return cust.name.toLowerCase().includes(search.toLowerCase()) ||
           cust.email.toLowerCase().includes(search.toLowerCase()) ||
           cust.company.toLowerCase().includes(search.toLowerCase());
  });

  const columns = [
    { key: "name", label: "Full Name" },
    { key: "email", label: "Email Address" },
    { key: "phone", label: "Phone" },
    { key: "company", label: "Company" }
  ];

  return (
    <MainLayout>
      <PageHeader
        title="Customers"
        subtitle="Manage customer directories, record lead interactions, track purchase history, and log contact info."
        actionText="Add Customer"
        onAction={() => navigate("/sales/customers/add")}
      />

      {/* Export & Search Controls */}
      {customers.length > 0 && (
        <ExportActions
          data={filteredCustomers}
          columns={columns}
          filename="amdox-sales-customers-report"
        />
      )}

      {/* Search Filter */}
      <div className="card">
        <div className="card-header">
          <h3>Search Directory</h3>
        </div>
        <div className="card-body">
          <input
            type="text"
            className="form-input"
            placeholder="Search by name, email, or company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: "100%" }}
          />
        </div>
      </div>

      {/* Split layout containing list and side collaboration panel */}
      <div style={{ display: "flex", gap: "24px", flexDirection: "row", flexWrap: "wrap" }}>
        
        {/* Table list */}
        <div className="card" style={{ flex: selectedRecord ? "2 1 600px" : "1 1 100%", overflow: "hidden" }}>
          <div className="card-header">
            <h3>Customer Directory</h3>
          </div>

          <div className="table-responsive">
            {loading ? (
              <TableSkeleton rows={5} cols={5} />
            ) : filteredCustomers.length === 0 ? (
              <div className="empty-state">No customers found matching filters.</div>
            ) : (
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
                  {filteredCustomers.map((customer) => {
                    const isActive = selectedRecord?._id === customer._id;
                    return (
                      <tr key={customer._id} style={{ background: isActive ? "var(--primary-light)" : "transparent" }}>
                        <td style={{ fontWeight: "700" }}>{customer.name}</td>
                        <td>{customer.email}</td>
                        <td>{customer.phone || "-"}</td>
                        <td>{customer.company || "-"}</td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="btn btn-sm btn-secondary"
                              onClick={() => setSelectedRecord(customer)}
                              style={{ display: "inline-flex", gap: "4px", alignItems: "center" }}
                            >
                              <MessageSquare size={12} />
                              Notes
                            </button>

                            <button
                              className="btn btn-sm btn-secondary"
                              onClick={() => navigate(`/sales/customers/edit/${customer._id}`)}
                            >
                              Edit
                            </button>

                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDelete(customer._id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Dynamic Sidebar panel */}
        {selectedRecord && (
          <div className="card glass-effect" style={{ flex: "1 1 320px", padding: "20px", height: "fit-content", position: "sticky", top: "100px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ margin: 0, fontSize: "16px" }}>Record: {selectedRecord.name}</h3>
              <button
                onClick={() => setSelectedRecord(null)}
                style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--text-muted)", display: "flex" }}
              >
                <X size={16} />
              </button>
            </div>
            
            <RecordAttachments recordId={selectedRecord._id} module="sales" />
            <RecordComments recordId={selectedRecord._id} module="sales" />
            <RecordTimeline recordId={selectedRecord._id} module="sales" />
          </div>
        )}

      </div>
    </MainLayout>
  );
}