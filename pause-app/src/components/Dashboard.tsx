"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Flame,
  Trophy,
  Star,
  Shield,
  Droplets,
  Dumbbell,
  XCircle,
  Leaf,
  Heart,
  Zap,
  Wind,
  Brain,
  GlassWater,
  ChevronRight,
  Home,
  BarChart3,
  Users,
  Settings,
  User,
  Check,
} from "lucide-react";

interface WinCard {
  id: string;
  label: string;
  icon: React.ElementType;
  points: number;
}

const WIN_CARDS: WinCard[] = [
  { id: "closed-app", label: "Closed App", icon: Shield, points: 8 },
  { id: "chose-water", label: "Chose Water", icon: Droplets, points: 5 },
  { id: "worked-out", label: "Worked Out", icon: Dumbbell, points: 10 },
  { id: "cancelled-order", label: "Cancelled Order", icon: XCircle, points: 12 },
  { id: "healthy-swap", label: "Healthy Swap", icon: Leaf, points: 8 },
  { id: "resisted-craving", label: "Resisted Craving", icon: Heart, points: 10 },
];

interface QuickActivity {
  id: string;
  label: string;
  icon: React.ElementType;
  meta: string;
}

const ACTIVITIES: QuickActivity[] = [
  { id: "sprint", label: "Decision Sprint", icon: Zap, meta: "10 rounds" },
  { id: "breathing", label: "Box Breathing", icon: Wind, meta: "4-4-4-4" },
  { id: "mindful", label: "Mindful Moment", icon: Brain, meta: "reflect" },
  { id: "hydration", label: "Hydration", icon: GlassWater, meta: "8 glasses" },
];

type NavTab = "home" | "analytics" | "leaderboard" | "settings" | "profile";

interface DashboardProps {
  archetypeName?: string;
  archetypeColor?: string;
  level?: number;
  levelName?: string;
  levelProgress?: number;
  streak?: number;
  totalPoints?: number;
  winsToday?: number;
  onNavChange?: (tab: NavTab) => void;
  onLogWin?: (winId: string, points: number) => void;
  onActivity?: (activityId: string) => void;
}

function FloatingPoints({ points, onDone }: { points: number; onDone: () => void }) {
  return (
    <motion.span
      className="pointer-events-none absolute -top-2 left-1/2 z-10 text-lg font-bold text-pause-success"
      initial={{ opacity: 1, y: 0, x: "-50%" }}
      animate={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.8 }}
      onAnimationComplete={onDone}
    >
      +{points}
    </motion.span>
  );
}

export default function Dashboard({
  archetypeName = "Burnt-Out Professional",
  archetypeColor = "#F59E0B",
  level = 3,
  levelName = "Shifting",
  levelProgress = 0.6,
  streak = 12,
  totalPoints = 847,
  winsToday = 3,
  onNavChange,
  onLogWin,
  onActivity,
}: DashboardProps) {
  const [activeTab, setActiveTab] = useState<NavTab>("home");
  const [loggedWins, setLoggedWins] = useState<Set<string>>(new Set());
  const [animatingWin, setAnimatingWin] = useState<string | null>(null);

  function handleLogWin(win: WinCard) {
    if (loggedWins.has(win.id)) return;
    setAnimatingWin(win.id);
    setLoggedWins((prev) => new Set(prev).add(win.id));
    onLogWin?.(win.id, win.points);
  }

  function handleNav(tab: NavTab) {
    setActiveTab(tab);
    onNavChange?.(tab);
  }

  const NAV_ITEMS: { id: NavTab; icon: React.ElementType; label: string }[] = [
    { id: "home", icon: Home, label: "Home" },
    { id: "analytics", icon: BarChart3, label: "Analytics" },
    { id: "leaderboard", icon: Users, label: "Board" },
    { id: "settings", icon: Settings, label: "Settings" },
    { id: "profile", icon: User, label: "Profile" },
  ];

  return (
    <div className="flex min-h-dvh flex-col bg-pause-bg font-sans">
      <div className="mx-auto w-full max-w-[480px] flex-1 pb-24">
        {/* Hero card */}
        <div
          className="mx-4 mt-4 rounded-card p-5 text-white shadow-lg"
          style={{
            background: `linear-gradient(135deg, ${archetypeColor}, ${archetypeColor}CC)`,
          }}
        >
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20">
              <User className="h-7 w-7 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-base font-bold">{archetypeName}</p>
              <div className="mt-1 flex items-center gap-2">
                <span className="rounded-pill bg-white/20 px-2.5 py-0.5 text-xs font-semibold">
                  Level {level} — {levelName}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-3">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/20">
              <motion.div
                className="h-full rounded-full bg-white"
                initial={{ width: 0 }}
                animate={{ width: `${levelProgress * 100}%` }}
                transition={{ duration: 0.6 }}
              />
            </div>
          </div>
          <div className="mt-4 flex justify-between">
            <div className="flex items-center gap-1.5">
              <Flame className="h-4 w-4" />
              <span className="text-sm font-semibold">{streak} days</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Trophy className="h-4 w-4" />
              <span className="text-sm font-semibold">{totalPoints} pts</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Star className="h-4 w-4" />
              <span className="text-sm font-semibold">{winsToday} wins</span>
            </div>
          </div>
        </div>

        {/* Log a Win */}
        <div className="mt-6 px-4">
          <h2 className="mb-3 text-base font-bold text-pause-primary">
            Log a Win
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {WIN_CARDS.map((win) => {
              const logged = loggedWins.has(win.id);
              const Icon = win.icon;
              return (
                <motion.button
                  key={win.id}
                  onClick={() => handleLogWin(win)}
                  disabled={logged}
                  className={`relative flex flex-col items-center gap-2 rounded-card border p-4 transition-all ${
                    logged
                      ? "border-pause-success/30 bg-pause-success/5"
                      : "border-pause-border bg-white shadow-sm hover:shadow-md active:scale-[0.97]"
                  }`}
                  whileTap={logged ? {} : { scale: 0.95 }}
                >
                  <AnimatePresence>
                    {animatingWin === win.id && (
                      <FloatingPoints
                        points={win.points}
                        onDone={() => setAnimatingWin(null)}
                      />
                    )}
                  </AnimatePresence>
                  {logged ? (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pause-success/10">
                      <Check className="h-5 w-5 text-pause-success" />
                    </div>
                  ) : (
                    <Icon className="h-6 w-6" style={{ color: archetypeColor }} />
                  )}
                  <span className="text-sm font-medium text-pause-primary">
                    {win.label}
                  </span>
                  <span className="text-xs text-pause-muted">
                    +{win.points} pts
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Quick Activities */}
        <div className="mt-6 px-4">
          <h2 className="mb-3 text-base font-bold text-pause-primary">
            Quick Activities
          </h2>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
            {ACTIVITIES.map((act) => {
              const Icon = act.icon;
              return (
                <button
                  key={act.id}
                  onClick={() => onActivity?.(act.id)}
                  className="flex min-w-[130px] shrink-0 flex-col gap-1.5 rounded-card border border-pause-border bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
                >
                  <Icon className="h-5 w-5 text-pause-accent" />
                  <span className="text-sm font-medium text-pause-primary">
                    {act.label}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-pause-muted">
                    {act.meta}
                    <ChevronRight className="h-3 w-3" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 border-t border-pause-border bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[480px] items-center justify-around py-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`flex flex-col items-center gap-0.5 px-3 py-1 ${
                  active ? "text-pause-accent" : "text-pause-muted"
                }`}
                aria-label={item.label}
                aria-current={active ? "page" : undefined}
              >
                <Icon className="h-5 w-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
