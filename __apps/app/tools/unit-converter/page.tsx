"use client";
import { useState } from "react";
import { ArrowLeftRight } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";

type UnitCategory = "length" | "area" | "volume";

const categories: { key: UnitCategory; label: string }[] = [
  { key: "length", label: "Panjang" },
  { key: "area", label: "Luas" },
  { key: "volume", label: "Volume" },
];

const units: Record<UnitCategory, { key: string; label: string; symbol: string; factor: number }[]> = {
  length: [
    { key: "km",  label: "Kilometer",   symbol: "km",  factor: 0.001 },
    { key: "m",   label: "Meter",        symbol: "m",   factor: 1 },
    { key: "cm",  label: "Sentimeter",   symbol: "cm",  factor: 100 },
    { key: "mm",  label: "Milimeter",    symbol: "mm",  factor: 1000 },
    { key: "mi",  label: "Mil",          symbol: "mi",  factor: 0.000621371 },
    { key: "yd",  label: "Yard",         symbol: "yd",  factor: 1.09361 },
    { key: "ft",  label: "Kaki (feet)",  symbol: "ft",  factor: 3.28084 },
    { key: "in",  label: "Inci",         symbol: "in",  factor: 39.3701 },
    { key: "nm",  label: "Mil Laut",     symbol: "nmi", factor: 0.000539957 },
  ],
  area: [
    { key: "km2",  label: "Km²",       symbol: "km²",  factor: 0.000001 },
    { key: "m2",   label: "Meter²",    symbol: "m²",   factor: 1 },
    { key: "cm2",  label: "Cm²",       symbol: "cm²",  factor: 10000 },
    { key: "ha",   label: "Hektar",    symbol: "ha",   factor: 0.0001 },
    { key: "ac",   label: "Acre",      symbol: "ac",   factor: 0.000247105 },
    { key: "mi2",  label: "Mil²",      symbol: "mi²",  factor: 3.861e-7 },
    { key: "ft2",  label: "Kaki²",     symbol: "ft²",  factor: 10.7639 },
    { key: "in2",  label: "Inci²",     symbol: "in²",  factor: 1550 },
  ],
  volume: [
    { key: "l",    label: "Liter",       symbol: "L",    factor: 1 },
    { key: "ml",   label: "Mililiter",   symbol: "mL",   factor: 1000 },
    { key: "m3",   label: "Meter³",      symbol: "m³",   factor: 0.001 },
    { key: "cm3",  label: "Cm³",         symbol: "cm³",  factor: 1000 },
    { key: "gal",  label: "Galon (US)",  symbol: "gal",  factor: 0.264172 },
    { key: "qt",   label: "Quart",       symbol: "qt",   factor: 1.05669 },
    { key: "pt",   label: "Pint",        symbol: "pt",   factor: 2.11338 },
    { key: "cup",  label: "Cup",         symbol: "cup",  factor: 4.22675 },
    { key: "floz", label: "Fl. Ounce",   symbol: "fl oz",factor: 33.814 },
    { key: "tbsp", label: "Sendok Makan",symbol: "tbsp", factor: 67.628 },
    { key: "tsp",  label: "Sendok Teh",  symbol: "tsp",  factor: 202.884 },
  ],
};

function convert(value: number, fromFactor: number, toFactor: number): string {
  if (isNaN(value)) return "";
  const result = (value / fromFactor) * toFactor;
  if (result === 0) return "0";
  if (Math.abs(result) >= 1e9 || (Math.abs(result) < 0.0001 && result !== 0)) {
    return result.toExponential(6);
  }
  return result.toPrecision(10).replace(/\.?0+$/, "");
}

export default function UnitConverterPage() {
  const [category, setCategory] = useState<UnitCategory>("length");
  const [inputValue, setInputValue] = useState("");
  const [fromUnit, setFromUnit] = useState("m");

  const currentUnits = units[category];
  const from = currentUnits.find((u) => u.key === fromUnit) ?? currentUnits[0];
  const parsedInput = parseFloat(inputValue);

  const handleCategoryChange = (cat: UnitCategory) => {
    setCategory(cat);
    setFromUnit(units[cat][1]?.key ?? units[cat][0].key);
    setInputValue("");
  };

  return (
    <ToolLayout
      title="Unit Converter"
      description="Konversi panjang, luas, dan volume secara instan."
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Category tabs */}
        <div className="flex gap-2 flex-wrap">
          {categories.map((c) => (
            <button
              key={c.key}
              onClick={() => handleCategoryChange(c.key)}
              className={`px-4 py-1.5 rounded-full text-xs font-mono border transition-all duration-200 ${
                category === c.key
                  ? "bg-primary/10 border-primary/40 text-primary"
                  : "bg-surface border-line text-muted hover:text-soft hover:border-white/10"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Input */}
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
          <div className="sm:min-w-[190px]">
            <label className="text-xs text-muted font-mono mb-1.5 block">Dari satuan</label>
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="w-full bg-bg border border-line rounded-xl px-4 py-3 text-soft text-sm focus:outline-none focus:border-white/20 transition-colors cursor-pointer"
            >
              {currentUnits.map((u) => (
                <option key={u.key} value={u.key}>
                  {u.label} ({u.symbol})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results */}
        <div className="grid sm:grid-cols-2 gap-3">
          {currentUnits.map((toUnit) => {
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
                className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 text-left group ${
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
                  <span className={`text-xs px-2 py-0.5 rounded-md border font-mono ${
                    isSource ? "text-primary border-primary/30 bg-primary/5" : "text-muted border-line"
                  }`}>
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
          klik hasil untuk swap · basis konversi standar SI
        </p>
      </div>
    </ToolLayout>
  );
}
