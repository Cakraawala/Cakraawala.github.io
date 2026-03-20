"use client";
import { useState } from "react";
import { Copy, Check, Minimize2, Maximize2, Trash2 } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";

export default function JsonFormatterPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [indentSize, setIndentSize] = useState(2);

  const format = () => {
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, indentSize));
      setError("");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Invalid JSON");
      setOutput("");
    }
  };

  const minify = () => {
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError("");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Invalid JSON");
      setOutput("");
    }
  };

  const validate = () => {
    if (!input.trim()) return;
    try {
      JSON.parse(input);
      setError("✓ Valid JSON");
      setOutput("");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Invalid JSON");
      setOutput("");
    }
  };

  const clear = () => {
    setInput("");
    setOutput("");
    setError("");
  };

  const copy = async () => {
    const text = output || input;
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isValid = (() => {
    if (!input.trim()) return null;
    try { JSON.parse(input); return true; } catch { return false; }
  })();

  return (
    <ToolLayout
      title="JSON Formatter"
      description="Format, minify, dan validasi JSON dengan mudah."
    >
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex gap-2">
            <button
              onClick={format}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-xs font-mono hover:bg-blue-500 transition-colors"
            >
              <Maximize2 size={13} /> Format
            </button>
            <button
              onClick={minify}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-surface border border-line text-muted text-xs font-mono hover:text-soft hover:border-white/10 transition-colors"
            >
              <Minimize2 size={13} /> Minify
            </button>
            <button
              onClick={validate}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-surface border border-line text-muted text-xs font-mono hover:text-soft hover:border-white/10 transition-colors"
            >
              Validate
            </button>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <span className="text-muted text-xs font-mono">Indent:</span>
            {[2, 4].map((n) => (
              <button
                key={n}
                onClick={() => setIndentSize(n)}
                className={`w-7 h-7 rounded-lg text-xs font-mono border transition-all ${
                  indentSize === n
                    ? "bg-primary/10 border-primary/40 text-primary"
                    : "bg-surface border-line text-muted hover:text-soft hover:border-white/10"
                }`}
              >
                {n}
              </button>
            ))}
            <button
              onClick={clear}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-surface border border-line text-muted text-xs font-mono hover:text-red-400 hover:border-red-400/20 transition-colors"
            >
              <Trash2 size={12} /> Clear
            </button>
          </div>
        </div>

        {/* Status */}
        {error && (
          <div
            className={`px-4 py-2.5 rounded-xl text-xs font-mono border ${
              error.startsWith("✓")
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                : "bg-red-500/10 border-red-500/20 text-red-400"
            }`}
          >
            {error}
          </div>
        )}

        {/* Editor area */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Input */}
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted font-mono">Input</span>
              {isValid !== null && (
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                  isValid
                    ? "text-emerald-400 border-emerald-400/20 bg-emerald-400/5"
                    : "text-red-400 border-red-400/20 bg-red-400/5"
                }`}>
                  {isValid ? "valid" : "invalid"}
                </span>
              )}
            </div>
            <textarea
              value={input}
              onChange={(e) => { setInput(e.target.value); setError(""); setOutput(""); }}
              placeholder={'{\n  "key": "value"\n}'}
              rows={20}
              spellCheck={false}
              className="w-full bg-bg border border-line rounded-xl px-4 py-3 text-soft text-sm font-mono focus:outline-none focus:border-white/20 transition-colors resize-none placeholder:text-muted/30 leading-relaxed"
            />
          </div>

          {/* Output */}
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted font-mono">Output</span>
              {output && (
                <button
                  onClick={copy}
                  className="flex items-center gap-1 text-[10px] font-mono text-muted hover:text-soft transition-colors"
                >
                  {copied ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                  {copied ? "Copied!" : "Copy"}
                </button>
              )}
            </div>
            <textarea
              value={output}
              readOnly
              placeholder="Output akan muncul di sini..."
              rows={20}
              spellCheck={false}
              className="w-full bg-bg border border-line rounded-xl px-4 py-3 text-soft text-sm font-mono focus:outline-none resize-none placeholder:text-muted/30 leading-relaxed cursor-default"
            />
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
