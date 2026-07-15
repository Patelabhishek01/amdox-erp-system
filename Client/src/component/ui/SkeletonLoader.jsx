import React from "react";

// Table Rows skeleton
export function TableSkeleton({ rows = 5, cols = 5 }) {
  return (
    <div style={{ width: "100%" }}>
      {/* Header skeleton */}
      <div
        style={{
          display: "flex",
          borderBottom: "2px solid var(--border-color)",
          padding: "14px 16px",
          gap: "16px"
        }}
      >
        {Array.from({ length: cols }).map((_, idx) => (
          <div
            key={idx}
            className="skeleton-box"
            style={{ height: "16px", flex: 1 }}
          />
        ))}
      </div>
      
      {/* Row skeletons */}
      {Array.from({ length: rows }).map((_, rIdx) => (
        <div
          key={rIdx}
          style={{
            display: "flex",
            borderBottom: "1px solid var(--border-color)",
            padding: "16px",
            gap: "16px"
          }}
        >
          {Array.from({ length: cols }).map((_, cIdx) => (
            <div
              key={cIdx}
              className="skeleton-box"
              style={{
                height: "14px",
                flex: 1,
                borderRadius: "4px"
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

// KPI Grid card skeleton
export function CardSkeleton() {
  return (
    <div className="card" style={{ padding: "24px", minHeight: "150px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
        <div className="skeleton-box" style={{ width: "60%", height: "14px" }} />
        <div className="skeleton-box" style={{ width: "40px", height: "40px", borderRadius: "10px" }} />
      </div>
      <div className="skeleton-box" style={{ width: "40%", height: "24px", marginBottom: "12px" }} />
      <div className="skeleton-box" style={{ width: "70%", height: "12px" }} />
    </div>
  );
}

// Full page loader skeleton
export default function SkeletonLoader({ type = "table" }) {
  if (type === "card") {
    return (
      <div className="kpi-grid">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  return (
    <div className="card" style={{ padding: "16px" }}>
      <TableSkeleton />
    </div>
  );
}
