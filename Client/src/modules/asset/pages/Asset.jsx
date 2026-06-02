import { useEffect, useState } from "react";

import AssetForm from "../components/AssetForm";
import AssetList from "../components/AssetList";

import {
  getAssets,
  createAsset,
  updateAsset,
  deleteAsset,
} from "../services/assetService";

import MainLayout from "../../../component/layouts/MainLayout";
import PageHeader from "../../../component/ui/PageHeader";

function Asset() {
  const [assets, setAssets] = useState([]);
  const [search, setSearch] = useState("");
  const [editingAsset, setEditingAsset] =
    useState(null);

  /* =========================
     Load Assets
  ========================= */
  const fetchAssets = async () => {
    try {
      const data = await getAssets(search);
      setAssets(data);
    } catch (error) {
      console.error("Error fetching assets:", error);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, [search]);

  /* =========================
     Create / Update Asset
  ========================= */
  const handleSubmit = async (formData) => {
    try {
      if (editingAsset) {
        await updateAsset(
          editingAsset._id,
          formData
        );
        setEditingAsset(null);
      } else {
        await createAsset(formData);
      }

      fetchAssets();
    } catch (error) {
      console.error("Error saving asset:", error);
    }
  };

  /* =========================
     Delete Asset
  ========================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this asset?"))
      return;

    try {
      await deleteAsset(id);
      fetchAssets();
    } catch (error) {
      console.error("Error deleting asset:", error);
    }
  };

  return (
    <MainLayout>
      <PageHeader
        title="Assets"
        subtitle="Manage company assets and assignments"
        actionText={
          editingAsset
            ? "Editing Asset"
            : "Add Asset"
        }
        onAction={() =>
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          })
        }
      />

      {/* Search */}
      <div className="card">
        <div className="card-header">
          <h3>Search Assets</h3>
        </div>

        <div className="card-body">
          <input
            type="text"
            placeholder="Search assets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input"
          />
        </div>
      </div>

      {/* Asset Form */}
      <div className="card">
        <div className="card-header">
          <h3>
            {editingAsset
              ? "Update Asset"
              : "Add New Asset"}
          </h3>
        </div>

        <div className="card-body">
          <AssetForm
            onSubmit={handleSubmit}
            editingAsset={editingAsset}
            onCancel={() =>
              setEditingAsset(null)
            }
          />
        </div>
      </div>

      {/* Asset List */}
      <div className="card">
        <div className="card-header">
          <h3>Asset Register</h3>
        </div>

        <div className="card-body">
          <AssetList
            assets={assets}
            onEdit={setEditingAsset}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </MainLayout>
  );
}

export default Asset;