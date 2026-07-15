import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../../component/layouts/MainLayout";
import PageHeader from "../../../component/ui/PageHeader";
import ExportActions from "../../../component/ui/ExportActions";
import RecordComments from "../../../component/ui/RecordComments";
import RecordAttachments from "../../../component/ui/RecordAttachments";
import RecordTimeline from "../../../component/ui/RecordTimeline";
import { TableSkeleton } from "../../../component/ui/SkeletonLoader";
import { MessageSquare, X } from "lucide-react";
import { getExpenses, deleteExpense } from "../services/expenseService";

export default function Expenses() {
  const navigate = useNavigate();

  const [expenses, setExpenses] = useState([]);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Fetch Expenses
  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const response = await getExpenses();
      const data = response.data || response || [];
      setExpenses(data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    } finally {
      setLoading(false);
    }
  };

  // Delete Expense
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this expense?");
    if (!confirmDelete) return;

    try {
      await deleteExpense(id);
      if (selectedRecord && selectedRecord._id === id) {
        setSelectedRecord(null);
      }
      fetchExpenses();
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // Filter & Search logic
  const filteredExpenses = expenses.filter(exp => {
    const matchesSearch = exp.title.toLowerCase().includes(search.toLowerCase()) ||
                          exp.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !filterCategory || exp.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Extract unique categories for filter dropdown
  const categories = Array.from(new Set(expenses.map(e => e.category)));

  const columns = [
    { key: "title", label: "Title" },
    { key: "category", label: "Category" },
    { key: "amount", label: "Amount ($)" },
    { key: "date", label: "Date" }
  ];

  return (
    <MainLayout>
      <PageHeader
        title="Expenses"
        subtitle="Track and manage business expenses, compile summaries, upload receipts, and review logs."
        actionText="Add Expense"
        onAction={() => navigate("/finance/expenses/add")}
      />

      {/* Export & Search Controls */}
      {expenses.length > 0 && (
        <ExportActions
          data={filteredExpenses.map(e => ({ ...e, amount: `$${e.amount}` }))}
          columns={columns}
          filename="amdox-finance-expenses-report"
        />
      )}

      {/* Search & Filter Box */}
      <div className="card">
        <div className="card-header">
          <h3>Advanced Filters</h3>
        </div>
        <div className="card-body" style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          <input
            type="text"
            className="form-input"
            placeholder="Search by expense title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1, minWidth: "220px" }}
          />

          <select
            className="form-input"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            style={{ width: "200px" }}
          >
            <option value="">All Categories</option>
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Split layout containing list and side collaboration panel */}
      <div style={{ display: "flex", gap: "24px", flexDirection: "row", flexWrap: "wrap" }}>
        
        {/* Table container */}
        <div className="card" style={{ flex: selectedRecord ? "2 1 600px" : "1 1 100%", overflow: "hidden" }}>
          <div className="card-header">
            <h3>Expense Records</h3>
          </div>

          <div className="table-responsive">
            {loading ? (
              <TableSkeleton rows={5} cols={5} />
            ) : filteredExpenses.length === 0 ? (
              <div className="empty-state">No expenses found matching filters.</div>
            ) : (
              <table className="erp-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredExpenses.map((expense) => {
                    const isActive = selectedRecord?._id === expense._id;
                    return (
                      <tr key={expense._id} style={{ background: isActive ? "var(--primary-light)" : "transparent" }}>
                        <td>{expense.title}</td>
                        <td>
                          <span style={{ fontSize: "12px", background: "var(--border-color)", padding: "4px 8px", borderRadius: "12px" }}>
                            {expense.category}
                          </span>
                        </td>
                        <td style={{ fontWeight: "700" }}>${expense.amount}</td>
                        <td>{expense.date ? new Date(expense.date).toLocaleDateString() : "-"}</td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="btn btn-sm btn-secondary"
                              onClick={() => setSelectedRecord(expense)}
                              style={{ display: "inline-flex", gap: "4px", alignItems: "center" }}
                            >
                              <MessageSquare size={12} />
                              Notes
                            </button>

                            <button
                              className="btn btn-sm btn-secondary"
                              onClick={() => navigate(`/finance/expenses/edit/${expense._id}`)}
                            >
                              Edit
                            </button>

                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDelete(expense._id)}
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
              <h3 style={{ margin: 0, fontSize: "16px" }}>Record: {selectedRecord.title}</h3>
              <button
                onClick={() => setSelectedRecord(null)}
                style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--text-muted)", display: "flex" }}
              >
                <X size={16} />
              </button>
            </div>
            
            <RecordAttachments recordId={selectedRecord._id} module="finance" />
            <RecordComments recordId={selectedRecord._id} module="finance" />
            <RecordTimeline recordId={selectedRecord._id} module="finance" />
          </div>
        )}

      </div>
    </MainLayout>
  );
}