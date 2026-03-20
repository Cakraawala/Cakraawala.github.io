"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Shuffle, SkipForward, RotateCcw, History } from "lucide-react";

interface TodItem {
    id: number;
    level: string;
    category: string[];
    type: "truth" | "dare";
    id_text: string;
    en: string;
}

interface TodData {
    truths: TodItem[];
    dares: TodItem[];
}

type Mode = "truth" | "dare" | "both";
type Lang = "id" | "en";

const LEVELS = ["easy", "embarrassing", "deep", "romance", "advanced", "fun", "friends", "physical"] as const;
type Level = (typeof LEVELS)[number];

const LEVEL_LABELS: Record<Level, { label: string; color: string; bg: string }> = {
    easy: { label: "Santai", color: "text-green-400", bg: "bg-green-400/10 border-green-400/30" },
    embarrassing: { label: "Memalukan", color: "text-orange-400", bg: "bg-orange-400/10 border-orange-400/30" },
    deep: { label: "Mendalam", color: "text-blue-400", bg: "bg-blue-400/10 border-blue-400/30" },
    romance: { label: "Romansa", color: "text-pink-400", bg: "bg-pink-400/10 border-pink-400/30" },
    advanced: { label: "Advanced", color: "text-red-400", bg: "bg-red-400/10 border-red-400/30" },
    fun: { label: "Fun", color: "text-yellow-400", bg: "bg-yellow-400/10 border-yellow-400/30" },
    friends: { label: "Pertemanan", color: "text-violet-400", bg: "bg-violet-400/10 border-violet-400/30" },
    physical: { label: "Fisik", color: "text-sky-400", bg: "bg-sky-400/10 border-sky-400/30" },
};

