"use client";

import { useState, useEffect, useCallback } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Plus, Minus, Play, Eye, RotateCcw, Shuffle, Shield, Ghost, User, Lock } from "lucide-react";

interface UndercoverItem {
    id: number;
    penduduk: string;
    undercover: string;
    kategori: string;
}

interface UndercoverData {
    undercover: (UndercoverItem | UndercoverItem[])[];
}

function flattenWords(raw: (UndercoverItem | UndercoverItem[])[]): UndercoverItem[] {
    const result: UndercoverItem[] = [];
    for (const item of raw) {
        if (Array.isArray(item)) result.push(...item);
        else result.push(item);
    }
    return result;
}

type Role = "civilian" | "undercover" | "mrwhite";
type GamePhase = "setup" | "card-pick" | "playing";

interface Player {
    id: number;
    name: string;
    initials: string;
    role: Role;
    word: string;
}

interface TarotCard {
    index: number;
    role: Role;
    word: string;
    pickedByPlayerIdx: number | null; // which player claimed it
}

function getInitials(name: string): string {
    return name.trim().split(/\s+/).map((w) => w[0]?.toUpperCase() ?? "").join("").slice(0, 2);
}

function shuffleArr<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

const ROLE_COLORS: Record<Role, string> = {
    civilian: "from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-400",
    undercover: "from-amber-500/20 to-amber-600/10 border-amber-500/30 text-amber-400",
    mrwhite: "from-purple-500/20 to-purple-600/10 border-purple-500/30 text-purple-400",
};

const ROLE_LABEL: Record<Role, string> = {
    civilian: "Penduduk Sipil",
    undercover: "Undercover",
    mrwhite: "Mr. White",
};

const ROLE_ICONS: Record<Role, React.ElementType> = {
    civilian: User,
    undercover: Shield,
    mrwhite: Ghost,
};

const AVATAR_COLORS = [
    "bg-blue-500/20 border-blue-500/40 text-blue-400",
    "bg-violet-500/20 border-violet-500/40 text-violet-400",
    "bg-emerald-500/20 border-emerald-500/40 text-emerald-400",
    "bg-rose-500/20 border-rose-500/40 text-rose-400",
    "bg-amber-500/20 border-amber-500/40 text-amber-400",
    "bg-cyan-500/20 border-cyan-500/40 text-cyan-400",
    "bg-pink-500/20 border-pink-500/40 text-pink-400",
    "bg-lime-500/20 border-lime-500/40 text-lime-400",
    "bg-indigo-500/20 border-indigo-500/40 text-indigo-400",
    "bg-orange-500/20 border-orange-500/40 text-orange-400",
];

const USED_IDS_KEY = "undercover_used_ids";
function getUsedIds(): number[] {
    try { return JSON.parse(sessionStorage.getItem(USED_IDS_KEY) ?? "[]"); } catch { return []; }
}
function saveUsedIds(ids: number[]) {
    sessionStorage.setItem(USED_IDS_KEY, JSON.stringify(ids));
}

// ── Stepper component reused for all role counts ──────────────────────────────
function CountStepper({
    value, onDec, onInc, color = "text-soft", disabled = false,
}: { value: number; onDec: () => void; onInc: () => void; color?: string; disabled?: boolean }) {
    return (
        <div className="flex items-center gap-3">
            <button
                onClick={onDec}
                disabled={disabled}
                className="w-8 h-8 rounded-lg border border-line bg-bg flex items-center justify-center text-muted hover:text-soft hover:border-white/10 transition-all disabled:opacity-30"
            >
                <Minus size={14} />
            </button>
            <span className={`font-bold text-lg w-6 text-center ${color}`}>{value}</span>
            <button
                onClick={onInc}
                disabled={disabled}
                className="w-8 h-8 rounded-lg border border-line bg-bg flex items-center justify-center text-muted hover:text-soft hover:border-white/10 transition-all disabled:opacity-30"
            >
                <Plus size={14} />
            </button>
        </div>
    );
}

