// StatCard component file
import React from "react";

export default function StatCard({ title, value, sub, icon: Icon, color = "indigo" }) {
  const colorClasses = {
    indigo: "bg-indigo-50 text-indigo-600",
    green: "bg-emerald-50 text-emerald-600",
    red: "bg-red-50 text-red-600",
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-100 transition duration-300 hover:shadow-xl">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-gray-500">{title}</div>
        <div className={`p-2 rounded-full ${colorClasses[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-1">
        <div className="text-3xl font-bold text-gray-900">{value}</div>
        {sub && <div className="text-xs mt-1 text-gray-500">{sub}</div>}
      </div>
    </div>
  );
}
