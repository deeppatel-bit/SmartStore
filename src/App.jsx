import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import LoginPage from "./components/auth/LoginPage";

import Dashboard from "./components/dashboard/Dashboard";
import ProductsPage from "./components/products/ProductsPage";
import ProductForm from "./components/products/ProductForm";

import PurchaseList from "./components/purchase/PurchaseList";
import PurchaseForm from "./components/purchase/PurchaseForm";

import SalesList from "./components/sales/SalesList";
import SalesForm from "./components/sales/SalesForm";

import ReportsPage from "./components/reports/ReportsPage";
import SettingsPage from "./components/settings/SettingsPage";

const LS_PRODUCTS = "smartstore_products";
const LS_PURCHASES = "smartstore_purchases";
const LS_SALES = "smartstore_sales";
const LS_USER = "smartstore_user";

function readLS(key, fallback) {
  try {
    const s = localStorage.getItem(key);
    return s ? JSON.parse(s) : fallback;
  } catch {
    return fallback;
  }
}
function writeLS(key, val) {
  localStorage.setItem(key, JSON.stringify(val));
}

function nextInvoiceId(list, prefix) {
  const year = new Date().getFullYear();
  const idsThisYear = list
    .map((i) => i.purchaseId || i.saleId)
    .filter(Boolean)
    .filter((s) => s.startsWith(prefix + "-" + year));
  const lastSeq = idsThisYear
    .map((s) => parseInt(s.split("-").pop(), 10))
    .filter(Number.isFinite)
    .sort((a, b) => b - a)[0] || 0;
  const next = (lastSeq + 1).toString().padStart(4, "0");
  return `${prefix}-${year}-${next}`;
}

