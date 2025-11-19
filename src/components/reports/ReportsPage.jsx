// ReportsPage component file
import React from "react";
import { BarChart2, Package } from "lucide-react";

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Business Reports</h2>

      <div className="bg-white p-6 rounded-xl shadow border">
        <h3 className="text-xl font-semibold mb-4">Report Tools</h3>

        <p className="text-gray-600 mb-4">
          Generate detailed sales, purchase and stock reports here.
        </p>

        <div className="flex gap-3">
          <button className="px-4 py-2 border rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center gap-2">
            <BarChart2 className="w-5" />
            Generate Sales Report
          </button>

          <button className="px-4 py-2 border rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center gap-2">
            <Package className="w-5" />
            Export Stock Data
          </button>
        </div>
      </div>
    </div>
  );
}
