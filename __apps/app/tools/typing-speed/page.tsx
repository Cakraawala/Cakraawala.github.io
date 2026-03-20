"use client";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { RefreshCw, Clock, Zap, Target } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";

// ── Word banks ────────────────────────────────────────────────────────────────

const WORDS_ID = [
  "aku", "kamu", "dia", "kita", "mereka", "ada", "tidak", "iya", "bisa", "mau",
  "pergi", "pulang", "makan", "minum", "tidur", "belajar", "kerja", "main", "baca", "tulis",
  "rumah", "sekolah", "kantor", "jalan", "kota", "desa", "pasar", "toko", "bank", "rumah",
  "besar", "kecil", "panjang", "pendek", "tinggi", "rendah", "cepat", "lambat", "bagus", "jelek",
  "merah", "biru", "hijau", "kuning", "putih", "hitam", "coklat", "ungu", "abu", "oranye",
  "satu", "dua", "tiga", "empat", "lima", "enam", "tujuh", "delapan", "sembilan", "sepuluh",
  "senin", "selasa", "rabu", "kamis", "jumat", "sabtu", "minggu", "hari", "bulan", "tahun",
  "pagi", "siang", "sore", "malam", "waktu", "lama", "baru", "tua", "muda", "sama",
  "air", "api", "tanah", "udara", "pohon", "bunga", "daun", "akar", "buah", "biji",
  "kucing", "anjing", "burung", "ikan", "ayam", "sapi", "kuda", "gajah", "harimau", "monyet",
  "nasi", "roti", "ayam", "ikan", "sayur", "buah", "susu", "kopi", "teh", "gula",
  "buku", "pensil", "pena", "kertas", "meja", "kursi", "pintu", "jendela", "lantai", "atap",
  "senang", "sedih", "marah", "takut", "kaget", "heran", "malu", "rindu", "bosan", "capek",
  "lari", "jalan", "duduk", "berdiri", "tidur", "bangun", "makan", "masak", "bersih", "kotor",
  "dengan", "untuk", "dari", "kepada", "tentang", "karena", "supaya", "ketika", "setelah", "sebelum",
  "sangat", "sekali", "cukup", "kurang", "lebih", "paling", "terlalu", "hampir", "sudah", "belum",
  "saya", "anda", "beliau", "kami", "kalian", "ini", "itu", "sini", "situ", "sana",
  "yang", "dan", "atau", "tapi", "jika", "maka", "sehingga", "namun", "bahwa", "agar",
];

const WORDS_EN = [
  "the", "be", "to", "of", "and", "a", "in", "that", "have", "it",
  "for", "not", "on", "with", "he", "as", "you", "do", "at", "this",
  "but", "his", "by", "from", "they", "we", "say", "her", "she", "or",
  "an", "will", "my", "one", "all", "would", "there", "their", "what", "so",
  "up", "out", "if", "about", "who", "get", "which", "go", "me", "when",
  "make", "can", "like", "time", "no", "just", "him", "know", "take", "people",
  "into", "year", "your", "good", "some", "could", "them", "see", "other", "than",
  "then", "now", "look", "only", "come", "its", "over", "think", "also", "back",
  "after", "use", "two", "how", "our", "work", "first", "well", "way", "even",
  "new", "want", "any", "these", "give", "day", "most", "us", "great", "between",
  "need", "large", "often", "hand", "high", "place", "hold", "turn", "move", "live",
  "give", "here", "most", "tell", "very", "much", "before", "right", "too", "mean",
  "old", "any", "same", "boy", "follow", "came", "want", "show", "form", "three",
  "small", "set", "put", "end", "does", "another", "well", "large", "big", "such",
  "because", "turn", "here", "why", "ask", "went", "men", "read", "need", "land",
  "different", "home", "move", "try", "kind", "hand", "picture", "again", "change", "off",
  "play", "spell", "air", "away", "animal", "house", "point", "page", "letter", "mother",
  "answer", "found", "study", "still", "learn", "plant", "cover", "food", "sun", "four",
  "between", "state", "keep", "eye", "never", "last", "door", "thought", "city", "tree",
  "cross", "farm", "hard", "start", "might", "story", "saw", "far", "sea", "draw",
];

