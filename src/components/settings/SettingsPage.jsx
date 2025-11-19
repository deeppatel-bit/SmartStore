// SettingsPage component file
import React from "react";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Application Settings</h2>

      <div className="bg-white p-6 rounded-xl shadow border">
        <h3 className="text-xl font-semibold mb-4">General Settings</h3>

        <p className="text-gray-600">
          Configure basic system settings and app preferences here.
        </p>

        <div className="mt-4">
          <label className="flex items-center gap-3">
            <input type="checkbox" className="h-5 w-5 text-indigo-600 rounded" />
            <span className="text-gray-700">Enable Dark Mode (future)</span>
          </label>
        </div>
      </div>
    </div>
  );
}
