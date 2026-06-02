import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";
import ProductForm from "../components/ProductForm";
import {
  getProductById,
  updateProduct,
} from "../services/poductService";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response =
          await getProductById(id);

        const productData =
          response.data || response || null;

        setProduct(productData);
      } catch (error) {
        console.error(
          "Error fetching product:",
          error
        );
        setProduct(null);
      } finally {
        setFetching(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleUpdate = async (formData) => {
    try {
      setLoading(true);
      await updateProduct(id, formData);
      navigate("/inventory/products");
    } catch (error) {
      console.error(
        "Error updating product:",
        error
      );
      alert("Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div style={{ padding: "24px" }}>
        Loading...
      </div>
    );
  }

  if (!product || !product._id) {
    return (
      <div
        style={{
          padding: "24px",
          color: "red",
        }}
      >
        Product not found.
      </div>
    );
  }

  return (
    <div style={{ padding: "24px" }}>
      <h1
        style={{
          fontSize: "32px",
          fontWeight: "bold",
          marginBottom: "24px",
        }}
      >
        Edit Product
      </h1>

      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={() =>
            navigate("/inventory/products")
          }
          style={{
            backgroundColor: "#6b7280",
            color: "#ffffff",
            border: "none",
            padding: "8px 14px",
            borderRadius: "6px",
            cursor: "pointer",
            marginBottom: "20px",
          }}
        >
          ⬅ Back
        </button>
      </div>

      <ProductForm
        initialData={product}
        onSubmit={handleUpdate}
        loading={loading}
      />
    </div>
  );
};

export default EditProduct;