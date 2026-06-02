import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Attach JWT token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// =========================
// Project APIs
// =========================

// Get all projects
export const getProjects = async (search = "") => {
  const response = await api.get(`/projects?search=${search}`);
  return response.data;
};

// Create project
export const createProject = async (data) => {
  const response = await api.post("/projects", data);
  return response.data;
};

// Update project
export const updateProject = async (id, data) => {
  const response = await api.put(`/projects/${id}`, data);
  return response.data;
};

// Delete project
export const deleteProject = async (id) => {
  const response = await api.delete(`/projects/${id}`);
  return response.data;
};