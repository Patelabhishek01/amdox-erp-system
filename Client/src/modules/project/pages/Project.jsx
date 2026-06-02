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
  const [editingProject, setEditingProject] =
    useState(null);

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
        await updateProject(
          editingProject._id,
          formData
        );
        setEditingProject(null);
      } else {
        await createProject(formData);
      }

      fetchProjects();
    } catch (error) {
      console.error("Error saving project:", error);
    }
  };

  /* =========================
     Delete Project
  ========================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this project?"))
      return;

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
        actionText={
          editingProject
            ? "Editing Project"
            : "New Project"
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

      {/* Project Form */}
      <div className="card">
        <div className="card-header">
          <h3>
            {editingProject
              ? "Update Project"
              : "Create New Project"}
          </h3>
        </div>

        <div className="card-body">
          <ProjectForm
            onSubmit={handleSubmit}
            editingProject={editingProject}
            onCancel={() =>
              setEditingProject(null)
            }
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
            onEdit={setEditingProject}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </MainLayout>
  );
}

export default Project;