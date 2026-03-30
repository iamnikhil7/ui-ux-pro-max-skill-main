"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Flame, Star, Trophy, User, Crown } from "lucide-react";

interface LeaderboardEntry {
  rank: number;
  username: string;
  archetypeSlug: string;
  archetypeName: string;
  archetypeColor: string;
  points: number;
  streak: number;
  wins: number;
  isCurrentUser?: boolean;
}

type SortKey = "points" | "streak" | "wins";
type TabKey = "tribe" | "global";

const SAMPLE_ENTRIES: LeaderboardEntry[] = [
  { rank: 1, username: "zenMaster_99", archetypeSlug: "mindful-aspirant", archetypeName: "Mindful Aspirant", archetypeColor: "#14B8A6", points: 2340, streak: 45, wins: 312 },
  { rank: 2, username: "recoverHero", archetypeSlug: "burnt-out-professional", archetypeName: "Burnt-Out Pro", archetypeColor: "#F59E0B", points: 2105, streak: 33, wins: 287 },
  { rank: 3, username: "morningRunner", archetypeSlug: "former-athlete", archetypeName: "Former Athlete", archetypeColor: "#84CC16", points: 1890, streak: 28, wins: 256 },
  { rank: 4, username: "parentWin", archetypeSlug: "overwhelmed-parent", archetypeName: "Overwhelmed Parent", archetypeColor: "#FB7185", points: 1672, streak: 21, wins: 198 },
  { rank: 5, username: "quietNight", archetypeSlug: "night-owl", archetypeName: "Night Owl", archetypeColor: "#6366F1", points: 1450, streak: 19, wins: 176 },
  { rank: 6, username: "you_user", archetypeSlug: "burnt-out-professional", archetypeName: "Burnt-Out Pro", archetypeColor: "#F59E0B", points: 847, streak: 12, wins: 89, isCurrentUser: true },
  { rank: 7, username: "freshStart", archetypeSlug: "serial-starter", archetypeName: "Serial Starter", archetypeColor: "#F97316", points: 720, streak: 8, wins: 67 },
  { rank: 8, username: "balanced_life", archetypeSlug: "social-butterfly", archetypeName: "Social Butterfly", archetypeColor: "#FACC15", points: 690, streak: 14, wins: 71 },
];

const RANK_ICONS: Record<number, { icon: React.ElementType; color: string }> = {
  1: { icon: Crown, color: "#F59E0B" },
  2: { icon: Crown, color: "#9CA3AF" },
  3: { icon: Crown, color: "#CD7F32" },
};

interface AvatarBoardProps {
  currentUserArchetype?: string;
}

export default function AvatarBoard({
  currentUserArchetype = "Burnt-Out Professional",
}: AvatarBoardProps) {
  const [tab, setTab] = useState<TabKey>("tribe");
  const [sortBy, setSortBy] = useState<SortKey>("points");
  const userRowRef = useRef<HTMLDivElement>(null);

  const sorted = [...SAMPLE_ENTRIES].sort((a, b) => b[sortBy] - a[sortBy]).map((e, i) => ({ ...e, rank: i + 1 }));

  useEffect(() => {
    userRowRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [sortBy, tab]);

  const SORT_OPTIONS: { key: SortKey; label: string }[] = [
    { key: "points", label: "Points" },
    { key: "streak", label: "Streak" },
    { key: "wins", label: "Wins" },
  ];

  return (
    <div className="min-h-dvh bg-pause-bg pb-24 font-sans">
      <div className="mx-auto max-w-[480px] px-4 pt-6">
        <h1 className="text-2xl font-bold text-pause-primary">Avatar Board</h1>

        {/* Tabs */}
        <div className="mt-4 flex border-b border-pause-border">
          {(["tribe", "global"] as TabKey[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`relative flex-1 pb-3 text-center text-sm font-semibold transition-colors ${
                tab === t ? "text-pause-accent" : "text-pause-muted"
              }`}
            >
              {t === "tribe" ? "My Tribe" : "Global"}
              {tab === t && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-pause-accent"
                  layoutId="tab-indicator"
                />
              )}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="mt-4 flex items-center gap-2">
          <span className="text-xs text-pause-muted">Sort by:</span>
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setSortBy(opt.key)}
              className={`rounded-pill px-3 py-1 text-xs font-semibold transition-all ${
                sortBy === opt.key
                  ? "bg-pause-accent text-white"
                  : "border border-pause-border bg-white text-pause-muted"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Leaderboard */}
        <div className="mt-4 flex flex-col gap-2">
          {sorted.map((entry) => {
            const rankMeta = RANK_ICONS[entry.rank];
            return (
              <motion.div
                key={entry.username}
                ref={entry.isCurrentUser ? userRowRef : undefined}
                className={`flex items-center gap-3 rounded-card border p-3 transition-all ${
                  entry.isCurrentUser
                    ? "border-pause-accent bg-pause-accent-light"
                    : "border-pause-border bg-white"
                }`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: entry.rank * 0.04 }}
              >
                {/* Rank */}
                <div className="flex w-8 items-center justify-center">
                  {rankMeta ? (
                    <rankMeta.icon
                      className="h-5 w-5"
                      style={{ color: rankMeta.color }}
                    />
                  ) : (
                    <span className="text-sm font-bold text-pause-muted">
                      {entry.rank}
                    </span>
                  )}
                </div>

                {/* Avatar */}
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                  style={{
                    background: `linear-gradient(135deg, ${entry.archetypeColor}, ${entry.archetypeColor}AA)`,
                  }}
                >
                  <User className="h-5 w-5 text-white/80" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-semibold text-pause-primary">
                      {entry.username}
                    </span>
                    {entry.isCurrentUser && (
                      <span className="shrink-0 rounded-pill bg-pause-accent px-2 py-0.5 text-[10px] font-bold text-white">
                        YOU
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-pause-muted">
                    {entry.archetypeName}
                  </span>
                </div>

                {/* Stats */}
                <div className="flex shrink-0 items-center gap-3 text-right">
                  <span className="text-sm font-bold text-pause-primary">
                    {entry[sortBy].toLocaleString()}
                  </span>
                  <div className="flex items-center gap-0.5 text-xs text-pause-muted">
                    <Flame className="h-3 w-3 text-pause-warning" />
                    {entry.streak}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
