"use client";
import { useState, useCallback } from "react";
import { Copy, Check, Hash } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";

async function digestHash(algorithm: string, message: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest(algorithm, data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

const algorithms = [
  { label: "SHA-1",   algo: "SHA-1",   warning: true },
  { label: "SHA-256", algo: "SHA-256",  warning: false },
  { label: "SHA-384", algo: "SHA-384",  warning: false },
  { label: "SHA-512", algo: "SHA-512",  warning: false },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
      className="p-1.5 rounded-lg text-muted hover:text-soft hover:bg-white/[0.06] transition-all flex-shrink-0"
    >
      {copied ? <Check size={13} className="text-primary" /> : <Copy size={13} />}
    </button>
  );
}

export default function HashGeneratorPage() {
  const [input, setInput] = useState("");
  const [hashes, setHashes] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [uppercase, setUppercase] = useState(false);

  const generate = useCallback(async (text: string) => {
    if (!text) { setHashes({}); return; }
    setLoading(true);
    const results: Record<string, string> = {};
    await Promise.all(
      algorithms.map(async ({ label, algo }) => {
        results[label] = await digestHash(algo, text);
      })
    );
    setHashes(results);
    setLoading(false);
  }, []);

  const handleChange = (val: string) => {
    setInput(val);
    generate(val);
  };

  return (
    <ToolLayout
      title="Hash Generator"
      description="Generate SHA-1, SHA-256, SHA-384, SHA-512 hash dari teks. Berjalan sepenuhnya di browser."
    >
      <div className="max-w-2xl mx-auto space-y-5">
        <div className="bg-surface border border-line rounded-2xl p-5 space-y-3">
          <label className="text-xs text-muted font-mono">{"// input teks"}</label>
          <textarea
            value={input}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Ketik atau paste teks di sini..."
            rows={4}
            className="w-full bg-bg border border-line rounded-xl px-4 py-3 text-soft text-sm font-mono resize-none focus:outline-none focus:border-white/20 transition-colors placeholder:text-muted/30"
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted font-mono">{input.length} karakter</span>
              {input && (
                <button
                  onClick={() => handleChange("")}
                  className="text-xs text-muted/50 hover:text-muted transition-colors font-mono"
                >
                  hapus
                </button>
              )}
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <span className="text-xs text-muted font-mono">UPPERCASE</span>
              <button
                onClick={() => setUppercase(!uppercase)}
                className={`w-9 h-5 rounded-full transition-colors relative ${
                  uppercase ? "bg-primary" : "bg-line"
                }`}
              >
                <span
                  className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${
                    uppercase ? "left-[18px]" : "left-0.5"
                  }`}
                />
              </button>
            </label>
          </div>
        </div>
        <div className="space-y-3">
          {algorithms.map(({ label, warning }) => {
            const hash = hashes[label];
            const display = hash ? (uppercase ? hash.toUpperCase() : hash) : "";
            return (
              <div key={label} className="bg-surface border border-line rounded-2xl p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Hash size={13} className="text-primary" />
                    <span className="text-xs font-mono text-soft">{label}</span>
                    {warning && (
                      <span className="text-[10px] font-mono text-yellow-500/60 border border-yellow-500/20 rounded-full px-1.5 py-0.5">
                        deprecated
                      </span>
                    )}
                  </div>
                  {display && <CopyButton text={display} />}
                </div>
                <div className="bg-bg rounded-xl px-4 py-3 border border-line min-h-[44px]">
                  {loading && input ? (
                    <span className="text-muted/40 text-xs font-mono">computing...</span>
                  ) : display ? (
                    <span className="text-xs font-mono text-muted break-all leading-relaxed">{display}</span>
                  ) : (
                    <span className="text-muted/20 text-xs font-mono">â€”</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </ToolLayout>
  );
}
