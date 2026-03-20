"use client";
import { useState } from "react";
import { Copy, Check, AlertCircle } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";

function base64UrlDecode(str: string): string {
  try {
    const padded = str.replace(/-/g, "+").replace(/_/g, "/").padEnd(str.length + ((4 - (str.length % 4)) % 4), "=");
    return decodeURIComponent(
      atob(padded)
        .split("")
        .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join("")
    );
  } catch {
    return str;
  }
}

function formatJson(str: string): string {
  try {
    return JSON.stringify(JSON.parse(str), null, 2);
  } catch {
    return str;
  }
}

function prettyJson(obj: Record<string, unknown>) {
  return Object.entries(obj).map(([k, v]) => ({ key: k, value: v }));
}

const SAMPLE_JWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkNha3JhIERld2FuZ2dhIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE5OTk5OTk5OTl9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

type CopiedKey = "header" | "payload" | "token" | null;

export default function JwtDecoderPage() {
  const [token, setToken] = useState("");
  const [copied, setCopied] = useState<CopiedKey>(null);

  const parts = token.trim().split(".");
  const isValid = parts.length === 3;

  const decoded = isValid
    ? (() => {
        try {
          const header = JSON.parse(base64UrlDecode(parts[0]));
          const payload = JSON.parse(base64UrlDecode(parts[1]));
          return { header, payload, signature: parts[2] };
        } catch {
          return null;
        }
      })()
    : null;

  const copy = async (text: string, key: CopiedKey) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const now = Math.floor(Date.now() / 1000);
  const exp: number | undefined = decoded?.payload?.exp as number | undefined;
  const iat: number | undefined = decoded?.payload?.iat as number | undefined;
  const isExpired = exp !== undefined && exp < now;
  const expiresIn = exp !== undefined ? exp - now : null;

  const formatTimestamp = (ts: number) =>
    new Date(ts * 1000).toLocaleString("id-ID", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit", second: "2-digit",
    });

  return (
    <ToolLayout
      title="JWT Decoder"
      description="Decode dan inspect payload JWT token secara instan, tanpa verifikasi signature."
    >
      <div className="max-w-3xl mx-auto space-y-5">
        {/* Token input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs text-muted font-mono">JWT Token</label>
            <div className="flex gap-2">
              <button
                onClick={() => setToken(SAMPLE_JWT)}
                className="text-[11px] font-mono text-muted/60 hover:text-primary transition-colors"
              >
                Gunakan contoh
              </button>
              {token && (
                <button
                  onClick={() => copy(token, "token")}
                  className="flex items-center gap-1 text-[11px] font-mono text-muted/60 hover:text-soft transition-colors"
                >
                  {copied === "token" ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                  {copied === "token" ? "Copied!" : "Copy"}
                </button>
              )}
            </div>
          </div>
          <textarea
            value={token}
            onChange={(e) => setToken(e.target.value)}
            rows={4}
            placeholder="Paste JWT token di sini... (format: xxxxx.yyyyy.zzzzz)"
            spellCheck={false}
            className="w-full bg-bg border border-line rounded-xl px-4 py-3 text-soft text-xs font-mono focus:outline-none focus:border-white/20 transition-colors resize-none placeholder:text-muted/30 leading-relaxed break-all"
          />
        </div>

        {/* Token parts visual */}
        {token.trim() && (
          <div className="bg-surface border border-line rounded-xl p-4">
            <p className="text-[10px] text-muted font-mono mb-3">Struktur token</p>
            <div className="flex flex-wrap gap-1 font-mono text-xs break-all">
              <span className="text-blue-400">{parts[0] ?? ""}</span>
              {parts.length > 1 && <span className="text-muted">.</span>}
              <span className="text-violet-400">{parts[1] ?? ""}</span>
              {parts.length > 2 && <span className="text-muted">.</span>}
              <span className="text-emerald-400">{parts[2] ?? ""}</span>
            </div>
            {!isValid && token.trim() && (
              <div className="flex items-center gap-1.5 mt-3 text-red-400 text-xs font-mono">
                <AlertCircle size={13} /> Token tidak valid - harus mengandung 3 bagian dipisah titik.
              </div>
            )}
          </div>
        )}

        {decoded && (
          <>
            {/* Status bar */}
            <div className={`flex flex-wrap gap-3 p-4 rounded-xl border text-xs font-mono ${
              isExpired
                ? "bg-red-500/10 border-red-500/20"
                : "bg-emerald-500/10 border-emerald-500/20"
            }`}>
              <span className={isExpired ? "text-red-400" : "text-emerald-400"}>
                {isExpired ? "⚠ Token sudah expired" : "✓ Token belum expired"}
              </span>
              {exp !== undefined && (
                <span className="text-muted">
                  Exp: {formatTimestamp(exp)}
                  {!isExpired && expiresIn !== null && (
                    <span className="ml-1 text-emerald-400/70">
                      (dalam {Math.floor(expiresIn / 3600 / 24)}h {Math.floor((expiresIn % (3600 * 24)) / 3600)}j)
                    </span>
                  )}
                </span>
              )}
              {iat !== undefined && (
                <span className="text-muted">Issued: {formatTimestamp(iat)}</span>
              )}
            </div>

            {/* Header */}
            <Section
              title="Header"
              color="blue"
              data={decoded.header as Record<string, unknown>}
              raw={formatJson(base64UrlDecode(parts[0]))}
              onCopy={() => copy(formatJson(base64UrlDecode(parts[0])), "header")}
              copied={copied === "header"}
            />

            {/* Payload */}
            <Section
              title="Payload"
              color="violet"
              data={decoded.payload as Record<string, unknown>}
              raw={formatJson(base64UrlDecode(parts[1]))}
              onCopy={() => copy(formatJson(base64UrlDecode(parts[1])), "payload")}
              copied={copied === "payload"}
            />

            {/* Signature */}
            <div className="bg-surface border border-line rounded-2xl p-5">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-mono text-emerald-400/70">Signature</span>
                <span className="text-[10px] font-mono text-muted/40 border border-line px-2 py-0.5 rounded-md">
                  {decoded.header?.alg as string ?? "unknown"}
                </span>
              </div>
              <p className="text-xs font-mono text-emerald-400/70 break-all leading-relaxed">{parts[2]}</p>
              <p className="text-[10px] text-muted/40 font-mono mt-3">
                Signature tidak diverifikasi - hanya decode struktur.
              </p>
            </div>
          </>
        )}
      </div>
    </ToolLayout>
  );
}

