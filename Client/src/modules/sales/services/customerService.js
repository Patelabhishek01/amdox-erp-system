import axios from "axios";

const API =
  "http://localhost:5000/api/customers";

// Auth Config
const getAuthConfig = () => {
  const token =
    localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Get all customers
export const getCustomers = async () => {
  const res = await axios.get(
    API,
    getAuthConfig()
  );

  return res.data;
};

// Get single customer
export const getCustomerById = async (
  id
) => {
  const res = await axios.get(
    `${API}/${id}`,
    getAuthConfig()
  );

  return res.data;
};

// Create customer
export const createCustomer = async (
  data
) => {
  const res = await axios.post(
    API,
    data,
    getAuthConfig()
  );

  return res.data;
};

// Update customer
export const updateCustomer = async (
  id,
  data
) => {
  const res = await axios.put(
    `${API}/${id}`,
    data,
    getAuthConfig()
  );

  return res.data;
};

// Delete customer
export const deleteCustomer = async (
  id
) => {
  const res = await axios.delete(
    `${API}/${id}`,
    getAuthConfig()
  );

  return res.data;
};