"use client";
import { useState, useRef, useCallback } from "react";
import { Wifi, RefreshCw, Activity, ArrowDown, ArrowUp } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";

type Phase = "idle" | "latency" | "download" | "upload" | "done";

interface Results {
  latency: number | null;      // ms
  jitter: number | null;       // ms
  download: number | null;     // Mbps
  upload: number | null;       // Mbps
}

// Cloudflare speed test endpoints - CORS-enabled
const CF_LATENCY = "https://speed.cloudflare.com/__down?bytes=100";
const CF_DOWNLOAD_SIZES = [
  { bytes: 102_400,    label: "100KB"  },
  { bytes: 1_048_576,  label: "1MB"   },
  { bytes: 10_485_760, label: "10MB"  },
];
const CF_UPLOAD = "https://speed.cloudflare.com/__up";

function bpsToMbps(bytes: number, ms: number): number {
  return (bytes * 8) / (ms / 1000) / 1_000_000;
}

function formatSpeed(mbps: number | null): string {
  if (mbps === null) return "-";
  if (mbps >= 1000) return `${(mbps / 1000).toFixed(2)} Gbps`;
  if (mbps >= 1) return `${mbps.toFixed(2)} Mbps`;
  return `${(mbps * 1000).toFixed(0)} Kbps`;
}

function speedColor(mbps: number | null, type: "dl" | "ul"): string {
  if (mbps === null) return "text-muted";
  const threshold = type === "dl" ? [10, 50, 100] : [5, 20, 50];
  if (mbps < threshold[0]) return "text-red-400";
  if (mbps < threshold[1]) return "text-amber-400";
  if (mbps < threshold[2]) return "text-blue-400";
  return "text-emerald-400";
}

function latencyColor(ms: number | null): string {
  if (ms === null) return "text-muted";
  if (ms < 20)  return "text-emerald-400";
  if (ms < 50)  return "text-blue-400";
  if (ms < 100) return "text-amber-400";
  return "text-red-400";
}

function qualityLabel(dl: number | null): string {
  if (dl === null) return "Belum diuji";
  if (dl >= 100) return "Sangat Cepat";
  if (dl >= 50)  return "Cepat";
  if (dl >= 25)  return "Baik";
  if (dl >= 10)  return "Sedang";
  if (dl >= 5)   return "Lambat";
  return "Sangat Lambat";
}

