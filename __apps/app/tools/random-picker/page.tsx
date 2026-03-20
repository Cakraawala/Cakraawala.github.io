"use client";
import { useState, useRef } from "react";
import { Plus, X, Shuffle, Users, RefreshCw } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";

type Gender = "M" | "F" | "X";

interface Person {
  id: string;
  name: string;
  gender: Gender;
}

const GENDER_CONFIG: Record<Gender, { label: string; color: string; bg: string; border: string }> = {
  M: { label: "Pria",   color: "text-blue-400",   bg: "bg-blue-400/10",   border: "border-blue-400/30" },
  F: { label: "Wanita", color: "text-pink-400",   bg: "bg-pink-400/10",   border: "border-pink-400/30" },
  X: { label: "Lainnya",color: "text-muted",       bg: "bg-white/5",       border: "border-line" },
};

type Mode = "teams" | "pick";

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

/** Fisher-Yates shuffle */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Distribute people into N teams, balanced by gender */
function distributeTeams(people: Person[], numTeams: number): Person[][] {
  const teams: Person[][] = Array.from({ length: numTeams }, () => []);

  // Separate by gender, shuffle each group
  const males   = shuffle(people.filter((p) => p.gender === "M"));
  const females = shuffle(people.filter((p) => p.gender === "F"));
  const others  = shuffle(people.filter((p) => p.gender === "X"));

  // Round-robin distribute each group
  const distribute = (group: Person[]) => {
    group.forEach((p, i) => teams[i % numTeams].push(p));
  };

  distribute(males);
  distribute(females);
  distribute(others);

  // Final shuffle within each team for visual variety
  return teams.map((t) => shuffle(t));
}

