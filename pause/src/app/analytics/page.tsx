"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser, getWins, StoredUser, StoredWin } from "@/lib/store";
import { getArchetype } from "@/lib/archetypes";
import Avatar from "@/components/Avatar";
import ProgressRing from "@/components/ProgressRing";
import { ArrowLeft } from "lucide-react";

function getLast7Days() {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split("T")[0]);
  }
  return days;
}

function getDayLabel(dateStr: string) {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", { weekday: "short" });
}

export default function AnalyticsPage() {
  const router = useRouter();
  const [user, setUser] = useState<StoredUser | null>(null);
  const [wins, setWins] = useState<StoredWin[]>([]);

  useEffect(() => {
    const u = getUser();
    if (!u || !u.questionnaire_completed) {
      router.push("/questionnaire");
      return;
    }
    setUser(u);
    setWins(getWins());
  }, [router]);

  if (!user || !user.assigned_archetype) return null;

  const archetype = getArchetype(user.assigned_archetype);
  const last7 = getLast7Days();

  // Wins per day
  const winsPerDay = last7.map((day) => {
    const dayWins = wins.filter((w) => w.created_at.startsWith(day));
    return { day, label: getDayLabel(day), count: dayWins.length, points: dayWins.reduce((s, w) => s + w.points_earned, 0) };
  });
  const maxCount = Math.max(...winsPerDay.map((d) => d.count), 1);

  // Win breakdown by category
  const breakdown: Record<string, number> = {};
  for (const w of wins) {
    const label = w.action_type.replace(/_/g, " ");
    breakdown[label] = (breakdown[label] || 0) + 1;
  }
  const totalWins = wins.length || 1;
  const breakdownEntries = Object.entries(breakdown).sort((a, b) => b[1] - a[1]);

  const colors = ["#7c3aed", "#10b981", "#f59e0b", "#ef4444", "#3b82f6", "#ec4899", "#8b5cf6", "#14b8a6", "#f97316"];

  return (
    <div className="min-h-screen pb-20">
      <header className="sticky top-0 z-10 bg-pause-darker/90 backdrop-blur-sm border-b border-pause-border px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <button onClick={() => router.push("/dashboard")} className="text-pause-muted hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-bold text-lg">Analytics</h1>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Weekly activity */}
        <div className="bg-pause-card border border-pause-border rounded-2xl p-6 mb-6">
          <h2 className="text-sm font-medium text-pause-muted uppercase tracking-wider mb-4">
            Weekly Activity
          </h2>
          <div className="flex items-end justify-between gap-2 h-40">
            {winsPerDay.map((d) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs text-pause-muted">{d.count}</span>
                <div className="w-full flex items-end justify-center" style={{ height: "100px" }}>
                  <div
                    className="w-full max-w-8 bg-pause-accent rounded-t-md transition-all duration-500"
                    style={{ height: `${Math.max((d.count / maxCount) * 100, 4)}%` }}
                  />
                </div>
                <span className="text-xs text-pause-muted">{d.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Win breakdown */}
        <div className="bg-pause-card border border-pause-border rounded-2xl p-6 mb-6">
          <h2 className="text-sm font-medium text-pause-muted uppercase tracking-wider mb-4">
            Win Breakdown
          </h2>
          {breakdownEntries.length === 0 ? (
            <p className="text-pause-muted text-sm">No wins logged yet. Start from the dashboard!</p>
          ) : (
            <div className="flex flex-col gap-3">
              {breakdownEntries.map(([label, count], i) => (
                <div key={label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="capitalize">{label}</span>
                    <span className="text-pause-muted">{count} ({Math.round((count / totalWins) * 100)}%)</span>
                  </div>
                  <div className="w-full h-2 bg-pause-border rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${(count / totalWins) * 100}%`,
                        backgroundColor: colors[i % colors.length],
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Dual avatar view */}
        <div className="bg-pause-card border border-pause-border rounded-2xl p-6 mb-6">
          <h2 className="text-sm font-medium text-pause-muted uppercase tracking-wider mb-4">
            Your Journey
          </h2>
          <div className="flex items-center justify-around">
            <div className="text-center">
              <Avatar archetypeKey={user.assigned_archetype} state="resting" size="md" />
              <p className="text-sm text-pause-muted mt-2">Now</p>
              <ProgressRing
                value={archetype.wellnessBaseline}
                color={archetype.avatarColor}
                size={80}
                strokeWidth={6}
              />
            </div>
            <div className="text-pause-muted text-2xl">&rarr;</div>
            <div className="text-center">
              <Avatar archetypeKey={user.assigned_archetype} state="celebrating" size="md" />
              <p className="text-sm text-pause-muted mt-2">30-Day Goal</p>
              <ProgressRing
                value={Math.min(archetype.wellnessBaseline + 15, 100)}
                color="#10b981"
                size={80}
                strokeWidth={6}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