type Lang = "id" | "en" | "both";
type GameState = "idle" | "countdown" | "running" | "finished";

const LANG_OPTIONS: { key: Lang; label: string }[] = [
  { key: "id",   label: "Indonesia" },
  { key: "en",   label: "English" },
  { key: "both", label: "Campur" },
];

const DURATION_OPTIONS = [30, 60, 120];

function getWordBank(lang: Lang): string[] {
  if (lang === "id")   return WORDS_ID;
  if (lang === "en")   return WORDS_EN;
  return [...WORDS_ID, ...WORDS_EN];
}

function generateWords(lang: Lang, count = 120): string[] {
  const bank = getWordBank(lang);
  const result: string[] = [];
  for (let i = 0; i < count; i++) {
    result.push(bank[Math.floor(Math.random() * bank.length)]);
  }
  return result;
}

interface CharState {
  char: string;
  status: "pending" | "correct" | "wrong";
}

type WordStatus = "pending" | "active" | "done-correct" | "done-wrong";

interface WordData {
  word: string;
  chars: CharState[];
  status: WordStatus;
}

function buildWordData(words: string[]): WordData[] {
  return words.map((w) => ({
    word: w,
    chars: w.split("").map((c) => ({ char: c, status: "pending" })),
    status: "pending",
  }));
}

