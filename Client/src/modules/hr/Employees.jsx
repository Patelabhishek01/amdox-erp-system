import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import HRSubNav from "./components/HRSubNav";
import MainLayout from "../../component/layouts/MainLayout";
import PageHeader from "../../component/ui/PageHeader";
import StatusBadge from "../../component/ui/StatusBadge";
import ExportActions from "../../component/ui/ExportActions";
import RecordComments from "../../component/ui/RecordComments";
import RecordAttachments from "../../component/ui/RecordAttachments";
import RecordTimeline from "../../component/ui/RecordTimeline";
import { TableSkeleton } from "../../component/ui/SkeletonLoader";
import { MessageSquare, X } from "lucide-react";
import { apiRequest } from "../../utils/api";

const Employees = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role") || "employee";

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [selectedAssets, setSelectedAssets] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const [formData, setFormData] = useState({
    employeeId: "",
    name: "",
    email: "",
    department: "",
    designation: "",
    salary: "",
    joiningDate: "",
    status: "Active",
  });

  const [editingEmployeeId, setEditingEmployeeId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);

  /* =========================
     Load Employee Details (Tasks, Assets)
  ========================= */
  useEffect(() => {
    if (selectedRecord) {
      fetchEmployeeDetails(selectedRecord._id);
    } else {
      setSelectedTasks([]);
      setSelectedAssets([]);
    }
  }, [selectedRecord]);

  const fetchEmployeeDetails = async (employeeId) => {
    try {
      setLoadingDetails(true);
      const tasksRes = await apiRequest(`/api/projects/tasks?assignedEmployeeId=${employeeId}`);
      if (tasksRes.ok) {
        const tasksData = await tasksRes.json();
        setSelectedTasks(tasksData || []);
      }
      
      const assetsRes = await apiRequest(`/api/assets?assignedToEmployeeId=${employeeId}`);
      if (assetsRes.ok) {
        const assetsData = await assetsRes.json();
        setSelectedAssets(assetsData || []);
      }
    } catch (err) {
      console.error("Error fetching employee details:", err);
    } finally {
      setLoadingDetails(false);
    }
  };

  /* =========================
     Load Employees
  ========================= */
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await apiRequest("/api/employees");
      const data = await res.json();
      setEmployees(data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     Search Filter
  ========================= */
  const filteredEmployees = employees.filter((employee) =>
    employee.name.toLowerCase().includes(search.toLowerCase()) ||
    employee.email.toLowerCase().includes(search.toLowerCase()) ||
    employee.department.toLowerCase().includes(search.toLowerCase())
  );

  /* =========================
     Form Handling
  ========================= */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /* =========================
     Create / Update Employee
  ========================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const endpoint = isEditing
        ? `/api/employees/${editingEmployeeId}`
        : "/api/employees";

      const method = isEditing ? "PUT" : "POST";

      const res = await apiRequest(endpoint, {
        method,
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to save employee");
        return;
      }

      alert(data.message || (isEditing ? "Employee updated successfully" : "Employee saved successfully"));

      await fetchEmployees();

      setFormData({
        employeeId: "",
        name: "",
        email: "",
        department: "",
        designation: "",
        salary: "",
        joiningDate: "",
        status: "Active",
      });

      setIsEditing(false);
      setEditingEmployeeId(null);
      setShowForm(false);
    } catch (error) {
      console.error("Submit Error:", error);
      alert("Something went wrong");
    }
  };

  /* =========================
     Delete Employee
  ========================= */
  const deleteEmployee = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this employee?"
    );

    if (!confirmDelete) return;

    try {
      const res = await apiRequest(`/api/employees/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      alert(data.message);

      // Deselect record if active
      if (selectedRecord && selectedRecord._id === id) {
        setSelectedRecord(null);
      }

      fetchEmployees();
    } catch (error) {
      console.error("Delete Error:", error);
    }
  };

  /* =========================
     Approve Employee Request
  ========================= */
  const approveEmployee = async (id) => {
    if (!window.confirm("Approve this employee request?")) return;
    try {
      const res = await apiRequest(`/api/employees/${id}`, {
        method: "PUT",
        body: JSON.stringify({ status: "Active" })
      });
      const data = await res.json();
      if (res.ok) {
        alert("Employee approved successfully");
        fetchEmployees();
      } else {
        alert(data.message || "Failed to approve employee");
      }
    } catch (err) {
      console.error("Approve error:", err);
      alert("Something went wrong");
    }
  };

  /* =========================
     Reject Employee Request
  ========================= */
  const rejectEmployee = async (id) => {
    if (!window.confirm("Reject and delete this employee request?")) return;
    try {
      const res = await apiRequest(`/api/employees/${id}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (res.ok) {
        alert("Employee request rejected successfully");
        fetchEmployees();
      } else {
        alert(data.message || "Failed to reject employee");
      }
    } catch (err) {
      console.error("Reject error:", err);
      alert("Something went wrong");
    }
  };

  /* =========================
     Edit Employee
  ========================= */
  const editEmployee = (employee) => {
    setFormData({
      employeeId: employee.employeeId,
      name: employee.name,
      email: employee.email,
      department: employee.department,
      designation: employee.designation,
      salary: employee.salary,
      joiningDate: employee.joiningDate
        ? employee.joiningDate.split("T")[0]
        : "",
      status: employee.status,
    });

    setEditingEmployeeId(employee._id);
    setIsEditing(true);
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const columns = [
    { key: "employeeId", label: "Employee ID" },
    { key: "name", label: "Full Name" },
    { key: "email", label: "Email" },
    { key: "department", label: "Department" },
    { key: "designation", label: "Designation" },
    { key: "salary", label: "Salary" },
    { key: "status", label: "Status" }
  ];

  return (
    <MainLayout>
      <HRSubNav />
      <PageHeader
        title="Employees"
        subtitle="Manage employee records, edit profiles, attach resumes, and audit history changes."
        actionText={showForm ? "Hide Form" : (isEditing ? "Editing Employee" : "Add Employee")}
        onAction={() => setShowForm(!showForm)}
      />

      {/* Export actions and quick stats bar */}
      {employees.length > 0 && (
        <ExportActions
          data={filteredEmployees}
          columns={columns}
          filename="amdox-employees-report"
        />
      )}

      {/* Search */}
      <div className="card">
        <div className="card-header">
          <h3>Search Employees</h3>
        </div>

        <div className="card-body">
          <input
            type="text"
            className="form-input"
            placeholder="Search by name, email, or department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Form Card */}
      {showForm && (
        <div className="card">
        <div className="card-header">
          <h3>
            {isEditing ? "Update Employee" : "Add Employee"}
          </h3>
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit} className="form-grid">
            <input
              type="text"
              name="employeeId"
              placeholder="Employee ID"
              value={formData.employeeId}
              onChange={handleChange}
              required
              className="form-input"
            />

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="form-input"
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="form-input"
            />

            <input
              type="text"
              name="department"
              placeholder="Department"
              value={formData.department}
              onChange={handleChange}
              required
              className="form-input"
            />

            <input
              type="text"
              name="designation"
              placeholder="Designation"
              value={formData.designation}
              onChange={handleChange}
              required
              className="form-input"
            />

            <input
              type="number"
              name="salary"
              placeholder="Salary"
              value={formData.salary}
              onChange={handleChange}
              required
              className="form-input"
            />

            <input
              type="date"
              name="joiningDate"
              value={formData.joiningDate}
              onChange={handleChange}
              required
              className="form-input"
            />

            {role === "admin" && (
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="form-input"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            )}

            <div className="form-actions">
              <button
                type="submit"
                className="btn btn-primary"
              >
                {isEditing
                  ? "Update Employee"
                  : "Save Employee"}
              </button>

              {isEditing && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setIsEditing(false);
                    setEditingEmployeeId(null);
                    setShowForm(false);
                    setFormData({
                      employeeId: "",
                      name: "",
                      email: "",
                      department: "",
                      designation: "",
                      salary: "",
                      joiningDate: "",
                      status: "Active",
                    });
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
      )}

      {/* Responsive Grid with Split Collaboration Panel */}
      <div style={{ display: "flex", gap: "24px", flexDirection: "row", flexWrap: "wrap" }}>
        
        {/* Table list */}
        <div className="card" style={{ flex: selectedRecord ? "2 1 600px" : "1 1 100%", overflow: "hidden" }}>
          <div className="card-header">
            <h3>Employee Directory</h3>
          </div>

          <div className="table-responsive">
            {loading ? (
              <TableSkeleton rows={5} cols={8} />
            ) : (
              <table className="erp-table">
                <thead>
                  <tr>
                    <th>Employee ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Department</th>
                    <th>Designation</th>
                    <th>Salary</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredEmployees.length > 0 ? (
                    filteredEmployees.map((employee) => {
                      const isActiveRow = selectedRecord?._id === employee._id;
                      return (
                        <tr key={employee._id} style={{ background: isActiveRow ? "var(--primary-light)" : "transparent" }}>
                          <td>{employee.employeeId}</td>
                          <td>{employee.name}</td>
                          <td>{employee.email}</td>
                          <td>{employee.department}</td>
                          <td>{employee.designation}</td>
                          <td>${employee.salary}</td>
                          <td>
                            <StatusBadge
                              status={employee.status}
                            />
                          </td>
                          <td>
                            <div className="action-buttons">
                              {employee.status === "Pending Approval" ? (
                                role === "admin" ? (
                                  <>
                                    <button
                                      className="btn btn-sm btn-success"
                                      onClick={() => approveEmployee(employee._id)}
                                      style={{ backgroundColor: "#22c55e", color: "#ffffff", border: "none" }}
                                    >
                                      Approve
                                    </button>
                                    <button
                                      className="btn btn-sm btn-danger"
                                      onClick={() => rejectEmployee(employee._id)}
                                      style={{ backgroundColor: "#ef4444", color: "#ffffff", border: "none" }}
                                    >
                                      Reject
                                    </button>
                                  </>
                                ) : (
                                  <span style={{ color: "var(--text-muted)", fontSize: "12px", fontStyle: "italic" }}>
                                    Pending Admin Approval
                                  </span>
                                )
                              ) : (
                                <>
                                  <button
                                    className="btn btn-sm btn-secondary"
                                    onClick={() => {
                                      setSelectedRecord(employee);
                                      setTimeout(() => {
                                        const panel = document.getElementById("collaboration-panel");
                                        if (panel) {
                                          panel.scrollIntoView({ behavior: "smooth" });
                                        }
                                      }, 100);
                                    }}
                                    style={{ display: "inline-flex", gap: "4px", alignItems: "center" }}
                                  >
                                    <MessageSquare size={12} />
                                    Chat
                                  </button>

                                  {role === "admin" && (
                                    <>
                                      <button
                                        className="btn btn-sm btn-secondary"
                                        onClick={() => editEmployee(employee)}
                                      >
                                        Edit
                                      </button>

                                      <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() => deleteEmployee(employee._id)}
                                      >
                                        Delete
                                      </button>
                                    </>
                                  )}
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan="8"
                        className="empty-state"
                      >
                        No employees found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Dynamic Collaboration panel side panel */}
        {selectedRecord && (
          <div id="collaboration-panel" className="card glass-effect" style={{ flex: "1 1 350px", padding: "20px", height: "fit-content", position: "sticky", top: "100px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ margin: 0, fontSize: "16px" }}>Profile: {selectedRecord.name}</h3>
              <button
                onClick={() => setSelectedRecord(null)}
                style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--text-muted)", display: "flex" }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Inactive Asset Warning Trigger */}
            {selectedRecord.status?.toLowerCase() === "inactive" && selectedAssets.length > 0 && (
              <div style={{
                background: "#fee2e2",
                border: "1px solid #f87171",
                color: "#991b1b",
                padding: "12px",
                borderRadius: "6px",
                marginBottom: "16px",
                fontSize: "0.85rem",
                fontWeight: "700"
              }}>
                ⚠️ Warning: This employee is Inactive. Please collect the following {selectedAssets.length} corporate asset(s) immediately!
              </div>
            )}

            {/* Assigned Tasks & Projects */}
            <div style={{ marginBottom: "20px" }}>
              <h4 style={{ fontSize: "14px", borderBottom: "1px solid #e5e7eb", paddingBottom: "6px", marginBottom: "8px" }}>
                Active Tasks & Projects ({selectedTasks.length})
              </h4>
              {loadingDetails ? (
                <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>Loading relations...</div>
              ) : selectedTasks.length === 0 ? (
                <div style={{ fontSize: "12px", color: "var(--text-muted)", fontStyle: "italic" }}>No tasks currently assigned.</div>
              ) : (
                <ul style={{ paddingLeft: "16px", margin: 0, fontSize: "13px" }}>
                  {selectedTasks.map(t => (
                    <li key={t._id} style={{ marginBottom: "6px" }}>
                      <strong>{t.title}</strong> - <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>{t.status} ({t.hoursLogged || 0} hrs)</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Assigned Assets */}
            <div style={{ marginBottom: "20px" }}>
              <h4 style={{ fontSize: "14px", borderBottom: "1px solid #e5e7eb", paddingBottom: "6px", marginBottom: "8px" }}>
                Assigned Corporate Assets ({selectedAssets.length})
              </h4>
              {loadingDetails ? (
                <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>Loading relations...</div>
              ) : selectedAssets.length === 0 ? (
                <div style={{ fontSize: "12px", color: "var(--text-muted)", fontStyle: "italic" }}>No hardware assets currently assigned.</div>
              ) : (
                <ul style={{ paddingLeft: "16px", margin: 0, fontSize: "13px" }}>
                  {selectedAssets.map(a => (
                    <li key={a._id} style={{ marginBottom: "6px" }}>
                      <strong>{a.assetName}</strong> <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>({a.serialNumber || "No S/N"}) - Condition: {a.condition || "Good"}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            
            {/* Context comments, files and timeline */}
            <RecordAttachments recordId={selectedRecord._id} module="employees" />
            <RecordComments recordId={selectedRecord._id} module="employees" />
            <RecordTimeline recordId={selectedRecord._id} module="employees" />
          </div>
        )}

      </div>
    </MainLayout>
  );
};

export default Employees;