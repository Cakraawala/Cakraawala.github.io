"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
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
  Wifi,
  Search,
  X,
  Percent,
  Receipt,
  CalendarDays,
  HardDrive,
  Fingerprint,
  Bot,
  Gamepad2,
  Dices,
  TrendingDown,
  Target,
  BarChart2,
} from "lucide-react";

type Category = "all" | "tool" | "minigame";
type Status = "ready" | "soon";

const ALL_TAGS = ["converter", "generator", "formatter", "decoder", "encoder", "crypto", "text", "math", "network", "utility", "team", "fun", "game", "finance"] as const;
type Tag = typeof ALL_TAGS[number];

const items: {
  label: string;
  desc: string;
  icon: React.ElementType;
  href: string;
  status: Status;
  category: Category;
  tags: Tag[];
}[] = [
  {
    label: "Calculator",
    desc: "Kalkulator serbaguna untuk operasi matematika dasar dan lanjutan.",
    icon: Calculator,
    href: "/tools/calculator",
    status: "ready",
    category: "tool",
    tags: ["utility", "math"],
  },
  {
    label: "Weight Converter",
    desc: "Konversi satuan berat: kg, lbs, gram, ounce, dan lainnya.",
    icon: Weight,
    href: "/tools/weight-converter",
    status: "ready",
    category: "tool",
    tags: ["converter"],
  },
  {
    label: "Timestamp Converter",
    desc: "Konversi Unix timestamp ke tanggal/waktu dan sebaliknya.",
    icon: Timer,
    href: "/tools/timestamp",
    status: "ready",
    category: "tool",
    tags: ["converter", "utility"],
  },
  {
    label: "Color Picker",
    desc: "Konversi antara HEX, RGB, HSL, dan preview warna secara langsung.",
    icon: Palette,
    href: "/tools/color-picker",
    status: "ready",
    category: "tool",
    tags: ["converter", "utility"],
  },
  {
    label: "Hash Generator",
    desc: "Generate hash SHA-1, SHA-256, SHA-384, SHA-512 dari teks input.",
    icon: Hash,
    href: "/tools/hash-generator",
    status: "ready",
    category: "tool",
    tags: ["generator", "crypto", "text"],
  },
  {
    label: "JSON Formatter",
    desc: "Format, minify, dan validasi JSON dengan syntax highlighting.",
    icon: Code2,
    href: "/tools/json-formatter",
    status: "ready",
    category: "tool",
    tags: ["formatter", "text", "utility"],
  },
  {
    label: "Unit Converter",
    desc: "Konversi panjang, luas, volume - meter, inch, feet, dan lainnya.",
    icon: Ruler,
    href: "/tools/unit-converter",
    status: "ready",
    category: "tool",
    tags: ["converter"],
  },
  {
    label: "Temperature Converter",
    desc: "Konversi Celsius, Fahrenheit, dan Kelvin secara instan.",
    icon: Thermometer,
    href: "/tools/temperature",
    status: "ready",
    category: "tool",
    tags: ["converter"],
  },
  {
    label: "Base Converter",
    desc: "Konversi bilangan antara biner, oktal, desimal, dan heksadesimal.",
    icon: Binary,
    href: "/tools/base-converter",
    status: "ready",
    category: "tool",
    tags: ["converter", "math"],
  },
  {
    label: "Timezone Converter",
    desc: "Bandingkan waktu di berbagai zona waktu dunia secara bersamaan.",
    icon: Globe,
    href: "/tools/timezone",
    status: "ready",
    category: "tool",
    tags: ["converter", "network"],
  },
  {
    label: "Password Generator",
    desc: "Buat password acak yang kuat dengan cek skor kekuatannya.",
    icon: KeyRound,
    href: "/tools/password-generator",
    status: "ready",
    category: "tool",
    tags: ["generator", "crypto"],
  },
  {
    label: "URL Encoder / Decoder",
    desc: "Encode atau decode URL dan query string dengan mudah.",
    icon: Link2,
    href: "/tools/url-encoder",
    status: "ready",
    category: "tool",
    tags: ["encoder", "decoder", "text"],
  },
  {
    label: "JWT Decoder",
    desc: "Decode dan inspect payload JWT token tanpa verifikasi.",
    icon: FileKey,
    href: "/tools/jwt-decoder",
    status: "ready",
    category: "tool",
    tags: ["decoder", "crypto", "text"],
  },
  {
    label: "Random Picker",
    desc: "Pilih item acak dari daftar - dengan pembagian tim & balancing gender.",
    icon: Shuffle,
    href: "/tools/random-picker",
    status: "ready",
    category: "tool",
    tags: ["utility", "fun", "team"],
  },
  {
    label: "Internet Speed Test",
    desc: "Cek kecepatan download, upload, dan latency koneksi internetmu.",
    icon: Wifi,
    href: "/tools/internet-speed",
    status: "ready",
    category: "tool",
    tags: ["network", "utility"],
  },

  {
    label: "Loan / Interest Calculator",
    desc: "Simulasi cicilan kredit (anuitas / flat) dengan jadwal angsuran lengkap.",
    icon: Percent,
    href: "/tools/loan-calculator",
    status: "ready",
    category: "tool",
    tags: ["finance", "math", "utility"],
  },
  {
    label: "Split Bill Calculator",
    desc: "Hitung pembagian tagihan restoran termasuk pajak dan tips untuk banyak orang.",
    icon: Receipt,
    href: "/tools/split-bill",
    status: "ready",
    category: "tool",
    tags: ["finance", "utility", "math"],
  },
  {
    label: "Age Calculator",
    desc: "Hitung usia tepat, jadwal ulang tahun berikutnya, zodiak, dan shio.",
    icon: CalendarDays,
    href: "/tools/age-calculator",
    status: "ready",
    category: "tool",
    tags: ["utility", "converter"],
  },
  {
    label: "File Size Converter",
    desc: "Konversi ukuran file: Bit, Byte, KB, MB, GB, TB, PB secara instan.",
    icon: HardDrive,
    href: "/tools/file-size",
    status: "ready",
    category: "tool",
    tags: ["converter", "utility"],
  },
  {
    label: "UUID Generator",
    desc: "Generate UUID v4 acak dalam jumlah banyak sekaligus, dengan opsi format.",
    icon: Fingerprint,
    href: "/tools/uuid-generator",
    status: "ready",
    category: "tool",
    tags: ["generator", "utility", "crypto"],
  },
  {
    label: "Fake Data Generator",
    desc: "Buat data dummy Indonesia (nama, email, NIK, alamat) untuk testing.",
    icon: Bot,
    href: "/tools/fake-data",
    status: "ready",
    category: "tool",
    tags: ["generator", "utility", "text"],
  },

  // ── Minigames ─────────────────────────────────────────────────────────
  {
    label: "Typing Speed Test",
    desc: "Uji kecepatan & akurasi mengetikmu - Indonesia, English, atau campur.",
    icon: Keyboard,
    href: "/tools/typing-speed",
    status: "ready",
    category: "minigame",
    tags: ["game", "text"],
  },
  {
    label: "Memory Card Game",
    desc: "Temukan pasangan kartu yang cocok, uji daya ingatmu!",
    icon: Brain,
    href: "/tools/memory-card",
    status: "soon",
    category: "minigame",
    tags: ["game"],
  },
  {
    label: "Mini Puzzle",
    desc: "Susun ulang potongan gambar ke posisi yang benar.",
    icon: Grid3X3,
    href: "/tools/mini-puzzle",
    status: "soon",
    category: "minigame",
    tags: ["game"],
  },
  {
    label: "Truth Or Dare",
    desc: "Pertanyaan jujur atau tantangan seru buat kamu dan teman.",
    icon: Flame,
    href: "/tools/truth-or-dare",
    status: "ready",
    category: "minigame",
    tags: ["game", "fun"],
  },
  {
    label: "Would You Rather",
    desc: "Pilih salah satu dari dua pilihan yang sama-sama susah.",
    icon: ArrowLeftRight,
    href: "/tools/would-you-rather",
    status: "soon",
    category: "minigame",
    tags: ["game", "fun"],
  },
  {
    label: "Random Question",
    desc: "Generator pertanyaan acak untuk ngobrol dan saling mengenal.",
    icon: HelpCircle,
    href: "/tools/random-question",
    status: "soon",
    category: "minigame",
    tags: ["game", "fun"],
  },

  // ── 🎰 Mini Game Edukasi Anti-Judol ───────────────────────────────────
  {
    label: "You Can't Win",
    desc: "Spin mesin slot yang sudah dimanipulasi - pelajari mengapa kamu tidak pernah bisa menang.",
    icon: Gamepad2,
    href: "/tools/cant-win",
    status: "ready",
    category: "minigame",
    tags: ["game", "fun"],
  },
  {
    label: "Rigged RNG Simulator",
    desc: "Pilih angka dan lihat perbedaan peluang asli vs hasil yang dimanipulasi kasino.",
    icon: Dices,
    href: "/tools/rigged-rng",
    status: "ready",
    category: "minigame",
    tags: ["game", "math"],
  },
  {
    label: "Money Drain Simulator",
    desc: "Mulai dari Rp 1 juta - lihat grafik saldo yang selalu turun meski ada kemenangan kecil.",
    icon: TrendingDown,
    href: "/tools/money-drain",
    status: "ready",
    category: "minigame",
    tags: ["game", "finance"],
  },
  {
    label: "Near Miss Psychology",
    desc: "Animasi slot yang selalu hampir jackpot - teknik adiksi yang disengaja.",
    icon: Target,
    href: "/tools/near-miss",
    status: "ready",
    category: "minigame",
    tags: ["game", "fun"],
  },
  {
    label: "House Always Wins",
    desc: "Simulasi 1.000 pemain - 90%+ selalu rugi, kasino selalu untung.",
    icon: BarChart2,
    href: "/tools/house-wins",
    status: "ready",
    category: "minigame",
    tags: ["game", "math", "finance"],
  },
];

