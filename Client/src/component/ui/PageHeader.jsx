import { FaPlus } from "react-icons/fa";

export default function PageHeader({
  title,
  subtitle,
  actionText,
  onAction,
}) {
  return (
    <div className="page-header">
      <div>
        <h2 className="section-title">{title}</h2>
        {subtitle && (
          <p className="section-subtitle">{subtitle}</p>
        )}
      </div>

      {actionText && (
        <button className="btn btn-primary" onClick={onAction}>
          <FaPlus />
          <span>{actionText}</span>
        </button>
      )}
    </div>
  );
}