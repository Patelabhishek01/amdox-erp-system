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
// Asset APIs
// =========================

// Get all assets
export const getAssets = async (search = "") => {
  const response = await api.get(`/assets?search=${search}`);
  return response.data;
};

// Create asset
export const createAsset = async (data) => {
  const response = await api.post("/assets", data);
  return response.data;
};

// Update asset
export const updateAsset = async (id, data) => {
  const response = await api.put(`/assets/${id}`, data);
  return response.data;
};

// Delete asset
export const deleteAsset = async (id) => {
  const response = await api.delete(`/assets/${id}`);
  return response.data;
};