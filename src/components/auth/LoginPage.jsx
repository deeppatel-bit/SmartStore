import React, { useState } from "react";
import { Store, Lock, Key, User } from "lucide-react";

export default function LoginPage({ onLogin }) {
    const [storeId, setStoreId] = useState("");
    const [licenseKey, setLicenseKey] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    function handleSubmit(e) {
        e.preventDefault();
        setError("");

        // Demo Credentials
        // In a real app, this would call an API
        if (storeId === "demo" && licenseKey === "KEY-2024" && password === "admin") {
            onLogin({ storeId, name: "Demo Store" });
        } else {
            setError("Invalid credentials. Please check your details.");
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-emerald-600 p-8 text-center">
                    <div className="mx-auto bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
                        <Store className="text-white" size={32} />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">SmartStore</h1>
                    <p className="text-emerald-100">Business Management System</p>
                </div>

                <div className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Store ID</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    value={storeId}
                                    onChange={(e) => setStoreId(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                                    placeholder="e.g. RajuKirana101"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">License Key</label>
                            <div className="relative">
                                <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    value={licenseKey}
                                    onChange={(e) => setLicenseKey(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                                    placeholder="XXXX-XXXX-XXXX"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition-all transform active:scale-[0.98]"
                        >
                            Sign In to Store
                        </button>
                    </form>

                    <div className="mt-6 text-center text-xs text-gray-400">
                        Protected by SmartStore Security Systems
                    </div>
                </div>
            </div>
        </div>
    );
}