export default function Undercover() {
    const [words, setWords] = useState<UndercoverItem[]>([]);
    const [loading, setLoading] = useState(true);

    // Setup state
    const [playerCount, setPlayerCount] = useState(4);
    const [undercoverCount, setUndercoverCount] = useState(1);
    const [mrWhiteCount, setMrWhiteCount] = useState(0);
    const [names, setNames] = useState<string[]>(["", "", "", ""]);

    // Game state
    const [phase, setPhase] = useState<GamePhase>("setup");
    const [players, setPlayers] = useState<Player[]>([]);

    // Tarot card-pick state
    const [cards, setCards] = useState<TarotCard[]>([]);
    const [currentPickerIdx, setCurrentPickerIdx] = useState(0); // whose turn to pick
    const [selectedCardIdx, setSelectedCardIdx] = useState<number | null>(null); // card being viewed
    const [isRevealed, setIsRevealed] = useState(false); // card flipped open

    useEffect(() => {
        fetch("/undercover.json")
            .then((r) => r.json())
            .then((d: UndercoverData) => {
                setWords(flattenWords(d.undercover));
                setLoading(false);
            });
    }, []);

    // Keep names array in sync with playerCount
    useEffect(() => {
        setNames((prev) => {
            if (prev.length < playerCount) return [...prev, ...Array(playerCount - prev.length).fill("")];
            return prev.slice(0, playerCount);
        });
    }, [playerCount]);

    // ── Derived constraints ───────────────────────────────────────────────────
    // undercover + mrwhite ≤ floor(playerCount / 2)
    const maxSpecial = Math.floor(playerCount / 2);
    const civCount = playerCount - undercoverCount - mrWhiteCount;
    const isValidSetup = civCount >= 1 && undercoverCount >= 1;
    const allNamed = names.every((n) => n.trim().length > 0);

    function clampUndercover(uc: number, mw: number, total: number) {
        return Math.max(1, Math.min(uc, total - mw - 1)); // ensure at least 1 civ
    }
    function clampMrWhite(mw: number, uc: number, total: number) {
        return Math.max(0, Math.min(mw, total - uc - 1, maxSpecial - uc));
    }

    const handlePlayerCount = (next: number) => {
        const n = Math.min(10, Math.max(3, next));
        const newMax = Math.floor(n / 2);
        const uc = Math.max(1, Math.min(undercoverCount, newMax - mrWhiteCount, n - mrWhiteCount - 1));
        const mw = Math.max(0, Math.min(mrWhiteCount, newMax - uc, n - uc - 1));
        setPlayerCount(n);
        setUndercoverCount(uc);
        setMrWhiteCount(mw);
    };

    const handleUndercoverCount = (delta: number) => {
        const next = undercoverCount + delta;
        const uc = clampUndercover(next, mrWhiteCount, playerCount);
        // also clamp mrwhite if needed
        const mw = clampMrWhite(mrWhiteCount, uc, playerCount);
        setUndercoverCount(uc);
        setMrWhiteCount(mw);
    };

    const handleMrWhiteCount = (delta: number) => {
        const next = mrWhiteCount + delta;
        const mw = clampMrWhite(next, undercoverCount, playerCount);
        setMrWhiteCount(mw);
    };

    // ── Start Game → go to card-pick phase ───────────────────────────────────
    const startGame = useCallback(() => {
        if (words.length === 0 || !isValidSetup || !allNamed) return;

        const usedIds = getUsedIds();
        const available = words.filter((item) => !usedIds.includes(item.id));
        const pool = available.length > 0 ? available : words;
        const picked = pool[Math.floor(Math.random() * pool.length)];
        const newUsed = available.length > 0 ? [...usedIds, picked.id] : [picked.id];
        saveUsedIds(newUsed);

        // Build roles list
        const roles: Role[] = [
            ...Array(civCount).fill("civilian" as Role),
            ...Array(undercoverCount).fill("undercover" as Role),
            ...Array(mrWhiteCount).fill("mrwhite" as Role),
        ];
        const shuffledRoles = shuffleArr(roles);

        // Build players (name order, roles are scrambled in cards)
        const builtPlayers: Player[] = names.map((name, i) => ({
            id: i,
            name: name.trim(),
            initials: getInitials(name),
            role: "civilian", // will be determined by card pick
            word: "",
        }));

        // Build tarot cards (one per player, shuffled — player picks which card = their role)
        const tarotCards: TarotCard[] = shuffledRoles.map((role, i) => ({
            index: i,
            role,
            word: role === "civilian" ? picked.penduduk : role === "undercover" ? picked.undercover : "",
            pickedByPlayerIdx: null,
        }));

        setPlayers(builtPlayers);
        setCards(tarotCards);
        setCurrentPickerIdx(0);
        setSelectedCardIdx(null);
        setIsRevealed(false);
        setPhase("card-pick");
    }, [words, isValidSetup, allNamed, civCount, undercoverCount, mrWhiteCount, names]);

    // ── Card Pick: player selects a face-down card ────────────────────────────
    const handleCardSelect = (cardIdx: number) => {
        if (cards[cardIdx].pickedByPlayerIdx !== null) return; // already taken
        if (selectedCardIdx !== null) return; // already picking
        setSelectedCardIdx(cardIdx);
        setIsRevealed(false);
    };

    const handleReveal = () => {
        setIsRevealed(true);
    };

    const handleDoneViewing = () => {
        if (selectedCardIdx === null) return;

        // Assign this card's role to current picker
        const card = cards[selectedCardIdx];
        const updatedPlayers = players.map((p) => {
            if (p.id === currentPickerIdx) {
                return { ...p, role: card.role, word: card.word };
            }
            return p;
        });
        const updatedCards = cards.map((c) => {
            if (c.index === selectedCardIdx) return { ...c, pickedByPlayerIdx: currentPickerIdx };
            return c;
        });

        setPlayers(updatedPlayers);
        setCards(updatedCards);
        setSelectedCardIdx(null);
        setIsRevealed(false);

        if (currentPickerIdx < players.length - 1) {
            setCurrentPickerIdx((i) => i + 1);
        } else {
            setPhase("playing");
        }
    };

    const resetGame = () => {
        setPhase("setup");
        setPlayers([]);
        setCards([]);
        setCurrentPickerIdx(0);
        setSelectedCardIdx(null);
        setIsRevealed(false);
    };

    // ── Loading ───────────────────────────────────────────────────────────────
    if (loading) {
        return (
            <ToolLayout title="Undercover" description="Game deduksi sosial berbasis kata — siapa yang menyamar di antara kalian?">
                <div className="flex items-center justify-center py-32">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
            </ToolLayout>
        );
    }

    // ── PHASE: PLAYING ────────────────────────────────────────────────────────
    if (phase === "playing") {
        const finalCivCount = players.filter((p) => p.role === "civilian").length;
        const finalUcCount = players.filter((p) => p.role === "undercover").length;
        const finalMwCount = players.filter((p) => p.role === "mrwhite").length;

        return (
            <ToolLayout title="Undercover" description="Game deduksi sosial berbasis kata — siapa yang menyamar di antara kalian?">
                <div className="max-w-2xl mx-auto space-y-6">
                    <div className="rounded-2xl bg-primary/5 border border-primary/20 p-5 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary flex-shrink-0">
                            <Play size={18} />
                        </div>
                        <div>
                            <p className="text-soft font-semibold text-sm">Game Dimulai! 🎮</p>
                            <p className="text-muted text-xs mt-0.5">
                                Setiap pemain bergiliran memberikan <span className="text-soft">satu kata/kalimat pendek</span> yang mendeskripsikan kata mereka. Jangan terlalu obvious!
                            </p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <p className="text-muted text-xs font-mono mb-3">{"// urutan giliran"} ({players.length} pemain)</p>
                        {players.map((p, i) => (
                            <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl bg-surface border border-line">
                                <div className={`w-9 h-9 rounded-xl border flex items-center justify-center text-sm font-bold flex-shrink-0 ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}>
                                    {p.initials}
                                </div>
                                <span className="text-soft text-sm font-medium">{p.name}</span>
                                <span className="ml-auto text-muted text-xs font-mono">giliran {i + 1}</span>
                            </div>
                        ))}
                    </div>

                    <div className="rounded-xl border border-line bg-surface p-4">
                        <p className="text-muted text-xs font-mono mb-3">{"// distribusi peran (untuk host)"}</p>
                        <div className="flex flex-wrap gap-2">
                            <span className="text-xs font-mono px-2 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">{finalCivCount}× Penduduk Sipil</span>
                            <span className="text-xs font-mono px-2 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">{finalUcCount}× Undercover</span>
                            {finalMwCount > 0 && <span className="text-xs font-mono px-2 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400">{finalMwCount}× Mr. White</span>}
                        </div>
                    </div>

                    <div className="rounded-xl border border-line bg-surface p-4 space-y-2">
                        <p className="text-muted text-xs font-mono mb-1">{"// cara bermain"}</p>
                        <div className="space-y-2 text-xs text-muted leading-relaxed">
                            <p>1. Setiap pemain bergiliran memberi <span className="text-soft">1 kata/kalimat pendek</span> yang menggambarkan kata mereka.</p>
                            <p>2. Setelah semua selesai, <span className="text-soft">diskusi & voting</span> siapa yang paling mencurigakan.</p>
                            <p>3. Pemain dengan vote terbanyak disingkirkan & rolenya <span className="text-soft">diungkap</span>.</p>
                            <p>4. <span className="text-amber-400">Undercover</span> menang jika tersisa 2 orang. <span className="text-purple-400">Mr. White</span> menang jika bisa nebak kata civilian saat disingkirkan. <span className="text-blue-400">Civilian</span> menang jika semua penyusup tersingkir.</p>
                        </div>
                    </div>

                    <button onClick={resetGame} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-line text-muted text-sm font-mono hover:text-soft hover:border-white/10 transition-all">
                        <RotateCcw size={14} /> Main Lagi / Reset
                    </button>
                </div>
            </ToolLayout>
        );
    }

    // ── PHASE: CARD PICK ──────────────────────────────────────────────────────
    if (phase === "card-pick") {
        const currentPicker = players[currentPickerIdx];
        const avatarColor = AVATAR_COLORS[currentPickerIdx % AVATAR_COLORS.length];
        const pickedCard = selectedCardIdx !== null ? cards[selectedCardIdx] : null;
        const RoleIcon = pickedCard ? ROLE_ICONS[pickedCard.role] : null;

        // How many cards still available
        const remaining = cards.filter((c) => c.pickedByPlayerIdx === null).length;

        return (
            <ToolLayout title="Undercover" description="Game deduksi sosial berbasis kata — siapa yang menyamar di antara kalian?">
                <div className="max-w-xl mx-auto space-y-6">

                    {/* Progress header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center font-bold text-sm ${avatarColor}`}>
                                {currentPicker.initials}
                            </div>
                            <div>
                                <p className="text-soft font-semibold text-sm">{currentPicker.name}</p>
                                <p className="text-muted text-xs font-mono">giliran ambil kartu</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-muted text-xs font-mono">{currentPickerIdx + 1} / {players.length}</p>
                            <p className="text-muted/50 text-[10px] font-mono mt-0.5">{remaining} kartu tersisa</p>
                        </div>
                    </div>

                    {/* Progress bar */}
                    <div className="h-1 bg-line rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary rounded-full transition-all duration-500"
                            style={{ width: `${(currentPickerIdx / players.length) * 100}%` }}
                        />
                    </div>

                    {/* Instruction */}
                    {selectedCardIdx === null && (
                        <p className="text-center text-muted text-sm">
                            <span className="text-soft font-semibold">{currentPicker.name}</span>, pilih satu kartu di bawah!
                        </p>
                    )}

                    {/* Tarot card grid */}
                    {selectedCardIdx === null && (
                        <div className={`grid gap-3 ${playerCount <= 4 ? "grid-cols-4" : playerCount <= 6 ? "grid-cols-3 sm:grid-cols-6" : "grid-cols-4 sm:grid-cols-5"}`}>
                            {cards.map((card) => {
                                const taken = card.pickedByPlayerIdx !== null;
                                const takenByPlayer = taken ? players[card.pickedByPlayerIdx!] : null;
                                return (
                                    <button
                                        key={card.index}
                                        disabled={taken}
                                        onClick={() => handleCardSelect(card.index)}
                                        className={`
                                            relative aspect-[2/3] rounded-xl border flex flex-col items-center justify-center transition-all duration-200
                                            ${taken
                                                ? "border-line/30 bg-surface/30 opacity-40 cursor-not-allowed"
                                                : "border-primary/30 bg-gradient-to-br from-primary/10 to-primary/5 hover:border-primary/60 hover:from-primary/20 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10 cursor-pointer active:scale-95"
                                            }
                                        `}
                                    >
                                        {taken ? (
                                            <>
                                                <Lock size={14} className="text-muted/30 mb-1" />
                                                <span className="text-[9px] font-mono text-muted/30">{takenByPlayer?.initials}</span>
                                            </>
                                        ) : (
                                            <>
                                                {/* Card back design */}
                                                <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
                                                    <div className="absolute inset-2 rounded-lg border border-primary/20 flex items-center justify-center">
                                                        <span className="text-primary/20 text-2xl font-bold select-none">?</span>
                                                    </div>
                                                    {/* Subtle shimmer lines */}
                                                    <div className="absolute inset-0 opacity-5 bg-gradient-to-br from-white via-transparent to-transparent" />
                                                </div>
                                                <span className="relative text-primary/40 text-xs font-mono">{card.index + 1}</span>
                                            </>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {/* Card viewing modal */}
                    {selectedCardIdx !== null && pickedCard && (
                        <div className="rounded-2xl bg-surface border border-line p-6 space-y-5">
                            <div className="flex flex-col items-center gap-3">
                                <div className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center text-xl font-bold ${avatarColor}`}>
                                    {currentPicker.initials}
                                </div>
                                <div className="text-center">
                                    <p className="text-soft font-bold">{currentPicker.name}</p>
                                    <p className="text-muted text-xs font-mono mt-0.5">kartu #{selectedCardIdx + 1}</p>
                                </div>
                            </div>

                            {!isRevealed ? (
                                <button
                                    onClick={handleReveal}
                                    className="w-full py-4 rounded-xl bg-primary/10 border border-primary/30 text-primary font-semibold text-sm flex items-center justify-center gap-2 hover:bg-primary/15 transition-all active:scale-95"
                                >
                                    <Eye size={16} />
                                    Tap untuk buka kartu
                                </button>
                            ) : (
                                <>
                                    {/* Revealed card */}
                                    <div className={`w-full rounded-xl bg-gradient-to-br border p-5 text-center space-y-3 ${ROLE_COLORS[pickedCard.role]}`}>
                                        {RoleIcon && (
                                            <div className="flex items-center justify-center gap-2 opacity-70">
                                                <RoleIcon size={14} />
                                                <span className="text-xs font-mono">{ROLE_LABEL[pickedCard.role]}</span>
                                            </div>
                                        )}
                                        {pickedCard.role === "mrwhite" ? (
                                            <div>
                                                <p className="text-5xl font-bold opacity-30">?</p>
                                                <p className="text-xs opacity-60 mt-2">Kamu tidak dapat kata. Dengarkan baik-baik orang lain!</p>
                                            </div>
                                        ) : (
                                            <p className="text-3xl font-bold tracking-wide">{pickedCard.word}</p>
                                        )}
                                    </div>

                                    <button
                                        onClick={handleDoneViewing}
                                        className="w-full py-3 rounded-xl bg-surface border border-line text-soft text-sm font-mono flex items-center justify-center gap-2 hover:border-white/10 hover:bg-white/5 transition-all active:scale-95"
                                    >
                                        {currentPickerIdx < players.length - 1 ? (
                                            <>Sudah hafal, giliran berikutnya →</>
                                        ) : (
                                            <><Play size={14} /> Semua selesai — Mulai Game!</>
                                        )}
                                    </button>
                                </>
                            )}
                        </div>
                    )}

                    <p className="text-center text-muted/40 text-[11px] font-mono">
                        Ingat kata mu, jangan kasih tau siapapun! 🤫
                    </p>
                </div>
            </ToolLayout>
        );
    }

    // ── PHASE: SETUP ─────────────────────────────────────────────────────────
    const specialCount = undercoverCount + mrWhiteCount;

    return (
        <ToolLayout title="Undercover" description="Game deduksi sosial berbasis kata — siapa yang menyamar di antara kalian?">
            <div className="max-w-2xl mx-auto space-y-8">

                {/* How to play */}
                <div className="rounded-2xl border border-line bg-surface p-5 space-y-3">
                    <p className="text-muted text-xs font-mono">{"// cara main"}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {[
                            { icon: User, color: "text-blue-400 bg-blue-500/10 border-blue-500/20", title: "Penduduk Sipil", desc: "Dapat kata asli. Temukan Undercover & Mr. White lalu keluarkan mereka!" },
                            { icon: Shield, color: "text-amber-400 bg-amber-500/10 border-amber-500/20", title: "Undercover", desc: "Dapat kata mirip tapi berbeda. Menyamar & bertahan sampai akhir." },
                            { icon: Ghost, color: "text-purple-400 bg-purple-500/10 border-purple-500/20", title: "Mr. White", desc: "Tidak dapat kata. Dengarkan & tebak kata civilian untuk menang!" },
                        ].map((r) => {
                            const Icon = r.icon;
                            return (
                                <div key={r.title} className={`rounded-xl border p-3 space-y-1.5 ${r.color}`}>
                                    <div className="flex items-center gap-2">
                                        <Icon size={14} />
                                        <span className="text-xs font-semibold">{r.title}</span>
                                    </div>
                                    <p className="text-[11px] opacity-70 leading-relaxed">{r.desc}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Role config */}
                <div className="rounded-2xl border border-line bg-surface p-5 space-y-5">
                    <p className="text-muted text-xs font-mono">{"// konfigurasi pemain & peran"}</p>

                    {/* Total players */}
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-soft font-semibold text-sm">Total Pemain</p>
                            <p className="text-muted text-xs mt-0.5">3 – 10 orang</p>
                        </div>
                        <CountStepper
                            value={playerCount}
                            onDec={() => handlePlayerCount(playerCount - 1)}
                            onInc={() => handlePlayerCount(playerCount + 1)}
                        />
                    </div>

                    <div className="h-px bg-line" />

                    {/* Undercover */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                                <Shield size={12} className="text-amber-400" />
                            </div>
                            <div>
                                <p className="text-soft font-semibold text-sm">Undercover</p>
                                <p className="text-muted text-xs mt-0.5">Min 1</p>
                            </div>
                        </div>
                        <CountStepper
                            value={undercoverCount}
                            onDec={() => handleUndercoverCount(-1)}
                            onInc={() => handleUndercoverCount(+1)}
                            color="text-amber-400"
                        />
                    </div>

                    <div className="h-px bg-line" />

                    {/* Mr. White */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                                <Ghost size={12} className="text-purple-400" />
                            </div>
                            <div>
                                <p className="text-soft font-semibold text-sm">Mr. White</p>
                                <p className="text-muted text-xs mt-0.5">Tanpa kata, 0 = nonaktif</p>
                            </div>
                        </div>
                        <CountStepper
                            value={mrWhiteCount}
                            onDec={() => handleMrWhiteCount(-1)}
                            onInc={() => handleMrWhiteCount(+1)}
                            color="text-purple-400"
                        />
                    </div>

                    <div className="h-px bg-line" />

                    {/* Distribution preview */}
                    <div className="space-y-2">
                        {/* Special quota bar */}
                        <div className="flex items-center justify-between text-[11px] font-mono">
                            <span className="text-muted">Kuota penyusup</span>
                            <span className={specialCount > maxSpecial ? "text-red-400" : "text-muted"}>
                                {specialCount} / {maxSpecial} maks
                            </span>
                        </div>
                        <div className="h-2 bg-line rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-300 ${specialCount > maxSpecial ? "bg-red-400" : specialCount === maxSpecial ? "bg-amber-400" : "bg-primary"}`}
                                style={{ width: `${Math.min(100, (specialCount / maxSpecial) * 100)}%` }}
                            />
                        </div>

                        {/* Chips */}
                        <div className={`flex flex-wrap gap-2 pt-1 ${!isValidSetup ? "opacity-60" : ""}`}>
                            <span className="text-xs font-mono px-2 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">{civCount}× Sipil</span>
                            <span className="text-xs font-mono px-2 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">{undercoverCount}× Undercover</span>
                            {mrWhiteCount > 0 && <span className="text-xs font-mono px-2 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400">{mrWhiteCount}× Mr. White</span>}
                            {!isValidSetup && (
                                <span className="text-xs font-mono px-2 py-1 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
                                    ⚠ Perlu minimal 1 sipil!
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Player names */}
                <div className="rounded-2xl border border-line bg-surface p-5 space-y-4">
                    <div className="flex items-center justify-between">
                        <p className="text-soft font-semibold text-sm">Nama Pemain</p>
                        <p className="text-muted text-xs font-mono">{playerCount} orang</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {Array.from({ length: playerCount }).map((_, i) => (
                            <div key={i} className="relative">
                                <div className={`absolute left-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg border text-xs font-bold flex items-center justify-center flex-shrink-0 pointer-events-none ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}>
                                    {names[i] ? getInitials(names[i]) : (i + 1)}
                                </div>
                                <input
                                    type="text"
                                    value={names[i] ?? ""}
                                    onChange={(e) => {
                                        const v = e.target.value;
                                        setNames((prev) => { const next = [...prev]; next[i] = v; return next; });
                                    }}
                                    placeholder={`Pemain ${i + 1}`}
                                    maxLength={20}
                                    className="w-full pl-12 pr-3 py-2.5 rounded-xl bg-bg border border-line text-soft text-sm font-mono focus:outline-none focus:border-white/20 placeholder:text-muted/30 transition-colors"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Start button */}
                <button
                    disabled={!isValidSetup || !allNamed}
                    onClick={startGame}
                    className={`w-full py-4 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 ${isValidSetup && allNamed
                        ? "bg-primary/15 border border-primary/40 text-primary hover:bg-primary/20 hover:border-primary/60 active:scale-[0.98]"
                        : "bg-surface border border-line text-muted/40 cursor-not-allowed"
                        }`}
                >
                    <Shuffle size={16} />
                    {!allNamed
                        ? "Isi semua nama terlebih dahulu"
                        : !isValidSetup
                            ? "Setup tidak valid"
                            : "Acak & Mulai Pilih Kartu!"}
                </button>

                <p className="text-center text-muted/40 text-[11px] font-mono pb-2">
                    Kata yang sudah digunakan sesi ini tidak akan muncul lagi.
                </p>
            </div>
        </ToolLayout>
    );
}
