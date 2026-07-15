import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../../component/layouts/MainLayout";
import PageHeader from "../../../component/ui/PageHeader";
import ProductForm from "../components/ProductForm";
import { createProduct } from "../services/productService";

const AddProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleCreate = async (formData) => {
    try {
      setLoading(true);
      await createProduct(formData);
      navigate("/inventory/products");
    } catch (error) {
      console.error("Error creating product:", error);
      alert("Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <PageHeader
        title="Add Product"
        subtitle="Catalog a new product into the inventory system."
        backUrl="/inventory/products"
      />

      <div style={{ marginTop: "24px" }}>
        <ProductForm
          onSubmit={handleCreate}
          loading={loading}
        />
      </div>
    </MainLayout>
  );
};

export default AddProduct;