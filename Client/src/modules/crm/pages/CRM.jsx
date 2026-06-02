import { useEffect, useState } from "react";

import LeadForm from "../components/LeadForm";
import LeadList from "../components/LeadList";

import {
  getLeads,
  createLead,
  updateLead,
  deleteLead,
} from "../services/crmService";

import MainLayout from "../../../component/layouts/MainLayout";
import PageHeader from "../../../component/ui/PageHeader";

function CRM() {
  const [leads, setLeads] = useState([]);
  const [search, setSearch] = useState("");
  const [editingLead, setEditingLead] = useState(null);

  /* =========================
     Load Leads
  ========================= */
  const fetchLeads = async () => {
    try {
      const data = await getLeads(search);
      setLeads(data);
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [search]);

  /* =========================
     Create / Update Lead
  ========================= */
  const handleSubmit = async (formData) => {
    try {
      if (editingLead) {
        await updateLead(editingLead._id, formData);
        setEditingLead(null);
      } else {
        await createLead(formData);
      }

      fetchLeads();
    } catch (error) {
      console.error("Error saving lead:", error);
    }
  };

  /* =========================
     Delete Lead
  ========================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this lead?")) return;

    try {
      await deleteLead(id);
      fetchLeads();
    } catch (error) {
      console.error("Error deleting lead:", error);
    }
  };

  return (
    <MainLayout>
      <PageHeader
        title="Leads & Opportunities"
        subtitle="Customer Relationship Management"
        actionText={editingLead ? "Editing Lead" : "Add Lead"}
        onAction={() =>
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          })
        }
      />

      {/* Search */}
      <div className="card">
        <div className="card-header">
          <h3>Search Leads</h3>
        </div>

        <div className="card-body">
          <input
            type="text"
            placeholder="Search leads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input"
          />
        </div>
      </div>

      {/* Lead Form */}
      <div className="card">
        <div className="card-header">
          <h3>
            {editingLead ? "Update Lead" : "Add New Lead"}
          </h3>
        </div>

        <div className="card-body">
          <LeadForm
            onSubmit={handleSubmit}
            editingLead={editingLead}
            onCancel={() => setEditingLead(null)}
          />
        </div>
      </div>

      {/* Lead List */}
      <div className="card">
        <div className="card-header">
          <h3>Lead Pipeline</h3>
        </div>

        <div className="card-body">
          <LeadList
            leads={leads}
            onEdit={setEditingLead}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </MainLayout>
  );
}

export default CRM;