export default function TypingSpeedPage() {
  const [lang, setLang]         = useState<Lang>("en");
  const [duration, setDuration] = useState(60);
  const [gameState, setGameState] = useState<GameState>("idle");
  const [countdown, setCountdown] = useState(3);
  const [timeLeft, setTimeLeft]   = useState(60);
  const [words, setWords]         = useState<WordData[]>([]);
  const [curWordIdx, setCurWordIdx] = useState(0);
  const [curCharIdx, setCurCharIdx] = useState(0);
  const [input, setInput]           = useState("");
  const [correctWords, setCorrectWords] = useState(0);
  const [wrongWords, setWrongWords]     = useState(0);
  const [totalTyped, setTotalTyped]     = useState(0);
  const [correctChars, setCorrectChars] = useState(0);

  const inputRef  = useRef<HTMLInputElement>(null);
  const timerRef  = useRef<ReturnType<typeof setInterval> | null>(null);
  const cdRef     = useRef<ReturnType<typeof setInterval> | null>(null);
  const wordRefs  = useRef<(HTMLSpanElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // ── Derived stats ──────────────────────────────────────────────────────────
  const elapsed = duration - timeLeft;
  const wpm = elapsed > 0 ? Math.round((correctWords / elapsed) * 60) : 0;
  const rawWpm = elapsed > 0 ? Math.round(((correctWords + wrongWords) / elapsed) * 60) : 0;
  const accuracy = totalTyped > 0 ? Math.round((correctChars / totalTyped) * 100) : 100;

  // ── Auto-scroll active word into view ─────────────────────────────────────
  useEffect(() => {
    const el = wordRefs.current[curWordIdx];
    if (el && containerRef.current) {
      el.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  }, [curWordIdx]);

  // ── Init / reset ──────────────────────────────────────────────────────────
  const init = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (cdRef.current)   clearInterval(cdRef.current);
    setWords(buildWordData(generateWords(lang)));
    setCurWordIdx(0);
    setCurCharIdx(0);
    setInput("");
    setCorrectWords(0);
    setWrongWords(0);
    setTotalTyped(0);
    setCorrectChars(0);
    setTimeLeft(duration);
    setGameState("idle");
  }, [lang, duration]);

  useEffect(() => { init(); }, [init]);

  // ── Start countdown ───────────────────────────────────────────────────────
  const startCountdown = () => {
    setGameState("countdown");
    setCountdown(3);
    let cd = 3;
    cdRef.current = setInterval(() => {
      cd--;
      setCountdown(cd);
      if (cd <= 0) {
        clearInterval(cdRef.current!);
        startGame();
      }
    }, 1000);
  };

  const startGame = () => {
    setGameState("running");
    inputRef.current?.focus();
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          setGameState("finished");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  };

  // ── Typing handler ────────────────────────────────────────────────────────
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (gameState !== "running") return;
    const val = e.target.value;

    // Space → submit word
    if (val.endsWith(" ")) {
      submitWord(val.trimEnd());
      return;
    }
    setInput(val);

    // Update char highlights
    setWords((prev) => {
      const next = [...prev];
      const wd = { ...next[curWordIdx], chars: [...next[curWordIdx].chars] };
      wd.chars = wd.word.split("").map((c, i) => ({
        char: c,
        status: (
          i < val.length ? (val[i] === c ? "correct" : "wrong") : "pending"
        ) as CharState["status"],
      }));
      wd.status = "active";
      next[curWordIdx] = wd;
      return next;
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (gameState !== "running") return;
    if (e.key === "Backspace" && input === "" && curWordIdx > 0) {
      // Allow going back to previous word
      e.preventDefault();
      const prevIdx = curWordIdx - 1;
      const prevWord = words[prevIdx].word;
      setCurWordIdx(prevIdx);
      setInput(prevWord);
      setWords((prev) => {
        const next = [...prev];
        next[prevIdx] = {
          ...next[prevIdx],
          status: "active",
          chars: next[prevIdx].chars.map((c) => ({ ...c, status: "pending" })),
        };
        return next;
      });
    }
  };

  const submitWord = (typed: string) => {
    const currentWord = words[curWordIdx].word;
    const isCorrect = typed === currentWord;

    // Track stats
    setTotalTyped((n) => n + typed.length);
    if (isCorrect) {
      setCorrectWords((n) => n + 1);
      setCorrectChars((n) => n + typed.length);
    } else {
      setWrongWords((n) => n + 1);
      // Count correct chars in the typed word
      let cc = 0;
      for (let i = 0; i < Math.min(typed.length, currentWord.length); i++) {
        if (typed[i] === currentWord[i]) cc++;
      }
      setCorrectChars((n) => n + cc);
    }

    // Mark current word done
    setWords((prev) => {
      const next = [...prev];
      const wd = { ...next[curWordIdx] };
      wd.status = isCorrect ? "done-correct" : "done-wrong";
      wd.chars = wd.word.split("").map((c, i) => ({
        char: c,
        status: (i < typed.length ? (typed[i] === c ? "correct" : "wrong") : "wrong") as CharState["status"],
      }));
      next[curWordIdx] = wd;

      // Mark next word active
      if (curWordIdx + 1 < next.length) {
        next[curWordIdx + 1] = { ...next[curWordIdx + 1], status: "active" };
      }
      return next;
    });

    setCurWordIdx((i) => i + 1);
    setCurCharIdx(0);
    setInput("");
  };

  // ── Grades ────────────────────────────────────────────────────────────────
  const grade = useMemo(() => {
    if (wpm >= 80 && accuracy >= 97) return { label: "S", color: "text-amber-400", desc: "Luar biasa!" };
    if (wpm >= 60 && accuracy >= 95) return { label: "A", color: "text-emerald-400", desc: "Sangat baik!" };
    if (wpm >= 40 && accuracy >= 90) return { label: "B", color: "text-blue-400", desc: "Baik!" };
    if (wpm >= 25 && accuracy >= 80) return { label: "C", color: "text-violet-400", desc: "Lumayan" };
    return { label: "D", color: "text-muted", desc: "Perlu latihan" };
  }, [wpm, accuracy]);

  const timerColor =
    timeLeft <= 10 ? "text-red-400" :
    timeLeft <= 20 ? "text-amber-400" :
    "text-primary";

  return (
    <ToolLayout
      title="Typing Speed Test"
      description="Uji kecepatan dan akurasi mengetikmu. Tersedia kata bahasa Indonesia dan Inggris."
    >
      <div className="max-w-3xl mx-auto space-y-5">

        {/* Settings bar */}
        {gameState === "idle" && (
          <div className="flex flex-wrap gap-3 items-center">
            {/* Language */}
            <div>
              <p className="text-[10px] text-muted font-mono mb-2">Bahasa</p>
              <div className="flex gap-1.5">
                {LANG_OPTIONS.map((l) => (
                  <button
                    key={l.key}
                    onClick={() => setLang(l.key)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono border transition-all ${
                      lang === l.key
                        ? "bg-primary/10 border-primary/40 text-primary"
                        : "bg-surface border-line text-muted hover:text-soft hover:border-white/10"
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Separator */}
            <div className="h-8 w-px bg-line hidden sm:block self-end mb-0.5" />

            {/* Duration */}
            <div>
              <p className="text-[10px] text-muted font-mono mb-2">Durasi</p>
              <div className="flex gap-1.5">
                {DURATION_OPTIONS.map((d) => (
                  <button
                    key={d}
                    onClick={() => setDuration(d)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono border transition-all ${
                      duration === d
                        ? "bg-primary/10 border-primary/40 text-primary"
                        : "bg-surface border-line text-muted hover:text-soft hover:border-white/10"
                    }`}
                  >
                    {d}s
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={init}
              className="ml-auto p-2 rounded-xl bg-surface border border-line text-muted hover:text-soft hover:border-white/10 transition-all"
              title="Acak ulang kata"
            >
              <RefreshCw size={14} />
            </button>
          </div>
        )}

        {/* Countdown overlay */}
        {gameState === "countdown" && (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <p className="text-muted font-mono text-sm">Bersiap...</p>
            <span className="text-8xl font-mono font-bold text-primary animate-pulse">
              {countdown}
            </span>
          </div>
        )}

        {/* Running / idle game area */}
        {(gameState === "running" || gameState === "idle") && (
          <>
            {/* Timer + live stats */}
            <div className="flex items-center justify-between px-1">
              <div className="flex gap-4">
                <div className="text-center">
                  <p className="text-[10px] text-muted font-mono">WPM</p>
                  <p className="text-xl font-mono font-bold text-soft">
                    {gameState === "running" ? wpm : "-"}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-muted font-mono">Akurasi</p>
                  <p className="text-xl font-mono font-bold text-soft">
                    {gameState === "running" ? `${accuracy}%` : "-"}
                  </p>
                </div>
              </div>

              <div className={`text-4xl font-mono font-bold tabular-nums ${timerColor}`}>
                {timeLeft}
                <span className="text-base ml-0.5 opacity-60">s</span>
              </div>
            </div>

            {/* Word display */}
            <div
              ref={containerRef}
              className="relative bg-surface border border-line rounded-2xl px-6 py-5 h-36 overflow-hidden select-none"
              onClick={() => gameState === "running" && inputRef.current?.focus()}
            >
              {/* Fade top/bottom */}
              <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-surface to-transparent z-10 pointer-events-none" />
              <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-surface to-transparent z-10 pointer-events-none" />

              <div className="flex flex-wrap gap-x-2 gap-y-2 leading-loose">
                {words.map((wd, wi) => (
                  <span
                    key={wi}
                    ref={(el) => { wordRefs.current[wi] = el; }}
                    className={`font-mono text-base relative transition-all ${
                      wd.status === "active"
                        ? "text-soft"
                        : wd.status === "done-correct"
                        ? "text-emerald-400/50"
                        : wd.status === "done-wrong"
                        ? "text-red-400/50 line-through decoration-red-400/40"
                        : "text-muted/30"
                    }`}
                  >
                    {wd.status === "active"
                      ? wd.chars.map((ch, ci) => (
                          <span
                            key={ci}
                            className={`relative ${
                              ch.status === "correct"
                                ? "text-soft"
                                : ch.status === "wrong"
                                ? "text-red-400 bg-red-400/10 rounded"
                                : "text-muted/40"
                            } ${ci === curCharIdx && ci >= (input?.length ?? 0) ? "after:content-['|'] after:text-primary after:animate-pulse after:ml-0.5" : ""}`}
                          >
                            {ch.char}
                          </span>
                        ))
                      : wd.word}
                  </span>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                disabled={gameState === "idle"}
                placeholder={gameState === "idle" ? "Klik tombol mulai untuk memulai..." : "Ketik di sini... (spasi untuk lanjut kata)"}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
                className="w-full bg-bg border border-line rounded-xl px-4 py-3 text-soft text-base font-mono focus:outline-none focus:border-white/20 transition-colors placeholder:text-muted/30 disabled:opacity-40 disabled:cursor-not-allowed"
              />
            </div>

            {/* Start button */}
            {gameState === "idle" && (
              <button
                onClick={startCountdown}
                className="w-full py-3.5 rounded-2xl bg-primary text-white font-semibold hover:bg-blue-500 transition-colors flex items-center justify-center gap-2"
              >
                <Zap size={16} /> Mulai Tes
              </button>
            )}

            {gameState === "running" && (
              <button
                onClick={init}
                className="w-full py-2.5 rounded-xl bg-surface border border-line text-muted text-xs font-mono hover:text-soft hover:border-white/10 transition-colors flex items-center justify-center gap-1.5"
              >
                <RefreshCw size={12} /> Reset
              </button>
            )}
          </>
        )}

        {/* Results screen */}
        {gameState === "finished" && (
          <div className="space-y-5">
            {/* Grade */}
            <div className="bg-surface border border-line rounded-2xl p-8 text-center space-y-2">
              <p className="text-xs text-muted font-mono">Nilai</p>
              <p className={`text-7xl font-mono font-bold ${grade.color}`}>{grade.label}</p>
              <p className="text-sm text-muted font-mono">{grade.desc}</p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <StatCard icon={<Zap size={15} />} label="WPM" value={wpm.toString()} sub="kata/menit" color="text-primary" />
              <StatCard icon={<Target size={15} />} label="Akurasi" value={`${accuracy}%`} sub={`${correctChars}/${totalTyped} karakter`} color="text-emerald-400" />
              <StatCard icon={<Zap size={15} className="opacity-50" />} label="Raw WPM" value={rawWpm.toString()} sub="termasuk salah" color="text-muted" />
              <StatCard icon={<Clock size={15} />} label="Durasi" value={`${duration}s`} sub={`${correctWords} kata benar`} color="text-violet-400" />
            </div>

            {/* Breakdown */}
            <div className="bg-surface border border-line rounded-2xl p-5 grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] text-muted font-mono mb-1">Kata benar</p>
                <p className="text-2xl font-mono font-bold text-emerald-400">{correctWords}</p>
              </div>
              <div>
                <p className="text-[10px] text-muted font-mono mb-1">Kata salah</p>
                <p className="text-2xl font-mono font-bold text-red-400">{wrongWords}</p>
              </div>
            </div>

            {/* Speed rating */}
            <div className="bg-surface border border-line rounded-2xl p-5 space-y-3">
              <p className="text-xs text-muted font-mono">Perbandingan kecepatan rata-rata</p>
              {[
                { label: "Rata-rata orang",    wpm: 40, color: "bg-muted/30" },
                { label: "Pengguna komputer",  wpm: 60, color: "bg-blue-400/40" },
                { label: "Profesional",        wpm: 80, color: "bg-violet-400/40" },
                { label: "Kamu",               wpm,    color: "bg-primary" },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-[11px] font-mono text-muted/60 mb-1">
                    <span>{item.label}</span>
                    <span>{item.wpm} WPM</span>
                  </div>
                  <div className="h-2 bg-bg rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${item.color}`}
                      style={{ width: `${Math.min(100, (item.wpm / 120) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Retry options */}
            <div className="flex gap-3">
              <button
                onClick={init}
                className="flex-1 py-3.5 rounded-2xl bg-primary text-white font-semibold hover:bg-blue-500 transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw size={15} /> Coba Lagi
              </button>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

function StatCard({
  icon,
  label,
  value,
  sub,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  color: string;
}) {
  return (
    <div className="bg-surface border border-line rounded-2xl p-4 space-y-1">
      <div className={`flex items-center gap-1.5 ${color}`}>
        {icon}
        <span className="text-[10px] font-mono">{label}</span>
      </div>
      <p className={`text-2xl font-mono font-bold ${color}`}>{value}</p>
      <p className="text-[10px] font-mono text-muted/50">{sub}</p>
    </div>
  );
}
