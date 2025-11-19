import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

/**
 Props:
  - products: array
  - onSave: function(payload) -> for add (if editMode true it receives (id,payload))
  - editMode: optional boolean when route is edit
 Note: For edit route we expect parent to pass same component but with editMode and route param id.
**/

export default function PurchaseForm({ products = [], onSave, editMode }) {
  const { id } = useParams();
  const navigate = useNavigate();

  // If editMode, fetch existing purchase from localStorage
  const [initial, setInitial] = useState(null);

  useEffect(() => {
    if (editMode && id) {
      const purchases = JSON.parse(localStorage.getItem("smartstore_purchases") || "[]");
      const p = purchases.find((x) => x.purchaseId === id);
      if (p) setInitial(p);
    }
  }, [editMode, id]);

  const [supplierName, setSupplierName] = useState(initial?.supplierName || "");
  const [billNo, setBillNo] = useState(initial?.billNo || "");
  const [date, setDate] = useState(initial ? new Date(initial.date).toISOString().slice(0, 10) : new Date().toISOString().slice(0,10));
  const [lines, setLines] = useState(initial?.lines || [{ productId: products[0]?.id || "", qty: 1, price: 0 }]);
  const [taxPercent, setTaxPercent] = useState(initial?.taxPercent || 0);
  const [discountPercent, setDiscountPercent] = useState(initial?.discountPercent || 0);
  const [notes, setNotes] = useState(initial?.notes || "");

  useEffect(() => {
    if (initial) {
      setSupplierName(initial.supplierName || "");
      setBillNo(initial.billNo || "");
      setDate(new Date(initial.date).toISOString().slice(0,10));
      setLines(initial.lines || [{ productId: products[0]?.id || "", qty: 1, price: 0 }]);
      setTaxPercent(initial.taxPercent || 0);
      setDiscountPercent(initial.discountPercent || 0);
      setNotes(initial.notes || "");
    }
    // eslint-disable-next-line
  }, [initial]);

  function changeLine(i, key, val) {
    setLines((s) => s.map((ln, idx) => (idx === i ? { ...ln, [key]: val } : ln)));
  }
  function addLine() {
    setLines((s) => [...s, { productId: products[0]?.id || "", qty: 1, price: 0 }]);
  }
  function removeLine(idx) {
    setLines((s) => s.filter((_, i) => i !== idx));
  }

  const subtotal = lines.reduce((s, ln) => s + Number(ln.qty || 0) * Number(ln.price || 0), 0);
  const discount = (subtotal * Number(discountPercent || 0)) / 100;
  const taxed = subtotal - discount;
  const tax = (taxed * Number(taxPercent || 0)) / 100;
  const total = taxed + tax;

  function handleSave() {
    if (!supplierName) return alert("Supplier required");
    if (!lines.length) return alert("Add lines");
    for (const ln of lines) {
      if (!ln.productId) return alert("Choose product for each line");
    }

    const payload = { supplierName, billNo, date: new Date(date).toISOString(), lines, taxPercent, discountPercent, notes };
    if (editMode && id) {
      onSave(id, payload);
      alert("Purchase updated");
    } else {
      onSave(payload);
      alert("Purchase saved");
    }
    navigate("/purchase");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{editMode ? "Edit Purchase" : "Add Purchase"}</h2>
      </div>

      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-sm text-gray-700">Supplier</label>
            <input value={supplierName} onChange={(e) => setSupplierName(e.target.value)} className="mt-1 w-full border px-3 py-2 rounded-lg" />
          </div>
          <div>
            <label className="text-sm text-gray-700">Bill No</label>
            <input value={billNo} onChange={(e) => setBillNo(e.target.value)} className="mt-1 w-full border px-3 py-2 rounded-lg" />
          </div>
          <div>
            <label className="text-sm text-gray-700">Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 w-full border px-3 py-2 rounded-lg" />
          </div>
        </div>

        <div>
          <div className="grid grid-cols-5 gap-4 font-semibold text-gray-600 border-b pb-2">
            <div className="col-span-2">Product</div>
            <div>Qty</div>
            <div>Cost</div>
            <div>Total</div>
          </div>

          {lines.map((ln, i) => {
            const subtotalLine = (Number(ln.qty || 0) * Number(ln.price || 0)).toFixed(2);
            return (
              <div key={i} className="grid grid-cols-5 gap-4 items-center py-2">
                <select value={ln.productId} onChange={(e) => changeLine(i, "productId", e.target.value)} className="col-span-2 border px-3 py-2 rounded-lg">
                  <option value="">-- select --</option>
                  {products.map((p) => <option key={p.id} value={p.id}>{p.name} ({p.unit})</option>)}
                </select>

                <input type="number" value={ln.qty} onChange={(e) => changeLine(i, "qty", Number(e.target.value))} className="border px-3 py-2 rounded-lg" min="1" />

                <input type="number" value={ln.price} onChange={(e) => changeLine(i, "price", Number(e.target.value))} className="border px-3 py-2 rounded-lg" min="0" />

                <div className="text-right">₹ {subtotalLine}</div>

                <div className="col-span-5 flex justify-end">
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
          <div>
            <label className="text-sm text-gray-700">Notes</label>
            <input value={notes} onChange={(e) => setNotes(e.target.value)} className="mt-1 w-full border px-3 py-2 rounded-lg" />
          </div>
        </div>

        <div className="flex justify-between items-center border-t pt-4">
          <div className="text-lg font-semibold">Subtotal: ₹ {subtotal.toFixed(2)}</div>
          <div className="text-right">
            <div>Discount: ₹ {discount.toFixed(2)}</div>
            <div>Tax: ₹ {tax.toFixed(2)}</div>
            <div className="text-2xl font-bold">Total: ₹ {total.toFixed(2)}</div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button onClick={() => navigate("/purchase")} className="px-4 py-2 border rounded-lg">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 bg-emerald-600 text-white rounded-lg">{editMode ? "Save Changes" : "Save Purchase"}</button>
        </div>
      </div>
    </div>
  );
}
