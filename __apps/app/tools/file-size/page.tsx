"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Copy, Check } from "lucide-react";

type Unit = "bit" | "byte" | "KB" | "MB" | "GB" | "TB" | "PB";

const UNITS: { unit: Unit; label: string; bytes: number }[] = [
  { unit: "bit",  label: "Bit (b)",       bytes: 1 / 8 },
  { unit: "byte", label: "Byte (B)",       bytes: 1 },
  { unit: "KB",   label: "Kilobyte (KB)",  bytes: 1024 },
  { unit: "MB",   label: "Megabyte (MB)",  bytes: 1024 ** 2 },
  { unit: "GB",   label: "Gigabyte (GB)",  bytes: 1024 ** 3 },
  { unit: "TB",   label: "Terabyte (TB)",  bytes: 1024 ** 4 },
  { unit: "PB",   label: "Petabyte (PB)",  bytes: 1024 ** 5 },
];

function toBytes(value: number, unit: Unit): number {
  const u = UNITS.find((u) => u.unit === unit)!;
  return value * u.bytes;
}

function fromBytes(bytes: number, unit: Unit): number {
  const u = UNITS.find((u) => u.unit === unit)!;
  return bytes / u.bytes;
}

function prettyNum(n: number): string {
  if (n === 0) return "0";
  if (!isFinite(n)) return "∞";
  const abs = Math.abs(n);
  if (abs >= 1e15) return n.toExponential(4);
  if (abs >= 0.0001 || abs === 0) {
    const str = n.toPrecision(10).replace(/\.?0+$/, "");
    return parseFloat(str).toLocaleString("en-US", { maximumFractionDigits: 10 });
  }
  return n.toExponential(4);
}

export default function FileSizeConverterPage() {
  const [value, setValue] = useState("1");
  const [fromUnit, setFromUnit] = useState<Unit>("GB");
  const [copied, setCopied] = useState<string | null>(null);

  const bytes = toBytes(parseFloat(value) || 0, fromUnit);

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  };

  const QUICK = [
    { label: "1 Foto (3 MB)", value: "3", unit: "MB" as Unit },
    { label: "1 Lagu (4 MB)", value: "4", unit: "MB" as Unit },
    { label: "1 Film HD (4 GB)", value: "4", unit: "GB" as Unit },
    { label: "1 GB Storage", value: "1", unit: "GB" as Unit },
    { label: "512 KB Dokumen", value: "512", unit: "KB" as Unit },
    { label: "1 TB Drive", value: "1", unit: "TB" as Unit },
  ];

  return (
    <ToolLayout title="File Size Converter" description="Konversi satuan ukuran file: Bit, Byte, KB, MB, GB, TB, PB.">
      <div className="max-w-2xl mx-auto space-y-5">
        {/* Input */}
        <div className="bg-surface rounded-xl p-5 border border-line">
          <label className="text-xs text-muted mb-2 block">Masukkan Ukuran</label>
          <div className="flex gap-3">
            <input
              type="number"
              className="flex-1 bg-bg border border-line rounded-lg px-4 py-3 text-2xl font-semibold text-soft focus:outline-none focus:border-primary"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              min="0"
            />
            <select
              className="bg-bg border border-line rounded-lg px-4 py-3 text-soft font-medium focus:outline-none focus:border-primary text-sm"
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value as Unit)}
            >
              {UNITS.map((u) => (
                <option key={u.unit} value={u.unit}>
                  {u.unit}
                </option>
              ))}
            </select>
          </div>

          {/* Quick presets */}
          <div className="mt-3 flex flex-wrap gap-2">
            {QUICK.map((q) => (
              <button
                key={q.label}
                onClick={() => { setValue(q.value); setFromUnit(q.unit); }}
                className="text-xs px-3 py-1.5 bg-bg border border-line rounded-full text-muted hover:border-primary hover:text-soft transition-colors"
              >
                {q.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="bg-surface rounded-xl border border-line overflow-hidden">
          {UNITS.map((u) => {
            const converted = fromBytes(bytes, u.unit);
            const display = prettyNum(converted);
            const isCurrent = u.unit === fromUnit;
            return (
              <div
                key={u.unit}
                className={`flex items-center justify-between px-5 py-3.5 border-b border-line last:border-0 transition-colors ${
                  isCurrent ? "bg-primary/10" : "hover:bg-bg"
                }`}
              >
                <div>
                  <span className={`text-sm font-semibold ${isCurrent ? "text-primary" : "text-soft"}`}>
                    {display}
                  </span>
                  <span className="text-xs text-muted ml-2">{u.label}</span>
                </div>
                <button
                  onClick={() => copy(display, u.unit)}
                  className="p-1.5 text-muted hover:text-soft transition-colors"
                >
                  {copied === u.unit ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                </button>
              </div>
            );
          })}
        </div>

        {/* Binary info */}
        <div className="bg-surface rounded-xl p-5 border border-line">
          <h3 className="text-sm font-semibold text-soft mb-3">Referensi Cepat</h3>
          <div className="grid grid-cols-2 gap-2 text-xs text-muted">
            {[
              ["1 KB", "1,024 Byte"],
              ["1 MB", "1,024 KB = 1,048,576 Byte"],
              ["1 GB", "1,024 MB"],
              ["1 TB", "1,024 GB"],
            ].map(([a, b]) => (
              <div key={a} className="bg-bg rounded-lg px-3 py-2 border border-line">
                <span className="text-soft font-medium">{a}</span> = {b}
              </div>
            ))}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
