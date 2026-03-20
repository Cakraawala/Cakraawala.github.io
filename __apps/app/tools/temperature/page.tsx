"use client";
import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";

type TempUnit = "celsius" | "fahrenheit" | "kelvin";

const unitConfig: { key: TempUnit; label: string; symbol: string; color: string }[] = [
  { key: "celsius",    label: "Celsius",    symbol: "°C", color: "text-blue-400" },
  { key: "fahrenheit", label: "Fahrenheit", symbol: "°F", color: "text-orange-400" },
  { key: "kelvin",     label: "Kelvin",     symbol: "K",  color: "text-violet-400" },
];

function toKelvin(value: number, from: TempUnit): number {
  if (from === "celsius")    return value + 273.15;
  if (from === "fahrenheit") return (value - 32) * (5 / 9) + 273.15;
  return value;
}

function fromKelvin(k: number, to: TempUnit): number {
  if (to === "celsius")    return k - 273.15;
  if (to === "fahrenheit") return (k - 273.15) * (9 / 5) + 32;
  return k;
}

function convert(value: number, from: TempUnit, to: TempUnit): string {
  if (isNaN(value)) return "";
  const kelvin = toKelvin(value, from);
  const result = fromKelvin(kelvin, to);
  return parseFloat(result.toFixed(6)).toString();
}

const presets = [
  { label: "Air mendidih", celsius: 100 },
  { label: "Suhu tubuh",   celsius: 37 },
  { label: "Room temp",    celsius: 22 },
  { label: "Air membeku",  celsius: 0 },
  { label: "Nitrogen cair",celsius: -196 },
];

export default function TemperaturePage() {
  const [values, setValues] = useState<Record<TempUnit, string>>({
    celsius: "",
    fahrenheit: "",
    kelvin: "",
  });

  const handleChange = (unit: TempUnit, raw: string) => {
    const num = parseFloat(raw);
    if (raw === "" || raw === "-") {
      setValues({ celsius: raw === "-" ? (unit === "celsius" ? "-" : "") : "", fahrenheit: raw === "-" ? (unit === "fahrenheit" ? "-" : "") : "", kelvin: raw === "-" ? (unit === "kelvin" ? "-" : "") : "" });
      if (raw === "-") setValues((prev) => ({ ...prev, [unit]: "-" }));
      else setValues({ celsius: "", fahrenheit: "", kelvin: "" });
      return;
    }
    if (isNaN(num)) return;
    setValues({
      celsius:    unit === "celsius"    ? raw : convert(num, unit, "celsius"),
      fahrenheit: unit === "fahrenheit" ? raw : convert(num, unit, "fahrenheit"),
      kelvin:     unit === "kelvin"     ? raw : convert(num, unit, "kelvin"),
    });
  };

  const applyPreset = (celsius: number) => {
    setValues({
      celsius:    celsius.toString(),
      fahrenheit: convert(celsius, "celsius", "fahrenheit"),
      kelvin:     convert(celsius, "celsius", "kelvin"),
    });
  };

  return (
    <ToolLayout
      title="Temperature Converter"
      description="Konversi Celsius, Fahrenheit, dan Kelvin secara instan."
    >
      <div className="max-w-xl mx-auto space-y-6">
        {/* Inputs */}
        <div className="space-y-3">
          {unitConfig.map(({ key, label, symbol, color }) => (
            <div key={key} className="bg-surface border border-line rounded-2xl p-5">
              <label className="text-xs text-muted font-mono mb-2 block">{label}</label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={values[key]}
                  onChange={(e) => handleChange(key, e.target.value)}
                  placeholder="0"
                  className="flex-1 bg-bg border border-line rounded-xl px-4 py-3 text-soft text-2xl font-mono focus:outline-none focus:border-white/20 transition-colors placeholder:text-muted/30"
                />
                <span className={`text-2xl font-mono font-bold ${color} w-12 text-right`}>
                  {symbol}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Presets */}
        <div>
          <p className="text-xs text-muted font-mono mb-3">Preset umum</p>
          <div className="flex flex-wrap gap-2">
            {presets.map((p) => (
              <button
                key={p.label}
                onClick={() => applyPreset(p.celsius)}
                className="px-3 py-1.5 rounded-xl bg-surface border border-line text-muted text-xs font-mono hover:text-soft hover:border-white/10 transition-all"
              >
                {p.label}
                <span className="ml-1.5 text-primary opacity-70">{p.celsius}°C</span>
              </button>
            ))}
          </div>
        </div>

        {/* Formula reference */}
        <div className="bg-surface border border-line rounded-2xl p-5 space-y-2">
          <p className="text-xs text-muted font-mono mb-3">Rumus konversi</p>
          <p className="text-xs text-soft font-mono">°F = (°C × 9/5) + 32</p>
          <p className="text-xs text-soft font-mono">K  = °C + 273.15</p>
          <p className="text-xs text-soft font-mono">°C = (°F − 32) × 5/9</p>
        </div>
      </div>
    </ToolLayout>
  );
}