export default function InternetSpeedPage() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [results, setResults] = useState<Results>({ latency: null, jitter: null, download: null, upload: null });
  const [progress, setProgress] = useState(0);
  const [currentSpeed, setCurrentSpeed] = useState<number | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const measureLatency = useCallback(async (): Promise<{ avg: number; jitter: number }> => {
    const pings: number[] = [];
    for (let i = 0; i < 8; i++) {
      const t0 = performance.now();
      await fetch(`${CF_LATENCY}&t=${Date.now()}`, { cache: "no-store", signal: abortRef.current?.signal });
      pings.push(performance.now() - t0);
    }
    // Remove outliers (min/max)
    pings.sort((a, b) => a - b);
    const trimmed = pings.slice(1, -1);
    const avg = trimmed.reduce((a, b) => a + b, 0) / trimmed.length;
    const jitter = trimmed.reduce((s, p) => s + Math.abs(p - avg), 0) / trimmed.length;
    return { avg: Math.round(avg), jitter: Math.round(jitter * 10) / 10 };
  }, []);

  const measureDownload = useCallback(async (): Promise<number> => {
    const speeds: number[] = [];

    for (let i = 0; i < CF_DOWNLOAD_SIZES.length; i++) {
      const { bytes } = CF_DOWNLOAD_SIZES[i];
      const url = `https://speed.cloudflare.com/__down?bytes=${bytes}&t=${Date.now()}`;
      const t0 = performance.now();
      const res = await fetch(url, { cache: "no-store", signal: abortRef.current?.signal });
      await res.arrayBuffer();
      const elapsed = performance.now() - t0;
      const mbps = bpsToMbps(bytes, elapsed);
      speeds.push(mbps);
      setCurrentSpeed(mbps);
      setProgress(20 + Math.round((i + 1) / CF_DOWNLOAD_SIZES.length * 40));
    }

    return speeds[speeds.length - 1]; // Use the largest file for accuracy
  }, []);

  const measureUpload = useCallback(async (): Promise<number> => {
    const sizes = [128_000, 512_000, 2_097_152];
    const speeds: number[] = [];

    for (let i = 0; i < sizes.length; i++) {
      const body = new Uint8Array(sizes[i]);
      crypto.getRandomValues(body.slice(0, Math.min(1024, sizes[i]))); // partial random for speed
      const t0 = performance.now();
      await fetch(CF_UPLOAD, {
        method: "POST",
        body,
        cache: "no-store",
        signal: abortRef.current?.signal,
      });
      const elapsed = performance.now() - t0;
      const mbps = bpsToMbps(sizes[i], elapsed);
      speeds.push(mbps);
      setCurrentSpeed(mbps);
      setProgress(65 + Math.round((i + 1) / sizes.length * 30));
    }

    return speeds[speeds.length - 1];
  }, []);

  const runTest = async () => {
    abortRef.current = new AbortController();
    setResults({ latency: null, jitter: null, download: null, upload: null });
    setCurrentSpeed(null);
    setProgress(0);

    try {
      // Latency
      setPhase("latency");
      setProgress(5);
      const { avg, jitter } = await measureLatency();
      setResults((r) => ({ ...r, latency: avg, jitter }));
      setProgress(20);

      // Download
      setPhase("download");
      const dl = await measureDownload();
      setResults((r) => ({ ...r, download: Math.round(dl * 100) / 100 }));
      setProgress(65);
      setCurrentSpeed(null);

      // Upload
      setPhase("upload");
      const ul = await measureUpload();
      setResults((r) => ({ ...r, upload: Math.round(ul * 100) / 100 }));
      setProgress(100);
      setCurrentSpeed(null);

      setPhase("done");
    } catch (e: unknown) {
      if ((e as Error)?.name !== "AbortError") {
        console.error("Speed test error:", e);
        setPhase("idle");
      }
    }
  };

  const stopTest = () => {
    abortRef.current?.abort();
    setPhase("idle");
    setCurrentSpeed(null);
  };

  const isRunning = phase !== "idle" && phase !== "done";

  const phaseLabels: Record<Phase, string> = {
    idle: "",
    latency: "Mengukur latency...",
    download: "Mengukur download...",
    upload: "Mengukur upload...",
    done: "Selesai",
  };

  return (
    <ToolLayout
      title="Internet Speed Test"
      description="Cek kecepatan download, upload, dan latency koneksi internetmu."
    >
      <div className="max-w-xl mx-auto space-y-6">
        {/* Main gauge area */}
        <div className="bg-surface border border-line rounded-2xl p-8 text-center space-y-4">
          {/* Icon */}
          <div className={`w-16 h-16 mx-auto rounded-2xl border flex items-center justify-center transition-all ${
            isRunning ? "border-primary/40 bg-primary/10 text-primary" : "border-line bg-bg text-muted"
          }`}>
            <Wifi size={28} className={isRunning ? "animate-pulse" : ""} />
          </div>

          {/* Current live speed */}
          <div className="min-h-[60px] flex flex-col items-center justify-center">
            {isRunning && currentSpeed !== null ? (
              <>
                <span className="text-4xl font-mono font-bold text-primary">
                  {formatSpeed(currentSpeed)}
                </span>
                <span className="text-xs text-muted font-mono mt-1">
                  {phaseLabels[phase]}
                </span>
              </>
            ) : (
              <span className="text-sm text-muted font-mono">
                {phase === "done" ? qualityLabel(results.download) : isRunning ? phaseLabels[phase] : "Siap untuk diuji"}
              </span>
            )}
          </div>

          {/* Progress bar */}
          {isRunning && (
            <div className="h-1.5 bg-bg rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          {/* CTA */}
          <button
            onClick={isRunning ? stopTest : runTest}
            className={`px-8 py-3 rounded-xl font-semibold text-sm transition-all ${
              isRunning
                ? "bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20"
                : "bg-primary text-white hover:bg-blue-500"
            }`}
          >
            {isRunning ? "Stop" : phase === "done" ? (
              <span className="flex items-center gap-2"><RefreshCw size={15}/> Uji Ulang</span>
            ) : (
              <span className="flex items-center gap-2"><Activity size={15}/> Mulai Tes</span>
            )}
          </button>
        </div>

        {/* Results cards */}
        <div className="grid grid-cols-2 gap-3">
          {/* Latency */}
          <div className="bg-surface border border-line rounded-2xl p-5 space-y-1">
            <p className="text-xs text-muted font-mono">Latency (Ping)</p>
            <p className={`text-3xl font-mono font-bold ${latencyColor(results.latency)}`}>
              {results.latency !== null ? `${results.latency}` : "-"}
              {results.latency !== null && <span className="text-sm ml-1">ms</span>}
            </p>
            {results.jitter !== null && (
              <p className="text-[11px] text-muted font-mono">jitter {results.jitter} ms</p>
            )}
          </div>

          {/* Download */}
          <div className="bg-surface border border-line rounded-2xl p-5 space-y-1">
            <div className="flex items-center gap-1.5">
              <ArrowDown size={12} className="text-blue-400" />
              <p className="text-xs text-muted font-mono">Download</p>
            </div>
            <p className={`text-3xl font-mono font-bold ${speedColor(results.download, "dl")}`}>
              {results.download !== null ? `${results.download.toFixed(1)}` : "-"}
              {results.download !== null && <span className="text-sm ml-1">Mbps</span>}
            </p>
          </div>

          {/* Upload - spans full if latency is being shown */}
          <div className="col-span-2 bg-surface border border-line rounded-2xl p-5 space-y-1">
            <div className="flex items-center gap-1.5">
              <ArrowUp size={12} className="text-emerald-400" />
              <p className="text-xs text-muted font-mono">Upload</p>
            </div>
            <p className={`text-3xl font-mono font-bold ${speedColor(results.upload, "ul")}`}>
              {results.upload !== null ? `${results.upload.toFixed(1)}` : "-"}
              {results.upload !== null && <span className="text-sm ml-1">Mbps</span>}
            </p>
          </div>
        </div>

        {/* Speed quality reference */}
        <div className="bg-surface border border-line rounded-2xl p-5">
          <p className="text-xs text-muted font-mono mb-3">Referensi kecepatan download</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Browsing",   min: "1 Mbps",  color: "text-muted" },
              { label: "SD Video",   min: "3 Mbps",  color: "text-amber-400" },
              { label: "HD Video",   min: "10 Mbps", color: "text-blue-400" },
              { label: "4K Video",   min: "25 Mbps", color: "text-violet-400" },
              { label: "Gaming",     min: "15 Mbps", color: "text-emerald-400" },
              { label: "Video Call", min: "5 Mbps",  color: "text-pink-400" },
            ].map((item) => (
              <div key={item.label} className="flex justify-between text-xs font-mono">
                <span className="text-muted/60">{item.label}</span>
                <span className={item.color}>{item.min}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-muted/30 text-xs font-mono">
          Menggunakan Cloudflare Speed Test · Hasil dapat bervariasi
        </p>
      </div>
    </ToolLayout>
  );
}