function Section({
  title,
  color,
  data,
  raw,
  onCopy,
  copied,
}: {
  title: string;
  color: "blue" | "violet";
  data: Record<string, unknown>;
  raw: string;
  onCopy: () => void;
  copied: boolean;
}) {
  const [showRaw, setShowRaw] = useState(false);
  const colorClass = color === "blue" ? "text-blue-400/70" : "text-violet-400/70";
  const borderClass = color === "blue" ? "border-blue-400/20" : "border-violet-400/20";
  const bgClass = color === "blue" ? "bg-blue-400/5" : "bg-violet-400/5";

  return (
    <div className={`bg-surface border ${borderClass} ${bgClass} rounded-2xl p-5`}>
      <div className="flex justify-between items-center mb-4">
        <span className={`text-xs font-mono ${colorClass}`}>{title}</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowRaw(!showRaw)}
            className="text-[10px] font-mono text-muted/40 hover:text-muted transition-colors"
          >
            {showRaw ? "Tabel" : "Raw JSON"}
          </button>
          <button
            onClick={onCopy}
            className="flex items-center gap-1 text-[10px] font-mono text-muted/40 hover:text-soft transition-colors"
          >
            {copied ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>

      {showRaw ? (
        <pre className="text-xs font-mono text-soft bg-bg rounded-xl p-4 overflow-x-auto leading-relaxed">{raw}</pre>
      ) : (
        <div className="space-y-2">
          {prettyJson(data).map(({ key, value }) => (
            <div key={key} className="flex items-start gap-3 py-1.5 border-b border-line/30 last:border-0">
              <span className={`text-xs font-mono ${colorClass} min-w-[100px] flex-shrink-0`}>{key}</span>
              <span className="text-xs font-mono text-soft break-all">
                {typeof value === "number" && (key === "exp" || key === "iat" || key === "nbf")
                  ? `${value} (${new Date(value * 1000).toLocaleString("id-ID")})`
                  : JSON.stringify(value)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
