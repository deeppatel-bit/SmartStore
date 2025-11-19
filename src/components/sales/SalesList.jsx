import React from "react";
import { Link } from "react-router-dom";

export default function SalesList({ sales = [], onDelete }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Sales</h2>
        <div>
          <Link to="/sales/add" className="px-4 py-2 bg-indigo-600 text-white rounded-lg">+ New Sale</Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3">Date</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Invoice</th>
              <th className="p-3">Total</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((s) => (
              <tr key={s.saleId} className="border-t">
                <td className="p-3">{new Date(s.date).toLocaleString()}</td>
                <td className="p-3">{s.customerName}</td>
                <td className="p-3">{s.saleId}</td>
                <td className="p-3">₹ {Number(s.total).toFixed(2)}</td>
                <td className="p-3">
                  <Link to={`/sales/edit/${s.saleId}`} className="mr-2 text-indigo-600">Edit</Link>
                  <button onClick={() => onDelete(s.saleId)} className="text-red-600">Delete</button>
                </td>
              </tr>
            ))}
            {!sales.length && <tr><td colSpan="5" className="p-4 text-center text-gray-500">No sales yet</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
