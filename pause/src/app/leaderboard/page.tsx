"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser, StoredUser, getWins } from "@/lib/store";
import { getArchetype, ARCHETYPES } from "@/lib/archetypes";
import { ArchetypeKey } from "@/lib/types";
import Avatar from "@/components/Avatar";
import { ArrowLeft, Flame, Trophy } from "lucide-react";

interface LeaderEntry {
  rank: number;
  name: string;
  archetype: ArchetypeKey;
  points: number;
  streak: number;
  wins: number;
  isYou: boolean;
}

function generateMockLeaderboard(user: StoredUser): LeaderEntry[] {
  const totalWins = getWins().length;
  const entries: LeaderEntry[] = [];

  // Add mock users
  const names = ["Alex M.", "Jordan K.", "Sam R.", "Riley T.", "Morgan P.", "Casey L.", "Quinn H.", "Drew S."];
  for (let i = 0; i < 8; i++) {
    entries.push({
      rank: 0,
      name: names[i],
      archetype: ARCHETYPES[Math.floor(Math.random() * 10)].key,
      points: Math.floor(Math.random() * 400) + 50,
      streak: Math.floor(Math.random() * 14) + 1,
      wins: Math.floor(Math.random() * 40) + 5,
      isYou: false,
    });
  }

  // Add current user
  entries.push({
    rank: 0,
    name: "You",
    archetype: user.assigned_archetype!,
    points: user.total_points,
    streak: user.current_streak,
    wins: totalWins,
    isYou: true,
  });

  // Sort by points descending
  entries.sort((a, b) => b.points - a.points);
  entries.forEach((e, i) => (e.rank = i + 1));
  return entries;
}

export default function LeaderboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<StoredUser | null>(null);
  const [tab, setTab] = useState<"tribe" | "global">("tribe");
  const [entries, setEntries] = useState<LeaderEntry[]>([]);

  useEffect(() => {
    const u = getUser();
    if (!u || !u.questionnaire_completed) {
      router.push("/questionnaire");
      return;
    }
    setUser(u);
    setEntries(generateMockLeaderboard(u));
  }, [router]);

  if (!user || !user.assigned_archetype) return null;

  const tribeEntries = entries.filter(
    (e) => e.archetype === user.assigned_archetype || e.isYou
  );
  const displayEntries = tab === "tribe" ? tribeEntries : entries;

  return (
    <div className="min-h-screen pb-20">
      <header className="sticky top-0 z-10 bg-pause-darker/90 backdrop-blur-sm border-b border-pause-border px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <button onClick={() => router.push("/dashboard")} className="text-pause-muted hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-bold text-lg">Avatar Board</h1>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab("tribe")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === "tribe" ? "bg-pause-accent text-white" : "bg-pause-card text-pause-muted"
            }`}
          >
            My Tribe
          </button>
          <button
            onClick={() => setTab("global")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === "global" ? "bg-pause-accent text-white" : "bg-pause-card text-pause-muted"
            }`}
          >
            Global
          </button>
        </div>

        {/* Leaderboard */}
        <div className="flex flex-col gap-2">
          {displayEntries.map((entry) => (
            <div
              key={entry.name + entry.rank}
              className={`flex items-center gap-4 bg-pause-card border rounded-xl px-5 py-3 ${
                entry.isYou ? "border-pause-accent bg-pause-accent/10" : "border-pause-border"
              }`}
            >
              <span className="text-lg font-bold text-pause-muted w-8">{entry.rank}</span>
              <Avatar archetypeKey={entry.archetype} size="sm" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{entry.name}</span>
                  {entry.isYou && (
                    <span className="px-2 py-0.5 bg-pause-accent text-white text-xs rounded-full font-medium">
                      YOU
                    </span>
                  )}
                </div>
                <p className="text-xs text-pause-muted">{getArchetype(entry.archetype).name}</p>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Trophy className="w-3.5 h-3.5 text-pause-accent" />
                  <span>{entry.points}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-orange-400" />
                  <span>{entry.streak}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