export default function TruthOrDarePage() {
    const [data, setData] = useState<TodData | null>(null);
    const [loading, setLoading] = useState(true);

    const [mode, setMode] = useState<Mode>("both");
    const [lang, setLang] = useState<Lang>("id");
    const [selectedLevels, setSelectedLevels] = useState<Level[]>([...LEVELS]);

    const [current, setCurrent] = useState<TodItem | null>(null);
    const [history, setHistory] = useState<TodItem[]>([]);
    const [usedIds, setUsedIds] = useState<Set<number>>(new Set());
    const [flipping, setFlipping] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [counter, setCounter] = useState({ truth: 0, dare: 0 });

    useEffect(() => {
        fetch("/truth_or_dare.json")
            .then((r) => r.json())
            .then((d: TodData) => {
                setData(d);
                setLoading(false);
            });
    }, []);

    const pool = useMemo(() => {
        if (!data) return [];
        const all = [...data.truths, ...data.dares];
        return all.filter((item) => {
            const matchMode = mode === "both" || item.type === mode;
            const matchLevel = selectedLevels.includes(item.level as Level);
            return matchMode && matchLevel;
        });
    }, [data, mode, selectedLevels]);

    const draw = useCallback(
        (force?: TodItem) => {
            if (flipping) return;
            const available = force ? [force] : pool.filter((i) => !usedIds.has(i.id));
            if (available.length === 0) {
                // reset used
                setUsedIds(new Set());
                return;
            }
            const picked = force ?? available[Math.floor(Math.random() * available.length)];
            setFlipping(true);
            setTimeout(() => {
                setCurrent(picked);
                setUsedIds((prev) => new Set([...prev, picked.id]));
                if (!force) {
                    setHistory((h) => [picked, ...h].slice(0, 20));
                    setCounter((c) => ({
                        truth: picked.type === "truth" ? c.truth + 1 : c.truth,
                        dare: picked.type === "dare" ? c.dare + 1 : c.dare,
                    }));
                }
                setFlipping(false);
            }, 320);
        },
        [pool, usedIds, flipping]
    );

    const skip = () => {
        if (!current) return;
        draw();
    };

    const reset = () => {
        setCurrent(null);
        setUsedIds(new Set());
        setHistory([]);
        setCounter({ truth: 0, dare: 0 });
    };

    const toggleLevel = (level: Level) => {
        setSelectedLevels((prev) =>
            prev.includes(level)
                ? prev.length > 1 ? prev.filter((l) => l !== level) : prev
                : [...prev, level]
        );
    };

    const levelInfo = current ? LEVEL_LABELS[current.level as Level] : null;
    const typeLabel = current?.type === "dare" ? "DARE" : "TRUTH";

    const exhausted = pool.filter((i) => !usedIds.has(i.id)).length === 0 && pool.length > 0;
    const progressPct = pool.length > 0 ? Math.round((usedIds.size / pool.length) * 100) : 0;

    return (
        <ToolLayout title="Truth Or Dare" description="Pertanyaan jujur atau tantangan seru untuk kamu dan teman.">
            <div className="max-w-2xl mx-auto space-y-5">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : (
                    <>
                        {/* Settings */}
                        <div className="bg-surface rounded-xl p-4 border border-line space-y-4">
                            <div className="flex flex-wrap gap-4">
                                {/* Mode */}
                                <div>
                                    <p className="text-[10px] text-muted font-mono mb-2">Mode</p>
                                    <div className="flex gap-1.5">
                                        {([
                                            { k: "truth", label: "Truth" },
                                            { k: "dare", label: "Dare" },
                                            { k: "both", label: "Both" },
                                        ] as { k: Mode; label: string; }[]).map(({ k, label }) => (
                                            <button
                                                key={k}
                                                onClick={() => { setMode(k); setCurrent(null); }}
                                                className={`px-3 py-1.5 rounded-xl text-xs font-mono border transition-all flex items-center gap-1.5 ${mode === k
                                                    ? "bg-primary/10 border-primary/40 text-primary"
                                                    : "bg-bg border-line text-muted hover:border-white/10 hover:text-soft"
                                                    }`}
                                            >
                                                {label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Language */}
                                <div>
                                    <p className="text-[10px] text-muted font-mono mb-2">Bahasa</p>
                                    <div className="flex gap-1.5">
                                        {([{ k: "id", l: "🇮🇩 Indonesia" }, { k: "en", l: "🇬🇧 English" }] as { k: Lang; l: string }[]).map(({ k, l }) => (
                                            <button
                                                key={k}
                                                onClick={() => setLang(k)}
                                                className={`px-3 py-1.5 rounded-xl text-xs font-mono border transition-all ${lang === k
                                                    ? "bg-primary/10 border-primary/40 text-primary"
                                                    : "bg-bg border-line text-muted hover:border-white/10 hover:text-soft"
                                                    }`}
                                            >
                                                {l}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Level filter */}
                            <div>
                                <p className="text-[10px] text-muted font-mono mb-2">Kategori Level</p>
                                <div className="flex flex-wrap gap-1.5">
                                    {LEVELS.map((level) => {
                                        const info = LEVEL_LABELS[level];
                                        const active = selectedLevels.includes(level);
                                        return (
                                            <button
                                                key={level}
                                                onClick={() => toggleLevel(level)}
                                                className={`px-2.5 py-1 rounded-full text-[11px] font-mono border transition-all flex items-center gap-1 ${active ? `${info.bg} ${info.color}` : "bg-bg border-line text-muted/40 hover:text-muted"
                                                    }`}
                                            >
                                                {info.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Pool count + progress */}
                        <div className="flex items-center gap-3 text-xs font-mono text-muted">
                            <span>{pool.length} kartu tersedia</span>
                            <span>·</span>
                            <span className="text-primary">{pool.length - usedIds.size} belum dipakai</span>
                            {pool.length > 0 && (
                                <>
                                    <div className="flex-1 h-1 bg-line rounded-full overflow-hidden">
                                        <div className="h-full bg-primary transition-all" style={{ width: `${progressPct}%` }} />
                                    </div>
                                    <span>{progressPct}%</span>
                                </>
                            )}
                        </div>

                        {/* Main card */}
                        <div
                            className={`min-h-56 bg-surface rounded-2xl border border-line p-8 flex flex-col items-center justify-center text-center gap-4 transition-all duration-300 ${flipping ? "opacity-0 scale-95" : "opacity-100 scale-100"
                                } ${current?.type === "dare" ? "border-orange-400/20" : current?.type === "truth" ? "border-blue-400/20" : ""}`}
                        >
                            {current ? (
                                <>
                                    {/* Type + Level badge */}
                                    <div className="flex items-center gap-2 flex-wrap justify-center">
                                        <span
                                            className={`text-xs font-mono font-bold px-3 py-1 rounded-full border ${current.type === "dare"
                                                ? "text-orange-400 border-orange-400/30 bg-orange-400/10"
                                                : "text-blue-400 border-blue-400/30 bg-blue-400/10"
                                                }`}
                                        >
                                            {current.type === "dare" ? "" : ""} {typeLabel}
                                        </span>
                                        {levelInfo && (
                                            <span className={`text-xs font-mono px-2.5 py-1 rounded-full border ${levelInfo.bg} ${levelInfo.color}`}>
                                                {levelInfo.label}
                                            </span>
                                        )}
                                    </div>

                                    {/* Question text */}
                                    <p className="text-soft text-xl font-medium leading-relaxed max-w-lg">
                                        {lang === "id" ? current.id_text : current.en}
                                    </p>

                                    {/* Card counter */}
                                    <p className="text-[11px] text-muted/40 font-mono">#{current.id}</p>
                                </>
                            ) : exhausted ? (
                                <div className="space-y-3 text-center">
                                    <p className="text-3xl">🎉</p>
                                    <p className="text-soft font-semibold">Semua kartu sudah dipakai!</p>
                                    <p className="text-muted text-sm">Total: {counter.truth} Truth, {counter.dare} Dare</p>
                                    <button
                                        onClick={reset}
                                        className="flex items-center gap-2 text-primary text-sm font-mono hover:opacity-80 transition-opacity mx-auto"
                                    >
                                        <RotateCcw size={14} /> Main lagi dari awal
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-3 text-center">
                                    <p className="text-5xl mb-2"></p>
                                    <p className="text-muted font-mono text-sm">Klik tombol di bawah untuk memulai!</p>
                                    <p className="text-xs text-muted/50">{pool.length} kartu siap dimainkan</p>
                                </div>
                            )}
                        </div>

                        {/* Action buttons */}
                        <div className="flex gap-3">
                            <button
                                onClick={() => draw()}
                                disabled={pool.length === 0 || flipping}
                                className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-semibold text-base transition-all ${!current
                                    ? "bg-primary text-white hover:opacity-90"
                                    : mode === "truth"
                                        ? "bg-blue-500 text-white hover:opacity-90"
                                        : mode === "dare"
                                            ? "bg-orange-500 text-white hover:opacity-90"
                                            : "bg-primary text-white hover:opacity-90"
                                    } disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]`}
                            >
                                <Shuffle size={18} />
                                {!current ? "Mulai!" : mode === "truth" ? "Truth Berikutnya" : mode === "dare" ? "Dare Berikutnya" : "Kartu Berikutnya"}
                            </button>
                            {current && (
                                <button
                                    onClick={skip}
                                    disabled={flipping}
                                    className="px-4 py-4 rounded-2xl bg-surface border border-line text-muted hover:text-soft hover:border-white/10 transition-all disabled:opacity-40"
                                    title="Skip kartu ini"
                                >
                                    <SkipForward size={18} />
                                </button>
                            )}
                        </div>

                        {/* Stats + history toggle */}
                        <div className="flex items-center justify-between">
                            <div className="flex gap-4 text-xs font-mono">
                                <span className="text-blue-400"> {counter.truth} Truth</span>
                                <span className="text-orange-400"> {counter.dare} Dare</span>
                            </div>
                            <div className="flex gap-2">
                                {(counter.truth + counter.dare) > 0 && (
                                    <button
                                        onClick={reset}
                                        className="flex items-center gap-1.5 text-xs font-mono text-muted hover:text-soft transition-colors"
                                    >
                                        <RotateCcw size={12} /> Reset
                                    </button>
                                )}
                                {history.length > 0 && (
                                    <button
                                        onClick={() => setShowHistory(!showHistory)}
                                        className="flex items-center gap-1.5 text-xs font-mono text-muted hover:text-soft transition-colors"
                                    >
                                        <History size={12} /> Riwayat ({history.length})
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* History */}
                        {showHistory && history.length > 0 && (
                            <div className="bg-surface rounded-xl border border-line overflow-hidden">
                                <div className="px-4 py-2.5 border-b border-line">
                                    <p className="text-xs font-mono text-muted">Riwayat kartu</p>
                                </div>
                                <div className="max-h-64 overflow-y-auto">
                                    {history.map((item, i) => (
                                        <div key={`${item.id}-${i}`} className="flex gap-3 px-4 py-3 border-b border-line/50 last:border-0 hover:bg-bg">
                                            <span
                                                className={`text-[10px] font-mono mt-0.5 flex-shrink-0 px-1.5 py-0.5 rounded border h-fit ${item.type === "dare"
                                                    ? "text-orange-400 border-orange-400/30"
                                                    : "text-blue-400 border-blue-400/30"
                                                    }`}
                                            >
                                                {item.type === "dare" ? "DARE" : "TRUTH"}
                                            </span>
                                            <p className="text-soft text-xs leading-relaxed">
                                                {lang === "id" ? item.id_text : item.en}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </ToolLayout>
    );
}
