"use client";
import { useState, useEffect } from "react";
import { Copy, Check, RefreshCw } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";

function formatDate(date: Date): string {
  return date.toLocaleString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
  });
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button
      onClick={copy}
      className="p-1.5 rounded-lg text-muted hover:text-soft hover:bg-white/[0.06] transition-all"
    >
      {copied ? <Check size={13} className="text-primary" /> : <Copy size={13} />}
    </button>
  );
}

export default function TimestampPage() {
  const [now, setNow] = useState(Math.floor(Date.now() / 1000));
  const [tsInput, setTsInput] = useState("");
  const [dateInput, setDateInput] = useState("");

  // Live clock
  useEffect(() => {
    const t = setInterval(() => setNow(Math.floor(Date.now() / 1000)), 1000);
    return () => clearInterval(t);
  }, []);

  // Derived: timestamp -> date
  const tsNum = parseInt(tsInput);
  const tsDate = tsInput !== "" && !isNaN(tsNum) ? new Date(tsNum * 1000) : null;
  const tsDateStr = tsDate && isFinite(tsDate.getTime()) ? formatDate(tsDate) : "Timestamp tidak valid";

  // Derived: date -> timestamp
  const dateTs = dateInput ? Math.floor(new Date(dateInput).getTime() / 1000) : null;
  const dateTsStr = dateTs !== null && !isNaN(dateTs) ? String(dateTs) : "Tanggal tidak valid";

  return (
    <ToolLayout
      title="Timestamp Converter"
      description="Konversi Unix timestamp ke tanggal/waktu dan sebaliknya."
    >
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Live now */}
        <div className="bg-surface border border-line rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-muted font-mono">// waktu sekarang</span>
            <RefreshCw size={13} className="text-muted/40 animate-spin" style={{ animationDuration: "3s" }} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-mono text-soft font-light">{now}</div>
              <div className="text-xs text-muted mt-1">{formatDate(new Date(now * 1000))}</div>
            </div>
            <CopyButton text={String(now)} />
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-line" />
          <span className="text-xs text-muted/40 font-mono">konversi</span>
          <div className="flex-1 h-px bg-line" />
        </div>

        {/* Timestamp -> Date */}
        <div className="bg-surface border border-line rounded-2xl p-5 space-y-4">
          <p className="text-xs text-muted font-mono">// Unix Timestamp Tanggal</p>
          <input
            type="number"
            value={tsInput}
            onChange={(e) => setTsInput(e.target.value)}
            placeholder="Masukkan Unix timestamp (e.g. 1710000000)"
            className="w-full bg-bg border border-line rounded-xl px-4 py-3 text-soft font-mono text-sm focus:outline-none focus:border-white/20 transition-colors placeholder:text-muted/30"
          />
          {tsInput && (
            <div className="flex items-start justify-between bg-bg rounded-xl px-4 py-3 border border-line">
              <div>
                <div className="text-xs text-muted font-mono mb-1">Hasil</div>
                <div className={`text-sm font-mono ${tsDate ? "text-soft" : "text-red-400/70"}`}>
                  {tsDateStr}
                </div>
              </div>
              {tsDate && <CopyButton text={tsDateStr} />}
            </div>
          )}
          <div className="flex gap-2">
            {["now", "now-1h", "now-1d", "now-7d"].map((preset) => {
              const offsets: Record<string, number> = {
                now: 0, "now-1h": -3600, "now-1d": -86400, "now-7d": -604800,
              };
              const val = now + offsets[preset];
              return (
                <button
                  key={preset}
                  onClick={() => setTsInput(String(val))}
                  className="px-3 py-1.5 rounded-lg bg-bg border border-line text-xs text-muted hover:text-soft hover:border-white/10 transition-all font-mono"
                >
                  {preset}
                </button>
              );
            })}
          </div>
        </div>

        {/* Date -> Timestamp */}
        <div className="bg-surface border border-line rounded-2xl p-5 space-y-4">
          <p className="text-xs text-muted font-mono">// Tanggal Unix Timestamp</p>
          <input
            type="datetime-local"
            value={dateInput}
            onChange={(e) => setDateInput(e.target.value)}
            className="w-full bg-bg border border-line rounded-xl px-4 py-3 text-soft font-mono text-sm focus:outline-none focus:border-white/20 transition-colors"
          />
          {dateInput && (
            <div className="flex items-start justify-between bg-bg rounded-xl px-4 py-3 border border-line">
              <div>
                <div className="text-xs text-muted font-mono mb-1">Unix Timestamp</div>
                <div className={`text-2xl font-mono font-light ${dateTs && !isNaN(dateTs) ? "text-soft" : "text-red-400/70"}`}>
                  {dateTsStr}
                </div>
              </div>
              {dateTs && !isNaN(dateTs) && <CopyButton text={dateTsStr} />}
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
