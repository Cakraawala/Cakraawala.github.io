"use client";

import { useState, useCallback } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Copy, Check, RefreshCw, Trash2, Plus } from "lucide-react";

function generateUUID(): string {
  const buf = new Uint8Array(16);
  crypto.getRandomValues(buf);
  buf[6] = (buf[6] & 0x0f) | 0x40; // version 4
  buf[8] = (buf[8] & 0x3f) | 0x80; // variant
  const hex = Array.from(buf).map((b) => b.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export default function UUIDGeneratorPage() {
  const [uuids, setUuids] = useState<string[]>(() => [generateUUID()]);
  const [count, setCount] = useState("5");
  const [uppercase, setUppercase] = useState(false);
  const [noDash, setNoDash] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const transform = useCallback(
    (id: string) => {
      let s = id;
      if (noDash) s = s.replace(/-/g, "");
      if (uppercase) s = s.toUpperCase();
      return s;
    },
    [uppercase, noDash]
  );

  const generate = () => {
    const n = Math.min(Math.max(parseInt(count) || 1, 1), 100);
    setUuids(Array.from({ length: n }, generateUUID));
  };

  const addOne = () => setUuids((prev) => [...prev, generateUUID()]);

  const removeOne = (idx: number) => setUuids((prev) => prev.filter((_, i) => i !== idx));

  const copyOne = (uuid: string) => {
    navigator.clipboard.writeText(transform(uuid));
    setCopied(uuid);
    setTimeout(() => setCopied(null), 1500);
  };

  const copyAll = () => {
    navigator.clipboard.writeText(uuids.map(transform).join("\n"));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 1500);
  };

  return (
    <ToolLayout title="UUID Generator" description="Generate UUID v4 acak untuk kebutuhan identifier unik.">
      <div className="max-w-2xl mx-auto space-y-5">
        {/* Controls */}
        <div className="bg-surface rounded-xl p-5 border border-line">
          <div className="flex flex-wrap gap-3 items-end">
            <div className="flex-1 min-w-[140px]">
              <label className="text-xs text-muted mb-1 block">Jumlah UUID</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  className="w-20 bg-bg border border-line rounded-lg px-3 py-2 text-soft focus:outline-none focus:border-primary"
                  value={count}
                  onChange={(e) => setCount(e.target.value)}
                  min="1"
                  max="100"
                />
                <button
                  onClick={generate}
                  className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  <RefreshCw size={14} />
                  Generate
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <div
                  onClick={() => setUppercase(!uppercase)}
                  className={`w-9 h-5 rounded-full transition-colors relative ${uppercase ? "bg-primary" : "bg-line"}`}
                >
                  <div
                    className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${uppercase ? "left-4" : "left-0.5"}`}
                  />
                </div>
                <span className="text-xs text-soft">Uppercase</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <div
                  onClick={() => setNoDash(!noDash)}
                  className={`w-9 h-5 rounded-full transition-colors relative ${noDash ? "bg-primary" : "bg-line"}`}
                >
                  <div
                    className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${noDash ? "left-4" : "left-0.5"}`}
                  />
                </div>
                <span className="text-xs text-soft">Hapus Dash</span>
              </label>
            </div>
          </div>
        </div>

        {/* UUID List */}
        <div className="bg-surface rounded-xl border border-line overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-line">
            <span className="text-sm font-semibold text-soft">{uuids.length} UUID</span>
            <div className="flex gap-2">
              <button
                onClick={addOne}
                className="flex items-center gap-1 text-xs text-muted hover:text-soft transition-colors"
              >
                <Plus size={13} /> Tambah
              </button>
              <button
                onClick={copyAll}
                className="flex items-center gap-1 text-xs text-primary hover:opacity-80 transition-opacity"
              >
                {copiedAll ? <Check size={13} /> : <Copy size={13} />}
                Salin Semua
              </button>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {uuids.map((uuid, idx) => {
              const display = transform(uuid);
              return (
                <div
                  key={uuid}
                  className="flex items-center justify-between px-5 py-3 border-b border-line/50 last:border-0 hover:bg-bg group"
                >
                  <span className="font-mono text-sm text-soft break-all">{display}</span>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-3">
                    <button onClick={() => copyOne(uuid)} className="p-1.5 text-muted hover:text-soft transition-colors">
                      {copied === uuid ? <Check size={13} className="text-green-400" /> : <Copy size={13} />}
                    </button>
                    <button onClick={() => removeOne(idx)} className="p-1.5 text-muted hover:text-red-400 transition-colors">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Info */}
        <div className="bg-surface rounded-xl p-5 border border-line">
          <h3 className="text-sm font-semibold text-soft mb-2">Tentang UUID v4</h3>
          <p className="text-xs text-muted leading-relaxed">
            UUID (Universally Unique Identifier) v4 adalah 128-bit identifier yang di-generate secara acak menggunakan{" "}
            <code className="bg-bg border border-line px-1 rounded text-soft">crypto.getRandomValues()</code>. Peluang
            tabrakan (collision) sangat kecil - sekitar 1 dalam 5.3 × 10³⁶ untuk setiap generasi.
          </p>
          <p className="text-xs text-muted mt-2">Format: <code className="font-mono text-soft">xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx</code></p>
        </div>
      </div>
    </ToolLayout>
  );
}
