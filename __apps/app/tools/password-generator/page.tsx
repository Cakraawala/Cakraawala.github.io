"use client";
import { useState, useCallback } from "react";
import { Copy, Check, RefreshCw, Eye, EyeOff } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";

const CHARS = {
  upper:   "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lower:   "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
  similar: "0O1lI",
};

function calcStrength(password: string): { score: number; label: string; color: string } {
  if (!password) return { score: 0, label: "-", color: "bg-line" };
  let score = 0;
  if (password.length >= 8)  score++;
  if (password.length >= 12) score++;
  if (password.length >= 16) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) return { score, label: "Lemah",      color: "bg-red-500" };
  if (score <= 4) return { score, label: "Sedang",     color: "bg-amber-500" };
  if (score <= 5) return { score, label: "Kuat",       color: "bg-blue-500" };
  return            { score, label: "Sangat Kuat", color: "bg-emerald-500" };
}

export default function PasswordGeneratorPage() {
  const [length, setLength]     = useState(16);
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(false);
  const [excludeSimilar, setExcludeSimilar] = useState(false);
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);
  const [show, setShow] = useState(true);
  const [history, setHistory] = useState<string[]>([]);

  const generate = useCallback(() => {
    let pool = "";
    if (useUpper)   pool += CHARS.upper;
    if (useLower)   pool += CHARS.lower;
    if (useNumbers) pool += CHARS.numbers;
    if (useSymbols) pool += CHARS.symbols;
    if (!pool) pool = CHARS.lower + CHARS.numbers;

    if (excludeSimilar) {
      pool = pool.split("").filter((c) => !CHARS.similar.includes(c)).join("");
    }

    let result = "";
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    for (let i = 0; i < length; i++) {
      result += pool[array[i] % pool.length];
    }

    setPassword(result);
    setHistory((h) => [result, ...h].slice(0, 5));
  }, [length, useUpper, useLower, useNumbers, useSymbols, excludeSimilar]);

  const copy = async (pw: string = password) => {
    if (!pw) return;
    await navigator.clipboard.writeText(pw);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const strength = calcStrength(password);

  const toggleOption = (
    val: boolean,
    set: (v: boolean) => void,
    others: boolean[]
  ) => {
    if (val && others.filter(Boolean).length === 0) return;
    set(!val);
  };

  return (
    <ToolLayout
      title="Password Generator"
      description="Buat password acak yang aman dengan cek skor kekuatannya."
    >
      <div className="max-w-xl mx-auto space-y-5">
        {/* Output */}
        <div className="bg-surface border border-line rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-3">
            <input
              type={show ? "text" : "password"}
              value={password}
              readOnly
              placeholder="Klik Generate..."
              className="flex-1 bg-bg border border-line rounded-xl px-4 py-3 text-soft text-lg font-mono focus:outline-none placeholder:text-muted/30 tracking-wider"
            />
            <button
              onClick={() => setShow(!show)}
              className="p-3 rounded-xl bg-bg border border-line text-muted hover:text-soft hover:border-white/10 transition-colors"
            >
              {show ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
            <button
              onClick={() => copy()}
              disabled={!password}
              className="p-3 rounded-xl bg-bg border border-line text-muted hover:text-soft hover:border-white/10 transition-colors disabled:opacity-30"
            >
              {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
            </button>
          </div>

          {/* Strength bar */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-muted font-mono">Kekuatan password</span>
              <span className="text-xs font-mono text-soft">{strength.label}</span>
            </div>
            <div className="h-1.5 bg-bg rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${strength.color}`}
                style={{ width: `${(strength.score / 7) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="bg-surface border border-line rounded-2xl p-5 space-y-5">
          {/* Length */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="text-xs text-muted font-mono">Panjang password</label>
              <span className="text-lg font-mono font-bold text-primary">{length}</span>
            </div>
            <input
              type="range"
              min={4}
              max={64}
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-muted/40 font-mono mt-1">
              <span>4</span><span>16</span><span>32</span><span>64</span>
            </div>
          </div>

          {/* Options */}
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { label: "Huruf Besar (A-Z)", val: useUpper,   set: setUseUpper,   others: [useLower, useNumbers, useSymbols] },
              { label: "Huruf Kecil (a-z)", val: useLower,   set: setUseLower,   others: [useUpper, useNumbers, useSymbols] },
              { label: "Angka (0-9)",        val: useNumbers, set: setUseNumbers, others: [useUpper, useLower, useSymbols] },
              { label: "Simbol (!@#...)",    val: useSymbols, set: setUseSymbols, others: [useUpper, useLower, useNumbers] },
            ].map(({ label, val, set, others }) => (
              <button
                key={label}
                onClick={() => toggleOption(val, set, others)}
                className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all text-xs font-mono ${
                  val
                    ? "bg-primary/10 border-primary/30 text-primary"
                    : "bg-bg border-line text-muted hover:border-white/10 hover:text-soft"
                }`}
              >
                <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center flex-shrink-0 ${val ? "bg-primary border-primary" : "border-muted/40"}`}>
                  {val && <span className="text-white text-[9px]">✓</span>}
                </span>
                {label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setExcludeSimilar(!excludeSimilar)}
            className={`flex items-center gap-2.5 w-full p-3 rounded-xl border text-left transition-all text-xs font-mono ${
              excludeSimilar
                ? "bg-amber-400/10 border-amber-400/30 text-amber-400"
                : "bg-bg border-line text-muted hover:border-white/10 hover:text-soft"
            }`}
          >
            <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center flex-shrink-0 ${excludeSimilar ? "bg-amber-400 border-amber-400" : "border-muted/40"}`}>
              {excludeSimilar && <span className="text-white text-[9px]">✓</span>}
            </span>
            Hilangkan karakter mirip (0, O, 1, l, I)
          </button>
        </div>

        {/* Generate */}
        <button
          onClick={generate}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-primary text-white font-semibold hover:bg-blue-500 transition-colors"
        >
          <RefreshCw size={16} /> Generate Password
        </button>

        {/* History */}
        {history.length > 0 && (
          <div className="bg-surface border border-line rounded-2xl p-5">
            <p className="text-xs text-muted font-mono mb-3">Riwayat (sesi ini)</p>
            <div className="space-y-2">
              {history.map((pw, i) => (
                <div key={i} className="flex items-center justify-between gap-3">
                  <span className="text-xs font-mono text-soft truncate tracking-wider">{pw}</span>
                  <button onClick={() => copy(pw)} className="text-muted hover:text-soft transition-colors flex-shrink-0">
                    <Copy size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