export default function RandomPickerPage() {
  const [people, setPeople] = useState<Person[]>([
    { id: uid(), name: "", gender: "M" },
  ]);
  const [mode, setMode] = useState<Mode>("teams");
  const [numTeams, setNumTeams] = useState(2);
  const [pickCount, setPickCount] = useState(1);
  const [result, setResult] = useState<Person[][] | null>(null);
  const [picked, setPicked] = useState<Person[] | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const valid = people.filter((p) => p.name.trim() !== "");

  const addPerson = () => {
    const newP = { id: uid(), name: "", gender: "M" as Gender };
    setPeople((prev) => [...prev, newP]);
    setTimeout(() => {
      inputRefs.current[people.length]?.focus();
    }, 50);
  };

  const removePerson = (id: string) => {
    setPeople((prev) => prev.filter((p) => p.id !== id));
  };

  const updatePerson = (id: string, field: keyof Person, value: string) => {
    setPeople((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const cycleGender = (id: string) => {
    setPeople((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const order: Gender[] = ["M", "F", "X"];
        const next = order[(order.indexOf(p.gender) + 1) % order.length];
        return { ...p, gender: next };
      })
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent, idx: number) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (idx === people.length - 1) addPerson();
      else inputRefs.current[idx + 1]?.focus();
    }
    if (e.key === "Backspace" && people[idx].name === "" && people.length > 1) {
      e.preventDefault();
      removePerson(people[idx].id);
      setTimeout(() => inputRefs.current[idx - 1]?.focus(), 50);
    }
  };

  const run = () => {
    const pool = valid;
    if (pool.length === 0) return;

    if (mode === "teams") {
      const teams = distributeTeams(pool, Math.min(numTeams, pool.length));
      setResult(teams);
      setPicked(null);
    } else {
      const n = Math.min(pickCount, pool.length);
      const shuffled = shuffle(pool).slice(0, n);
      setPicked(shuffled);
      setResult(null);
    }
  };

  const TEAM_COLORS = [
    "border-blue-400/30 bg-blue-400/5",
    "border-violet-400/30 bg-violet-400/5",
    "border-emerald-400/30 bg-emerald-400/5",
    "border-amber-400/30 bg-amber-400/5",
    "border-pink-400/30 bg-pink-400/5",
    "border-cyan-400/30 bg-cyan-400/5",
    "border-orange-400/30 bg-orange-400/5",
    "border-rose-400/30 bg-rose-400/5",
  ];

  const genderStats = {
    M: valid.filter((p) => p.gender === "M").length,
    F: valid.filter((p) => p.gender === "F").length,
    X: valid.filter((p) => p.gender === "X").length,
  };

  return (
    <ToolLayout
      title="Random Picker"
      description="Pilih item acak atau bagi ke dalam tim dengan balancing gender otomatis."
    >
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left - input */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted font-mono">
                Daftar ({valid.length} orang)
              </p>
              {valid.length > 0 && (
                <div className="flex gap-2 text-[10px] font-mono text-muted/50">
                  {genderStats.M > 0 && <span className="text-blue-400/60">♂ {genderStats.M}</span>}
                  {genderStats.F > 0 && <span className="text-pink-400/60">♀ {genderStats.F}</span>}
                  {genderStats.X > 0 && <span className="text-muted/40">⊕ {genderStats.X}</span>}
                </div>
              )}
            </div>

            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {people.map((p, idx) => {
                const g = GENDER_CONFIG[p.gender];
                return (
                  <div key={p.id} className="flex items-center gap-2">
                    <button
                      onClick={() => cycleGender(p.id)}
                      title="Klik untuk ganti gender"
                      className={`flex-shrink-0 w-8 h-8 rounded-lg border text-xs font-mono transition-all ${g.color} ${g.bg} ${g.border}`}
                    >
                      {p.gender}
                    </button>
                    <input
                      ref={(el) => { inputRefs.current[idx] = el; }}
                      type="text"
                      value={p.name}
                      onChange={(e) => updatePerson(p.id, "name", e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, idx)}
                      placeholder={`Orang ${idx + 1}`}
                      className="flex-1 bg-bg border border-line rounded-xl px-3 py-2 text-soft text-sm font-mono focus:outline-none focus:border-white/20 transition-colors placeholder:text-muted/30"
                    />
                    {people.length > 1 && (
                      <button
                        onClick={() => removePerson(p.id)}
                        className="flex-shrink-0 p-1.5 text-muted/40 hover:text-red-400 transition-colors"
                      >
                        <X size={13} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            <button
              onClick={addPerson}
              className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl border border-dashed border-line text-muted text-xs font-mono hover:text-soft hover:border-white/20 transition-all"
            >
              <Plus size={13} /> Tambah orang (Enter)
            </button>

            <p className="text-[10px] text-muted/30 font-mono">
              Klik huruf gender [M/F/X] untuk mengganti · Enter untuk baris baru
            </p>
          </div>

          {/* Right - settings */}
          <div className="space-y-5">
            {/* Mode */}
            <div>
              <p className="text-xs text-muted font-mono mb-3">Mode</p>
              <div className="grid grid-cols-2 gap-2">
                {(["teams", "pick"] as Mode[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-mono transition-all ${
                      mode === m
                        ? "bg-primary/10 border-primary/30 text-primary"
                        : "bg-bg border-line text-muted hover:text-soft hover:border-white/10"
                    }`}
                  >
                    {m === "teams" ? <Users size={14} /> : <Shuffle size={14} />}
                    {m === "teams" ? "Bagi Tim" : "Pick Acak"}
                  </button>
                ))}
              </div>
            </div>

            {mode === "teams" ? (
              <div>
                <p className="text-xs text-muted font-mono mb-2">
                  Jumlah tim
                </p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setNumTeams((n) => Math.max(2, n - 1))}
                    className="w-9 h-9 rounded-xl bg-surface border border-line text-soft hover:border-white/10 transition-colors text-lg"
                  >
                    −
                  </button>
                  <span className="text-3xl font-mono font-bold text-primary w-12 text-center">
                    {numTeams}
                  </span>
                  <button
                    onClick={() => setNumTeams((n) => Math.min(valid.length || 8, n + 1))}
                    className="w-9 h-9 rounded-xl bg-surface border border-line text-soft hover:border-white/10 transition-colors text-lg"
                  >
                    +
                  </button>
                </div>
                {valid.length > 0 && (
                  <p className="text-[11px] text-muted/50 font-mono mt-2">
                    ~{Math.ceil(valid.length / numTeams)} orang/tim · gender balanced
                  </p>
                )}
              </div>
            ) : (
              <div>
                <p className="text-xs text-muted font-mono mb-2">Ambil berapa orang?</p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setPickCount((n) => Math.max(1, n - 1))}
                    className="w-9 h-9 rounded-xl bg-surface border border-line text-soft hover:border-white/10 transition-colors text-lg"
                  >
                    −
                  </button>
                  <span className="text-3xl font-mono font-bold text-primary w-12 text-center">
                    {pickCount}
                  </span>
                  <button
                    onClick={() => setPickCount((n) => n + 1)}
                    className="w-9 h-9 rounded-xl bg-surface border border-line text-soft hover:border-white/10 transition-colors text-lg"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={run}
              disabled={valid.length === 0}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-primary text-white text-sm font-semibold hover:bg-blue-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <RefreshCw size={15} />
              {mode === "teams" ? "Bagi Tim!" : "Pick Sekarang!"}
            </button>
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted font-mono">{result.length} Tim terbentuk</p>
              <button
                onClick={run}
                className="flex items-center gap-1.5 text-[11px] font-mono text-muted hover:text-primary transition-colors"
              >
                <RefreshCw size={11} /> Acak ulang
              </button>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {result.map((team, i) => (
                <div
                  key={i}
                  className={`rounded-2xl border p-4 ${TEAM_COLORS[i % TEAM_COLORS.length]}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-mono text-soft font-semibold">
                      Tim {i + 1}
                    </p>
                    <span className="text-[10px] font-mono text-muted/50">
                      {team.length} orang
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    {team.map((p, j) => {
                      const g = GENDER_CONFIG[p.gender];
                      return (
                        <div key={p.id} className="flex items-center gap-2">
                          <span className={`text-[10px] font-mono ${g.color} w-4`}>{p.gender}</span>
                          <span className="text-sm font-mono text-soft">{p.name}</span>
                          {j === 0 && (
                            <span className="ml-auto text-[9px] font-mono text-amber-400/60 border border-amber-400/20 px-1.5 py-0.5 rounded-md">
                              kapten
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {picked && (
          <div className="space-y-3">
            <p className="text-xs text-muted font-mono">Terpilih ({picked.length})</p>
            <div className="flex flex-wrap gap-3">
              {picked.map((p) => {
                const g = GENDER_CONFIG[p.gender];
                return (
                  <div
                    key={p.id}
                    className={`flex items-center gap-2 px-4 py-3 rounded-2xl border ${g.bg} ${g.border}`}
                  >
                    <span className={`text-xs font-mono ${g.color}`}>{p.gender}</span>
                    <span className="text-sm font-mono text-soft font-medium">{p.name}</span>
                  </div>
                );
              })}
            </div>
            <button
              onClick={run}
              className="flex items-center gap-1.5 text-xs font-mono text-muted hover:text-primary transition-colors"
            >
              <RefreshCw size={12} /> Pick ulang
            </button>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
