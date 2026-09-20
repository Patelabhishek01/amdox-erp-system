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
// Ticket APIs
// =========================

// Get all tickets
export const getTickets = async (search = "") => {
  const response = await api.get(`/tickets?search=${search}`);
  return response.data;
};

// Create ticket
export const createTicket = async (data) => {
  const response = await api.post("/tickets", data);
  return response.data;
};

// Update ticket
export const updateTicket = async (id, data) => {
  const response = await api.put(`/tickets/${id}`, data);
  return response.data;
};

// Delete ticket
export const deleteTicket = async (id) => {
  const response = await api.delete(`/tickets/${id}`);
  return response.data;
};