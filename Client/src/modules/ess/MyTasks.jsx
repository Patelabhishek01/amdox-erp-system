import { useEffect, useState } from "react";
import MainLayout from "../../component/layouts/MainLayout";
import PageHeader from "../../component/ui/PageHeader";
import { apiRequest } from "../../utils/api";
import { FaClock } from "react-icons/fa";

function MyTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [logHoursModalTask, setLogHoursModalTask] = useState(null);
  const [hoursToLog, setHoursToLog] = useState("");

  const fetchMyTasks = async () => {
    try {
      setLoading(true);
      const res = await apiRequest("/api/projects/tasks/me");
      if (res.ok) {
        const data = await res.json();
        setTasks(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Error fetching my tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyTasks();
  }, []);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const res = await apiRequest(`/api/projects/tasks/${taskId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchMyTasks();
      } else {
        const err = await res.json();
        alert(err.message || "Failed to update task status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleLogHoursSubmit = async (e) => {
    e.preventDefault();
    if (!logHoursModalTask || !hoursToLog) return;
    try {
      const res = await apiRequest(`/api/projects/tasks/${logHoursModalTask._id}/log-hours`, {
        method: "PATCH",
        body: JSON.stringify({ hours: Number(hoursToLog) }),
      });
      if (res.ok) {
        setLogHoursModalTask(null);
        setHoursToLog("");
        fetchMyTasks();
      } else {
        const err = await res.json();
        alert(err.message || "Failed to log hours");
      }
    } catch (error) {
      console.error("Error logging hours:", error);
    }
  };

  return (
    <MainLayout>
      <PageHeader
        title="My Assigned Tasks"
        subtitle="Track deliverables, update your progress, and log work hours"
      />

      <div className="card">
        <div className="card-header">
          <h3 style={{ margin: 0 }}>Task Deliverables ({tasks.length})</h3>
        </div>

        <div className="card-body">
          {loading ? (
            <p style={{ color: "var(--text-muted)", margin: 0 }}>Loading your tasks...</p>
          ) : tasks.length === 0 ? (
            <p style={{ color: "var(--text-muted)", fontStyle: "italic", margin: 0 }}>
              No tasks currently assigned to you.
            </p>
          ) : (
            <div className="table-responsive">
              <table className="erp-table">
                <thead>
                  <tr>
                    <th>Task Title</th>
                    <th>Project</th>
                    <th>Target Due Date</th>
                    <th>Hours Logged</th>
                    <th>Progress Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task) => (
                    <tr key={task._id}>
                      <td>
                        <strong>{task.title}</strong>
                        {task.description && (
                          <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                            {task.description}
                          </div>
                        )}
                      </td>
                      <td>{task.projectId?.projectName || "Direct Task"}</td>
                      <td>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "-"}</td>
                      <td>
                        <strong>{task.hoursLogged || 0} hrs</strong>
                      </td>
                      <td>
                        <select
                          value={task.status}
                          onChange={(e) => handleStatusChange(task._id, e.target.value)}
                          className="form-input"
                          style={{
                            padding: "4px 8px",
                            fontSize: "12px",
                            width: "auto",
                            borderColor:
                              task.status === "Done"
                                ? "#16a34a"
                                : task.status === "In Progress"
                                ? "#2563eb"
                                : "#d97706",
                          }}
                        >
                          <option value="Todo">Todo</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Done">Done</option>
                        </select>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-sm btn-secondary"
                          onClick={() => {
                            setLogHoursModalTask(task);
                            setHoursToLog("");
                          }}
                          style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}
                        >
                          <FaClock size={11} /> Log Hours
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Log Hours Modal */}
      {logHoursModalTask && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            padding: "16px",
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "8px",
              maxWidth: "400px",
              width: "100%",
              padding: "24px",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
            }}
          >
            <h3 style={{ margin: "0 0 8px" }}>Log Task Hours</h3>
            <p style={{ margin: "0 0 16px", fontSize: "13px", color: "var(--text-muted)" }}>
              Task: <strong>{logHoursModalTask.title}</strong>
            </p>

            <form onSubmit={handleLogHoursSubmit}>
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "4px" }}>
                  Hours to add (numeric)
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  required
                  placeholder="e.g. 2.5"
                  value={hoursToLog}
                  onChange={(e) => setHoursToLog(e.target.value)}
                  className="form-input"
                  style={{ width: "100%" }}
                  autoFocus
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                <button
                  type="button"
                  onClick={() => setLogHoursModalTask(null)}
                  className="btn btn-secondary btn-sm"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  Save Hours
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </MainLayout>
  );
}

export default MyTasks;
