"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";
import { DollarSign, ChevronDown, ChevronUp } from "lucide-react";

type LoanType = "anuitas" | "flat";

export default function LoanCalculatorPage() {
  const [principal, setPrincipal] = useState("10000000");
  const [rate, setRate] = useState("12");
  const [duration, setDuration] = useState("24");
  const [durationType, setDurationType] = useState<"bulan" | "tahun">("bulan");
  const [loanType, setLoanType] = useState<LoanType>("anuitas");
  const [showTable, setShowTable] = useState(false);

  const fmt = (n: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

  const result = useMemo(() => {
    const P = parseFloat(principal.replace(/\D/g, "")) || 0;
    const rAnnual = parseFloat(rate) || 0;
    const rMonthly = rAnnual / 100 / 12;
    const months = durationType === "tahun" ? (parseFloat(duration) || 0) * 12 : parseFloat(duration) || 0;

    if (P <= 0 || months <= 0) return null;

    let monthlyPayment = 0;
    const schedule: { month: number; payment: number; principal: number; interest: number; remaining: number }[] = [];

    if (loanType === "anuitas") {
      if (rMonthly === 0) {
        monthlyPayment = P / months;
      } else {
        monthlyPayment = (P * rMonthly * Math.pow(1 + rMonthly, months)) / (Math.pow(1 + rMonthly, months) - 1);
      }

      let balance = P;
      for (let m = 1; m <= months; m++) {
        const interestPart = balance * rMonthly;
        const principalPart = monthlyPayment - interestPart;
        balance = Math.max(0, balance - principalPart);
        schedule.push({
          month: m,
          payment: monthlyPayment,
          principal: principalPart,
          interest: interestPart,
          remaining: balance,
        });
      }
    } else {
      // flat
      const interestPerMonth = (P * rAnnual) / 100 / 12;
      const principalPerMonth = P / months;
      monthlyPayment = principalPerMonth + interestPerMonth;

      let balance = P;
      for (let m = 1; m <= months; m++) {
        balance = Math.max(0, balance - principalPerMonth);
        schedule.push({
          month: m,
          payment: monthlyPayment,
          principal: principalPerMonth,
          interest: interestPerMonth,
          remaining: balance,
        });
      }
    }

    const totalPayment = monthlyPayment * months;
    const totalInterest = totalPayment - P;

    return { monthlyPayment, totalPayment, totalInterest, schedule };
  }, [principal, rate, duration, durationType, loanType]);

  const principalNum = parseFloat(principal.replace(/\D/g, "")) || 0;
  const totalPer = result ? Math.round((principalNum / result.totalPayment) * 100) : 0;
  const interestPer = 100 - totalPer;

  return (
    <ToolLayout title="Loan / Interest Calculator" description="Simulasi cicilan kredit dengan metode anuitas atau flat.">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <div className="bg-surface rounded-xl p-5 border border-line space-y-4">
          <h2 className="font-semibold text-soft">Parameter Pinjaman</h2>

          <div>
            <label className="text-xs text-muted mb-1 block">Jumlah Pinjaman (Rp)</label>
            <input
              className="w-full bg-bg border border-line rounded-lg px-4 py-2.5 text-soft focus:outline-none focus:border-primary"
              value={principal}
              onChange={(e) => setPrincipal(e.target.value.replace(/\D/g, ""))}
              placeholder="10000000"
            />
          </div>

          <div>
            <label className="text-xs text-muted mb-1 block">Suku Bunga per Tahun (%)</label>
            <input
              type="number"
              className="w-full bg-bg border border-line rounded-lg px-4 py-2.5 text-soft focus:outline-none focus:border-primary"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              min="0"
              max="100"
              step="0.1"
            />
          </div>

          <div>
            <label className="text-xs text-muted mb-1 block">Jangka Waktu</label>
            <div className="flex gap-2">
              <input
                type="number"
                className="flex-1 bg-bg border border-line rounded-lg px-4 py-2.5 text-soft focus:outline-none focus:border-primary"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                min="1"
              />
              <select
                className="bg-bg border border-line rounded-lg px-3 py-2.5 text-soft focus:outline-none focus:border-primary"
                value={durationType}
                onChange={(e) => setDurationType(e.target.value as "bulan" | "tahun")}
              >
                <option value="bulan">Bulan</option>
                <option value="tahun">Tahun</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs text-muted mb-1 block">Metode Bunga</label>
            <div className="flex gap-2">
              {(["anuitas", "flat"] as LoanType[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setLoanType(t)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                    loanType === t ? "bg-primary text-white" : "bg-bg border border-line text-muted hover:border-primary"
                  }`}
                >
                  {t === "anuitas" ? "Anuitas (Efektif)" : "Flat"}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted mt-1">
              {loanType === "anuitas"
                ? "Cicilan tetap, porsi bunga menurun setiap bulan."
                : "Bunga dihitung dari pokok awal, cicilan tetap."}
            </p>
          </div>
        </div>

        {/* Result */}
        <div className="space-y-4">
          {result ? (
            <>
              <div className="bg-surface rounded-xl p-5 border border-line">
                <p className="text-xs text-muted mb-1">Cicilan per Bulan</p>
                <p className="text-3xl font-bold text-primary">{fmt(result.monthlyPayment)}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-surface rounded-xl p-4 border border-line">
                  <p className="text-xs text-muted">Total Bayar</p>
                  <p className="text-lg font-semibold text-soft">{fmt(result.totalPayment)}</p>
                </div>
                <div className="bg-surface rounded-xl p-4 border border-line">
                  <p className="text-xs text-muted">Total Bunga</p>
                  <p className="text-lg font-semibold text-red-400">{fmt(result.totalInterest)}</p>
                </div>
              </div>

              {/* Breakdown bar */}
              <div className="bg-surface rounded-xl p-5 border border-line">
                <p className="text-xs text-muted mb-3">Komposisi Total Bayar</p>
                <div className="flex h-4 rounded-full overflow-hidden">
                  <div
                    className="bg-primary transition-all"
                    style={{ width: `${totalPer}%` }}
                    title={`Pokok: ${totalPer}%`}
                  />
                  <div
                    className="bg-red-400 transition-all"
                    style={{ width: `${interestPer}%` }}
                    title={`Bunga: ${interestPer}%`}
                  />
                </div>
                <div className="flex justify-between mt-2 text-xs text-muted">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-primary inline-block" />
                    Pokok {totalPer}%
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-red-400 inline-block" />
                    Bunga {interestPer}%
                  </span>
                </div>
              </div>

              {/* Amortization toggle */}
              <button
                onClick={() => setShowTable(!showTable)}
                className="w-full flex items-center justify-between bg-surface border border-line rounded-xl px-5 py-3 text-soft text-sm hover:border-primary transition-colors"
              >
                <span className="font-medium">Jadwal Angsuran</span>
                {showTable ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>

              {showTable && (
                <div className="bg-surface rounded-xl border border-line overflow-hidden">
                  <div className="overflow-auto max-h-96">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-line bg-bg">
                          {["Bln", "Cicilan", "Pokok", "Bunga", "Sisa"].map((h) => (
                            <th key={h} className="px-3 py-2 text-muted text-right first:text-left">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {result.schedule.map((row) => (
                          <tr key={row.month} className="border-b border-line/50 hover:bg-bg/50">
                            <td className="px-3 py-2 text-muted">{row.month}</td>
                            <td className="px-3 py-2 text-right text-soft">{fmt(row.payment)}</td>
                            <td className="px-3 py-2 text-right text-primary">{fmt(row.principal)}</td>
                            <td className="px-3 py-2 text-right text-red-400">{fmt(row.interest)}</td>
                            <td className="px-3 py-2 text-right text-muted">{fmt(row.remaining)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="bg-surface rounded-xl p-8 border border-line flex flex-col items-center justify-center text-center gap-3">
              <DollarSign size={32} className="text-muted" />
              <p className="text-muted text-sm">Isi parameter pinjaman untuk melihat simulasi cicilan.</p>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
