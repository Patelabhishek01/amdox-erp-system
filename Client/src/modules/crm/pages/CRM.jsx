import { useEffect, useState } from "react";

import LeadForm from "../components/LeadForm";
import LeadList from "../components/LeadList";

import {
  getLeads,
  createLead,
  updateLead,
  deleteLead,
} from "../services/crmService";
import { createCustomer } from "../../sales/services/customerService";

import MainLayout from "../../../component/layouts/MainLayout";
import PageHeader from "../../../component/ui/PageHeader";

function CRM() {
  const [leads, setLeads] = useState([]);
  const [search, setSearch] = useState("");
  const [editingLead, setEditingLead] = useState(null);
  const [showForm, setShowForm] = useState(false);

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
      const isWon = formData.stage === "Won" || formData.status === "Won";
      const wasNotWon = !editingLead || (editingLead.stage !== "Won" && editingLead.status !== "Won");

      if (editingLead) {
        await updateLead(editingLead._id, formData);
        setEditingLead(null);
      } else {
        await createLead(formData);
      }

      if (isWon && wasNotWon) {
        try {
          await createCustomer({
            name: formData.name || formData.contactPerson || "Unknown",
            email: formData.email || `won-lead-${Date.now()}@example.com`,
            phone: formData.phone || "000-000-0000",
            company: formData.company || formData.companyName || "N/A",
            address: "Converted from Won Lead"
          });
          console.log("Customer profile automatically created for won lead.");
        } catch (custError) {
          console.error("Failed to automatically create Customer Profile:", custError);
        }
      }

      setShowForm(false);
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
        actionText={showForm ? "Hide Form" : (editingLead ? "Editing Lead" : "Add Lead")}
        onAction={() => {
          if (showForm) {
            setEditingLead(null);
          }
          setShowForm(!showForm);
        }}
      />

      {/* Lead Form */}
      {showForm && (
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
              onCancel={() => {
                setEditingLead(null);
                setShowForm(false);
              }}
            />
          </div>
        </div>
      )}

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

      {/* Lead List */}
      <div className="card">
        <div className="card-header">
          <h3>Lead Pipeline</h3>
        </div>

        <div className="card-body">
          <LeadList
            leads={leads}
            onEdit={(lead) => {
              setEditingLead(lead);
              setShowForm(true);
            }}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </MainLayout>
  );
}

export default CRM;