export default function StatusBadge({ status = "Pending" }) {
  const normalizedStatus = status.toLowerCase().replace(/\s+/g, "-");

  return (
    <span className={`status-badge ${normalizedStatus}`}>
      {status}
    </span>
  );
}