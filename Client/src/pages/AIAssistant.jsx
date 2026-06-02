import MainLayout from "../component/layouts/MainLayout";
import PageHeader from "../component/ui/PageHeader";

export default function AIAssistant() {
  return (
    <MainLayout>
      <PageHeader
        title="AI Assistant"
        subtitle="Your intelligent ERP assistant for automation and insights."
      />

      <div className="content-card">
        <div
          style={{
            minHeight: "400px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "40px",
          }}
        >
          <div style={{ fontSize: "64px", marginBottom: "20px" }}>
            🤖
          </div>

          <h2 style={{ marginBottom: "12px" }}>
            AI Assistant Coming Soon
          </h2>

          <p
            style={{
              maxWidth: "600px",
              color: "#6b7280",
              lineHeight: "1.7",
            }}
          >
            This module will provide intelligent analytics,
            chatbot support, automated report generation,
            and business recommendations across your ERP
            system.
          </p>
        </div>
      </div>
    </MainLayout>
  );
}