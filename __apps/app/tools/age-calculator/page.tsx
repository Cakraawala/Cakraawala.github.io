"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";
import { CalendarDays, Gift, Star } from "lucide-react";

const ZODIAC = [
  { sign: "Capricorn", symbol: "♑", start: [12, 22], end: [1, 19] },
  { sign: "Aquarius", symbol: "♒", start: [1, 20], end: [2, 18] },
  { sign: "Pisces", symbol: "♓", start: [2, 19], end: [3, 20] },
  { sign: "Aries", symbol: "♈", start: [3, 21], end: [4, 19] },
  { sign: "Taurus", symbol: "♉", start: [4, 20], end: [5, 20] },
  { sign: "Gemini", symbol: "♊", start: [5, 21], end: [6, 20] },
  { sign: "Cancer", symbol: "♋", start: [6, 21], end: [7, 22] },
  { sign: "Leo", symbol: "♌", start: [7, 23], end: [8, 22] },
  { sign: "Virgo", symbol: "♍", start: [8, 23], end: [9, 22] },
  { sign: "Libra", symbol: "♎", start: [9, 23], end: [10, 22] },
  { sign: "Scorpio", symbol: "♏", start: [10, 23], end: [11, 21] },
  { sign: "Sagittarius", symbol: "♐", start: [11, 22], end: [12, 21] },
];

const CHINESE_ZODIAC = ["Tikus", "Kerbau", "Harimau", "Kelinci", "Naga", "Ular", "Kuda", "Kambing", "Monyet", "Ayam", "Anjing", "Babi"];

function getZodiac(month: number, day: number) {
  for (const z of ZODIAC) {
    const [sm, sd] = z.start;
    const [em, ed] = z.end;
    if ((month === sm && day >= sd) || (month === em && day <= ed)) {
      return z;
    }
  }
  return ZODIAC[0]; // Capricorn fallback
}

export default function AgeCalculatorPage() {
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const [birthDate, setBirthDate] = useState("1998-05-15");
  const [targetDate, setTargetDate] = useState(todayStr);

  const result = useMemo(() => {
    if (!birthDate || !targetDate) return null;

    const birth = new Date(birthDate);
    const target = new Date(targetDate);

    if (isNaN(birth.getTime()) || isNaN(target.getTime()) || birth >= target) return null;

    let years = target.getFullYear() - birth.getFullYear();
    let months = target.getMonth() - birth.getMonth();
    let days = target.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(target.getFullYear(), target.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    const totalDays = Math.floor((target.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = years * 12 + months;
    const totalHours = totalDays * 24;

    // Next birthday
    const nextBirthday = new Date(target.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBirthday <= target) nextBirthday.setFullYear(target.getFullYear() + 1);
    const daysToNext = Math.ceil((nextBirthday.getTime() - target.getTime()) / (1000 * 60 * 60 * 24));
    const nextAge = nextBirthday.getFullYear() - birth.getFullYear();

    // Zodiac
    const zodiac = getZodiac(birth.getMonth() + 1, birth.getDate());
    // Chinese zodiac
    const chineseZodiac = CHINESE_ZODIAC[(birth.getFullYear() - 4) % 12];

    const dayOfWeek = birth.toLocaleDateString("id-ID", { weekday: "long" });

    return {
      years, months, days,
      totalDays, totalWeeks, totalMonths, totalHours,
      daysToNext, nextAge, nextBirthday,
      zodiac, chineseZodiac, dayOfWeek,
    };
  }, [birthDate, targetDate]);

  return (
    <ToolLayout title="Age Calculator" description="Hitung usia tepat, hari ulang tahun berikutnya, dan zodiak.">
      <div className="max-w-2xl mx-auto space-y-5">
        {/* Inputs */}
        <div className="bg-surface rounded-xl p-5 border border-line">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-muted mb-1 block">Tanggal Lahir</label>
              <input
                type="date"
                className="w-full bg-bg border border-line rounded-lg px-4 py-2.5 text-soft focus:outline-none focus:border-primary"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                max={todayStr}
              />
            </div>
            <div>
              <label className="text-xs text-muted mb-1 block">Dihitung sampai</label>
              <input
                type="date"
                className="w-full bg-bg border border-line rounded-lg px-4 py-2.5 text-soft focus:outline-none focus:border-primary"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
              />
            </div>
          </div>
        </div>

        {result ? (
          <>
            {/* Main age */}
            <div className="bg-surface rounded-xl p-6 border border-line text-center">
              <p className="text-xs text-muted mb-2">Usia</p>
              <p className="text-4xl font-bold text-primary">{result.years} tahun</p>
              <p className="text-soft mt-1">
                {result.months} bulan, {result.days} hari
              </p>
              <p className="text-xs text-muted mt-1">
                Lahir hari {result.dayOfWeek}
              </p>
            </div>

            {/* Breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Total Hari", value: result.totalDays.toLocaleString("id-ID") },
                { label: "Total Minggu", value: result.totalWeeks.toLocaleString("id-ID") },
                { label: "Total Bulan", value: result.totalMonths.toLocaleString("id-ID") },
                { label: "Total Jam", value: result.totalHours.toLocaleString("id-ID") },
              ].map((s) => (
                <div key={s.label} className="bg-surface rounded-xl p-4 border border-line text-center">
                  <p className="text-xs text-muted">{s.label}</p>
                  <p className="text-lg font-semibold text-soft mt-1">{s.value}</p>
                </div>
              ))}
            </div>

            {/* Next birthday */}
            <div className="bg-surface rounded-xl p-5 border border-line flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Gift size={20} className="text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-soft">Ulang Tahun ke-{result.nextAge}</p>
                <p className="text-xs text-muted">
                  {result.nextBirthday.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                  &nbsp;- {result.daysToNext === 0 ? "🎉 Hari ini!" : `${result.daysToNext} hari lagi`}
                </p>
              </div>
            </div>

            {/* Zodiac */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface rounded-xl p-5 border border-line flex items-center gap-3">
                <span className="text-3xl">{result.zodiac.symbol}</span>
                <div>
                  <p className="text-xs text-muted">Zodiak Barat</p>
                  <p className="text-soft font-semibold">{result.zodiac.sign}</p>
                </div>
              </div>
              <div className="bg-surface rounded-xl p-5 border border-line flex items-center gap-3">
                <Star size={28} className="text-yellow-400" />
                <div>
                  <p className="text-xs text-muted">Shio</p>
                  <p className="text-soft font-semibold">{result.chineseZodiac}</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-surface rounded-xl p-8 border border-line flex flex-col items-center justify-center text-center gap-3">
            <CalendarDays size={32} className="text-muted" />
            <p className="text-muted text-sm">Masukkan tanggal lahir untuk melihat hasil.</p>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
