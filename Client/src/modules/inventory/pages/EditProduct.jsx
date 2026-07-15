import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";
import MainLayout from "../../../component/layouts/MainLayout";
import PageHeader from "../../../component/ui/PageHeader";
import ProductForm from "../components/ProductForm";
import {
  getProductById,
  updateProduct,
} from "../services/productService";

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

    const token = localStorage.getItem("token");

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
      <MainLayout>
        <div style={{ padding: "24px" }}>
          Loading...
        </div>
      </MainLayout>
    );
  }

  if (!product || !product._id) {
    return (
      <MainLayout>
        <div
          style={{
            padding: "24px",
            color: "red",
          }}
        >
          Product not found.
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <PageHeader
        title="Edit Product"
        subtitle={`Modify catalog details for SKU: ${product.sku}`}
        backUrl="/inventory/products"
      />

      <div style={{ marginTop: "24px" }}>
        <ProductForm
          initialData={product}
          onSubmit={handleUpdate}
          loading={loading}
        />
      </div>
    </MainLayout>
  );
};

export default EditProduct;