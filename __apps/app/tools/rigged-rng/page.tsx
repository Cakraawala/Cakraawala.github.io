"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";

const TOTAL_TRIALS = 100;

function riggedPick(userPick: number, range: number, houseEdge: number): number {
  // houseEdge 0–1: chance that result avoids user's number
  if (Math.random() < houseEdge) {
    // avoid user's pick
    let result = Math.floor(Math.random() * range) + 1;
    let attempts = 0;
    while (result === userPick && attempts < 100) {
      result = Math.floor(Math.random() * range) + 1;
      attempts++;
    }
    return result;
  }
  return Math.floor(Math.random() * range) + 1;
}

export default function RiggedRNGPage() {
  const [range, setRange] = useState(10);
  const [userPick, setUserPick] = useState<number | null>(null);
  const [houseEdge, setHouseEdge] = useState(80); // %
  const [results, setResults] = useState<number[]>([]);
  const [running, setRunning] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const runSim = async () => {
    if (userPick === null) return;
    setRunning(true);
    setRevealed(false);
    setResults([]);

    const newResults: number[] = [];
    for (let i = 0; i < TOTAL_TRIALS; i++) {
      await new Promise((r) => setTimeout(r, 25));
      const r = riggedPick(userPick, range, houseEdge / 100);
      newResults.push(r);
      setResults([...newResults]);
    }

    setRunning(false);
    setRevealed(true);
  };

  const reset = () => {
    setResults([]);
    setRevealed(false);
    setUserPick(null);
  };

  const hitCount = results.filter((r) => r === userPick).length;
  const expectedHits = Math.round((TOTAL_TRIALS / range));
  const hitRate = results.length > 0 ? ((hitCount / results.length) * 100).toFixed(1) : "0";
  const expectedRate = (100 / range).toFixed(1);

  // frequency map
  const freq: Record<number, number> = {};
  for (let i = 1; i <= range; i++) freq[i] = 0;
  results.forEach((r) => freq[r]++);
  const maxFreq = Math.max(...Object.values(freq), 1);

  return (
    <ToolLayout
      title="🎲 Rigged RNG Simulator"
      description="Lihat perbedaan antara peluang asli dan hasil yang dimanipulasi."
    >
      <div className="max-w-2xl mx-auto space-y-5">
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 text-xs text-yellow-400 leading-relaxed">
          ⚠️ <strong>Edukasi Anti-Judol:</strong> Simulasi ini menunjukkan bagaimana RNG (Random Number Generator)
          dapat dimanipulasi secara diam-diam untuk menguntungkan pihak tertentu.
        </div>

        {/* Controls */}
        <div className="bg-surface rounded-xl p-5 border border-line space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-muted mb-1 block">Rentang angka (1 – N)</label>
              <input
                type="range"
                min="2"
                max="20"
                value={range}
                onChange={(e) => { setRange(parseInt(e.target.value)); reset(); }}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-xs text-muted mt-1">
                <span>2</span>
                <span className="text-primary font-semibold">1 – {range}</span>
                <span>20</span>
              </div>
            </div>
            <div>
              <label className="text-xs text-muted mb-1 block">House Edge (manipulasi)</label>
              <input
                type="range"
                min="0"
                max="99"
                value={houseEdge}
                onChange={(e) => { setHouseEdge(parseInt(e.target.value)); reset(); }}
                className="w-full accent-red-500"
              />
              <div className="flex justify-between text-xs text-muted mt-1">
                <span>0% (fair)</span>
                <span className="text-red-400 font-semibold">{houseEdge}%</span>
                <span>99% (rigged)</span>
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs text-muted mb-2 block">Pilih angkamu (1 – {range})</label>
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: range }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => { setUserPick(n); reset(); }}
                  className={`w-9 h-9 rounded-lg text-sm font-semibold transition-colors ${
                    userPick === n
                      ? "bg-primary text-white"
                      : "bg-bg border border-line text-muted hover:border-primary"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={runSim}
            disabled={userPick === null || running}
            className="w-full py-2.5 rounded-xl bg-primary text-white font-semibold text-sm hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            {running ? `Menjalankan... (${results.length}/${TOTAL_TRIALS})` : `Jalankan ${TOTAL_TRIALS}x Generate`}
          </button>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface rounded-xl p-5 border border-line">
                <p className="text-xs text-muted">Peluang Seharusnya</p>
                <p className="text-2xl font-bold text-primary">{expectedRate}%</p>
                <p className="text-xs text-muted mt-1">Menang ~{expectedHits}x dari {TOTAL_TRIALS}</p>
              </div>
              <div className="bg-surface rounded-xl p-5 border border-line">
                <p className="text-xs text-muted">Hasil Aktual</p>
                <p className={`text-2xl font-bold ${hitCount < expectedHits ? "text-red-400" : "text-green-400"}`}>
                  {hitRate}%
                </p>
                <p className="text-xs text-muted mt-1">Menang {hitCount}x dari {results.length}</p>
              </div>
            </div>

            {/* Frequency chart */}
            <div className="bg-surface rounded-xl p-5 border border-line">
              <p className="text-sm font-semibold text-soft mb-4">Distribusi Hasil ({results.length} percobaan)</p>
              <div className="flex items-end gap-1 h-32">
                {Array.from({ length: range }, (_, i) => i + 1).map((n) => {
                  const count = freq[n] || 0;
                  const height = Math.round((count / maxFreq) * 100);
                  const isUser = n === userPick;
                  // const fair = Math.round(100 / range);
                  return (
                    <div key={n} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-xs text-muted">{count}</span>
                      <div className="w-full flex flex-col justify-end" style={{ height: "80px" }}>
                        <div
                          className={`w-full rounded-t transition-all ${isUser ? "bg-red-400" : "bg-primary/40"}`}
                          style={{ height: `${height}%`, minHeight: count > 0 ? "2px" : "0" }}
                        />
                      </div>
                      <span className={`text-xs font-medium ${isUser ? "text-red-400" : "text-muted"}`}>{n}</span>
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-muted mt-3 text-center">
                Angka pilihanmu <span className="text-red-400 font-semibold">({userPick})</span> muncul lebih jarang karena dimanipulasi.
              </p>
            </div>

            {revealed && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5">
                <h3 className="font-bold text-red-400 mb-2">Kesimpulan:</h3>
                <p className="text-sm text-soft leading-relaxed">
                  Dengan house edge <strong>{houseEdge}%</strong>, angka pilihanmu muncul{" "}
                  <strong>{hitCount}x</strong> dari {TOTAL_TRIALS} percobaan (seharusnya ~{expectedHits}x).
                  Perbedaan ini tidak terlihat secara kasual - itulah mengapa manipulasi ini sulit dideteksi
                  dan membuat pemain terus percaya mereka bisa menang.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </ToolLayout>
  );
}
