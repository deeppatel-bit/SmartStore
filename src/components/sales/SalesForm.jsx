import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Plus, Trash2, AlertCircle } from "lucide-react";

export default function SalesForm({ products = [], onSave, editMode }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [initial, setInitial] = useState(null);
  useEffect(() => {
    if (editMode && id) {
      const s = JSON.parse(localStorage.getItem("smartstore_sales") || "[]").find(x => x.saleId === id);
      if (s) setInitial(s);
    }
  }, [editMode, id]);

  const [customerName, setCustomerName] = useState(initial?.customerName || "");
  const [date, setDate] = useState(initial ? new Date(initial.date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10));
  const [lines, setLines] = useState(initial?.lines || [{ productId: products[0]?.id || "", qty: 1 }]);
  const [taxPercent, setTaxPercent] = useState(initial?.taxPercent || 0);
  const [discountPercent, setDiscountPercent] = useState(initial?.discountPercent || 0);
  const [notes, setNotes] = useState(initial?.notes || "");

  useEffect(() => {
    if (initial) {
      setCustomerName(initial.customerName || "");
      setDate(new Date(initial.date).toISOString().slice(0, 10));
      // Ensure lines have price, default to product price if missing (migration)
      const loadedLines = (initial.lines || []).map(ln => ({
        ...ln,
        price: ln.price !== undefined ? ln.price : (products.find(p => p.id === ln.productId)?.sellPrice || 0)
      }));
      setLines(loadedLines.length ? loadedLines : [{ productId: products[0]?.id || "", qty: 1, price: products[0]?.sellPrice || 0 }]);
      setTaxPercent(initial.taxPercent || 0);
      setDiscountPercent(initial.discountPercent || 0);
      setNotes(initial.notes || "");
    } else {
      // Set default line with price if products exist
      if (products.length && !lines[0].price) {
        setLines([{ productId: products[0]?.id || "", qty: 1, price: products[0]?.sellPrice || 0 }]);
      }
    }
    // eslint-disable-next-line
  }, [initial, products]); // Added products dependency to set default price

  function changeLine(i, key, val) {
    setLines(s => s.map((ln, idx) => {
      if (idx !== i) return ln;
      const newLn = { ...ln, [key]: val };
      // If product changed, update price to that product's default
      if (key === "productId") {
        const p = products.find(x => x.id === val);
        newLn.price = p ? p.sellPrice : 0;
      }
      return newLn;
    }));
  }
  function addLine() {
    setLines(s => [...s, { productId: "", qty: 1, price: 0 }]);
  }
  function removeLine(idx) {
    setLines(s => s.filter((_, i) => i !== idx));
  }

  const subtotal = lines.reduce((s, ln) => {
    return s + Number(ln.qty || 0) * Number(ln.price || 0);
  }, 0);
  const totalQty = lines.reduce((s, ln) => s + Number(ln.qty || 0), 0);
  const discount = (subtotal * Number(discountPercent || 0)) / 100;
  const taxed = subtotal - discount;
  const tax = (taxed * Number(taxPercent || 0)) / 100;
  const total = taxed + tax;

  function handleSave() {
    if (!customerName) return alert("Customer required");
    if (!lines.length) return alert("Add lines");
    for (const ln of lines) {
      if (!ln.productId) return alert("Choose product in each line");
    }

    const payload = { customerName, date: new Date(date).toISOString(), lines, taxPercent, discountPercent, notes };
    if (editMode && id) {
      onSave(id, payload);
      alert("Sale updated");
    } else {
      onSave(payload);
      alert("Sale recorded");
    }
    navigate("/sales");
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">{editMode ? "Edit Sale" : "New Sale"}</h2>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 space-y-6">
        {/* Header Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
            <input
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full border-gray-300 border px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              placeholder="Enter customer name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border-gray-300 border px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full border-gray-300 border px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              placeholder="Optional notes"
            />
          </div>
        </div>

        {/* Items Table */}
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-700 font-semibold">
              <tr>
                <th className="px-4 py-3 w-[35%]">Product</th>
                <th className="px-4 py-3 w-[10%]">Stock</th>
                <th className="px-4 py-3 w-[15%]">Price</th>
                <th className="px-4 py-3 w-[10%]">Qty</th>
                <th className="px-4 py-3 w-[20%] text-right">Subtotal</th>
                <th className="px-4 py-3 w-[10%] text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {lines.map((ln, i) => {
                const p = products.find(x => x.id === ln.productId);
                const stock = p ? p.stock : 0;
                const subtotalLine = (Number(ln.qty || 0) * Number(ln.price || 0)).toFixed(2);
                const isLowStock = p && stock < Number(ln.qty);

                return (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-4 py-2">
                      <select
                        value={ln.productId}
                        onChange={(e) => changeLine(i, "productId", e.target.value)}
                        className="w-full border-gray-300 border px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                      >
                        <option value="">-- Select Product --</option>
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-2 text-sm">
                      {p ? (
                        <span className={stock === 0 ? "text-red-600 font-bold" : "text-gray-600"}>
                          {stock} {p.unit}
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        value={ln.price}
                        onChange={(e) => changeLine(i, "price", Number(e.target.value))}
                        className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                        min="0"
                        step="0.01"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <div className="relative">
                        <input
                          type="number"
                          value={ln.qty}
                          onChange={(e) => changeLine(i, "qty", Number(e.target.value))}
                          className={`w-full border px-3 py-2 rounded-lg focus:ring-2 outline-none ${isLowStock ? "border-red-300 focus:ring-red-200" : "border-gray-300 focus:ring-indigo-500"}`}
                          min="1"
                        />
                        {isLowStock && (
                          <div className="absolute -top-6 left-0 bg-red-100 text-red-700 text-xs px-2 py-1 rounded shadow flex items-center gap-1">
                            <AlertCircle size={12} /> Exceeds stock
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-2 text-right font-medium text-gray-800">
                      ₹ {subtotalLine}
                    </td>
                    <td className="px-4 py-2 text-center">
                      <button
                        onClick={() => removeLine(i)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                        title="Remove Item"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {lines.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                    No items added. Click "Add Item" to start.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="bg-gray-50 px-4 py-3 border-t flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Total Items: <span className="font-semibold text-gray-800">{lines.length}</span> | Total Qty: <span className="font-semibold text-gray-800">{totalQty}</span>
            </div>
            <button
              onClick={addLine}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-indigo-200 text-indigo-700 rounded-lg hover:bg-indigo-50 transition-colors font-medium shadow-sm"
            >
              <Plus size={18} /> Add Item
            </button>
          </div>
        </div>

        {/* Footer Totals */}
        <div className="flex flex-col md:flex-row justify-end items-start md:items-center gap-8 pt-4 border-t">
          <div className="w-full md:w-64 space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm text-gray-600">Discount (%)</label>
              <input
                type="number"
                value={discountPercent}
                onChange={(e) => setDiscountPercent(Number(e.target.value))}
                className="w-20 border px-2 py-1 rounded text-right"
              />
            </div>
            <div className="flex justify-between items-center">
              <label className="text-sm text-gray-600">Tax (%)</label>
              <input
                type="number"
                value={taxPercent}
                onChange={(e) => setTaxPercent(Number(e.target.value))}
                className="w-20 border px-2 py-1 rounded text-right"
              />
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg min-w-[250px] space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal:</span>
              <span>₹ {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600 text-sm">
              <span>Discount:</span>
              <span>- ₹ {discount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600 text-sm">
              <span>Tax:</span>
              <span>+ ₹ {tax.toFixed(2)}</span>
            </div>
            <div className="border-t pt-2 mt-2 flex justify-between text-xl font-bold text-indigo-900">
              <span>Total:</span>
              <span>₹ {total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={() => navigate("/sales")}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all font-medium"
          >
            {editMode ? "Save Changes" : "Complete Sale"}
          </button>
        </div>
      </div>
    </div>
  );
}
