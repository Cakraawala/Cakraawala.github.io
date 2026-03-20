"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Play, RotateCcw, Users } from "lucide-react";

const NUM_PLAYERS = 1000;
const ROUNDS_PER_PLAYER = 100;
const BET = 10_000;
// Win chance per round: 45% - house edge ~10%
const WIN_CHANCE = 0.45;
const WIN_MULTIPLIER = 1.9; // payout on win

interface PlayerResult {
  id: number;
  finalBalance: number;
  netPL: number;
  peakBalance: number;
  rounds: number;
}

function simulatePlayer(): PlayerResult {
  let balance = BET * 10; // start with 10x bet
  let peak = balance;
  let rounds = 0;
  for (let i = 0; i < ROUNDS_PER_PLAYER; i++) {
    if (balance <= 0) break;
    rounds++;
    if (Math.random() < WIN_CHANCE) {
      balance += BET * (WIN_MULTIPLIER - 1);
    } else {
      balance -= BET;
    }
    if (balance > peak) peak = balance;
  }
  return {
    id: Math.random(),
    finalBalance: Math.max(0, balance),
    netPL: Math.max(0, balance) - BET * 10,
    peakBalance: peak,
    rounds,
  };
}

const fmt = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

export default function HouseWinsPage() {
  const [results, setResults] = useState<PlayerResult[]>([]);
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);

  const run = async () => {
    setRunning(true);
    setProgress(0);
    setResults([]);

    const all: PlayerResult[] = [];
    const BATCH = 50;
    for (let i = 0; i < NUM_PLAYERS; i += BATCH) {
      for (let j = 0; j < BATCH && i + j < NUM_PLAYERS; j++) {
        all.push(simulatePlayer());
      }
      setProgress(Math.min(i + BATCH, NUM_PLAYERS));
      await new Promise((r) => setTimeout(r, 10));
    }

    setResults(all);
    setRunning(false);
  };

  const reset = () => {
    setResults([]);
    setProgress(0);
  };

  // Stats
  const losers = results.filter((r) => r.netPL < 0);
  const winners = results.filter((r) => r.netPL > 0);
  const loserPct = results.length > 0 ? ((losers.length / results.length) * 100).toFixed(1) : "0";
  const winnerPct = results.length > 0 ? ((winners.length / results.length) * 100).toFixed(1) : "0";
  const avgLoss = losers.length > 0 ? losers.reduce((a, r) => a + Math.abs(r.netPL), 0) / losers.length : 0;
  const totalHouseProfit = results.reduce((a, r) => a - r.netPL, 0); // what house takes
  const biggestWinner = results.length > 0 ? Math.max(...results.map((r) => r.netPL)) : 0;
  const biggestLoser = results.length > 0 ? Math.min(...results.map((r) => r.netPL)) : 0;

  // Distribution buckets
  const buckets = {
    "Rugi > 50%": 0,
    "Rugi 20-50%": 0,
    "Rugi 1-20%": 0,
    "Impas": 0,
    "Untung 1-20%": 0,
    "Untung > 20%": 0,
  };
  const startingBalance = BET * 10;
  results.forEach((r) => {
    const pct = (r.netPL / startingBalance) * 100;
    if (pct < -50) buckets["Rugi > 50%"]++;
    else if (pct < -20) buckets["Rugi 20-50%"]++;
    else if (pct < 0) buckets["Rugi 1-20%"]++;
    else if (pct === 0) buckets["Impas"]++;
    else if (pct <= 20) buckets["Untung 1-20%"]++;
    else buckets["Untung > 20%"]++;
  });
  const bucketMax = Math.max(...Object.values(buckets), 1);

  const bucketColors: Record<string, string> = {
    "Rugi > 50%": "bg-red-600",
    "Rugi 20-50%": "bg-red-400",
    "Rugi 1-20%": "bg-orange-400",
    "Impas": "bg-muted",
    "Untung 1-20%": "bg-green-400",
    "Untung > 20%": "bg-green-600",
  };

  return (
    <ToolLayout
      title="🏦 House Always Wins"
      description="Simulasi 1.000 pemain - bukti matematis kasino selalu untung."
    >
      <div className="max-w-2xl mx-auto space-y-5">
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 text-xs text-yellow-400 leading-relaxed">
          ⚠️ <strong>Edukasi Anti-Judol:</strong> 1.000 pemain masing-masing bermain {ROUNDS_PER_PLAYER} ronde
          dengan peluang menang {Math.round(WIN_CHANCE * 100)}% per ronde. Angka realistis dari mesin slot.
        </div>

        {/* Run button */}
        {results.length === 0 ? (
          <div className="bg-surface rounded-xl p-6 border border-line text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <Users size={28} className="text-primary" />
            </div>
            <p className="text-soft">
              Simulasikan <strong className="text-primary">1.000 pemain</strong> yang masing-masing bermain{" "}
              <strong className="text-primary">{ROUNDS_PER_PLAYER} ronde</strong> perjudian.
            </p>
            <button
              onClick={run}
              disabled={running}
              className="flex items-center gap-2 mx-auto bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 disabled:opacity-50 transition-all"
            >
              <Play size={16} />
              {running ? `Mensimulasikan... (${progress}/${NUM_PLAYERS})` : "Mulai Simulasi"}
            </button>
            {running && (
              <div className="h-2 bg-bg rounded-full overflow-hidden border border-line">
                <div
                  className="h-full bg-primary transition-all rounded-full"
                  style={{ width: `${(progress / NUM_PLAYERS) * 100}%` }}
                />
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Key stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-surface rounded-xl p-4 border border-red-500/30 text-center">
                <p className="text-xs text-muted">Pemain Rugi</p>
                <p className="text-2xl font-bold text-red-400">{loserPct}%</p>
                <p className="text-xs text-muted">{losers.length} orang</p>
              </div>
              <div className="bg-surface rounded-xl p-4 border border-green-500/30 text-center">
                <p className="text-xs text-muted">Pemain Untung</p>
                <p className="text-2xl font-bold text-green-400">{winnerPct}%</p>
                <p className="text-xs text-muted">{winners.length} orang</p>
              </div>
              <div className="bg-surface rounded-xl p-4 border border-line text-center">
                <p className="text-xs text-muted">Rata-rata Rugi</p>
                <p className="text-lg font-bold text-red-400">{fmt(avgLoss)}</p>
              </div>
              <div className="bg-surface rounded-xl p-4 border border-line text-center">
                <p className="text-xs text-muted">Keuntungan Kasino</p>
                <p className="text-lg font-bold text-primary">{fmt(totalHouseProfit)}</p>
              </div>
            </div>

            {/* Distribution chart */}
            <div className="bg-surface rounded-xl p-5 border border-line">
              <p className="text-sm font-semibold text-soft mb-4">Distribusi Hasil {NUM_PLAYERS} Pemain</p>
              <div className="space-y-2">
                {Object.entries(buckets).map(([label, count]) => {
                  const w = Math.round((count / bucketMax) * 100);
                  const pct = ((count / (results.length || 1)) * 100).toFixed(1);
                  return (
                    <div key={label} className="flex items-center gap-3">
                      <span className="text-xs text-muted w-28 text-right flex-shrink-0">{label}</span>
                      <div className="flex-1 bg-bg rounded-full h-5 overflow-hidden border border-line">
                        <div
                          className={`h-full rounded-full transition-all ${bucketColors[label]}`}
                          style={{ width: `${w}%` }}
                        />
                      </div>
                      <span className="text-xs text-soft w-20">
                        {count}x ({pct}%)
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Extra facts */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-surface rounded-xl p-4 border border-line">
                <p className="text-xs text-muted">Pemenang Terbesar</p>
                <p className="text-lg font-bold text-green-400">+{fmt(biggestWinner)}</p>
              </div>
              <div className="bg-surface rounded-xl p-4 border border-line">
                <p className="text-xs text-muted">Pecundang Terbesar</p>
                <p className="text-lg font-bold text-red-400">{fmt(biggestLoser)}</p>
              </div>
            </div>

            {/* Conclusion */}
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5 space-y-3">
              <h3 className="font-bold text-red-400">📊 Apa Artinya?</h3>
              <ul className="space-y-2 text-sm text-soft list-disc list-inside leading-relaxed">
                <li>
                  <strong>{loserPct}%</strong> dari {NUM_PLAYERS} pemain rugi meskipun peluang menang{" "}
                  {Math.round(WIN_CHANCE * 100)}% per ronde.
                </li>
                <li>
                  Kasino meraup total <strong>{fmt(totalHouseProfit)}</strong> dari sesi ini saja.
                </li>
                <li>
                  Pemenang terbesar (<strong>+{fmt(biggestWinner)}</strong>) sering dijadikan {"bukti"} oleh kasino - padahal
                  itu pengecualian, bukan aturan.
                </li>
                <li>
                  Semakin lama kamu bermain, semakin pasti kamu akan rugi. <strong>Hukum bilangan besar tidak bisa dilawan.</strong>
                </li>
              </ul>
            </div>

            <button
              onClick={reset}
              className="w-full flex items-center justify-center gap-2 border border-line text-muted py-2.5 rounded-xl hover:border-primary hover:text-soft transition-colors text-sm"
            >
              <RotateCcw size={14} />
              Simulasi Ulang
            </button>
          </>
        )}
      </div>
    </ToolLayout>
  );
}
