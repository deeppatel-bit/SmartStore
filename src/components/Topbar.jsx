// Topbar component file
import React from "react";
import { Search } from "lucide-react";

export default function Topbar({ search, setSearch, userName = "Owner" }) {
  return (
    <header className="flex items-center justify-between bg-white p-4 border-b border-gray-200 sticky top-0 z-10">
      <div className="relative w-96">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search product, barcode, or transaction..."
          className="pl-10 pr-4 py-2 border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 
          rounded-lg w-full transition duration-150 ease-in-out text-sm"
        />
      </div>

      <div className="flex items-center gap-4">
        <div className="text-sm text-gray-700 font-medium">Hi, {userName}</div>
        <div className="w-10 h-10 bg-indigo-500 text-white rounded-full flex items-center justify-center font-semibold text-lg shadow-md">
          {userName.charAt(0)}
        </div>
      </div>
    </header>
  );
}
