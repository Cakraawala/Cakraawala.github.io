"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";

const SYMBOLS = ["🍒", "🍋", "🍊", "🍇", "⭐", "💎", "7️⃣", "🔔"];
const JACKPOT_SYM = "💎";

function pickRigged(luckPct: number, reel: number): string {
  // True win chance from luck %
  const winChance = luckPct / 100;

  // For near-miss: always show jackpot sym on 2 reels, miss on last
  const roll = Math.random();
  if (roll < winChance / 10) {
    // actual win (very rare even at 100%)
    return JACKPOT_SYM;
  }
  // near-miss bias: reel 0 & 1 show jackpot, reel 2 shows different
  if (reel < 2) {
    return Math.random() < 0.7 ? JACKPOT_SYM : SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
  } else {
    // last reel: never jackpot (near miss)
    return SYMBOLS.filter((s) => s !== JACKPOT_SYM)[Math.floor(Math.random() * (SYMBOLS.length - 1))];
  }
}

const MESSAGES_LOSING = [
  "Hampir! Coba lagi?",
  "Sayang banget, kurang dikit!",
  "Wah, nyaris jackpot!",
  "Sedikit lagi pasti dapat!",
  "Untungmu pasti datang!",
  "Jangan menyerah sekarang!",
];

const MESSAGES_REVELATION = [
  "You were never meant to win.",
  "The system is designed against you.",
  "Near miss? It's a programmed illusion.",
  "Your 'luck' was pre-determined.",
  "This is how gambling addiction starts.",
];

