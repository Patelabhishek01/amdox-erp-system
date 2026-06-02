import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import MainLayout from "../../component/layouts/MainLayout";

import PageHeader from "../../component/ui/PageHeader";

import {
  getProducts,
  deleteProduct,
} from "../inventory/services/poductService";

export default function Product() {
  const navigate = useNavigate();

  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  // ─────────────────────────────────────────────
  // Fetch Products
  // ─────────────────────────────────────────────
  const fetchProducts = async () => {
    try {
      setLoading(true);

      const response =
        await getProducts();

      const data = response || [];

      setProducts(data);
    } catch (error) {
      console.error(
        "Error fetching products:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────────
  // Delete Product
  // ─────────────────────────────────────────────
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Delete this product?"
    );

    if (!confirmDelete) return;

    try {
      await deleteProduct(id);

      fetchProducts();
    } catch (error) {
      console.error(
        "Error deleting product:",
        error
      );
    }
  };

  // ─────────────────────────────────────────────
  // Load Products
  // ─────────────────────────────────────────────
  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <MainLayout>
      <PageHeader
        title="Products"
        subtitle="Manage product catalog and inventory stock"
        actionText="Add Product"
        onAction={() =>
          navigate("/inventory/products/add")
        }
      />

      {/* Product Table */}
      <div className="content-card">
        <h3
          style={{
            marginBottom: "20px",
          }}
        >
          Product Catalog
        </h3>

        {loading ? (
          <p>Loading products...</p>
        ) : products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <div
            style={{
              overflowX: "auto",
            }}
          >
            <table className="erp-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {products.map((product) => (
                  <tr key={product._id}>
                    <td>
                      {product.name}
                    </td>

                    <td>
                      {product.category}
                    </td>

                    <td>
                      ₹{product.price}
                    </td>

                    <td>
                      {product.stock}
                    </td>

                    <td>
                      <div
                        style={{
                          display: "flex",
                          gap: "10px",
                        }}
                      >
                        {/* Edit */}
                        <button
                          className="btn btn-secondary"
                          onClick={() =>
                            navigate(
                              `/inventory/products/edit/${product._id}`
                            )
                          }
                        >
                          Edit
                        </button>

                        {/* Delete */}
                        <button
                          className="btn btn-danger"
                          onClick={() =>
                            handleDelete(
                              product._id
                            )
                          }
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </MainLayout>
  );
}