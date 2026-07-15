import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../component/layouts/MainLayout";
import PageHeader from "../../component/ui/PageHeader";
import ExportActions from "../../component/ui/ExportActions";
import RecordComments from "../../component/ui/RecordComments";
import RecordAttachments from "../../component/ui/RecordAttachments";
import RecordTimeline from "../../component/ui/RecordTimeline";
import { TableSkeleton } from "../../component/ui/SkeletonLoader";
import { MessageSquare, X } from "lucide-react";
import { getProducts, deleteProduct } from "../inventory/services/productService";

export default function Product() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Fetch Products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await getProducts();
      const data = response || [];
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  // Delete Product
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this product?");
    if (!confirmDelete) return;

    try {
      await deleteProduct(id);
      if (selectedRecord && selectedRecord._id === id) {
        setSelectedRecord(null);
      }
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter & Search logic
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                          p.sku.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !filterCategory || p.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(products.map(p => p.category)));

  const columns = [
    { key: "sku", label: "SKU" },
    { key: "name", label: "Product Name" },
    { key: "category", label: "Category" },
    { key: "price", label: "Price ($)" },
    { key: "quantity", label: "Quantity" }
  ];

  return (
    <MainLayout>
      <PageHeader
        title="Products"
        subtitle="Manage inventory records, check stock thresholds, catalog specifications, and generate reports."
        actionText="Add Product"
        onAction={() => navigate("/inventory/products/add")}
      />

      {/* Export & Search Controls */}
      {products.length > 0 && (
        <ExportActions
          data={filteredProducts.map(p => ({
            ...p,
            price: `$${p.price}`,
            quantity: p.quantity !== undefined ? p.quantity : p.stock
          }))}
          columns={columns}
          filename="amdox-inventory-catalog-report"
        />
      )}

      {/* Advanced Filters */}
      <div className="card">
        <div className="card-header">
          <h3>Advanced Filters</h3>
        </div>
        <div className="card-body" style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          <input
            type="text"
            className="form-input"
            placeholder="Search by SKU or name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1, minWidth: "220px" }}
          />

          <select
            className="form-input"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            style={{ width: "200px" }}
          >
            <option value="">All Categories</option>
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Split layout containing list and side collaboration panel */}
      <div style={{ display: "flex", gap: "24px", flexDirection: "row", flexWrap: "wrap" }}>
        
        {/* Table list */}
        <div className="card" style={{ flex: selectedRecord ? "2 1 600px" : "1 1 100%", overflow: "hidden" }}>
          <div className="card-header">
            <h3>Product Catalog</h3>
          </div>

          <div className="table-responsive">
            {loading ? (
              <TableSkeleton rows={5} cols={6} />
            ) : filteredProducts.length === 0 ? (
              <div className="empty-state">No products found matching filters.</div>
            ) : (
              <table className="erp-table">
                <thead>
                  <tr>
                    <th>SKU</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock Quantity</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredProducts.map((product) => {
                    const isActive = selectedRecord?._id === product._id;
                    const stock = product.quantity !== undefined ? product.quantity : product.stock;
                    const isLowStock = stock <= (product.reorderLevel || 10);

                    return (
                      <tr key={product._id} style={{ background: isActive ? "var(--primary-light)" : "transparent" }}>
                        <td style={{ fontWeight: "700" }}>{product.sku}</td>
                        <td>{product.name}</td>
                        <td>{product.category}</td>
                        <td>${product.price}</td>
                        <td>
                          <span
                            style={{
                              fontWeight: "600",
                              color: isLowStock ? "#dc2626" : "inherit",
                              background: isLowStock ? "#fee2e2" : "transparent",
                              padding: isLowStock ? "2px 8px" : "0",
                              borderRadius: "4px"
                            }}
                          >
                            {stock} {isLowStock && "⚠️ (Low)"}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="btn btn-sm btn-secondary"
                              onClick={() => setSelectedRecord(product)}
                              style={{ display: "inline-flex", gap: "4px", alignItems: "center" }}
                            >
                              <MessageSquare size={12} />
                              Notes
                            </button>

                            <button
                              className="btn btn-sm btn-secondary"
                              onClick={() => navigate(`/inventory/products/edit/${product._id}`)}
                            >
                              Edit
                            </button>

                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDelete(product._id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Dynamic Sidebar panel */}
        {selectedRecord && (
          <div className="card glass-effect" style={{ flex: "1 1 320px", padding: "20px", height: "fit-content", position: "sticky", top: "100px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ margin: 0, fontSize: "16px" }}>Record: {selectedRecord.name}</h3>
              <button
                onClick={() => setSelectedRecord(null)}
                style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--text-muted)", display: "flex" }}
              >
                <X size={16} />
              </button>
            </div>
            
            <RecordAttachments recordId={selectedRecord._id} module="inventory" />
            <RecordComments recordId={selectedRecord._id} module="inventory" />
            <RecordTimeline recordId={selectedRecord._id} module="inventory" />
          </div>
        )}

      </div>
    </MainLayout>
  );
}