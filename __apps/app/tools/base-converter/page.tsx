"use client";
import { useState } from "react";
import { Copy, Check } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";

type Base = 2 | 8 | 10 | 16;

const bases: { key: Base; label: string; prefix: string; chars: RegExp }[] = [
  { key: 2,  label: "Binary",      prefix: "0b", chars: /^[01]*$/ },
  { key: 8,  label: "Octal",       prefix: "0o", chars: /^[0-7]*$/ },
  { key: 10, label: "Decimal",     prefix: "",   chars: /^-?[0-9]*$/ },
  { key: 16, label: "Hexadecimal", prefix: "0x", chars: /^[0-9a-fA-F]*$/ },
];

const colorMap: Record<Base, string> = {
  2:  "text-blue-400 border-blue-400/20 bg-blue-400/5",
  8:  "text-amber-400 border-amber-400/20 bg-amber-400/5",
  10: "text-emerald-400 border-emerald-400/20 bg-emerald-400/5",
  16: "text-violet-400 border-violet-400/20 bg-violet-400/5",
};

export default function BaseConverterPage() {
  const [values, setValues] = useState<Record<Base, string>>({ 2: "", 8: "", 10: "", 16: "" });
  const [copied, setCopied] = useState<Base | null>(null);

  const handleChange = (base: Base, raw: string) => {
    const config = bases.find((b) => b.key === base)!;
    const cleaned = raw.toUpperCase().replace(/\s/g, "");
    if (cleaned !== "" && !config.chars.test(cleaned)) return;

    if (cleaned === "" || cleaned === "-") {
      setValues({ 2: "", 8: "", 10: "", 16: "" });
      if (cleaned === "-" && base === 10) setValues((v) => ({ ...v, 10: "-" }));
      return;
    }

    const decimal = parseInt(cleaned, base);
    if (isNaN(decimal)) return;

    setValues({
      2:  decimal.toString(2),
      8:  decimal.toString(8),
      10: decimal.toString(10),
      16: decimal.toString(16).toUpperCase(),
    });
  };

  const copy = async (base: Base) => {
    await navigator.clipboard.writeText(values[base]);
    setCopied(base);
    setTimeout(() => setCopied(null), 2000);
  };

  const quickValues = [0, 1, 10, 42, 255, 1024, 65535];

  return (
    <ToolLayout
      title="Base Converter"
      description="Konversi bilangan antara biner, oktal, desimal, dan heksadesimal."
    >
      <div className="max-w-xl mx-auto space-y-6">
        {/* Inputs */}
        <div className="space-y-3">
          {bases.map(({ key, label, prefix }) => (
            <div key={key} className="bg-surface border border-line rounded-2xl p-5">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs text-muted font-mono">{label} (Base {key})</label>
                {values[key] && (
                  <button
                    onClick={() => copy(key)}
                    className="flex items-center gap-1 text-[10px] font-mono text-muted hover:text-soft transition-colors"
                  >
                    {copied === key ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                    {copied === key ? "Copied!" : "Copy"}
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2">
                {prefix && (
                  <span className={`text-sm font-mono px-2 py-1 rounded-lg border ${colorMap[key]}`}>
                    {prefix}
                  </span>
                )}
                <input
                  type="text"
                  value={values[key]}
                  onChange={(e) => handleChange(key, e.target.value)}
                  placeholder={`Masukkan nilai ${label.toLowerCase()}...`}
                  spellCheck={false}
                  className="flex-1 bg-bg border border-line rounded-xl px-4 py-3 text-soft text-lg font-mono focus:outline-none focus:border-white/20 transition-colors placeholder:text-muted/30"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Quick picks */}
        <div>
          <p className="text-xs text-muted font-mono mb-3">Nilai cepat</p>
          <div className="flex flex-wrap gap-2">
            {quickValues.map((n) => (
              <button
                key={n}
                onClick={() => handleChange(10, n.toString())}
                className="px-3 py-1.5 rounded-xl bg-surface border border-line text-muted text-xs font-mono hover:text-soft hover:border-white/10 transition-all"
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Bit info */}
        {values[10] !== "" && !isNaN(parseInt(values[10])) && (
          <div className="bg-surface border border-line rounded-2xl p-5">
            <p className="text-xs text-muted font-mono mb-3">Info</p>
            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div>
                <span className="text-muted">Decimal: </span>
                <span className="text-soft">{parseInt(values[10])}</span>
              </div>
              <div>
                <span className="text-muted">Bits: </span>
                <span className="text-soft">{values[2].length}</span>
              </div>
              <div>
                <span className="text-muted">Bytes: </span>
                <span className="text-soft">{Math.ceil(values[2].length / 8)}</span>
              </div>
              <div>
                <span className="text-muted">Positif: </span>
                <span className={parseInt(values[10]) >= 0 ? "text-emerald-400" : "text-red-400"}>
                  {parseInt(values[10]) >= 0 ? "Ya" : "Tidak"}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
