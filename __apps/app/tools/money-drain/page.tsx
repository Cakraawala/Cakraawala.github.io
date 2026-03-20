"use client";

import { useState, useRef, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Play, RotateCcw } from "lucide-react";

const STARTING_BALANCE = 1_000_000;
const BET = 50_000;

type Round = { label: string; amount: number; balance: number };

// Rigged odds: ~20% small win, ~80% lose. Expected value is negative.
function playRound(balance: number): { label: string; amount: number } {
  if (balance <= 0) return { label: "Bangkrut", amount: 0 };
  const roll = Math.random();
  if (roll < 0.15) {
    // small win: 1–1.5x bet
    const win = BET * (1 + Math.random() * 0.5);
    return { label: `Menang kecil! +${Math.round(win / 1000)}rb`, amount: Math.round(win) };
  } else if (roll < 0.18) {
    // medium win: ~2x
    return { label: `Lumayan! +${Math.round(BET * 2 / 1000)}rb`, amount: BET * 2 };
  } else if (roll < 0.19) {
    // jackpot: 5x (very rare)
    return { label: `JACKPOT! +${Math.round(BET * 5 / 1000)}rb`, amount: BET * 5 };
  } else {
    // lose: full bet
    return { label: `Kalah -${Math.round(BET / 1000)}rb`, amount: -BET };
  }
}

const fmt = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

