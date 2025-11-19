import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

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
  const [date, setDate] = useState(initial ? new Date(initial.date).toISOString().slice(0,10) : new Date().toISOString().slice(0,10));
  const [lines, setLines] = useState(initial?.lines || [{ productId: products[0]?.id || "", qty: 1 }]);
  const [taxPercent, setTaxPercent] = useState(initial?.taxPercent || 0);
  const [discountPercent, setDiscountPercent] = useState(initial?.discountPercent || 0);
  const [notes, setNotes] = useState(initial?.notes || "");

  useEffect(() => {
    if (initial) {
      setCustomerName(initial.customerName || "");
      setDate(new Date(initial.date).toISOString().slice(0,10));
      setLines(initial.lines || [{ productId: products[0]?.id || "", qty: 1 }]);
      setTaxPercent(initial.taxPercent || 0);
      setDiscountPercent(initial.discountPercent || 0);
      setNotes(initial.notes || "");
    }
    // eslint-disable-next-line
  }, [initial]);

  function changeLine(i, key, val) {
    setLines(s => s.map((ln, idx) => idx === i ? { ...ln, [key]: val } : ln));
  }
  function addLine() {
    setLines(s => [...s, { productId: products[0]?.id || "", qty: 1 }]);
  }
  function removeLine(idx) {
    setLines(s => s.filter((_, i) => i !== idx));
  }

  const subtotal = lines.reduce((s, ln) => {
    const p = products.find(x => x.id === ln.productId);
    const price = p ? p.sellPrice : 0;
    return s + Number(ln.qty || 0) * price;
  }, 0);
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{editMode ? "Edit Sale" : "New Sale"}</h2>
      </div>

      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-sm text-gray-700">Customer</label>
            <input value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="mt-1 w-full border px-3 py-2 rounded-lg" />
          </div>

          <div>
            <label className="text-sm text-gray-700">Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 w-full border px-3 py-2 rounded-lg" />
          </div>

          <div>
            <label className="text-sm text-gray-700">Notes</label>
            <input value={notes} onChange={(e) => setNotes(e.target.value)} className="mt-1 w-full border px-3 py-2 rounded-lg" />
          </div>
        </div>

        <div>
          <div className="grid grid-cols-4 gap-4 font-semibold text-gray-600 border-b pb-2">
            <div className="col-span-2">Product</div>
            <div>Qty</div>
            <div>Subtotal</div>
          </div>

          {lines.map((ln, i) => {
            const p = products.find(x => x.id === ln.productId);
            const price = p ? p.sellPrice : 0;
            const subtotalLine = (Number(ln.qty || 0) * price).toFixed(2);
            return (
              <div key={i} className="grid grid-cols-4 gap-4 items-center py-2">
                <select value={ln.productId} onChange={(e) => changeLine(i, "productId", e.target.value)} className="col-span-2 border px-3 py-2 rounded-lg">
                  <option value="">-- select --</option>
                  {products.map((p) => <option key={p.id} value={p.id}>{p.name} — ₹{p.sellPrice}</option>)}
                </select>

                <input type="number" value={ln.qty} onChange={(e) => changeLine(i, "qty", Number(e.target.value))} className="border px-3 py-2 rounded-lg" min="1" />

                <div className="text-right">₹ {subtotalLine}</div>

                <div className="col-span-4 flex justify-end">
                  <button onClick={() => removeLine(i)} className="text-sm text-red-600">Remove</button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-sm text-gray-700">Discount (%)</label>
            <input type="number" value={discountPercent} onChange={(e) => setDiscountPercent(Number(e.target.value))} className="mt-1 w-full border px-3 py-2 rounded-lg" />
          </div>
          <div>
            <label className="text-sm text-gray-700">Tax (%)</label>
            <input type="number" value={taxPercent} onChange={(e) => setTaxPercent(Number(e.target.value))} className="mt-1 w-full border px-3 py-2 rounded-lg" />
          </div>
          <div className="text-right">
            <div className="text-lg">Subtotal: ₹ {subtotal.toFixed(2)}</div>
            <div>Discount: ₹ {discount.toFixed(2)}</div>
            <div>Tax: ₹ {tax.toFixed(2)}</div>
            <div className="text-2xl font-bold">Total: ₹ {total.toFixed(2)}</div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button onClick={() => navigate("/sales")} className="px-4 py-2 border rounded-lg">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 bg-indigo-600 text-white rounded-lg">{editMode ? "Save Changes" : "Complete Sale"}</button>
        </div>
      </div>
    </div>
  );
}