const tabs: { label: string; value: Category }[] = [
  { label: "All", value: "all" },
  { label: "Tool", value: "tool" },
  { label: "Minigames", value: "minigame" },
];

export default function ToolsPage() {
  const [active, setActive] = useState<Category>("all");
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);

  const toggleTag = (tag: Tag) =>
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );

  const clearFilters = () => {
    setSearch("");
    setSelectedTags([]);
    setActive("all");
  };

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchCat = active === "all" || item.category === active;
      const q = search.toLowerCase();
      const matchSearch =
        q === "" ||
        item.label.toLowerCase().includes(q) ||
        item.desc.toLowerCase().includes(q) ||
        item.tags.some((t) => t.includes(q));
      const matchTags =
        selectedTags.length === 0 ||
        selectedTags.some((t) => item.tags.includes(t));
      return matchCat && matchSearch && matchTags;
    });
  }, [active, search, selectedTags]);

  const hasFilter = search !== "" || selectedTags.length > 0 || active !== "all";

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

        {/* Search bar */}
        <div className="relative mb-4">
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted/50 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari tool berdasarkan nama, deskripsi, atau tag..."
            className="w-full bg-surface border border-line rounded-xl pl-10 pr-10 py-2.5 text-soft text-sm font-mono focus:outline-none focus:border-white/20 transition-colors placeholder:text-muted/30"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-soft transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Category tabs */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
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
          {hasFilter && (
            <button
              onClick={clearFilters}
              className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono border border-red-400/20 text-red-400/60 hover:text-red-400 hover:border-red-400/40 transition-all"
            >
              <X size={11} /> Reset filter
            </button>
          )}
        </div>

        {/* Tag multi-select */}
        <div className="flex flex-wrap gap-1.5 mb-8">
          {ALL_TAGS.map((tag) => {
            const isActive = selectedTags.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1 rounded-full text-[11px] font-mono border transition-all duration-200 ${
                  isActive
                    ? "bg-primary/15 border-primary/50 text-primary"
                    : "bg-surface border-line text-muted/50 hover:text-muted hover:border-white/10"
                }`}
              >
                {isActive && <span className="mr-1">✓</span>}#{tag}
              </button>
            );
          })}
        </div>

        {/* Result count when filtering */}
        {hasFilter && (
          <p className="text-xs text-muted font-mono mb-4">
            {filtered.length} hasil dari {items.length} tools
          </p>
        )}

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted font-mono text-sm">Tidak ada tool yang cocok.</p>
            <button onClick={clearFilters} className="mt-3 text-primary text-xs font-mono hover:underline">
              Reset filter
            </button>
          </div>
        ) : (
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

                  <div className="flex-1">
                    <h2 className="font-semibold text-soft text-sm mb-1 group-hover:text-white transition-colors">
                      {item.label}
                    </h2>
                    <p className="text-muted text-xs leading-relaxed">{item.desc}</p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mt-1">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`text-[9px] font-mono px-1.5 py-0.5 rounded-md border ${
                          selectedTags.includes(tag)
                            ? "text-primary border-primary/30 bg-primary/5"
                            : "text-muted/30 border-line/40"
                        }`}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
