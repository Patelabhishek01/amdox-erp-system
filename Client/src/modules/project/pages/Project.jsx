import { useEffect, useState } from "react";

import ProjectForm from "../components/ProjectForm";
import ProjectList from "../components/ProjectList";

import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../services/projectService";

import MainLayout from "../../../component/layouts/MainLayout";
import PageHeader from "../../../component/ui/PageHeader";

function Project() {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [editingProject, setEditingProject] = useState(null);
  const [showForm, setShowForm] = useState(false);

  /* =========================
     Load Projects
  ========================= */
  const fetchProjects = async () => {
    try {
      const data = await getProjects(search);
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [search]);

  /* =========================
     Create / Update Project
  ========================= */
  const handleSubmit = async (formData) => {
    try {
      if (editingProject) {
        await updateProject(editingProject._id, formData);
        setEditingProject(null);
      } else {
        await createProject(formData);
      }
      setShowForm(false);
      fetchProjects();
    } catch (error) {
      console.error("Error saving project:", error);
    }
  };

  /* =========================
     Delete Project
  ========================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this project?")) return;

    try {
      await deleteProject(id);
      fetchProjects();
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  return (
    <MainLayout>
      <PageHeader
        title="Projects"
        subtitle="Manage projects, timelines, and deliverables"
        actionText={showForm ? "Hide Form" : (editingProject ? "Editing Project" : "New Project")}
        onAction={() => {
          if (showForm) {
            setEditingProject(null);
          }
          setShowForm(!showForm);
        }}
      />

      {/* Project Form */}
      {showForm && (
        <div className="card">
          <div className="card-header">
            <h3>
              {editingProject ? "Update Project" : "Create New Project"}
            </h3>
          </div>

          <div className="card-body">
            <ProjectForm
              onSubmit={handleSubmit}
              editingProject={editingProject}
              onCancel={() => {
                setEditingProject(null);
                setShowForm(false);
              }}
            />
          </div>
        </div>
      )}

      {/* Search */}
      <div className="card">
        <div className="card-header">
          <h3>Search Projects</h3>
        </div>

        <div className="card-body">
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input"
          />
        </div>
      </div>

      {/* Project List */}
      <div className="card">
        <div className="card-header">
          <h3>Project Portfolio</h3>
        </div>

        <div className="card-body">
          <ProjectList
            projects={projects}
            onEdit={(project) => {
              setEditingProject(project);
              setShowForm(true);
            }}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </MainLayout>
  );
}

export default Project;