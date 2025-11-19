// ProductsPage component file
import React from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Edit, Trash2 } from "lucide-react";

export default function ProductsPage({ products, onDelete, search }) {
 const navigate = useNavigate();

 const filtered = products.filter((p) => {
  const name = p.name ? p.name.toLowerCase() : "";
  const category = p.category ? p.category.toLowerCase() : "";
  const s = search.toLowerCase();

  return name.includes(s) || category.includes(s);
});

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900">Product Inventory</h2>

        <button
          onClick={() => navigate('/products/new')}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center gap-2"
        >
          <Plus className="w-5" /> Add New Product
        </button>
      </div>

      <div className="bg-white rounded-xl shadow border overflow-hidden">
        <table className="w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left text-xs font-semibold">Name</th>
              <th className="p-3 text-left text-xs font-semibold">Category</th>
              <th className="p-3 text-left text-xs font-semibold">Stock</th>
              <th className="p-3 text-left text-xs font-semibold">Cost</th>
              <th className="p-3 text-left text-xs font-semibold">Sell</th>
              <th className="p-3 text-right text-xs font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {filtered.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="p-3">{p.name}</td>
                <td className="p-3 text-gray-500">{p.category}</td>

                <td className="p-3">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      p.stock <= p.reorder
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {p.stock} {p.unit}
                  </span>
                </td>

                <td className="p-3">₹ {p.costPrice}</td>
                <td className="p-3">₹ {p.sellPrice}</td>

                <td className="p-3 text-right flex gap-2 justify-end">
                  <button
                    onClick={() => navigate(`/products/edit/${p.id}`)}
                    className="p-1 rounded hover:bg-indigo-50 text-indigo-600"
                  >
                    <Edit className="w-4" />
                  </button>

                  <button
                    onClick={() => onDelete(p.id)}
                    className="p-1 rounded hover:bg-red-50 text-red-600"
                  >
                    <Trash2 className="w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!filtered.length && (
          <div className="p-4 text-center text-gray-500">No products found.</div>
        )}
      </div>
    </div>
  );
}
