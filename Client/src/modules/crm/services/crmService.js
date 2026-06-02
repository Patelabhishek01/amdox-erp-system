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
// Lead APIs
// =========================

// Get all leads
export const getLeads = async (search = "") => {
  const response = await api.get(`/leads?search=${search}`);
  return response.data;
};

// Create lead
export const createLead = async (data) => {
  const response = await api.post("/leads", data);
  return response.data;
};

// Update lead
export const updateLead = async (id, data) => {
  const response = await api.put(`/leads/${id}`, data);
  return response.data;
};

// Delete lead
export const deleteLead = async (id) => {
  const response = await api.delete(`/leads/${id}`);
  return response.data;
};