export default function YouCantWinPage() {
  const [reels, setReels] = useState(["🍒", "🍒", "🍒"]);
  const [spinning, setSpinning] = useState(false);
  const [spinCount, setSpinCount] = useState(0);
  const [luckPct, setLuckPct] = useState(50);
  const [message, setMessage] = useState<string | null>(null);
  const [phase, setPhase] = useState<"normal" | "revelation" | "truth">("normal");
  const [animReels, setAnimReels] = useState([false, false, false]);
  const [totalLost, setTotalLost] = useState(0);
  const BET = 10000;

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    setMessage(null);
    setTotalLost((n) => n + BET);

    const newSpinCount = spinCount + 1;
    setSpinCount(newSpinCount);

    // animate each reel with delay
    setAnimReels([true, true, true]);

    const result = [0, 1, 2].map((r) => pickRigged(luckPct, r));

    // stop reels one by one
    setTimeout(() => {
      setReels((prev) => [result[0], prev[1], prev[2]]);
      setAnimReels([false, true, true]);
    }, 600);
    setTimeout(() => {
      setReels((prev) => [result[0], result[1], prev[2]]);
      setAnimReels([false, false, true]);
    }, 1100);
    setTimeout(() => {
      setReels([result[0], result[1], result[2]]);
      setAnimReels([false, false, false]);
      setSpinning(false);

      const isWin = result[0] === result[1] && result[1] === result[2];

      if (phase === "normal") {
        if (isWin) {
          setMessage("🎉 MENANG! ...Tapi biasanya tidak begini.");
        } else {
          setMessage(MESSAGES_LOSING[Math.floor(Math.random() * MESSAGES_LOSING.length)]);
        }
        if (newSpinCount >= 7) setPhase("revelation");
      } else if (phase === "revelation") {
        setMessage(MESSAGES_REVELATION[Math.min(newSpinCount - 7, MESSAGES_REVELATION.length - 1)]);
        if (newSpinCount >= 12) setPhase("truth");
      }
    }, 1600);
  };

  const reset = () => {
    setReels(["🍒", "🍒", "🍒"]);
    setSpinCount(0);
    setMessage(null);
    setPhase("normal");
    setTotalLost(0);
    setAnimReels([false, false, false]);
  };

  const fmt = (n: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

  return (
    <ToolLayout
      title="🎰 You Can't Win"
      description="Simulasi edukasi: Mengapa mesin slot selalu menguntungkan kasino."
    >
      <div className="max-w-lg mx-auto space-y-5">
        {/* Warning banner */}
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 text-xs text-yellow-400 leading-relaxed">
          ⚠️ <strong>Edukasi Anti-Judol:</strong> Ini adalah simulasi yang sengaja dimanipulasi untuk menunjukkan
          bagaimana mesin slot sungguhan bekerja - selalu merugikan pemain.
        </div>

        {/* Slot machine */}
        <div className="bg-surface rounded-2xl border border-line p-6 flex flex-col items-center gap-5">
          {/* Display */}
          <div className="flex gap-3">
            {reels.map((sym, i) => (
              <div
                key={i}
                className={`w-20 h-20 bg-bg border-2 rounded-xl flex items-center justify-center text-4xl transition-all duration-100 ${
                  animReels[i] ? "animate-bounce border-primary" : "border-line"
                }`}
              >
                {animReels[i] ? SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)] : sym}
              </div>
            ))}
          </div>

          {/* Message */}
          <div className="min-h-[28px] text-center">
            {message && (
              <p
                className={`text-sm font-medium ${
                  phase === "truth"
                    ? "text-red-400"
                    : phase === "revelation"
                    ? "text-orange-400"
                    : "text-soft"
                }`}
              >
                {message}
              </p>
            )}
          </div>

          {/* Luck slider */}
          <div className="w-full">
            <div className="flex justify-between text-xs text-muted mb-1">
              <span>Keberuntunganmu</span>
              <span className="text-primary font-semibold">{luckPct}%</span>
            </div>
            <input
              type="range"
              min="1"
              max="100"
              value={luckPct}
              onChange={(e) => setLuckPct(parseInt(e.target.value))}
              className="w-full accent-primary"
              disabled={spinning}
            />
            <div className="flex justify-between text-xs text-muted mt-0.5">
              <span>Sangat sial</span>
              <span>Sangat beruntung</span>
            </div>
            <p className="text-xs text-muted text-center mt-1">
              Coba ubah ke 100% - hasilnya sama saja. 
            </p>
          </div>

          {/* Spin button */}
          <button
            onClick={spin}
            disabled={spinning || phase === "truth"}
            className={`w-full py-3.5 rounded-xl font-bold text-lg transition-all ${
              phase === "truth"
                ? "bg-line text-muted cursor-not-allowed"
                : "bg-primary text-white hover:opacity-90 active:scale-95"
            }`}
          >
            {spinning ? "Memutar..." : phase === "truth" ? "Mesin Rusak" : `SPIN - ${fmt(BET)}`}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-surface rounded-xl p-4 border border-line text-center">
            <p className="text-xs text-muted">Jumlah Spin</p>
            <p className="text-xl font-bold text-soft">{spinCount}</p>
          </div>
          <div className="bg-surface rounded-xl p-4 border border-line text-center">
            <p className="text-xs text-muted">Total Hilang</p>
            <p className="text-xl font-bold text-red-400">{fmt(totalLost)}</p>
          </div>
          <div className="bg-surface rounded-xl p-4 border border-line text-center">
            <p className="text-xs text-muted">Menang</p>
            <p className="text-xl font-bold text-muted">Rp 0</p>
          </div>
        </div>

        {/* Truth reveal */}
        {phase === "truth" && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5 space-y-3">
            <h3 className="font-bold text-red-400 text-lg">Kenyataannya:</h3>
            <ul className="space-y-2 text-sm text-soft list-disc list-inside leading-relaxed">
              <li>Near-miss (hampir menang) adalah <strong>teknik yang disengaja</strong> untuk menciptakan ilusi kendali.</li>
              <li>Mesin slot memiliki RTP (Return to Player) sekitar <strong>80–95%</strong> - artinya kasino selalu untung.</li>
              <li>Mengubah angka {"keberuntungan"} di sini <strong>tidak berpengaruh</strong> - sama seperti ritual pemain judi.</li>
              <li>Semakin lama bermain, semakin besar kerugianmu. <strong>Matematika tidak bisa dibohongi.</strong></li>
            </ul>
            <button
              onClick={reset}
              className="mt-2 px-4 py-2 border border-line rounded-lg text-sm text-muted hover:text-soft hover:border-primary transition-colors"
            >
              Reset Simulasi
            </button>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
