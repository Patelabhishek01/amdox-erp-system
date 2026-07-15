import { FileText, Download } from "lucide-react";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function ExportActions({ data = [], columns = [], filename = "report" }) {
  
  // ─── Export to CSV ───
  const exportToCSV = () => {
    if (data.length === 0) {
      alert("No data available to export");
      return;
    }

    const headers = columns.map(col => col.label).join(",");
    const rows = data.map(item => 
      columns.map(col => {
        let val = item[col.key];
        if (val === null || val === undefined) val = "";
        // Clean values of quotes and commas
        val = val.toString().replace(/"/g, '""');
        return `"${val}"`;
      }).join(",")
    );

    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  // ─── Export to PDF ───
  const exportToPDF = () => {
    if (data.length === 0) {
      alert("No data available to export");
      return;
    }

    const doc = new jsPDF();
    
    // Set corporate title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("AMDOX ERP ENTERPRISE REPORT", 14, 20);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 26);
    doc.text(`Document: ${filename.toUpperCase()}`, 14, 32);

    // Prepare table headers and rows
    const tableHeaders = columns.map(col => col.label);
    const tableRows = data.map(item => 
      columns.map(col => {
        const val = item[col.key];
        return val !== undefined && val !== null ? val.toString() : "";
      })
    );

    // Render table
    doc.autoTable({
      head: [tableHeaders],
      body: tableRows,
      startY: 38,
      theme: "striped",
      styles: { fontSize: 9 },
      headStyles: { fillColor: [15, 76, 129] } // Sapphire Blue Corporate color
    });

    doc.save(`${filename}.pdf`);
  };

  return (
    <div style={{ display: "flex", gap: "10px", margin: "16px 0" }}>
      <button
        onClick={exportToCSV}
        className="btn btn-secondary btn-sm"
        style={{ display: "inline-flex", gap: "6px", alignItems: "center" }}
      >
        <Download size={14} />
        Export CSV
      </button>

      <button
        onClick={exportToPDF}
        className="btn btn-secondary btn-sm"
        style={{ display: "inline-flex", gap: "6px", alignItems: "center" }}
      >
        <FileText size={14} />
        Export PDF Report
      </button>
    </div>
  );
}
