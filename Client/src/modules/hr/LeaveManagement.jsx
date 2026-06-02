import { useEffect, useState } from "react";

import HRSubNav from "./components/HRSubNav";
import MainLayout from "../../component/layouts/MainLayout";
import PageHeader from "../../component/ui/PageHeader";
import StatusBadge from "../../component/ui/StatusBadge";

const LeaveManagement = () => {
  const role = localStorage.getItem("role");

  const [employees, setEmployees] = useState([]);
  const [leaves, setLeaves] = useState([]);

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
    fetchEmployees();
    fetchLeaves();
  }, []);

  /* =========================
     Fetch Employees
  ========================= */
  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        "http://localhost:5000/api/employees",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      setEmployees(data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  /* =========================
     Fetch Leaves
  ========================= */
  const fetchLeaves = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        "http://localhost:5000/api/leaves",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      setLeaves(data);
    } catch (error) {
      console.error("Error fetching leaves:", error);
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
        "http://localhost:5000/api/leaves",
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
        `http://localhost:5000/api/leaves/${id}`,
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
        subtitle="Apply for leave and manage approval workflow"
        actionText="Apply Leave"
        onAction={() =>
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          })
        }
      />

      {/* Leave Application Form */}
      <div className="card">
        <div className="card-header">
          <h3>Leave Application Form</h3>
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit} className="form-grid">
            {/* Employee Select */}
            <select
              name="employee"
              value={formData.employee}
              onChange={handleChange}
              required
              className="form-input"
            >
              <option value="">Select Employee</option>
              {employees.map((emp) => (
                <option key={emp._id} value={emp._id}>
                  {emp.employeeId} - {emp.name}
                </option>
              ))}
            </select>

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
                {role === "admin" && <th>Actions</th>}
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

                    {role === "admin" && (
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
                      role === "admin" ? 7 : 6
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
