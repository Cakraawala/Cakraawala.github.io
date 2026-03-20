"use client";
import { useState, useEffect } from "react";
import { Plus, X, RefreshCw } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";

const allTimezones = Intl.supportedValuesOf
  ? Intl.supportedValuesOf("timeZone")
  : [
      "UTC", "America/New_York", "America/Los_Angeles", "America/Chicago",
      "Europe/London", "Europe/Paris", "Europe/Berlin", "Asia/Tokyo",
      "Asia/Shanghai", "Asia/Singapore", "Asia/Jakarta", "Asia/Kolkata",
      "Australia/Sydney", "Pacific/Auckland",
    ];

const defaultZones = [
  "UTC",
  "Asia/Jakarta",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Europe/London",
  "America/New_York",
];

function formatTime(tz: string, date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    timeZone: tz,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(date);
}

function formatDate(tz: string, date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    timeZone: tz,
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getOffset(tz: string, date: Date): string {
  const formatter = new Intl.DateTimeFormat("en", {
    timeZone: tz,
    timeZoneName: "shortOffset",
  });
  const parts = formatter.formatToParts(date);
  return parts.find((p) => p.type === "timeZoneName")?.value ?? tz;
}

export default function TimezoneConverterPage() {
  const [now, setNow] = useState(new Date());
  const [zones, setZones] = useState<string[]>(defaultZones);
  const [search, setSearch] = useState("");
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const filtered = allTimezones.filter(
    (tz) =>
      tz.toLowerCase().includes(search.toLowerCase()) && !zones.includes(tz)
  ).slice(0, 20);

  const addZone = (tz: string) => {
    setZones((z) => [...z, tz]);
    setSearch("");
    setShowPicker(false);
  };

  const removeZone = (tz: string) => setZones((z) => z.filter((x) => x !== tz));

  const localTz = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return (
    <ToolLayout
      title="Timezone Converter"
      description="Bandingkan waktu di berbagai zona waktu dunia secara real-time."
    >
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Live clock for local */}
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted font-mono mb-1">Waktu lokal kamu · {localTz}</p>
            <p className="text-3xl font-mono font-bold text-primary">
              {formatTime(localTz, now)}
            </p>
            <p className="text-xs text-muted font-mono mt-1">{formatDate(localTz, now)}</p>
          </div>
          <RefreshCw size={14} className="text-primary/40 animate-spin" style={{ animationDuration: "3s" }} />
        </div>

        {/* Timezone list */}
        <div className="space-y-2">
          {zones.map((tz) => {
            const isLocal = tz === localTz;
            return (
              <div
                key={tz}
                className="group bg-surface border border-line rounded-xl p-4 flex items-center justify-between hover:border-white/10 transition-all"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-soft font-mono">{tz}</span>
                    <span className="text-[10px] text-muted font-mono px-1.5 py-0.5 border border-line rounded-md">
                      {getOffset(tz, now)}
                    </span>
                    {isLocal && (
                      <span className="text-[10px] text-primary font-mono px-1.5 py-0.5 border border-primary/20 bg-primary/5 rounded-md">
                        local
                      </span>
                    )}
                  </div>
                  <span className="text-xl font-mono text-soft">{formatTime(tz, now)}</span>
                  <span className="text-xs text-muted font-mono ml-3">{formatDate(tz, now)}</span>
                </div>
                {!isLocal && (
                  <button
                    onClick={() => removeZone(tz)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-muted hover:text-red-400 hover:bg-red-400/5 transition-all"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Add timezone */}
        <div className="relative">
          {!showPicker ? (
            <button
              onClick={() => setShowPicker(true)}
              className="w-full flex items-center justify-center gap-2 p-3.5 rounded-xl border border-dashed border-line text-muted text-xs font-mono hover:text-soft hover:border-white/20 transition-all"
            >
              <Plus size={13} /> Tambah timezone
            </button>
          ) : (
            <div className="bg-surface border border-line rounded-2xl p-4 space-y-3">
              <input
                autoFocus
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari timezone... (contoh: Tokyo, Paris)"
                className="w-full bg-bg border border-line rounded-xl px-4 py-2.5 text-soft text-sm font-mono focus:outline-none focus:border-white/20 transition-colors placeholder:text-muted/30"
              />
              {search && (
                <div className="max-h-48 overflow-y-auto space-y-1">
                  {filtered.length === 0 ? (
                    <p className="text-muted text-xs font-mono text-center py-3">Tidak ditemukan</p>
                  ) : (
                    filtered.map((tz) => (
                      <button
                        key={tz}
                        onClick={() => addZone(tz)}
                        className="w-full text-left px-3 py-2 rounded-lg text-sm font-mono text-muted hover:text-soft hover:bg-white/[0.04] transition-colors"
                      >
                        {tz}
                        <span className="ml-2 text-[10px] text-muted/50">{getOffset(tz, now)}</span>
                      </button>
                    ))
                  )}
                </div>
              )}
              <button
                onClick={() => { setShowPicker(false); setSearch(""); }}
                className="text-xs text-muted font-mono hover:text-soft transition-colors"
              >
                Batal
              </button>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
