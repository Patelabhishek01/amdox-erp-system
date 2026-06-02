import { useEffect, useState } from "react";

const ExpenseForm = ({
  initialData = {},
  onSubmit,
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "",
    date: "",
    notes: "",
  });

  // Pre-fill form when editing
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData({
        title: initialData.title || "",
        amount: initialData.amount || "",
        category: initialData.category || "",
        date: initialData.date
          ? new Date(initialData.date).toISOString().split("T")[0]
          : "",
        notes: initialData.notes || "",
      });
    }
  }, [initialData]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "amount" ? Number(value) : value,
    }));
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto bg-white shadow rounded-lg p-6 space-y-4"
    >
      {/* Title */}
      <div>
        <label className="block mb-1 font-medium">Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full border rounded px-3 py-2"
          placeholder="Expense title"
        />
      </div>

      {/* Amount */}
      <div>
        <label className="block mb-1 font-medium">Amount</label>
        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          required
          min="0"
          step="0.01"
          className="w-full border rounded px-3 py-2"
          placeholder="0.00"
        />
      </div>

      {/* Category */}
      <div>
        <label className="block mb-1 font-medium">Category</label>
        <input
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          className="w-full border rounded px-3 py-2"
          placeholder="Office, Travel, Utilities"
        />
      </div>

      {/* Date */}
      <div>
        <label className="block mb-1 font-medium">Date</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
          className="w-full border rounded px-3 py-2"
        />
      </div>

      {/* Notes */}
      <div>
        <label className="block mb-1 font-medium">Notes</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows="4"
          className="w-full border rounded px-3 py-2"
          placeholder="Optional notes"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded disabled:opacity-50"
      >
        {loading ? "Saving..." : "Save Expense"}
      </button>
    </form>
  );
};

export default ExpenseForm;