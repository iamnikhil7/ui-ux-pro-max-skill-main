"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil, X, Plus, Sparkles, User } from "lucide-react";

const ARCHETYPE_COLORS: Record<string, { from: string; to: string }> = {
  "burnt-out-professional": { from: "#F59E0B", to: "#D97706" },
  "former-athlete": { from: "#84CC16", to: "#65A30D" },
  "overwhelmed-parent": { from: "#FB7185", to: "#E11D48" },
  "social-butterfly": { from: "#FACC15", to: "#EAB308" },
  "night-owl": { from: "#6366F1", to: "#4F46E5" },
  "emotional-eater": { from: "#FB923C", to: "#EA580C" },
  "serial-starter": { from: "#F97316", to: "#C2410C" },
  "mindless-grazer": { from: "#9CA3AF", to: "#6B7280" },
  "perfectionist-quitter": { from: "#475569", to: "#334155" },
  "mindful-aspirant": { from: "#14B8A6", to: "#0D9488" },
};

interface Archetype {
  slug: string;
  name: string;
  subtitle: string;
  traits: string[];
  wellnessBaseline: number;
  defaultGoals: string[];
}

interface ArchetypeRevealProps {
  archetype: Archetype;
  onStart?: (goals: string[], whyText: string) => void;
}

function WellnessRing({
  percentage,
  color,
}: {
  percentage: number;
  color: string;
}) {
  const r = 54;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="128" height="128" viewBox="0 0 128 128">
        <circle
          cx="64"
          cy="64"
          r={r}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth="8"
        />
        <motion.circle
          cx="64"
          cy="64"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
          transform="rotate(-90 64 64)"
        />
      </svg>
      <span className="absolute text-2xl font-bold text-pause-primary">
        {percentage}%
      </span>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-pause-bg font-sans">
      <motion.div
        className="h-16 w-16 rounded-full border-4 border-pause-accent-light border-t-pause-accent"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      <p className="text-base font-medium text-pause-primary">
        Building your profile
      </p>
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="h-2.5 w-2.5 rounded-full bg-pause-accent"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{
              duration: 1,
              delay: i * 0.2,
              repeat: Infinity,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function ArchetypeReveal({
  archetype,
  onStart,
}: ArchetypeRevealProps) {
  const [loading, setLoading] = useState(true);
  const [goals, setGoals] = useState<string[]>(archetype.defaultGoals);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [whyText, setWhyText] = useState("");

  const colors = ARCHETYPE_COLORS[archetype.slug] ?? {
    from: "#4A90D9",
    to: "#2E4057",
  };

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  function startEdit(index: number) {
    setEditingIndex(index);
    setEditText(goals[index]);
  }

  function saveEdit() {
    if (editingIndex === null) return;
    const updated = [...goals];
    updated[editingIndex] = editText;
    setGoals(updated);
    setEditingIndex(null);
  }

  function removeGoal(index: number) {
    setGoals(goals.filter((_, i) => i !== index));
  }

  function addGoal() {
    setGoals([...goals, "New goal"]);
    startEdit(goals.length);
  }

  if (loading) return <LoadingState />;

  return (
    <div className="min-h-dvh bg-pause-bg font-sans">
      <div className="mx-auto max-w-[480px] px-5 py-10">
        {/* Archetype name */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-2xl font-bold tracking-tight text-pause-primary sm:text-3xl">
            {archetype.name.toUpperCase()}
          </h1>
          <p className="mt-2 text-base text-pause-muted">{archetype.subtitle}</p>
        </motion.div>

        {/* Avatar */}
        <motion.div
          className="mt-8 flex justify-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div
            className="flex h-[200px] w-[200px] items-center justify-center rounded-3xl shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${colors.from}, ${colors.to})`,
            }}
          >
            <User className="h-20 w-20 text-white/80" />
          </div>
        </motion.div>

        {/* Wellness baseline */}
        <motion.div
          className="mt-8 flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <p className="mb-3 text-sm font-medium text-pause-muted">
            Wellness Baseline
          </p>
          <WellnessRing percentage={archetype.wellnessBaseline} color={colors.from} />
        </motion.div>

        {/* Key traits */}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-pause-muted">
            Key Traits
          </h3>
          <div className="flex flex-wrap gap-2">
            {archetype.traits.map((trait) => (
              <span
                key={trait}
                className="rounded-pill px-3 py-1.5 text-sm font-medium"
                style={{
                  backgroundColor: `${colors.from}15`,
                  color: colors.to,
                }}
              >
                {trait}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Goals */}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-pause-muted">
            Your Personalized Goals
          </h3>
          <div className="flex flex-col gap-2">
            {goals.map((goal, i) => (
              <div
                key={i}
                className="flex items-center gap-2 rounded-card border border-pause-border bg-white p-3"
              >
                {editingIndex === i ? (
                  <input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onBlur={saveEdit}
                    onKeyDown={(e) => e.key === "Enter" && saveEdit()}
                    className="flex-1 bg-transparent text-sm text-pause-primary outline-none"
                    autoFocus
                  />
                ) : (
                  <span className="flex-1 text-sm text-pause-primary">
                    {goal}
                  </span>
                )}
                <button
                  onClick={() => startEdit(i)}
                  className="rounded-full p-1.5 text-pause-muted hover:bg-pause-accent-light hover:text-pause-accent"
                  aria-label="Edit goal"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => removeGoal(i)}
                  className="rounded-full p-1.5 text-pause-muted hover:bg-red-50 hover:text-pause-danger"
                  aria-label="Remove goal"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
            <button
              onClick={addGoal}
              className="flex items-center justify-center gap-2 rounded-card border-2 border-dashed border-pause-border bg-white p-3 text-sm font-medium text-pause-muted transition-colors hover:border-pause-accent hover:text-pause-accent"
            >
              <Plus className="h-4 w-4" />
              Add Goal
            </button>
          </div>
        </motion.div>

        {/* Write your why */}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-pause-muted">
            Write Your Why
          </h3>
          <textarea
            value={whyText}
            onChange={(e) => setWhyText(e.target.value)}
            placeholder="When you're about to override a pause, this is what you'll see. Make it something only you would write."
            rows={3}
            className="w-full resize-none rounded-card border border-pause-border bg-white p-4 text-sm text-pause-primary placeholder-pause-muted-light outline-none transition-colors focus:border-pause-accent"
          />
        </motion.div>

        {/* CTA */}
        <motion.button
          onClick={() => onStart?.(goals, whyText)}
          className="mt-10 w-full rounded-btn py-4 text-base font-bold text-white shadow-lg transition-all hover:brightness-110 active:scale-[0.98]"
          style={{
            background: `linear-gradient(135deg, ${colors.from}, ${colors.to})`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          whileTap={{ scale: 0.97 }}
        >
          <span className="flex items-center justify-center gap-2">
            <Sparkles className="h-5 w-5" />
            Start My Journey
          </span>
        </motion.button>
      </div>
    </div>
  );
}
