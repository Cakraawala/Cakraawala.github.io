"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";

const SYMBOLS = ["🍒", "🍋", "🍊", "🍇", "⭐", "💎"];
const JACKPOT = "💎";

const NEAR_MISS_INSIGHTS = [
  {
    title: "Near Miss = Manipulasi Emosi",
    body: "Mesin slot diprogram untuk menampilkan 2 simbol sama + 1 beda secara sengaja. Ini bukan kebetulan - ini adalah fitur yang dirancang.",
  },
  {
    title: "Otak Kita Tertipu",
    body: "Near miss mengaktifkan area otak yang sama seperti kemenangan. Dopamin dilepaskan seolah kamu hampir berhasil - padahal kamu gagal.",
  },
  {
    title: "The Illusion of Control",
    body: "Near miss membuat kamu merasa 'hampir bisa menang' sehingga terus bermain. Ini adalah teknik psikologi yang disebut 'near-miss effect'.",
  },
  {
    title: "Semakin Banyak Near Miss, Semakin Kecanduan",
    body: "Penelitian menunjukkan: makin sering near miss, makin lama pemain bertahan dan makin besar total uang yang dikeluarkan.",
  },
  {
    title: "Regulasi di Beberapa Negara",
    body: "Di UK, UK Gambling Commission telah melarang near miss yang disengaja pada mesin slot sejak 2009. Di Indonesia, judi masih ilegal.",
  },
];

function getNearMissResult(): string[] {
  // Always 2 jackpot symbols + 1 different (near miss)
  const reels = [JACKPOT, JACKPOT];
  const others = SYMBOLS.filter((s) => s !== JACKPOT);
  reels.push(others[Math.floor(Math.random() * others.length)]);
  // shuffle positions slightly
  if (Math.random() > 0.5) {
    return [reels[2], reels[0], reels[1]]; // near miss on first
  }
  return reels; // near miss on last
}

export default function NearMissPage() {
  const [reels, setReels] = useState(["🍒", "🍋", "🍊"]);
  const [spinning, setSpinning] = useState(false);
  const [nearMissCount, setNearMissCount] = useState(0);
  const [insightIdx, setInsightIdx] = useState(0);
  const [showInsight, setShowInsight] = useState(false);
  const [animReels, setAnimReels] = useState([false, false, false]);

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    setShowInsight(false);
    setAnimReels([true, true, true]);

    const result = getNearMissResult();
    const newCount = nearMissCount + 1;

    setTimeout(() => {
      setReels((p) => [result[0], p[1], p[2]]);
      setAnimReels([false, true, true]);
    }, 600);
    setTimeout(() => {
      setReels((p) => [result[0], result[1], p[2]]);
      setAnimReels([false, false, true]);
    }, 1100);
    setTimeout(() => {
      setReels(result);
      setAnimReels([false, false, false]);
      setSpinning(false);
      setNearMissCount(newCount);

      // Show new insight every 2 spins
      if (newCount % 2 === 0) {
        const nextIdx = (insightIdx + 1) % NEAR_MISS_INSIGHTS.length;
        setInsightIdx(nextIdx);
        setShowInsight(true);
      } else {
        setShowInsight(true);
      }
    }, 1700);
  };

  const insight = NEAR_MISS_INSIGHTS[insightIdx % NEAR_MISS_INSIGHTS.length];

  // Count jackpot symbols in reels (always 2 for near miss)
  const jackpotCount = reels.filter((r) => r === JACKPOT).length;

  return (
    <ToolLayout
      title="🎯 Near Miss Psychology"
      description="Bagaimana ilusi 'hampir menang' diciptakan untuk memicu kecanduan."
    >
      <div className="max-w-lg mx-auto space-y-5">
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 text-xs text-yellow-400 leading-relaxed">
          ⚠️ <strong>Edukasi Anti-Judol:</strong> Setiap spin di sini <em>selalu</em> near miss - ini bukan
          kebetulan. Ini persis cara mesin slot sungguhan diprogram.
        </div>

        {/* Slot */}
        <div className="bg-surface rounded-2xl border border-line p-6 flex flex-col items-center gap-5">
          {/* Reels */}
          <div className="flex gap-3">
            {reels.map((sym, i) => {
              const isJackpot = sym === JACKPOT;
              return (
                <div
                  key={i}
                  className={`w-20 h-20 rounded-xl flex items-center justify-center text-4xl border-2 transition-all ${
                    animReels[i]
                      ? "animate-bounce border-primary bg-bg"
                      : isJackpot
                      ? "border-yellow-400 bg-yellow-400/10"
                      : "border-line bg-bg"
                  }`}
                >
                  {animReels[i] ? SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)] : sym}
                </div>
              );
            })}
          </div>

          {/* Near miss label */}
          {!spinning && nearMissCount > 0 && (
            <div className="text-center">
              {jackpotCount >= 2 ? (
                <p className="text-orange-400 font-bold text-lg">
                  💥 Hampir! Satu lagi!
                </p>
              ) : (
                <p className="text-muted text-sm">Coba lagi...</p>
              )}
              <p className="text-xs text-muted mt-1">
                (Ini sengaja diprogram - akan selalu hampir jackpot)
              </p>
            </div>
          )}

          <button
            onClick={spin}
            disabled={spinning}
            className="w-full py-3.5 rounded-xl bg-primary text-white font-bold text-lg hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {spinning ? "Berputar..." : "SPIN"}
          </button>
        </div>

        {/* Counter */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-surface rounded-xl p-4 border border-line text-center">
            <p className="text-xs text-muted">Jumlah Spin</p>
            <p className="text-2xl font-bold text-soft">{nearMissCount}</p>
          </div>
          <div className="bg-surface rounded-xl p-4 border border-line text-center">
            <p className="text-xs text-muted">Jackpot Sesungguhnya</p>
            <p className="text-2xl font-bold text-muted">0x</p>
            <p className="text-xs text-muted">(tidak pernah)</p>
          </div>
        </div>

        {/* Insight */}
        {showInsight && (
          <div className="bg-surface border border-primary/30 rounded-xl p-5 space-y-2 animate-pulse-once">
            <h3 className="text-sm font-bold text-primary">💡 {insight.title}</h3>
            <p className="text-sm text-soft leading-relaxed">{insight.body}</p>
            <div className="flex gap-1 mt-2">
              {NEAR_MISS_INSIGHTS.map((_, i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    i === insightIdx % NEAR_MISS_INSIGHTS.length ? "bg-primary" : "bg-line"
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Science section */}
        {nearMissCount >= 4 && (
          <div className="bg-surface rounded-xl p-5 border border-line space-y-3">
            <h3 className="font-semibold text-soft">🧠 Studi Ilmiah tentang Near Miss</h3>
            <div className="space-y-2 text-sm text-muted leading-relaxed">
              <p>
                <strong className="text-soft">Clark et al. (2009):</strong> Near miss mengaktifkan striatum ventral
                (pusat reward otak) sama seperti kemenangan nyata.
              </p>
              <p>
                <strong className="text-soft">Langer (1975) - Illusion of Control:</strong> Manusia cenderung
                percaya mereka punya kendali atas hasil acak, terutama ketika hampir berhasil.
              </p>
              <p>
                <strong className="text-soft">Kasino tahu ini:</strong> Mesin slot modern diatur oleh algoritma yang
                secara eksplisit meningkatkan frekuensi near miss tanpa melanggar probabilitas keseluruhan.
              </p>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
