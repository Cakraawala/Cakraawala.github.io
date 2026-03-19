"use client";
import { useState } from "react";
import { ArrowLeftRight } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";

const units = [
  { key: "kg",    label: "Kilogram",     symbol: "kg",  factor: 1 },
  { key: "g",     label: "Gram",         symbol: "g",   factor: 1000 },
  { key: "mg",    label: "Miligram",     symbol: "mg",  factor: 1_000_000 },
  { key: "ton",   label: "Ton (metrik)", symbol: "t",   factor: 0.001 },
  { key: "ons",   label: "Ons (100 g)",  symbol: "ons", factor: 10 },
  { key: "lbs",   label: "Pound",        symbol: "lbs", factor: 2.20462 },
  { key: "oz",    label: "Ounce",        symbol: "oz",  factor: 35.274 },
  { key: "grain", label: "Grain",        symbol: "gr",  factor: 15432.4 },
];

function convert(value: number, fromFactor: number, toFactor: number): string {
  if (isNaN(value)) return "";
  const result = (value / fromFactor) * toFactor;
  if (result === 0) return "0";
  if (Math.abs(result) >= 1e9 || (Math.abs(result) < 0.0001 && result !== 0)) {
    return result.toExponential(6);
  }
  return result.toPrecision(10).replace(/\.?0+$/, "");
}

export default function WeightConverterPage() {
  const [inputValue, setInputValue] = useState("");
  const [fromUnit, setFromUnit] = useState("kg");

  const from = units.find((u) => u.key === fromUnit)!;
  const parsedInput = parseFloat(inputValue);

  return (
    <ToolLayout
      title="Weight Converter"
      description="Konversi satuan berat secara instan. Ketik nilai dan pilih satuan asal."
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Input area */}
        <div className="bg-surface border border-line rounded-2xl p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex-1">
            <label className="text-xs text-muted font-mono mb-1.5 block">Nilai</label>
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="0"
              className="w-full bg-bg border border-line rounded-xl px-4 py-3 text-soft text-2xl font-mono focus:outline-none focus:border-white/20 transition-colors placeholder:text-muted/30"
            />
          </div>
          <div className="sm:min-w-[180px]">
            <label className="text-xs text-muted font-mono mb-1.5 block">Dari satuan</label>
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="w-full bg-bg border border-line rounded-xl px-4 py-3 text-soft text-sm focus:outline-none focus:border-white/20 transition-colors cursor-pointer"
            >
              {units.map((u) => (
                <option key={u.key} value={u.key}>
                  {u.label} ({u.symbol})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results grid */}
        <div className="grid sm:grid-cols-2 gap-3">
          {units.map((toUnit) => {
            const result =
              inputValue !== "" && !isNaN(parsedInput)
                ? convert(parsedInput, from.factor, toUnit.factor)
                : "~";
            const isSource = toUnit.key === fromUnit;

            return (
              <button
                key={toUnit.key}
                onClick={() => {
                  if (!isSource && result !== "~") {
                    setInputValue(result);
                    setFromUnit(toUnit.key);
                  }
                }}
                className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 text-left group
                  ${
                    isSource
                      ? "bg-primary/10 border-primary/30 cursor-default"
                      : "bg-surface border-line hover:border-white/10 hover:bg-white/[0.04] cursor-pointer"
                  }`}
              >
                <div>
                  <div className="text-xs text-muted font-mono mb-1">{toUnit.label}</div>
                  <div className={`text-lg font-mono font-medium ${isSource ? "text-primary" : "text-soft"}`}>
                    {result}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-md border font-mono ${
                      isSource
                        ? "text-primary border-primary/30 bg-primary/5"
                        : "text-muted border-line"
                    }`}
                  >
                    {toUnit.symbol}
                  </span>
                  {!isSource && result !== "~" && (
                    <ArrowLeftRight size={12} className="text-muted/30 group-hover:text-muted transition-colors" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <p className="text-center text-muted/30 text-xs font-mono">
          klik hasil untuk swap Â· basis konversi metrik standar
        </p>
      </div>
    </ToolLayout>
  );
}
