"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Plus, Trash2, Receipt, Users } from "lucide-react";

interface Item {
  id: number;
  name: string;
  price: string;
  qty: string;
}

interface Person {
  id: number;
  name: string;
}

export default function SplitBillPage() {
  const [items, setItems] = useState<Item[]>([
    { id: 1, name: "Ayam Goreng", price: "25000", qty: "2" },
    { id: 2, name: "Es Teh", price: "8000", qty: "3" },
  ]);
  const [people, setPeople] = useState<Person[]>([
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
    { id: 3, name: "Charlie" },
  ]);
  const [tip, setTip] = useState("10");
  const [tax, setTax] = useState("11");
  const [nextItemId, setNextItemId] = useState(3);
  const [nextPersonId, setNextPersonId] = useState(4);

  const fmt = (n: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

  const subtotal = useMemo(
    () =>
      items.reduce((acc, item) => {
        const p = parseFloat(item.price) || 0;
        const q = parseFloat(item.qty) || 1;
        return acc + p * q;
      }, 0),
    [items]
  );

  const taxAmount = (subtotal * (parseFloat(tax) || 0)) / 100;
  const tipAmount = (subtotal * (parseFloat(tip) || 0)) / 100;
  const total = subtotal + taxAmount + tipAmount;
  const perPerson = people.length > 0 ? total / people.length : 0;

  const addItem = () => {
    setItems((prev) => [...prev, { id: nextItemId, name: "", price: "", qty: "1" }]);
    setNextItemId((n) => n + 1);
  };

  const removeItem = (id: number) => setItems((prev) => prev.filter((i) => i.id !== id));

  const updateItem = (id: number, field: keyof Item, value: string) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
  };

  const addPerson = () => {
    setPeople((prev) => [...prev, { id: nextPersonId, name: `Orang ${nextPersonId}` }]);
    setNextPersonId((n) => n + 1);
  };

  const removePerson = (id: number) => setPeople((prev) => prev.filter((p) => p.id !== id));

  const updatePerson = (id: number, name: string) => {
    setPeople((prev) => prev.map((p) => (p.id === id ? { ...p, name } : p)));
  };

  const TIP_PRESETS = ["0", "5", "10", "15", "20"];

  return (
    <ToolLayout title="Split Bill Calculator" description="Hitung pembagian tagihan restoran untuk banyak orang.">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Items + People */}
        <div className="space-y-5">
          {/* Items */}
          <div className="bg-surface rounded-xl p-5 border border-line">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-soft flex items-center gap-2">
                <Receipt size={16} className="text-primary" />
                Daftar Item
              </h2>
              <button
                onClick={addItem}
                className="flex items-center gap-1 text-xs text-primary hover:opacity-80 transition-opacity"
              >
                <Plus size={14} /> Tambah
              </button>
            </div>

            <div className="space-y-2">
              <div className="grid grid-cols-[1fr_auto_auto_auto] gap-2 text-xs text-muted px-1">
                <span>Item</span>
                <span className="w-24 text-right">Harga</span>
                <span className="w-10 text-center">Qty</span>
                <span className="w-6" />
              </div>
              {items.map((item) => (
                <div key={item.id} className="grid grid-cols-[1fr_auto_auto_auto] gap-2 items-center">
                  <input
                    className="bg-bg border border-line rounded-lg px-3 py-2 text-sm text-soft focus:outline-none focus:border-primary"
                    value={item.name}
                    onChange={(e) => updateItem(item.id, "name", e.target.value)}
                    placeholder="Nama item"
                  />
                  <input
                    className="w-24 bg-bg border border-line rounded-lg px-3 py-2 text-sm text-soft text-right focus:outline-none focus:border-primary"
                    value={item.price}
                    onChange={(e) => updateItem(item.id, "price", e.target.value.replace(/\D/g, ""))}
                    placeholder="0"
                  />
                  <input
                    type="number"
                    className="w-10 bg-bg border border-line rounded-lg px-2 py-2 text-sm text-soft text-center focus:outline-none focus:border-primary"
                    value={item.qty}
                    onChange={(e) => updateItem(item.id, "qty", e.target.value)}
                    min="1"
                  />
                  <button
                    onClick={() => removeItem(item.id)}
                    className="w-6 h-6 flex items-center justify-center text-muted hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* People */}
          <div className="bg-surface rounded-xl p-5 border border-line">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-soft flex items-center gap-2">
                <Users size={16} className="text-primary" />
                Orang ({people.length})
              </h2>
              <button
                onClick={addPerson}
                className="flex items-center gap-1 text-xs text-primary hover:opacity-80 transition-opacity"
              >
                <Plus size={14} /> Tambah
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {people.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-1 bg-bg border border-line rounded-full pl-3 pr-1.5 py-1"
                >
                  <input
                    className="text-sm text-soft bg-transparent focus:outline-none w-20"
                    value={p.name}
                    onChange={(e) => updatePerson(p.id, e.target.value)}
                  />
                  <button
                    onClick={() => removePerson(p.id)}
                    className="text-muted hover:text-red-400 transition-colors ml-1"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Tax & Tip */}
          <div className="bg-surface rounded-xl p-5 border border-line">
            <h2 className="font-semibold text-soft mb-4">Pajak & Tips</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted mb-1 block">PPN / Tax (%)</label>
                <input
                  type="number"
                  className="w-full bg-bg border border-line rounded-lg px-3 py-2 text-soft text-sm focus:outline-none focus:border-primary"
                  value={tax}
                  onChange={(e) => setTax(e.target.value)}
                  min="0"
                  max="100"
                />
              </div>
              <div>
                <label className="text-xs text-muted mb-1 block">Tips (%)</label>
                <input
                  type="number"
                  className="w-full bg-bg border border-line rounded-lg px-3 py-2 text-soft text-sm focus:outline-none focus:border-primary"
                  value={tip}
                  onChange={(e) => setTip(e.target.value)}
                  min="0"
                  max="100"
                />
                <div className="flex gap-1 mt-2 flex-wrap">
                  {TIP_PRESETS.map((t) => (
                    <button
                      key={t}
                      onClick={() => setTip(t)}
                      className={`text-xs px-2 py-0.5 rounded-full border transition-colors ${
                        tip === t
                          ? "bg-primary text-white border-primary"
                          : "border-line text-muted hover:border-primary"
                      }`}
                    >
                      {t}%
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Summary */}
        <div className="space-y-4">
          <div className="bg-surface rounded-xl p-5 border border-line space-y-3">
            <h2 className="font-semibold text-soft">Ringkasan</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-muted">
                <span>Subtotal ({items.length} item)</span>
                <span className="text-soft">{fmt(subtotal)}</span>
              </div>
              {parseFloat(tax) > 0 && (
                <div className="flex justify-between text-muted">
                  <span>PPN {tax}%</span>
                  <span className="text-soft">{fmt(taxAmount)}</span>
                </div>
              )}
              {parseFloat(tip) > 0 && (
                <div className="flex justify-between text-muted">
                  <span>Tips {tip}%</span>
                  <span className="text-soft">{fmt(tipAmount)}</span>
                </div>
              )}
              <div className="border-t border-line pt-2 flex justify-between font-semibold text-soft">
                <span>Total</span>
                <span>{fmt(total)}</span>
              </div>
            </div>
          </div>

          {/* Per person */}
          <div className="bg-surface rounded-xl p-5 border border-line">
            <p className="text-xs text-muted mb-1">Bayar per Orang</p>
            <p className="text-3xl font-bold text-primary">{people.length > 0 ? fmt(perPerson) : "-"}</p>
            {people.length > 0 && (
              <p className="text-xs text-muted mt-1">dibagi {people.length} orang</p>
            )}
          </div>

          {/* Individual cards */}
          {people.length > 0 && (
            <div className="bg-surface rounded-xl p-5 border border-line">
              <h3 className="font-semibold text-soft mb-3 text-sm">Detail per Orang</h3>
              <div className="space-y-2">
                {people.map((p, i) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between bg-bg rounded-lg px-4 py-2.5 border border-line"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                        {(p.name || `P${i + 1}`).charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm text-soft">{p.name || `Orang ${i + 1}`}</span>
                    </div>
                    <span className="text-sm font-semibold text-soft">{fmt(perPerson)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
