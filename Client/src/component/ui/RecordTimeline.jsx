import { useEffect, useState, useCallback } from "react";
import { History, Loader2, Clock } from "lucide-react";
import { apiRequest } from "../../utils/api";

export default function RecordTimeline({ recordId, module }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTimeline = useCallback(async () => {
    if (!recordId) return;
    try {
      const res = await apiRequest(`/api/records/${module}/${recordId}/logs`);
      if (res.ok) {
        const data = await res.json();
        setLogs(data);
      }
    } catch (err) {
      console.error("Timeline load error:", err);
    } finally {
      setLoading(false);
    }
  }, [recordId, module]);

  useEffect(() => {
    fetchTimeline();
  }, [fetchTimeline]);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "12px" }}>
        <Loader2 className="animate-spin" size={16} />
      </div>
    );
  }

  return (
    <div style={{ marginTop: "16px", borderTop: "1px solid var(--border-color)", paddingTop: "16px" }}>
      <h4 style={{ display: "flex", alignItems: "center", gap: "8px", margin: "0 0 16px", fontSize: "14px" }}>
        <History size={16} />
        Record History & Audit Logs
      </h4>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px", paddingLeft: "8px", position: "relative" }}>
        {logs.length > 0 ? (
          logs.map((log, index) => (
            <div key={log._id} style={{ display: "flex", gap: "12px", position: "relative" }}>
              
              {/* Timeline dots */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    background: "var(--primary-color)",
                    zIndex: 2
                  }}
                />
                {index !== logs.length - 1 && (
                  <div
                    style={{
                      width: "2px",
                      flex: 1,
                      background: "var(--border-color)",
                      marginTop: "4px",
                      marginBottom: "-12px"
                    }}
                  />
                )}
              </div>

              {/* Log message */}
              <div style={{ flex: 1, paddingBottom: "8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2px" }}>
                  <span style={{ fontSize: "12px", fontWeight: "700" }}>{log.action}</span>
                  <span style={{ fontSize: "10px", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "3px" }}>
                    <Clock size={10} />
                    {new Date(log.createdAt).toLocaleDateString()} {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: "11px", color: "var(--text-muted)" }}>
                  By: {log.userName}
                </p>
                {log.details && (
                  <p style={{ margin: "4px 0 0", fontSize: "11px", color: "var(--text-muted)", fontStyle: "italic" }}>
                    {log.details}
                  </p>
                )}
              </div>

            </div>
          ))
        ) : (
          <div style={{ fontSize: "12px", color: "var(--text-muted)", textAlign: "center" }}>
            No edit history found for this record.
          </div>
        )}
      </div>
    </div>
  );
}
