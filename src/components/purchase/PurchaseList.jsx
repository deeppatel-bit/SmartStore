import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";

export default function PurchaseList({ purchases = [], onDelete }) {
  const [search, setSearch] = useState("");

  const filteredPurchases = purchases.filter((p) =>
    p.supplierName.toLowerCase().includes(search.toLowerCase()) ||
    (p.billNo || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Purchases History</h2>
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search supplier or bill..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>
          <Link to="/purchase/add" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors whitespace-nowrap">
            + Add Purchase
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 font-semibold border-b">
              <tr>
                <th className="p-4">Date</th>
                <th className="p-4">Supplier</th>
                <th className="p-4">Bill No</th>
                <th className="p-4 text-center">Items</th>
                <th className="p-4">Total</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPurchases.map((p) => (
                <tr key={p.purchaseId} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-gray-600">{new Date(p.date).toLocaleDateString()}</td>
                  <td className="p-4 font-medium text-gray-800">{p.supplierName}</td>
                  <td className="p-4 text-gray-600">{p.billNo || "-"}</td>
                  <td className="p-4 text-center">
                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">
                      {p.lines.length}
                    </span>
                  </td>
                  <td className="p-4 font-semibold text-gray-800">₹ {Number(p.total).toFixed(2)}</td>
                  <td className="p-4 text-right space-x-3">
                    <Link to={`/purchase/edit/${p.purchaseId}`} className="text-indigo-600 hover:text-indigo-800 font-medium text-sm">Edit</Link>
                    <button onClick={() => onDelete(p.purchaseId)} className="text-red-600 hover:text-red-800 font-medium text-sm">Delete</button>
                  </td>
                </tr>
              ))}
              {!filteredPurchases.length && (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500">
                    {search ? "No matching purchases found." : "No purchases recorded yet."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
