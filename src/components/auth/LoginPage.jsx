import React, { useState } from "react";
import { Store, Lock, Key, User } from "lucide-react";
import { motion } from "framer-motion";

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
        if (storeId === "1" && licenseKey === "1" && password === "1") {
            onLogin({ storeId, name: "Demo Store" });
        } else {
            setError("Invalid credentials. Please check your details.");
        }
    }

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Branding & Image */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?q=80&w=2070&auto=format&fit=crop"
                        alt="Store Background"
                        className="w-full h-full object-cover opacity-40"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
                </div>

                <div className="relative z-10 p-12 text-white max-w-xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mb-8"
                    >
                        <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/20">
                            <Store className="text-white" size={40} />
                        </div>
                        <h1 className="text-5xl font-bold mb-4 tracking-tight">SmartStore</h1>
                        <p className="text-xl text-slate-300 leading-relaxed">
                            Manage your inventory, sales, and purchases with the most advanced and intuitive store management system.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="flex gap-4 text-sm text-slate-400"
                    >
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span>Real-time Tracking</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span>Secure & Fast</span>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md space-y-8"
                >
                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
                        <p className="mt-2 text-gray-600">Please sign in to your store account</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                className="bg-red-50 text-red-600 text-sm p-4 rounded-xl border border-red-100 flex items-center gap-2"
                            >
                                <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                {error}
                            </motion.div>
                        )}

                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Store ID</label>
                                <div className="relative group">
                                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-600 transition-colors" size={20} />
                                    <input
                                        type="text"
                                        value={storeId}
                                        onChange={(e) => setStoreId(e.target.value)}
                                        className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all bg-white hover:bg-gray-50 focus:bg-white"
                                        placeholder="e.g. RajuKirana101"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">License Key</label>
                                <div className="relative group">
                                    <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-600 transition-colors" size={20} />
                                    <input
                                        type="text"
                                        value={licenseKey}
                                        onChange={(e) => setLicenseKey(e.target.value)}
                                        className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all bg-white hover:bg-gray-50 focus:bg-white"
                                        placeholder="XXXX-XXXX-XXXX"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-600 transition-colors" size={20} />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all bg-white hover:bg-gray-50 focus:bg-white"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            type="submit"
                            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-emerald-500/20 transition-all"
                        >
                            Sign In to Dashboard
                        </motion.button>
                    </form>

                    <div className="text-center">
                        <p className="text-sm text-gray-500">
                            Protected by SmartStore Security Systems v1.0
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
