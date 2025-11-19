import React from "react";
import StatCard from "../StatCard";
import { DollarSign, Package, AlertTriangle } from "lucide-react";

/**
 Props:
  - products
  - purchases
  - sales
**/

export default function Dashboard({ products = [], purchases = [], sales = [] }) {
  const todayISO = new Date().toISOString().slice(0, 10);

  // Today's sales total (from sales array) - check by date substring
  const todaysSales = sales
    .filter((s) => (s.date || "").slice(0, 10) === todayISO)
    .reduce((sum, s) => sum + (Number(s.total) || 0), 0);

  const totalProducts = products.length;
  const lowStock = products.filter((p) => p.stock <= (p.reorder || 5));

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Sales Today" value={`₹ ${todaysSales.toFixed(2)}`} icon={DollarSign} color="indigo" />
        <StatCard title="Total Products" value={totalProducts} icon={Package} color="green" />
        <StatCard title="Low Stock Alerts" value={lowStock.length} sub={lowStock.length ? lowStock.map((p) => p.name).join(", ") : "All good!"} icon={AlertTriangle} color={lowStock.length ? "red" : "green"} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h3 className="text-xl font-semibold mb-4 border-b pb-2 text-gray-800">Recent Activity</h3>

          <div className="space-y-4">
            <div>
              <div className="font-semibold text-gray-800">Recent Purchases</div>
              <ul className="mt-2 divide-y">
                {purchases.slice(0, 6).map((p) => (
                  <li key={p.purchaseId} className="py-2 flex justify-between">
                    <div>
                      <div className="font-medium">{p.purchaseId} • {p.supplierName}</div>
                      <div className="text-xs text-gray-500">{new Date(p.date).toLocaleString()}</div>
                    </div>
                    <div className="font-semibold">₹ {Number(p.total).toFixed(2)}</div>
                  </li>
                ))}
                {!purchases.length && <li className="py-2 text-gray-500">No purchases yet.</li>}
              </ul>
            </div>

            <div>
              <div className="font-semibold text-gray-800">Recent Sales</div>
              <ul className="mt-2 divide-y">
                {sales.slice(0, 6).map((s) => (
                  <li key={s.saleId} className="py-2 flex justify-between">
                    <div>
                      <div className="font-medium">{s.saleId} • {s.customerName}</div>
                      <div className="text-xs text-gray-500">{new Date(s.date).toLocaleString()}</div>
                    </div>
                    <div className="font-semibold">₹ {Number(s.total).toFixed(2)}</div>
                  </li>
                ))}
                {!sales.length && <li className="py-2 text-gray-500">No sales yet.</li>}
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h3 className="text-xl font-semibold mb-4 border-b pb-2 text-gray-800">Quick Actions</h3>
          <div className="space-y-3">
            <div className="text-gray-600">Use sidebar to navigate to Purchase / Sales / Products.</div>
            <div className="mt-2">
              <button className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg">New Sale</button>
              <button className="w-full mt-2 px-4 py-3 bg-emerald-600 text-white rounded-lg">New Purchase</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}