export default function App() {
  // central UI state (search kept for topbar)
  const [search, setSearch] = useState("");

  // Auth State
  const [user, setUser] = useState(() => readLS(LS_USER, null));

  // data with LocalStorage persistence
  const [products, setProducts] = useState(() =>
    readLS(LS_PRODUCTS, [
      { id: "p1", name: "Rice 5kg", category: "Grocery", unit: "kg", stock: 12, costPrice: 250, sellPrice: 300, reorder: 5 },
      { id: "p2", name: "Notebook", category: "Stationery", unit: "pcs", stock: 40, costPrice: 20, sellPrice: 35, reorder: 10 },
      { id: "p3", name: "Toothpaste", category: "Personal Care", unit: "pcs", stock: 6, costPrice: 60, sellPrice: 90, reorder: 5 },
    ])
  );
  const [purchases, setPurchases] = useState(() => readLS(LS_PURCHASES, []));
  const [sales, setSales] = useState(() => readLS(LS_SALES, []));

  useEffect(() => writeLS(LS_PRODUCTS, products), [products]);
  useEffect(() => writeLS(LS_PURCHASES, purchases), [purchases]);
  useEffect(() => writeLS(LS_SALES, sales), [sales]);
  useEffect(() => writeLS(LS_USER, user), [user]);

  // If not logged in, show Login Page
  if (!user) {
    return <LoginPage onLogin={setUser} />;
  }

  // ********** Products CRUD (kept simple) **********
  function addOrUpdateProduct(form) {
    if (!form.name) return alert("Name required");
    if (form.id) {
      setProducts((s) => s.map((p) => (p.id === form.id ? { ...p, ...form } : p)));
    } else {
      setProducts((s) => [...s, { ...form, id: `p${Date.now()}` }]);
    }
  }
  function deleteProduct(id) {
    if (!window.confirm("Delete product?")) return;
    setProducts((s) => s.filter((p) => p.id !== id));
  }

  // ********** Purchases: add / update / delete **********
  function addPurchase({ supplierName, billNo, date, lines, taxPercent = 0, discountPercent = 0, notes }) {
    // totals
    const subtotal = lines.reduce((s, l) => s + Number(l.qty || 0) * Number(l.price || 0), 0);
    const discount = (subtotal * Number(discountPercent || 0)) / 100;
    const taxed = subtotal - discount;
    const tax = (taxed * Number(taxPercent || 0)) / 100;
    const total = taxed + tax;

    const purchase = {
      purchaseId: nextInvoiceId(purchases, "PUR"),
      supplierName,
      billNo,
      date: date || new Date().toISOString(),
      lines,
      taxPercent,
      discountPercent,
      subtotal,
      discount,
      tax,
      total,
      notes,
    };

    setPurchases((s) => [purchase, ...s]);
    // update stocks
    setProducts((prev) =>
      prev.map((p) => {
        const ln = lines.find((l) => l.productId === p.id);
        if (ln && ln.productId) {
          return { ...p, stock: Number(p.stock || 0) + Number(ln.qty || 0) };
        }
        return p;
      })
    );
  }

  function updatePurchase(id, payload) {
    setPurchases((s) => s.map((p) => (p.purchaseId === id ? { ...p, ...payload } : p)));
    // NOTE: stock reconciliation for edit is complex — for now we do not revert old lines' stock.
    // If you need exact stock reconciliation on edit, we can store and apply diffs.
  }

  function deletePurchase(id) {
    if (!window.confirm("Delete purchase? This will not revert stock.")) return;
    setPurchases((s) => s.filter((p) => p.purchaseId !== id));
  }

  // ********** Sales: add / update / delete **********
  function addSale({ customerName, date, lines, taxPercent = 0, discountPercent = 0, notes }) {
    const linesResolved = lines.map((l) => {
      const p = products.find((x) => x.id === l.productId);
      const price = l.price ? Number(l.price) : (p ? p.sellPrice : 0);
      return { ...l, price };
    });
    const subtotal = linesResolved.reduce((s, l) => s + Number(l.qty || 0) * Number(l.price || 0), 0);
    const discount = (subtotal * Number(discountPercent || 0)) / 100;
    const taxed = subtotal - discount;
    const tax = (taxed * Number(taxPercent || 0)) / 100;
    const total = taxed + tax;

    const sale = {
      saleId: nextInvoiceId(sales, "SAL"),
      customerName,
      date: date || new Date().toISOString(),
      lines: linesResolved,
      taxPercent,
      discountPercent,
      subtotal,
      discount,
      tax,
      total,
      notes,
    };

    // reduce stock
    const insufficient = linesResolved.find((ln) => {
      const p = products.find((x) => x.id === ln.productId);
      return !p || Number(ln.qty) > Number(p.stock);
    });
    if (insufficient) {
      return alert("Not enough stock for some items. Sale aborted.");
    }

    setSales((s) => [sale, ...s]);
    setProducts((prev) =>
      prev.map((p) => {
        const ln = linesResolved.find((l) => l.productId === p.id);
        if (ln && ln.productId) {
          return { ...p, stock: Math.max(0, Number(p.stock || 0) - Number(ln.qty || 0)), soldToday: (p.soldToday || 0) + Number(ln.qty || 0) };
        }
        return p;
      })
    );
  }

  function updateSale(id, payload) {
    setSales((s) => s.map((x) => (x.saleId === id ? { ...x, ...payload } : x)));
    // stock reconciliation on edit not implemented here (could be added)
  }

  function deleteSale(id) {
    if (!window.confirm("Delete sale? This will not revert stock.")) return;
    setSales((s) => s.filter((x) => x.saleId !== id));
  }

  return (
    <BrowserRouter>
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Topbar search={search} setSearch={setSearch} onLogout={() => setUser(null)} user={user} />
          <main className="p-6 overflow-y-auto flex-1">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard products={products} purchases={purchases} sales={sales} />} />

              <Route
                path="/products"
                element={<ProductsPage products={products} onDelete={deleteProduct} search={search} />}
              />

              <Route path="/products/new" element={<ProductForm onSave={addOrUpdateProduct} />} />
              <Route
                path="/products/edit/:id"
                element={<ProductEditWrapper products={products} onSave={addOrUpdateProduct} />}
              />

              {/* Purchase routes */}
              <Route path="/purchase" element={<PurchaseList purchases={purchases} onDelete={deletePurchase} />} />
              <Route path="/purchase/add" element={<PurchaseForm products={products} onSave={addPurchase} />} />
              <Route path="/purchase/edit/:id" element={<PurchaseForm products={products} onSave={updatePurchase} editMode />} />

              {/* Sales routes */}
              <Route path="/sales" element={<SalesList sales={sales} onDelete={deleteSale} />} />
              <Route path="/sales/add" element={<SalesForm products={products} onSave={addSale} />} />
              <Route path="/sales/edit/:id" element={<SalesForm products={products} onSave={updateSale} editMode />} />

              <Route path="/reports" element={<ReportsPage purchases={purchases} sales={sales} />} />
              <Route path="/settings" element={<SettingsPage />} />

              <Route path="*" element={<div>Not found</div>} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

function ProductEditWrapper({ products, onSave }) {
  const { id } = useParams();
  const product = products.find((p) => p.id === id);
  if (!product) return <Navigate to="/products" replace />;
  return <ProductForm initial={product} onSave={onSave} />;
}
