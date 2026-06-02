import { useEffect, useState } from "react";

import CandidateForm from "../components/CandidateForm";
import CandidateList from "../components/CandidateList";

import {
  getCandidates,
  createCandidate,
  updateCandidate,
  deleteCandidate,
} from "../services/recruitmentService";

import MainLayout from "../../../component/layouts/MainLayout";
import PageHeader from "../../../component/ui/PageHeader";

function Recruitment() {
  const [candidates, setCandidates] = useState([]);
  const [search, setSearch] = useState("");
  const [editingCandidate, setEditingCandidate] =
    useState(null);

  /* =========================
     Load Candidates
  ========================= */
  const fetchCandidates = async () => {
    try {
      const data = await getCandidates(search);
      setCandidates(data);
    } catch (error) {
      console.error("Error fetching candidates:", error);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, [search]);

  /* =========================
     Create / Update Candidate
  ========================= */
  const handleSubmit = async (formData) => {
    try {
      if (editingCandidate) {
        await updateCandidate(
          editingCandidate._id,
          formData
        );
        setEditingCandidate(null);
      } else {
        await createCandidate(formData);
      }

      fetchCandidates();
    } catch (error) {
      console.error(
        "Error saving candidate:",
        error
      );
    }
  };

  /* =========================
     Delete Candidate
  ========================= */
  const handleDelete = async (id) => {
    if (
      !window.confirm("Delete this candidate?")
    )
      return;

    try {
      await deleteCandidate(id);
      fetchCandidates();
    } catch (error) {
      console.error(
        "Error deleting candidate:",
        error
      );
    }
  };

  return (
    <MainLayout>
      <PageHeader
        title="Candidates"
        subtitle="Manage applicants and hiring pipeline"
        actionText={
          editingCandidate
            ? "Editing Candidate"
            : "Add Candidate"
        }
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
          <h3>Search Candidates</h3>
        </div>

        <div className="card-body">
          <input
            type="text"
            placeholder="Search candidates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input"
          />
        </div>
      </div>

      {/* Candidate Form */}
      <div className="card">
        <div className="card-header">
          <h3>
            {editingCandidate
              ? "Update Candidate"
              : "Add New Candidate"}
          </h3>
        </div>

        <div className="card-body">
          <CandidateForm
            onSubmit={handleSubmit}
            editingCandidate={
              editingCandidate
            }
            onCancel={() =>
              setEditingCandidate(null)
            }
          />
        </div>
      </div>

      {/* Candidate List */}
      <div className="card">
        <div className="card-header">
          <h3>Candidate Pipeline</h3>
        </div>

        <div className="card-body">
          <CandidateList
            candidates={candidates}
            onEdit={setEditingCandidate}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </MainLayout>
  );
}

export default Recruitment;