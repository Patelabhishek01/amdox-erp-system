import axios from "axios";

const API = "http://localhost:5000/api/sales/orders";

// Auth Config
const getAuthConfig = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Get all sales orders
export const getSalesOrders = async () => {
  const res = await axios.get(API, getAuthConfig());
  return res.data;
};

// Create sales order
export const createSalesOrder = async (data) => {
  const res = await axios.post(API, data, getAuthConfig());
  return res.data;
};

// Update sales order (e.g. mark Paid)
export const updateSalesOrder = async (id, data) => {
  const res = await axios.put(`${API}/${id}`, data, getAuthConfig());
  return res.data;
};
