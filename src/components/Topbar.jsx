import React from "react";
import { Search, LogOut } from "lucide-react";

export default function Topbar({ search, setSearch, user, onLogout }) {
  const userName = user?.name || "Owner";

  return (
    <header className="flex items-center justify-between bg-white p-4 border-b border-gray-200 sticky top-0 z-10">
      <div className="relative w-96">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search product, barcode, or transaction..."
          className="pl-10 pr-4 py-2 border border-gray-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 
          rounded-lg w-full transition duration-150 ease-in-out text-sm outline-none"
        />
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <div className="text-sm font-semibold text-gray-800">{userName}</div>
          <div className="text-xs text-gray-500">Store Admin</div>
        </div>
        <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold text-lg shadow-sm border border-emerald-200">
          {userName.charAt(0)}
        </div>
        <button
          onClick={onLogout}
          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
          title="Logout"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
}
