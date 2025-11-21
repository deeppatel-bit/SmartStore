import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import StatCard from "../StatCard";
import { DollarSign, Package, AlertTriangle } from "lucide-react";

/**
 Props:
  - products
  - purchases
  - sales
**/

export default function Dashboard({ products = [], purchases = [], sales = [] }) {
  const navigate = useNavigate();
  const todayISO = new Date().toISOString().slice(0, 10);

  // Memoize calculations for performance
  const todaysSales = useMemo(() => {
    return sales
      .filter((s) => (s.date || "").slice(0, 10) === todayISO)
      .reduce((sum, s) => sum + (Number(s.total) || 0), 0);
  }, [sales, todayISO]);

  const totalProducts = products.length;

  const lowStock = useMemo(() => {
    return products.filter((p) => p.stock <= (p.reorder || 5));
  }, [products]);

  const lowStockMessage = useMemo(() => {
    if (!lowStock.length) return "All good!";
    const names = lowStock.map((p) => p.name);
    if (names.length <= 3) return names.join(", ");
    return `${names.slice(0, 3).join(", ")} +${names.length - 3} more`;
  }, [lowStock]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Sales Today" value={`₹ ${todaysSales.toFixed(2)}`} icon={DollarSign} color="indigo" />
        <StatCard title="Total Products" value={totalProducts} icon={Package} color="green" />
        <StatCard
          title="Low Stock Alerts"
          value={lowStock.length}
          sub={lowStockMessage}
          icon={AlertTriangle}
          color={lowStock.length ? "red" : "green"}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h3 className="text-xl font-semibold mb-4 border-b pb-2 text-gray-800">Recent Activity</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="font-semibold text-gray-800 mb-2">Recent Purchases</div>
              <ul className="divide-y">
                {purchases.slice(0, 6).map((p) => (
                  <li key={p.purchaseId} className="py-2 flex justify-between items-center">
                    <div>
                      <div className="font-medium text-sm">{p.supplierName}</div>
                      <div className="text-xs text-gray-500">{new Date(p.date).toLocaleDateString()}</div>
                    </div>
                    <div className="font-semibold text-sm">₹ {Number(p.total).toFixed(2)}</div>
                  </li>
                ))}
                {!purchases.length && <li className="py-2 text-gray-500 text-sm">No purchases yet.</li>}
              </ul>
            </div>

            <div>
              <div className="font-semibold text-gray-800 mb-2">Recent Sales</div>
              <ul className="divide-y">
                {sales.slice(0, 6).map((s) => (
                  <li key={s.saleId} className="py-2 flex justify-between items-center">
                    <div>
                      <div className="font-medium text-sm">{s.customerName}</div>
                      <div className="text-xs text-gray-500">{new Date(s.date).toLocaleDateString()}</div>
                    </div>
                    <div className="font-semibold text-sm">₹ {Number(s.total).toFixed(2)}</div>
                  </li>
                ))}
                {!sales.length && <li className="py-2 text-gray-500 text-sm">No sales yet.</li>}
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 h-fit">
          <h3 className="text-xl font-semibold mb-4 border-b pb-2 text-gray-800">Quick Actions</h3>
          <div className="space-y-4">
            <div className="text-gray-600 text-sm">Use these shortcuts to quickly add new records.</div>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate("/sales/add")}
                className="w-full px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium shadow-sm"
              >
                New Sale
              </button>
              <button
                onClick={() => navigate("/purchase/add")}
                className="w-full px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors font-medium shadow-sm"
              >
                New Purchase
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}