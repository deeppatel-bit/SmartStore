import React from "react";
import { Link } from "react-router-dom";

export default function PurchaseList({ purchases = [], onDelete }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Purchases</h2>
        <div className="flex gap-2">
          <Link to="/purchase/add" className="px-4 py-2 bg-emerald-600 text-white rounded-lg">+ Add Purchase</Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3">Date</th>
              <th className="p-3">Supplier</th>
              <th className="p-3">Bill No</th>
              <th className="p-3">Total</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {purchases.map((p) => (
              <tr key={p.purchaseId} className="border-t">
                <td className="p-3">{new Date(p.date).toLocaleString()}</td>
                <td className="p-3">{p.supplierName}</td>
                <td className="p-3">{p.billNo}</td>
                <td className="p-3">₹ {Number(p.total).toFixed(2)}</td>
                <td className="p-3">
                  <Link to={`/purchase/edit/${p.purchaseId}`} className="mr-2 text-indigo-600">Edit</Link>
                  <button onClick={() => onDelete(p.purchaseId)} className="text-red-600">Delete</button>
                </td>
              </tr>
            ))}
            {!purchases.length && <tr><td colSpan="5" className="p-4 text-center text-gray-500">No purchases yet</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
