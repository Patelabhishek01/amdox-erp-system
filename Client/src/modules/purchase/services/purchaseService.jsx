import axios from "axios";

const API = "http://localhost:5000/api";

// Create axios instance with JWT token
const api = axios.create({
  baseURL: API,
});

// Attach token from localStorage to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

//
// =========================
// Vendor APIs
// =========================
//

// Get all vendors
export const getVendors = async (search = "") => {
  const response = await api.get(`/vendors?search=${search}`);
  return response.data;
};

// Create vendor
export const createVendor = async (data) => {
  const response = await api.post("/vendors", data);
  return response.data;
};

// Update vendor
export const updateVendor = async (id, data) => {
  const response = await api.put(`/vendors/${id}`, data);
  return response.data;
};

// Delete vendor
export const deleteVendor = async (id) => {
  const response = await api.delete(`/vendors/${id}`);
  return response.data;
};

//
// =========================
// Purchase Order APIs
// =========================
//

// Get all purchase orders
export const getPurchaseOrders = async (search = "") => {
  const response = await api.get(`/purchase-orders?search=${search}`);
  return response.data;
};

// Create purchase order
export const createPurchaseOrder = async (data) => {
  const response = await api.post("/purchase-orders", data);
  return response.data;
};

// Update purchase order
export const updatePurchaseOrder = async (id, data) => {
  const response = await api.put(`/purchase-orders/${id}`, data);
  return response.data;
};

// Delete purchase order
export const deletePurchaseOrder = async (id) => {
  const response = await api.delete(`/purchase-orders/${id}`);
  return response.data;
};