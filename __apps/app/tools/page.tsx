"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Calculator,
  Weight,
  Timer,
  Palette,
  Hash,
  Code2,
  Ruler,
  Thermometer,
  Binary,
  Globe,
  KeyRound,
  Link2,
  FileKey,
  Shuffle,
  Keyboard,
  Brain,
  Grid3X3,
  Flame,
  ArrowLeftRight,
  HelpCircle,
} from "lucide-react";

type Category = "all" | "tool" | "minigame";
type Status = "ready" | "soon";

const items: {
  label: string;
  desc: string;
  icon: React.ElementType;
  href: string;
  status: Status;
  category: Category;
}[] = [
  {
    label: "Calculator",
    desc: "Kalkulator serbaguna untuk operasi matematika dasar dan lanjutan.",
    icon: Calculator,
    href: "/tools/calculator",
    status: "ready",
    category: "tool",
  },
  {
    label: "Weight Converter",
    desc: "Konversi satuan berat: kg, lbs, gram, ounce, dan lainnya.",
    icon: Weight,
    href: "/tools/weight-converter",
    status: "ready",
    category: "tool",
  },
  {
    label: "Timestamp Converter",
    desc: "Konversi Unix timestamp ke tanggal/waktu dan sebaliknya.",
    icon: Timer,
    href: "/tools/timestamp",
    status: "ready",
    category: "tool",
  },
  {
    label: "Color Picker",
    desc: "Konversi antara HEX, RGB, HSL, dan preview warna secara langsung.",
    icon: Palette,
    href: "/tools/color-picker",
    status: "ready",
    category: "tool",
  },
  {
    label: "Hash Generator",
    desc: "Generate hash SHA-1, SHA-256, SHA-384, SHA-512 dari teks input.",
    icon: Hash,
    href: "/tools/hash-generator",
    status: "ready",
    category: "tool",
  },
  {
    label: "JSON Formatter",
    desc: "Format, minify, dan validasi JSON dengan syntax highlighting.",
    icon: Code2,
    href: "/tools/json-formatter",
    status: "soon",
    category: "tool",
  },
  {
    label: "Unit Converter",
    desc: "Konversi panjang, luas, volume - meter, inch, feet, dan lainnya.",
    icon: Ruler,
    href: "/tools/unit-converter",
    status: "soon",
    category: "tool",
  },
  {
    label: "Temperature Converter",
    desc: "Konversi Celsius, Fahrenheit, dan Kelvin secara instan.",
    icon: Thermometer,
    href: "/tools/temperature",
    status: "soon",
    category: "tool",
  },
  {
    label: "Base Converter",
    desc: "Konversi bilangan antara biner, oktal, desimal, dan heksadesimal.",
    icon: Binary,
    href: "/tools/base-converter",
    status: "soon",
    category: "tool",
  },
  {
    label: "Timezone Converter",
    desc: "Bandingkan waktu di berbagai zona waktu dunia secara bersamaan.",
    icon: Globe,
    href: "/tools/timezone",
    status: "soon",
    category: "tool",
  },
  {
    label: "Password Generator",
    desc: "Buat password acak yang kuat dengan cek skor kekuatannya.",
    icon: KeyRound,
    href: "/tools/password-generator",
    status: "soon",
    category: "tool",
  },
  {
    label: "URL Encoder / Decoder",
    desc: "Encode atau decode URL dan query string dengan mudah.",
    icon: Link2,
    href: "/tools/url-encoder",
    status: "soon",
    category: "tool",
  },
  {
    label: "JWT Decoder",
    desc: "Decode dan inspect payload JWT token tanpa verifikasi.",
    icon: FileKey,
    href: "/tools/jwt-decoder",
    status: "soon",
    category: "tool",
  },
  {
    label: "Random Picker",
    desc: "Pilih item acak dari daftar yang kamu masukkan sendiri.",
    icon: Shuffle,
    href: "/tools/random-picker",
    status: "soon",
    category: "tool",
  },

  // ── Minigames ─────────────────────────────────────────────────────────
  {
    label: "Typing Speed Test",
    desc: "Uji kecepatan & akurasi mengetikmu dalam waktu singkat.",
    icon: Keyboard,
    href: "/tools/typing-speed",
    status: "soon",
    category: "minigame",
  },
  {
    label: "Memory Card Game",
    desc: "Temukan pasangan kartu yang cocok, uji daya ingatmu!",
    icon: Brain,
    href: "/tools/memory-card",
    status: "soon",
    category: "minigame",
  },
  {
    label: "Mini Puzzle",
    desc: "Susun ulang potongan gambar ke posisi yang benar.",
    icon: Grid3X3,
    href: "/tools/mini-puzzle",
    status: "soon",
    category: "minigame",
  },
  {
    label: "Truth Or Dare",
    desc: "Pertanyaan jujur atau tantangan seru buat kamu dan teman.",
    icon: Flame,
    href: "/tools/truth-or-dare",
    status: "soon",
    category: "minigame",
  },
  {
    label: "Would You Rather",
    desc: "Pilih salah satu dari dua pilihan yang sama-sama susah.",
    icon: ArrowLeftRight,
    href: "/tools/would-you-rather",
    status: "soon",
    category: "minigame",
  },
  {
    label: "Random Question",
    desc: "Generator pertanyaan acak untuk ngobrol dan saling mengenal.",
    icon: HelpCircle,
    href: "/tools/random-question",
    status: "soon",
    category: "minigame",
  },
];

