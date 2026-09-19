import { useEffect, useState } from "react";

import HRSubNav from "./components/HRSubNav";
import MainLayout from "../../component/layouts/MainLayout";
import PageHeader from "../../component/ui/PageHeader";
import StatusBadge from "../../component/ui/StatusBadge";

const LeaveManagement = () => {
  const role = (localStorage.getItem("role") || "").toLowerCase();
  const isAdminOrHR = ["admin", "hr"].includes(role);

  const [employees, setEmployees] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [formData, setFormData] = useState({
    employee: "",
    leaveType: "Sick",
    startDate: "",
    endDate: "",
    reason: "",
  });

  /* =========================
     Initial Load
  ========================= */
  useEffect(() => {
    if (isAdminOrHR) {
      fetchEmployees();
    }
    fetchLeaves();
  }, [isAdminOrHR]);

  /* =========================
     Fetch Employees
  ========================= */
  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${API_URL}/api/employees`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        const data = await res.json();
        setEmployees(Array.isArray(data) ? data : []);
      } else {
        setEmployees([]);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
      setEmployees([]);
    }
  };

  /* =========================
     Fetch Leaves
  ========================= */
  const fetchLeaves = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${API_URL}/api/leaves`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        const data = await res.json();
        setLeaves(Array.isArray(data) ? data : []);
      } else {
        setLeaves([]);
      }
    } catch (error) {
      console.error("Error fetching leaves:", error);
      setLeaves([]);
    }
  };

  /* =========================
     Handle Form Changes
  ========================= */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /* =========================
     Apply Leave
  ========================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${API_URL}/api/leaves`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to apply leave");
        return;
      }

      alert("Leave applied successfully");

      setFormData({
        employee: "",
        leaveType: "Sick",
        startDate: "",
        endDate: "",
        reason: "",
      });

      fetchLeaves();
      setShowForm(false);
    } catch (error) {
      console.error("Error applying leave:", error);
      alert("Something went wrong");
    }
  };

  /* =========================
     Update Leave Status
  ========================= */
  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${API_URL}/api/leaves/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await res.json();
      alert(data.message);

      fetchLeaves();
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Something went wrong");
    }
  };

  return (
    <MainLayout>
      <HRSubNav />
      <PageHeader
        title="Leave Management"
        subtitle={isAdminOrHR ? "Manage employee leave approval workflow" : "Apply for leave and view status"}
        actionText={!isAdminOrHR ? (showForm ? "Hide Form" : "Apply Leave") : null}
        onAction={!isAdminOrHR ? () => setShowForm(!showForm) : undefined}
      />

      {/* Leave Application Form */}
      {!isAdminOrHR && showForm && (
        <div className="card">
        <div className="card-header">
          <h3>Leave Application Form</h3>
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit} className="form-grid">
            {/* Leave Type */}
            <select
              name="leaveType"
              value={formData.leaveType}
              onChange={handleChange}
              className="form-input"
            >
              <option value="Sick">Sick</option>
              <option value="Casual">Casual</option>
              <option value="Annual">Annual</option>
            </select>

            {/* Start Date */}
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
              className="form-input"
            />

            {/* End Date */}
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
              className="form-input"
            />

            {/* Reason */}
            <textarea
              name="reason"
              placeholder="Reason for leave"
              value={formData.reason}
              onChange={handleChange}
              required
              className="form-input"
              style={{
                minHeight: "120px",
                paddingTop: "12px",
                resize: "vertical",
                gridColumn: "1 / -1",
              }}
            />

            {/* Submit Button */}
            <div className="form-actions">
              <button
                type="submit"
                className="btn btn-primary"
              >
                Apply Leave
              </button>
            </div>
          </form>
        </div>
      </div>
      )}

      {/* Leave Requests Table */}
      <div className="card">
        <div className="card-header">
          <h3>Leave Requests</h3>
        </div>

        <div className="table-responsive">
          <table className="erp-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Type</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Reason</th>
                <th>Status</th>
                {isAdminOrHR && <th>Actions</th>}
              </tr>
            </thead>

            <tbody>
              {leaves.length > 0 ? (
                leaves.map((leave) => (
                  <tr key={leave._id}>
                    <td>
                      {leave.employee?.name || "N/A"}
                    </td>
                    <td>{leave.leaveType}</td>
                    <td>
                      {new Date(
                        leave.startDate
                      ).toLocaleDateString()}
                    </td>
                    <td>
                      {new Date(
                        leave.endDate
                      ).toLocaleDateString()}
                    </td>
                    <td>{leave.reason}</td>
                    <td>
                      <StatusBadge
                        status={leave.status}
                      />
                    </td>

                    {isAdminOrHR && (
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() =>
                              updateStatus(
                                leave._id,
                                "Approved"
                              )
                            }
                          >
                            Approve
                          </button>

                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() =>
                              updateStatus(
                                leave._id,
                                "Rejected"
                              )
                            }
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={
                      isAdminOrHR ? 7 : 6
                    }
                    className="empty-state"
                  >
                    No leave requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
};

export default LeaveManagement;
