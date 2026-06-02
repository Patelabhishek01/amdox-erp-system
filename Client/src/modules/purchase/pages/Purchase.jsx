import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import VendorForm from "../components/VendorForm";
import VendorList from "../components/VendorList";
import PurchaseOrderForm from "../components/PurchaseOrderForm";
import PurchaseOrderList from "../components/PurchaseOrderList";

import {
  getVendors,
  createVendor,
  updateVendor,
  deleteVendor,
  getPurchaseOrders,
  createPurchaseOrder,
  updatePurchaseOrder,
  deletePurchaseOrder,
} from "../services/purchaseService";

import MainLayout from "../../../component/layouts/MainLayout";
import PageHeader from "../../../component/ui/PageHeader";

function Purchase() {
  const [vendors, setVendors] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);

  const [vendorSearch, setVendorSearch] = useState("");
  const [orderSearch, setOrderSearch] = useState("");

  const [editingVendor, setEditingVendor] = useState(null);
  const [editingPurchaseOrder, setEditingPurchaseOrder] =
    useState(null);

  const navigate = useNavigate();

  /* =========================
     Load Vendors
  ========================= */
  const fetchVendors = async () => {
    try {
      const data = await getVendors(vendorSearch);
      setVendors(data);
    } catch (error) {
      console.error("Error fetching vendors:", error);
    }
  };

  /* =========================
     Load Purchase Orders
  ========================= */
  const fetchPurchaseOrders = async () => {
    try {
      const data = await getPurchaseOrders(orderSearch);
      setPurchaseOrders(data);
    } catch (error) {
      console.error(
        "Error fetching purchase orders:",
        error
      );
    }
  };

  useEffect(() => {
    fetchVendors();
  }, [vendorSearch]);

  useEffect(() => {
    fetchPurchaseOrders();
  }, [orderSearch]);

  /* =========================
     Vendor CRUD
  ========================= */
  const handleVendorSubmit = async (formData) => {
    try {
      if (editingVendor) {
        await updateVendor(
          editingVendor._id,
          formData
        );
        setEditingVendor(null);
      } else {
        await createVendor(formData);
      }

      fetchVendors();
    } catch (error) {
      console.error("Error saving vendor:", error);
    }
  };

  const handleVendorDelete = async (id) => {
    if (!window.confirm("Delete this vendor?")) return;

    try {
      await deleteVendor(id);
      fetchVendors();
    } catch (error) {
      console.error("Error deleting vendor:", error);
    }
  };

  /* =========================
     Purchase Order CRUD
  ========================= */
  const handlePurchaseOrderSubmit = async (
    formData
  ) => {
    try {
      if (editingPurchaseOrder) {
        await updatePurchaseOrder(
          editingPurchaseOrder._id,
          formData
        );
        setEditingPurchaseOrder(null);
      } else {
        await createPurchaseOrder(formData);
      }

      fetchPurchaseOrders();
    } catch (error) {
      console.error(
        "Error saving purchase order:",
        error
      );
    }
  };

  const handlePurchaseOrderDelete = async (id) => {
    if (
      !window.confirm(
        "Delete this purchase order?"
      )
    )
      return;

    try {
      await deletePurchaseOrder(id);
      fetchPurchaseOrders();
    } catch (error) {
      console.error(
        "Error deleting purchase order:",
        error
      );
    }
  };

  return (
    <MainLayout>
      <PageHeader
        title="Purchase Orders"
        subtitle="Manage vendors and procurement orders"
        actionText="Create Purchase"
        onAction={() =>
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          })
        }
      />

      {/* =========================
          Vendor Management
      ========================= */}
      <div className="content-card">
        <div className="card-header">
          <h3>Vendor Management</h3>
        </div>

        <div className="card-body">
          {/* Search Vendors */}
          <input
            type="text"
            placeholder="Search vendors..."
            value={vendorSearch}
            onChange={(e) =>
              setVendorSearch(e.target.value)
            }
            className="form-input"
            style={{ marginBottom: "20px" }}
          />

          {/* Vendor Form */}
          <VendorForm
            onSubmit={handleVendorSubmit}
            editingVendor={editingVendor}
            onCancel={() =>
              setEditingVendor(null)
            }
          />

          {/* Vendor List */}
          <div style={{ marginTop: "24px" }}>
            <VendorList
              vendors={vendors}
              onEdit={setEditingVendor}
              onDelete={handleVendorDelete}
            />
          </div>
        </div>
      </div>

      {/* =========================
          Purchase Orders
      ========================= */}
      <div className="card">
        <div className="card-header">
          <h3>Purchase Orders</h3>
        </div>

        <div className="card-body">
          {/* Search Orders */}
          <input
            type="text"
            placeholder="Search purchase orders..."
            value={orderSearch}
            onChange={(e) =>
              setOrderSearch(e.target.value)
            }
            className="form-input"
            style={{ marginBottom: "20px" }}
          />

          {/* Purchase Order Form */}
          <PurchaseOrderForm
            vendors={vendors}
            onSubmit={
              handlePurchaseOrderSubmit
            }
            editingPurchaseOrder={
              editingPurchaseOrder
            }
            onCancel={() =>
              setEditingPurchaseOrder(null)
            }
          />

          {/* Purchase Order List */}
          <div style={{ marginTop: "24px" }}>
            <PurchaseOrderList
              purchaseOrders={purchaseOrders}
              onEdit={
                setEditingPurchaseOrder
              }
              onDelete={
                handlePurchaseOrderDelete
              }
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default Purchase;