const tabs: { label: string; value: Category }[] = [
  { label: "All", value: "all" },
  { label: "Tool", value: "tool" },
  { label: "Minigames", value: "minigame" },
];

export default function ToolsPage() {
  const [active, setActive] = useState<Category>("all");

  const filtered =
    active === "all" ? items : items.filter((i) => i.category === active);

  return (
    <main className="min-h-screen bg-bg">
      <div className="max-w-6xl mx-auto px-6 md:px-12 pt-28 pb-20">
        <div className="mb-10">
          <p className="text-primary font-mono text-sm mb-3">{"// utilities & games"}</p>
          <h1 className="text-4xl md:text-5xl font-bold text-soft mb-3">Tools</h1>
          <p className="text-muted text-sm max-w-lg">
            Kumpulan tools ringan dan mini-games untuk kebutuhan sehari-hari.
          </p>
          <div className="mt-4 h-px w-full bg-line" />
        </div>

        <div className="flex gap-2 mb-8 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActive(tab.value)}
              className={`px-4 py-1.5 rounded-full text-xs font-mono border transition-all duration-200 ${
                active === tab.value
                  ? "bg-primary/10 border-primary/40 text-primary"
                  : "bg-surface border-line text-muted hover:text-soft hover:border-white/10"
              }`}
            >
              {tab.label}
              <span className="ml-1.5 opacity-50">
                {tab.value === "all"
                  ? items.length
                  : items.filter((i) => i.category === tab.value).length}
              </span>
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.status === "ready" ? item.href : "#"}
                className={`group relative p-5 rounded-2xl bg-surface border border-line transition-all duration-300 flex flex-col gap-3 ${
                  item.status === "ready"
                    ? "hover:border-white/10 hover:-translate-y-1 cursor-pointer"
                    : "opacity-50 cursor-not-allowed pointer-events-none"
                }`}
              >
                {item.category === "minigame" && (
                  <span className="absolute top-4 left-4 text-[9px] font-mono text-amber-400/70 border border-amber-400/20 bg-amber-400/5 rounded-full px-2 py-0.5">
                    game
                  </span>
                )}

                {item.status === "soon" ? (
                  <span className="absolute top-4 right-4 text-[10px] font-mono text-muted/50 border border-line rounded-full px-2 py-0.5">
                    soon
                  </span>
                ) : (
                  <span className="absolute top-4 right-4 text-[10px] font-mono text-primary border border-primary/20 bg-primary/5 rounded-full px-2 py-0.5">
                    ready
                  </span>
                )}

                <div className="w-9 h-9 rounded-xl bg-bg border border-line flex items-center justify-center text-primary group-hover:border-primary/30 transition-colors">
                  <Icon size={17} />
                </div>

                <div>
                  <h2 className="font-semibold text-soft text-sm mb-1 group-hover:text-white transition-colors">
                    {item.label}
                  </h2>
                  <p className="text-muted text-xs leading-relaxed">{item.desc}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
