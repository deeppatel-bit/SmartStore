// ProductForm component file
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, Save } from "lucide-react";

export default function ProductForm({ onClose, onSave, initial }) {
  const navigate = useNavigate();
  const [form, setForm] = useState(
    initial || {
      name: "",
      category: "General",
      unit: "pcs",
      stock: 0,
      costPrice: 0,
      sellPrice: 0,
      reorder: 5,
    }
  );

  const isEdit = !!initial;

  const change = (key, val) => {
    setForm((s) => ({ ...s, [key]: val }));
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-xl font-semibold text-gray-900">
            {isEdit ? "Edit Product" : "Add New Product"}
          </h3>

          <button
            onClick={() => {
              if (onClose) onClose();
              else navigate("/products");
            }}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <label>
            <div className="text-sm font-medium text-gray-700">Product Name</div>
            <input
              value={form.name}
              onChange={(e) => change("name", e.target.value)}
              className="mt-1 w-full border px-3 py-2 rounded-lg"
              placeholder="e.g., Basmati Rice"
            />
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label>
              <div className="text-sm font-medium text-gray-700">Category</div>
              <input
                value={form.category}
                onChange={(e) => change("category", e.target.value)}
                className="mt-1 w-full border px-3 py-2 rounded-lg"
              />
            </label>

            <label>
              <div className="text-sm font-medium text-gray-700">Unit</div>
              <input
                value={form.unit}
                onChange={(e) => change("unit", e.target.value)}
                className="mt-1 w-full border px-3 py-2 rounded-lg"
                placeholder="pcs, kg, box"
              />
            </label>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <label>
              <div className="text-sm">Stock</div>
              <input
                type="number"
                value={form.stock}
                onChange={(e) => change("stock", Number(e.target.value))}
                className="mt-1 w-full border px-3 py-2 rounded-lg"
              />
            </label>

            <label>
              <div className="text-sm">Cost ₹</div>
              <input
                type="number"
                value={form.costPrice}
                onChange={(e) => change("costPrice", Number(e.target.value))}
                className="mt-1 w-full border px-3 py-2 rounded-lg"
              />
            </label>

            <label>
              <div className="text-sm">Sell ₹</div>
              <input
                type="number"
                value={form.sellPrice}
                onChange={(e) => change("sellPrice", Number(e.target.value))}
                className="mt-1 w-full border px-3 py-2 rounded-lg"
              />
            </label>
          </div>

          <label>
            <div className="text-sm font-medium text-gray-700">Reorder Point</div>
            <input
              type="number"
              value={form.reorder}
              onChange={(e) => change("reorder", Number(e.target.value))}
              className="mt-1 w-full border px-3 py-2 rounded-lg"
            />
          </label>
        </div>

        <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
          <button
            onClick={() => {
              if (onClose) onClose();
              else navigate("/products");
            }}
            className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              if (!form.name.trim()) {
                alert("Product name cannot be empty.");
                return;
              }
              if (!form.category.trim()) {
                alert("Category cannot be empty.");
                return;
              }
              if (onSave) onSave(form);
              navigate("/products");
            }}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg flex items-center gap-2 hover:bg-indigo-700"
          >
            <Save className="w-5 h-5" />
            {isEdit ? "Save Changes" : "Add Product"}
          </button>

        </div>
      </div>
    </div>
  );
}
