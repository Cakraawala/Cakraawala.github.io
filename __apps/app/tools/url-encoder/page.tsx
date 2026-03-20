"use client";
import { useState } from "react";
import { Copy, Check, ArrowDown, ArrowUp, Trash2 } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";

type Mode = "encode" | "decode";
type EncodeType = "component" | "full" | "base64";

const encodeTypes: { key: EncodeType; label: string; desc: string }[] = [
  { key: "component", label: "encodeURIComponent", desc: "Encode karakter khusus (direkomendasikan untuk query params)" },
  { key: "full",      label: "encodeURI",          desc: "Encode URL lengkap, abaikan karakter URI standar" },
  { key: "base64",    label: "Base64",             desc: "Encode/decode teks ke format Base64" },
];

function processText(input: string, mode: Mode, type: EncodeType): { result: string; error: string } {
  if (!input.trim()) return { result: "", error: "" };
  try {
    if (type === "component") {
      return { result: mode === "encode" ? encodeURIComponent(input) : decodeURIComponent(input), error: "" };
    }
    if (type === "full") {
      return { result: mode === "encode" ? encodeURI(input) : decodeURI(input), error: "" };
    }
    if (type === "base64") {
      if (mode === "encode") {
        return { result: btoa(unescape(encodeURIComponent(input))), error: "" };
      } else {
        return { result: decodeURIComponent(escape(atob(input))), error: "" };
      }
    }
    return { result: "", error: "" };
  } catch (e: unknown) {
    return { result: "", error: e instanceof Error ? e.message : "Proses gagal" };
  }
}

const examples = [
  { label: "URL dengan params", text: "https://example.com/search?q=hello world&lang=id" },
  { label: "Karakter spesial",  text: "nama=Cakra Dewangga&email=hello@example.com" },
  { label: "Unicode",           text: "こんにちは世界 / مرحبا بالعالم" },
];

export default function UrlEncoderPage() {
  const [input, setInput]         = useState("");
  const [output, setOutput]       = useState("");
  const [error, setError]         = useState("");
  const [mode, setMode]           = useState<Mode>("encode");
  const [encType, setEncType]     = useState<EncodeType>("component");
  const [copiedOut, setCopiedOut] = useState(false);

  const process = (text: string, m: Mode, t: EncodeType) => {
    const { result, error } = processText(text, m, t);
    setOutput(result);
    setError(error);
  };

  const handleInput = (val: string) => {
    setInput(val);
    process(val, mode, encType);
  };

  const handleMode = (m: Mode) => {
    setMode(m);
    process(input, m, encType);
  };

  const handleType = (t: EncodeType) => {
    setEncType(t);
    process(input, mode, t);
  };

  const swap = () => {
    const newInput = output;
    const newMode: Mode = mode === "encode" ? "decode" : "encode";
    setMode(newMode);
    setInput(newInput);
    process(newInput, newMode, encType);
  };

  const clear = () => {
    setInput(""); setOutput(""); setError("");
  };

  const copy = async () => {
    await navigator.clipboard.writeText(output);
    setCopiedOut(true);
    setTimeout(() => setCopiedOut(false), 2000);
  };

  return (
    <ToolLayout
      title="URL Encoder / Decoder"
      description="Encode atau decode URL, query string, dan Base64 dengan mudah."
    >
      <div className="max-w-3xl mx-auto space-y-5">
        {/* Encode type */}
        <div className="space-y-2">
          {encodeTypes.map((t) => (
            <button
              key={t.key}
              onClick={() => handleType(t.key)}
              className={`w-full flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all ${
                encType === t.key
                  ? "bg-primary/10 border-primary/30"
                  : "bg-surface border-line hover:border-white/10"
              }`}
            >
              <span className={`mt-0.5 w-3.5 h-3.5 rounded-full border-2 flex-shrink-0 ${encType === t.key ? "border-primary bg-primary/30" : "border-muted/40"}`} />
              <div>
                <p className={`text-xs font-mono font-medium ${encType === t.key ? "text-primary" : "text-soft"}`}>{t.label}</p>
                <p className="text-[11px] text-muted mt-0.5">{t.desc}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Mode toggle */}
        <div className="flex gap-2">
          {(["encode", "decode"] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => handleMode(m)}
              className={`px-5 py-2 rounded-xl text-xs font-mono border transition-all capitalize ${
                mode === m
                  ? "bg-primary/10 border-primary/40 text-primary"
                  : "bg-surface border-line text-muted hover:text-soft hover:border-white/10"
              }`}
            >
              {m === "encode" ? "↑ Encode" : "↓ Decode"}
            </button>
          ))}
          <button
            onClick={clear}
            className="ml-auto flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface border border-line text-muted text-xs font-mono hover:text-red-400 hover:border-red-400/20 transition-colors"
          >
            <Trash2 size={12} /> Clear
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="px-4 py-2.5 rounded-xl text-xs font-mono border bg-red-500/10 border-red-500/20 text-red-400">
            {error}
          </div>
        )}

        {/* Input / Output */}
        <div className="space-y-3">
          <div>
            <label className="text-xs text-muted font-mono mb-2 block">
              Input {mode === "encode" ? "(teks asli)" : "(teks ter-encode)"}
            </label>
            <textarea
              value={input}
              onChange={(e) => handleInput(e.target.value)}
              rows={6}
              placeholder="Masukkan teks di sini..."
              spellCheck={false}
              className="w-full bg-bg border border-line rounded-xl px-4 py-3 text-soft text-sm font-mono focus:outline-none focus:border-white/20 transition-colors resize-none placeholder:text-muted/30 leading-relaxed"
            />
          </div>

          {/* Swap button */}
          <div className="flex items-center justify-center">
            <button
              onClick={swap}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-surface border border-line text-muted text-xs font-mono hover:text-soft hover:border-white/10 transition-all"
            >
              {mode === "encode" ? <ArrowDown size={13} /> : <ArrowUp size={13} />}
              Swap & Balik Mode
            </button>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-muted font-mono">
                Output {mode === "encode" ? "(ter-encode)" : "(ter-decode)"}
              </label>
              {output && (
                <button
                  onClick={copy}
                  className="flex items-center gap-1 text-[10px] font-mono text-muted hover:text-soft transition-colors"
                >
                  {copiedOut ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                  {copiedOut ? "Copied!" : "Copy"}
                </button>
              )}
            </div>
            <textarea
              value={output}
              readOnly
              rows={6}
              placeholder="Output akan muncul otomatis..."
              className="w-full bg-bg border border-line rounded-xl px-4 py-3 text-soft text-sm font-mono focus:outline-none resize-none placeholder:text-muted/30 leading-relaxed cursor-default"
            />
          </div>
        </div>

        {/* Examples */}
        <div>
          <p className="text-xs text-muted font-mono mb-3">Contoh input</p>
          <div className="flex flex-wrap gap-2">
            {examples.map((ex) => (
              <button
                key={ex.label}
                onClick={() => handleInput(ex.text)}
                className="px-3 py-1.5 rounded-xl bg-surface border border-line text-muted text-xs font-mono hover:text-soft hover:border-white/10 transition-all"
              >
                {ex.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
