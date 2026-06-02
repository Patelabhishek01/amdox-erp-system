import axios from "axios";

const API =
  "http://localhost:5000/api/products";

// Auth config
const getAuthConfig = () => {
  const token =
    localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Get all products
export const getProducts = async () => {
  const res = await axios.get(
    API,
    getAuthConfig()
  );

  return res.data;
};

// Get single product
export const getProductById = async (
  id
) => {
  const res = await axios.get(
    `${API}/${id}`,
    getAuthConfig()
  );

  return res.data;
};

// Create product
export const createProduct = async (
  data
) => {
  const res = await axios.post(
    API,
    data,
    getAuthConfig()
  );

  return res.data;
};

// Update product
export const updateProduct = async (
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

// Delete product
export const deleteProduct = async (
  id
) => {
  const res = await axios.delete(
    `${API}/${id}`,
    getAuthConfig()
  );

  return res.data;
};