export default function MoneyDrainPage() {
  const [balance, setBalance] = useState(STARTING_BALANCE);
  const [history, setHistory] = useState<Round[]>([]);
  const [lastRound, setLastRound] = useState<{ label: string; amount: number } | null>(null);
  const [phase, setPhase] = useState<"playing" | "broke" | "idle">("idle");
  const [autoPlay, setAutoPlay] = useState(false);
  const autoRef = useRef<NodeJS.Timeout | null>(null);

  const pct = Math.max(0, (balance / STARTING_BALANCE) * 100);

  const doPlay = (currentBalance: number, currentHistory: Round[]) => {
    if (currentBalance <= 0) {
      setPhase("broke");
      return;
    }
    const round = playRound(currentBalance);
    const newBalance = Math.max(0, currentBalance + round.amount);
    const newHistory: Round[] = [...currentHistory, { ...round, balance: newBalance }];
    setBalance(newBalance);
    setLastRound(round);
    setHistory(newHistory);
    if (newBalance <= 0) setPhase("broke");
  };

  const handlePlay = () => {
    if (phase === "broke") return;
    setPhase("playing");
    doPlay(balance, history);
  };

  useEffect(() => {
    if (autoPlay && phase !== "broke") {
      autoRef.current = setInterval(() => {
        setBalance((bal) => {
          if (bal <= 0) {
            clearInterval(autoRef.current!);
            setAutoPlay(false);
            setPhase("broke");
            return 0;
          }
          setHistory((h) => {
            const round = playRound(bal);
            const newBalance = Math.max(0, bal + round.amount);
            setLastRound(round);
            setBalance(newBalance);
            return [...h, { ...round, balance: newBalance }];
          });
          return bal;
        });
      }, 300);
    } else {
      if (autoRef.current) clearInterval(autoRef.current);
    }
    return () => { if (autoRef.current) clearInterval(autoRef.current); };
  }, [autoPlay, phase]);

  const reset = () => {
    setBalance(STARTING_BALANCE);
    setHistory([]);
    setLastRound(null);
    setPhase("idle");
    setAutoPlay(false);
    if (autoRef.current) clearInterval(autoRef.current);
  };

  const wins = history.filter((r) => r.amount > 0).length;
  const losses = history.filter((r) => r.amount < 0).length;
  const totalLoss = STARTING_BALANCE - balance;

  // Chart: last 50 balance history
  const chartData = [STARTING_BALANCE, ...history.map((r) => r.balance)].slice(-50);
  const chartMax = STARTING_BALANCE;
  const chartMin = 0;
  const points = chartData.map((v, i) => {
    const x = (i / (chartData.length - 1 || 1)) * 100;
    const y = 100 - ((v - chartMin) / (chartMax - chartMin)) * 100;
    return `${x},${y}`;
  }).join(" ");

  return (
    <ToolLayout
      title="💸 Money Drain Simulator"
      description="Mulai Rp 1 juta - lihat berapa lama saldo bertahan."
    >
      <div className="max-w-2xl mx-auto space-y-5">
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 text-xs text-yellow-400 leading-relaxed">
          ⚠️ <strong>Edukasi Anti-Judol:</strong> Simulasi ini dirancang untuk menunjukkan pola kerugian yang
          terjadi dalam perjudian - kemenangan kecil membuatmu tetap main, tapi kerugian besar terus menguras saldo.
        </div>

        {/* Balance */}
        <div className="bg-surface rounded-2xl p-6 border border-line">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted">Saldo Tersisa</span>
            <span className="text-xs text-muted">{Math.round(pct)}%</span>
          </div>
          <p className={`text-3xl font-bold mb-3 ${balance <= 0 ? "text-red-500" : balance < 300000 ? "text-red-400" : balance < 600000 ? "text-yellow-400" : "text-primary"}`}>
            {fmt(balance)}
          </p>

          {/* Progress bar */}
          <div className="h-3 bg-bg rounded-full overflow-hidden border border-line">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                pct > 60 ? "bg-primary" : pct > 30 ? "bg-yellow-400" : "bg-red-500"
              }`}
              style={{ width: `${pct}%` }}
            />
          </div>

          {/* Last round */}
          {lastRound && (
            <p className={`mt-3 text-sm font-medium text-center ${lastRound.amount >= 0 ? "text-green-400" : "text-red-400"}`}>
              {lastRound.label}
            </p>
          )}
        </div>

        {/* Chart */}
        {chartData.length > 1 && (
          <div className="bg-surface rounded-xl p-5 border border-line">
            <p className="text-xs text-muted mb-3">Grafik Saldo (50 round terakhir)</p>
            <svg viewBox="0 0 100 40" className="w-full h-24" preserveAspectRatio="none">
              <defs>
                <linearGradient id="balGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                </linearGradient>
              </defs>
              <polyline
                points={points}
                fill="none"
                stroke="#ef4444"
                strokeWidth="1.5"
                vectorEffect="non-scaling-stroke"
              />
              <polygon
                points={`0,100 ${points} 100,100`}
                fill="url(#balGrad)"
              />
            </svg>
            <p className="text-xs text-muted text-center mt-1">Grafik selalu turun pada akhirnya.</p>
          </div>
        )}

        {/* Controls */}
        {phase !== "broke" ? (
          <div className="flex gap-3">
            <button
              onClick={handlePlay}
              className="flex-1 flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
            >
              <Play size={16} />
              Main ({fmt(BET)})
            </button>
            <button
              onClick={() => setAutoPlay(!autoPlay)}
              className={`flex-1 py-3 rounded-xl font-semibold border transition-colors ${
                autoPlay ? "bg-red-500 text-white border-red-500" : "border-line text-muted hover:border-primary hover:text-soft"
              }`}
            >
              {autoPlay ? "⏸ Stop Auto" : "⏩ Auto Play"}
            </button>
          </div>
        ) : (
          <button
            onClick={reset}
            className="w-full flex items-center justify-center gap-2 border border-line text-soft py-3 rounded-xl hover:border-primary transition-colors"
          >
            <RotateCcw size={16} />
            Main Lagi
          </button>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-surface rounded-xl p-4 border border-line text-center">
            <p className="text-xs text-muted">Total Round</p>
            <p className="text-xl font-bold text-soft">{history.length}</p>
          </div>
          <div className="bg-surface rounded-xl p-4 border border-line text-center">
            <p className="text-xs text-muted">Menang / Kalah</p>
            <p className="text-sm font-bold">
              <span className="text-green-400">{wins}W</span>
              <span className="text-muted"> / </span>
              <span className="text-red-400">{losses}L</span>
            </p>
          </div>
          <div className="bg-surface rounded-xl p-4 border border-line text-center">
            <p className="text-xs text-muted">Total Hilang</p>
            <p className="text-xl font-bold text-red-400">{fmt(totalLoss)}</p>
          </div>
        </div>

        {/* Broke screen */}
        {phase === "broke" && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5 text-center space-y-3">
            <p className="text-2xl">💀</p>
            <h3 className="font-bold text-red-400 text-lg">Saldo Habis</h3>
            <p className="text-sm text-soft leading-relaxed">
              Dari <strong>Rp 1.000.000</strong>, kamu habis dalam <strong>{history.length} round</strong>.
              Kemenangan kecil selalu ada untuk membuatmu <em>terus bermain</em> - tapi pada akhirnya,
              sistem selalu menang.
            </p>
            <p className="text-xs text-muted italic">
             {"Just like real gambling, the system is designed for you to lose."}
            </p>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
