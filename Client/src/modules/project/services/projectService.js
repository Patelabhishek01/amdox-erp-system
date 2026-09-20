import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: `${API_URL}/api`,
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

// =========================
// Task APIs
// =========================

// Create task
export const createTask = async (data) => {
  const response = await api.post("/projects/tasks", data);
  return response.data;
};

// Update task
export const updateTask = async (id, data) => {
  const response = await api.put(`/projects/tasks/${id}`, data);
  return response.data;
};

// Delete task
export const deleteTask = async (id) => {
  const response = await api.delete(`/projects/tasks/${id}`);
  return response.data;
};