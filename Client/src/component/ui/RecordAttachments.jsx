import { useState, useEffect, useCallback } from "react";
import { Paperclip, Trash2, UploadCloud, Loader2 } from "lucide-react";
import { apiRequest } from "../../utils/api";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function RecordAttachments({ recordId, module }) {
  const [attachments, setAttachments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchAttachments = useCallback(async () => {
    if (!recordId) return;
    try {
      const res = await apiRequest(`/api/records/${module}/${recordId}/attachments`);
      if (res.ok) {
        const data = await res.json();
        setAttachments(data);
      }
    } catch (err) {
      console.error("Fetch attachments error:", err);
    } finally {
      setLoading(false);
    }
  }, [recordId, module]);

  useEffect(() => {
    fetchAttachments();
  }, [fetchAttachments]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await apiRequest(`/api/records/${module}/${recordId}/attachments`, {
        method: "POST",
        body: formData
      });

      if (res.ok) {
        fetchAttachments();
      } else {
        const err = await res.json();
        alert(err.message || "Upload failed");
      }
    } catch (err) {
      console.error(err);
      alert("Error uploading file");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to remove this attachment?");
    if (!confirmDelete) return;

    try {
      const res = await apiRequest(`/api/records/attachments/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        fetchAttachments();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "12px" }}>
        <Loader2 className="animate-spin" size={18} />
      </div>
    );
  }

  return (
    <div style={{ marginTop: "16px", borderTop: "1px solid var(--border-color)", paddingTop: "16px" }}>
      <h4 style={{ display: "flex", alignItems: "center", gap: "8px", margin: "0 0 12px", fontSize: "14px" }}>
        <Paperclip size={16} />
        Attachments & Documents ({attachments.length})
      </h4>

      {/* File List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "12px" }}>
        {attachments.length > 0 ? (
          attachments.map((file) => (
            <div
              key={file._id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "8px 12px",
                background: "var(--bg-page)",
                border: "1px solid var(--border-color)",
                borderRadius: "8px"
              }}
            >
              <a
                href={`${BASE_URL}${file.filePath}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: "12px",
                  color: "var(--primary-color)",
                  fontWeight: "600",
                  textDecoration: "underline",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  maxWidth: "80%"
                }}
              >
                {file.fileName}
              </a>
              <button
                onClick={() => handleDelete(file._id)}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--text-muted)",
                  padding: "4px"
                }}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))
        ) : (
          <div style={{ textAlign: "center", padding: "10px", fontSize: "12px", color: "var(--text-muted)" }}>
            No files attached.
          </div>
        )}
      </div>

      {/* File Upload Box */}
      <div>
        <label
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
            border: "2px dashed var(--border-color)",
            borderRadius: "8px",
            cursor: "pointer",
            background: "var(--bg-card)",
            textAlign: "center"
          }}
        >
          {uploading ? (
            <>
              <Loader2 className="animate-spin" size={24} style={{ color: "var(--primary-color)" }} />
              <span style={{ fontSize: "11px", marginTop: "8px" }}>Uploading file...</span>
            </>
          ) : (
            <>
              <UploadCloud size={24} style={{ color: "var(--text-muted)" }} />
              <span style={{ fontSize: "11px", fontWeight: "600", marginTop: "6px" }}>Upload record file</span>
              <span style={{ fontSize: "9px", color: "var(--text-muted)" }}>PDF, CSV, Excel, Images, ZIP up to 15MB</span>
            </>
          )}
          <input
            type="file"
            onChange={handleFileUpload}
            style={{ display: "none" }}
            disabled={uploading}
          />
        </label>
      </div>
    </div>
  );
}
