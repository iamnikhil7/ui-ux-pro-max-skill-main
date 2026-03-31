"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getUser, addWin, StoredUser, getWins, StoredWin } from "@/lib/store";
import { getArchetype } from "@/lib/archetypes";
import { getLevel, WIN_POINTS, WinActionType } from "@/lib/types";
import { getStyledMessage, APP_INTERCEPTIONS } from "@/lib/interceptions";
import Avatar from "@/components/Avatar";
import InterceptionModal from "@/components/InterceptionModal";
import {
  Flame, Trophy, Droplets, Dumbbell, ShoppingCart,
  Apple, HandMetal, Wind, Brain, Timer,
  BarChart3, Users, Settings, Zap,
} from "lucide-react";

const WIN_CARDS: { type: WinActionType; label: string; icon: typeof Flame; points: number }[] = [
  { type: "closed_app", label: "Closed App", icon: HandMetal, points: WIN_POINTS.closed_app },
  { type: "chose_water", label: "Chose Water", icon: Droplets, points: WIN_POINTS.chose_water },
  { type: "worked_out", label: "Worked Out", icon: Dumbbell, points: WIN_POINTS.worked_out },
  { type: "cancelled_order", label: "Cancelled Order", icon: ShoppingCart, points: WIN_POINTS.cancelled_order },
  { type: "healthy_swap", label: "Healthy Swap", icon: Apple, points: WIN_POINTS.healthy_swap },
  { type: "resisted_craving", label: "Resisted Craving", icon: Zap, points: WIN_POINTS.resisted_craving },
];

const MINI_GAMES: { type: WinActionType; label: string; icon: typeof Flame; points: number }[] = [
  { type: "box_breathing", label: "Box Breathing", icon: Wind, points: WIN_POINTS.box_breathing },
  { type: "mindful_moment", label: "Mindful Moment", icon: Brain, points: WIN_POINTS.mindful_moment },
  { type: "decision_sprint", label: "Decision Sprint", icon: Timer, points: WIN_POINTS.decision_sprint },
];

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<StoredUser | null>(null);
  const [celebrating, setCelebrating] = useState(false);
  const [interception, setInterception] = useState<{ app: string; message: string } | null>(null);
  const [recentWins, setRecentWins] = useState<StoredWin[]>([]);

  const refreshUser = useCallback(() => {
    const u = getUser();
    if (!u || !u.questionnaire_completed) {
      router.push("/questionnaire");
      return;
    }
    setUser(u);
    setRecentWins(getWins().slice(-5).reverse());
  }, [router]);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const handleWin = (type: WinActionType, points: number) => {
    addWin(type, points);
    setCelebrating(true);
    setTimeout(() => setCelebrating(false), 1500);
    refreshUser();
  };

  const testInterception = () => {
    if (!user?.messaging_style || !user.assigned_archetype) return;
    const active = APP_INTERCEPTIONS.filter((a) => a.defaultActive && a.baseMessage);
    const pick = active[Math.floor(Math.random() * active.length)];
    if (!pick) return;
    const message = getStyledMessage(pick.baseMessage, user.messaging_style, pick.app);
    setInterception({ app: pick.app, message });
  };

  if (!user || !user.assigned_archetype) return null;

  const archetype = getArchetype(user.assigned_archetype);
  const level = getLevel(user.total_points);

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-pause-darker/90 backdrop-blur-sm border-b border-pause-border px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <h1 className="font-bold text-lg">PAUSE</h1>
          <div className="flex items-center gap-4">
            <button onClick={() => router.push("/analytics")} className="text-pause-muted hover:text-white">
              <BarChart3 className="w-5 h-5" />
            </button>
            <button onClick={() => router.push("/leaderboard")} className="text-pause-muted hover:text-white">
              <Users className="w-5 h-5" />
            </button>
            <button onClick={() => router.push("/settings")} className="text-pause-muted hover:text-white">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Profile card */}
        <div className="bg-pause-card border border-pause-border rounded-2xl p-6 mb-8">
          <div className="flex items-center gap-6">
            <Avatar
              archetypeKey={user.assigned_archetype}
              state={celebrating ? "celebrating" : "resting"}
              size="md"
            />
            <div className="flex-1">
              <p className="text-sm text-pause-accent font-medium">{archetype.name}</p>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1.5">
                  <Trophy className="w-4 h-4 text-pause-accent" />
                  <span className="text-sm font-medium">Lv.{level.level} {level.name}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-orange-400" />
                  <span className="text-sm font-medium">{user.current_streak} day streak</span>
                </div>
              </div>
              {/* Level progress */}
              <div className="mt-3">
                <div className="flex justify-between text-xs text-pause-muted mb-1">
                  <span>{user.total_points} pts</span>
                  <span>{level.progress}/{level.needed} to next</span>
                </div>
                <div className="w-full h-2 bg-pause-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-pause-accent rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((level.progress / level.needed) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Log a Win */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Log a Win</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {WIN_CARDS.map((w) => (
              <button
                key={w.type}
                onClick={() => handleWin(w.type, w.points)}
                className="bg-pause-card border border-pause-border hover:border-pause-accent/40 rounded-xl p-4 text-left transition-all hover:scale-[1.02] active:scale-95"
              >
                <w.icon className="w-6 h-6 text-pause-accent mb-2" />
                <p className="font-medium text-sm">{w.label}</p>
                <p className="text-xs text-pause-accent mt-1">+{w.points} pts</p>
              </button>
            ))}
          </div>
        </div>

        {/* Mini Games */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Mini-Games</h2>
          <div className="grid grid-cols-3 gap-3">
            {MINI_GAMES.map((g) => (
              <button
                key={g.type}
                onClick={() => handleWin(g.type, g.points)}
                className="bg-pause-card border border-pause-border hover:border-pause-accent/40 rounded-xl p-4 text-center transition-all hover:scale-[1.02] active:scale-95"
              >
                <g.icon className="w-6 h-6 text-pause-accent mx-auto mb-2" />
                <p className="font-medium text-xs">{g.label}</p>
                <p className="text-xs text-pause-accent mt-1">+{g.points} pts</p>
              </button>
            ))}
          </div>
        </div>

        {/* Test Interception */}
        <button
          onClick={testInterception}
          className="w-full py-3 bg-pause-card border border-pause-border hover:border-pause-accent/40 rounded-xl text-sm text-pause-muted hover:text-white transition-all"
        >
          Test Interception
        </button>

        {/* Recent Wins */}
        {recentWins.length > 0 && (
          <div className="mt-8">
            <h3 className="text-sm font-medium text-pause-muted uppercase tracking-wider mb-3">Recent Wins</h3>
            <div className="flex flex-col gap-2">
              {recentWins.map((w) => (
                <div key={w.id} className="flex items-center justify-between bg-pause-card border border-pause-border rounded-lg px-4 py-2.5">
                  <span className="text-sm">{w.action_type.replace(/_/g, " ")}</span>
                  <span className="text-sm text-pause-accent">+{w.points_earned}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Interception Modal */}
      {interception && user.assigned_archetype && (
        <InterceptionModal
          appName={interception.app}
          message={interception.message}
          userWhy={user.user_why}
          archetypeKey={user.assigned_archetype}
          onPause={() => {
            handleWin("closed_app", WIN_POINTS.closed_app);
            setInterception(null);
          }}
          onContinue={() => setInterception(null)}
        />
      )}
    </div>
  );
}
