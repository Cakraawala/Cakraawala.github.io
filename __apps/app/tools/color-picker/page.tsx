"use client";
import { useState, useCallback } from "react";
import { Copy, Check } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return m ? { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) } : null;
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  h /= 360; s /= 100; l /= 100;
  let r, g, b;
  if (s === 0) { r = g = b = l; } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1; if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
      className="p-1.5 rounded-lg text-muted hover:text-soft hover:bg-white/[0.06] transition-all"
    >
      {copied ? <Check size={13} className="text-primary" /> : <Copy size={13} />}
    </button>
  );
}

export default function ColorPickerPage() {
  const [hex, setHex] = useState("#3B82F6");
  const [rgbInput, setRgbInput] = useState({ r: "59", g: "130", b: "246" });
  const [hslInput, setHslInput] = useState({ h: "215", s: "91", l: "60" });

  const rgb = hexToRgb(hex);
  const hsl = rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null;

  const updateFromHex = useCallback((val: string) => {
    const clean = val.startsWith("#") ? val : "#" + val;
    setHex(clean);
    const r = hexToRgb(clean);
    if (r) {
      setRgbInput({ r: String(r.r), g: String(r.g), b: String(r.b) });
      const h = rgbToHsl(r.r, r.g, r.b);
      setHslInput({ h: String(h.h), s: String(h.s), l: String(h.l) });
    }
  }, []);

  const updateFromRgb = useCallback((field: "r" | "g" | "b", val: string) => {
    const next = { ...rgbInput, [field]: val };
    setRgbInput(next);
    const r = parseInt(next.r), g = parseInt(next.g), b = parseInt(next.b);
    if ([r, g, b].every((v) => !isNaN(v) && v >= 0 && v <= 255)) {
      const h = rgbToHex(r, g, b);
      setHex(h);
      const hsl = rgbToHsl(r, g, b);
      setHslInput({ h: String(hsl.h), s: String(hsl.s), l: String(hsl.l) });
    }
  }, [rgbInput]);

  const updateFromHsl = useCallback((field: "h" | "s" | "l", val: string) => {
    const next = { ...hslInput, [field]: val };
    setHslInput(next);
    const h = parseInt(next.h), s = parseInt(next.s), l = parseInt(next.l);
    if (!isNaN(h) && !isNaN(s) && !isNaN(l)) {
      const r = hslToRgb(h, s, l);
      setHex(rgbToHex(r.r, r.g, r.b));
      setRgbInput({ r: String(r.r), g: String(r.g), b: String(r.b) });
    }
  }, [hslInput]);

  const rgbStr = rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : "";
  const hslStr = hsl ? `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` : "";

  const presets = ["#EF4444","#F97316","#EAB308","#22C55E","#3B82F6","#8B5CF6","#EC4899","#FAFAFA","#A1A1AA","#0A0A0A"];

  return (
    <ToolLayout
      title="Color Picker"
      description="Konversi antara HEX, RGB, dan HSL. Klik preset atau masukkan nilai manual."
    >
      <div className="max-w-xl mx-auto space-y-5">
        {/* Preview swatch + native picker */}
        <div className="bg-surface border border-line rounded-2xl p-5">
          <div
            className="w-full h-32 rounded-xl mb-4 border border-line transition-colors duration-200 relative overflow-hidden"
            style={{ backgroundColor: hex }}
          >
            <input
              type="color"
              value={hex.length === 7 ? hex : "#3B82F6"}
              onChange={(e) => updateFromHex(e.target.value)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <span className="absolute bottom-2 right-3 text-xs font-mono bg-black/40 text-white/80 px-2 py-0.5 rounded-lg">
              klik untuk pilih warna
            </span>
          </div>
          {/* Presets */}
          <div className="flex gap-2 flex-wrap">
            {presets.map((p) => (
              <button
                key={p}
                onClick={() => updateFromHex(p)}
                className="w-7 h-7 rounded-lg border-2 transition-all hover:scale-110"
                style={{ backgroundColor: p, borderColor: hex === p ? "white" : "transparent" }}
              />
            ))}
          </div>
        </div>

        {/* HEX */}
        <div className="bg-surface border border-line rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted font-mono">HEX</span>
            <CopyButton text={hex} />
          </div>
          <input
            type="text"
            value={hex}
            onChange={(e) => updateFromHex(e.target.value)}
            className="w-full bg-bg border border-line rounded-xl px-4 py-3 text-soft font-mono text-lg uppercase focus:outline-none focus:border-white/20 transition-colors"
            maxLength={7}
          />
        </div>

        {/* RGB */}
        <div className="bg-surface border border-line rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted font-mono">RGB</span>
            <CopyButton text={rgbStr} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            {(["r", "g", "b"] as const).map((ch) => (
              <div key={ch}>
                <label className="text-xs text-muted/60 font-mono mb-1 block uppercase">{ch}</label>
                <input
                  type="number"
                  min={0} max={255}
                  value={rgbInput[ch]}
                  onChange={(e) => updateFromRgb(ch, e.target.value)}
                  className="w-full bg-bg border border-line rounded-xl px-3 py-2.5 text-soft font-mono text-sm focus:outline-none focus:border-white/20 transition-colors"
                />
              </div>
            ))}
          </div>
          <div className="text-xs text-muted/40 font-mono">{rgbStr}</div>
        </div>

        {/* HSL */}
        <div className="bg-surface border border-line rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted font-mono">HSL</span>
            <CopyButton text={hslStr} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            {(["h", "s", "l"] as const).map((ch, i) => (
              <div key={ch}>
                <label className="text-xs text-muted/60 font-mono mb-1 block uppercase">
                  {ch} {i === 0 ? "(0-360)" : "(0-100)"}
                </label>
                <input
                  type="number"
                  min={0} max={i === 0 ? 360 : 100}
                  value={hslInput[ch]}
                  onChange={(e) => updateFromHsl(ch, e.target.value)}
                  className="w-full bg-bg border border-line rounded-xl px-3 py-2.5 text-soft font-mono text-sm focus:outline-none focus:border-white/20 transition-colors"
                />
              </div>
            ))}
          </div>
          <div className="text-xs text-muted/40 font-mono">{hslStr}</div>
        </div>
      </div>
    </ToolLayout>
  );
}
