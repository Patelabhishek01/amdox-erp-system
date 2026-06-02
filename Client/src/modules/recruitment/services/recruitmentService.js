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
// Candidate APIs
// =========================

// Get all candidates
export const getCandidates = async (search = "") => {
  const response = await api.get(`/candidates?search=${search}`);
  return response.data;
};

// Create candidate
export const createCandidate = async (data) => {
  const response = await api.post("/candidates", data);
  return response.data;
};

// Update candidate
export const updateCandidate = async (id, data) => {
  const response = await api.put(`/candidates/${id}`, data);
  return response.data;
};

// Delete candidate
export const deleteCandidate = async (id) => {
  const response = await api.delete(`/candidates/${id}`);
  return response.data;
};