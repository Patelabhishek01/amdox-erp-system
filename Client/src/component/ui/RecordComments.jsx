import { useState, useEffect, useCallback } from "react";
import { MessageSquare, Send, Loader2 } from "lucide-react";
import { apiRequest } from "../../utils/api";

export default function RecordComments({ recordId, module }) {
  const [comments, setComments] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchComments = useCallback(async () => {
    if (!recordId) return;
    try {
      const res = await apiRequest(`/api/records/${module}/${recordId}/comments`);
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      }
    } catch (err) {
      console.error("Fetch comments error:", err);
    } finally {
      setLoading(false);
    }
  }, [recordId, module]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || submitting) return;

    setSubmitting(true);
    try {
      const res = await apiRequest(`/api/records/${module}/${recordId}/comments`, {
        method: "POST",
        body: JSON.stringify({ content: input })
      });

      if (res.ok) {
        setInput("");
        fetchComments();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "16px" }}>
        <Loader2 className="animate-spin" size={20} />
      </div>
    );
  }

  return (
    <div style={{ marginTop: "16px", borderTop: "1px solid var(--border-color)", paddingTop: "16px" }}>
      <h4 style={{ display: "flex", alignItems: "center", gap: "8px", margin: "0 0 12px", fontSize: "14px" }}>
        <MessageSquare size={16} />
        Internal Comments & Notes ({comments.length})
      </h4>

      {/* Message List */}
      <div
        style={{
          maxHeight: "200px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          marginBottom: "12px",
          padding: "8px",
          background: "var(--bg-page)",
          borderRadius: "8px"
        }}
      >
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div
              key={comment._id}
              style={{
                background: "var(--bg-card)",
                padding: "8px 12px",
                borderRadius: "8px",
                border: "1px solid var(--border-color)"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                <span style={{ fontSize: "11px", fontWeight: "700" }}>{comment.userName}</span>
                <span style={{ fontSize: "9px", color: "var(--text-muted)" }}>
                  {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: "12px", color: "var(--text-main)", lineHeight: 1.4 }}>
                {comment.content}
              </p>
            </div>
          ))
        ) : (
          <div style={{ textAlign: "center", padding: "12px", fontSize: "12px", color: "var(--text-muted)" }}>
            No comments yet. Leave a note below.
          </div>
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} style={{ display: "flex", gap: "8px" }}>
        <input
          type="text"
          className="form-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Write a comment..."
          style={{ flex: 1, height: "36px", fontSize: "12px" }}
          disabled={submitting}
        />
        <button
          type="submit"
          className="btn btn-primary btn-sm"
          style={{ height: "36px", padding: "0 12px" }}
          disabled={submitting || !input.trim()}
        >
          {submitting ? <Loader2 className="animate-spin" size={14} /> : <Send size={14} />}
        </button>
      </form>
    </div>
  );
}
