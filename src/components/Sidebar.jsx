import React from "react";
import { NavLink } from "react-router-dom";
import { Home, Package, ShoppingCart, DollarSign, BarChart2, Settings } from "lucide-react";

const items = [
  { to: "/dashboard", label: "Dashboard", icon: Home },
  { to: "/products", label: "Products", icon: Package },
  { to: "/purchase", label: "Purchase", icon: ShoppingCart },
  { to: "/sales", label: "Sales", icon: DollarSign },
  { to: "/reports", label: "Reports", icon: BarChart2 },
  { to: "/settings", label: "Settings", icon: Settings },
];

import { motion } from "framer-motion";

export default function Sidebar() {
  return (

    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-lg z-20">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-extrabold text-indigo-600 tracking-tight flex items-center gap-2">
          <motion.div
            initial={{ rotate: -10 }}
            animate={{ rotate: 0 }}
            transition={{ duration: 0.5, type: "spring" }}
          >
            🛍️
          </motion.div>
          Smart<span className="text-gray-900">Store</span>
        </h1>
      </div>

      <nav className="p-4 flex-grow">
        <ul className="space-y-1">
          {items.map((it) => {
            const Icon = it.icon;
            return (
              <li key={it.to}>
                <NavLink
                  to={it.to}
                  className={({ isActive }) =>
                    `relative w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 group overflow-hidden ${isActive ? "text-indigo-700 font-semibold" : "text-gray-600 hover:text-gray-900"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 bg-indigo-50 rounded-lg"
                          initial={false}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      )}
                      <span className="relative z-10 flex items-center gap-3">
                        <Icon className={`w-5 h-5 ${isActive ? "text-indigo-600" : "text-gray-400 group-hover:text-gray-600"}`} />
                        {it.label}
                      </span>
                    </>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200 text-sm text-gray-500">
        <p>Version 1.1</p>
      </div>
    </aside>
  );
}
