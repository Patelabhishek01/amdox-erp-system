import { FaPlus, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function PageHeader({
  title,
  subtitle,
  actionText,
  onAction,
  backText = "Back",
  onBack,
  backUrl,
}) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (backUrl) {
      navigate(backUrl);
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div>
        <h2 className="section-title">{title}</h2>
        {subtitle && (
          <p className="section-subtitle">{subtitle}</p>
        )}
      </div>

      <div style={{ display: "flex", gap: "10px" }}>
        {(onBack || backUrl) && (
          <button className="btn btn-secondary" onClick={handleBack} style={{ display: "inline-flex", gap: "6px", alignItems: "center" }}>
            <FaArrowLeft />
            <span>{backText}</span>
          </button>
        )}

        {actionText && (
          <button className="btn btn-primary" onClick={onAction} style={{ display: "inline-flex", gap: "6px", alignItems: "center" }}>
            <FaPlus />
            <span>{actionText}</span>
          </button>
        )}
      </div>
    </div>
  );
}