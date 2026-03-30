"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Pencil,
  X,
  Plus,
  HandMetal,
  BarChart3,
  Feather,
  Scale,
  RotateCcw,
  ChevronRight,
} from "lucide-react";

interface MonitoredApp {
  name: string;
  category: string;
  status: "TRIGGER" | "WATCH" | "SAFE";
  enabled: boolean;
}

const DEFAULT_APPS: MonitoredApp[] = [
  { name: "DoorDash", category: "Food Delivery", status: "TRIGGER", enabled: true },
  { name: "UberEats", category: "Food Delivery", status: "TRIGGER", enabled: true },
  { name: "Instagram", category: "Social Media", status: "TRIGGER", enabled: true },
  { name: "TikTok", category: "Social Media", status: "WATCH", enabled: true },
  { name: "Twitter/X", category: "Social Media", status: "WATCH", enabled: false },
  { name: "Amazon", category: "Shopping", status: "WATCH", enabled: true },
  { name: "Apple Fitness", category: "Health & Fitness", status: "SAFE", enabled: false },
  { name: "Netflix", category: "Entertainment", status: "WATCH", enabled: false },
  { name: "YouTube", category: "Entertainment", status: "WATCH", enabled: true },
];

const STATUS_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  TRIGGER: { bg: "bg-red-50", text: "text-pause-danger", dot: "bg-pause-danger" },
  WATCH: { bg: "bg-amber-50", text: "text-pause-warning", dot: "bg-pause-warning" },
  SAFE: { bg: "bg-green-50", text: "text-pause-success", dot: "bg-pause-success" },
};

interface MessagingStyle {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
}

const MESSAGING_STYLES: MessagingStyle[] = [
  { id: "tough", label: "Tough Love", description: "Direct and challenging", icon: HandMetal },
  { id: "data", label: "Data-Driven", description: "Facts and numbers", icon: BarChart3 },
  { id: "gentle", label: "Gentle Nudge", description: "Soft and supportive", icon: Feather },
  { id: "balanced", label: "Balanced", description: "Mix of motivation and data", icon: Scale },
];

interface SettingsPageProps {
  defaultGoals?: string[];
  defaultWhyText?: string;
  defaultMessagingStyle?: string;
  retakeEligible?: boolean;
  daysUntilRetake?: number;
  pointsUntilRetake?: number;
  onTest?: (appName: string) => void;
}

export default function SettingsPage({
  defaultGoals = ["Reduce delivery orders to 2x/week", "Walk 20 min daily", "Drink 8 glasses of water", "No screens after 10pm"],
  defaultWhyText = "",
  defaultMessagingStyle = "balanced",
  retakeEligible = false,
  daysUntilRetake = 18,
  pointsUntilRetake = 53,
  onTest,
}: SettingsPageProps) {
  const [apps, setApps] = useState(DEFAULT_APPS);
  const [messagingStyle, setMessagingStyle] = useState(defaultMessagingStyle);
  const [goals, setGoals] = useState(defaultGoals);
  const [editingGoal, setEditingGoal] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [whyText, setWhyText] = useState(defaultWhyText);

  function toggleApp(index: number) {
    const updated = [...apps];
    updated[index] = { ...updated[index], enabled: !updated[index].enabled };
    setApps(updated);
  }

  // Group apps by category
  const grouped = apps.reduce<Record<string, { apps: (MonitoredApp & { index: number })[]; status: string }>>((acc, app, i) => {
    if (!acc[app.category]) {
      acc[app.category] = { apps: [], status: app.status };
    }
    acc[app.category].apps.push({ ...app, index: i });
    return acc;
  }, {});

  function startEditGoal(i: number) {
    setEditingGoal(i);
    setEditText(goals[i]);
  }

  function saveGoal() {
    if (editingGoal === null) return;
    const updated = [...goals];
    updated[editingGoal] = editText;
    setGoals(updated);
    setEditingGoal(null);
  }

  return (
    <div className="min-h-dvh bg-pause-bg pb-24 font-sans">
      <div className="mx-auto max-w-[480px] px-4 pt-6">
        <h1 className="mb-6 text-2xl font-bold text-pause-primary">Settings</h1>

        {/* App monitoring */}
        <Section title="App Monitoring">
          {Object.entries(grouped).map(([category, { apps: catApps, status }]) => {
            const style = STATUS_STYLES[status];
            return (
              <div key={category} className="mb-4">
                <div className="mb-2 flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${style.dot}`} />
                  <span className="text-xs font-semibold uppercase tracking-wider text-pause-muted">
                    {category}
                  </span>
                  <span className={`rounded-pill px-2 py-0.5 text-[10px] font-bold ${style.bg} ${style.text}`}>
                    {status}
                  </span>
                </div>
                {catApps.map((app) => (
                  <div
                    key={app.name}
                    className="flex items-center justify-between border-b border-pause-border/50 py-3 last:border-0"
                  >
                    <span className="text-sm text-pause-primary">{app.name}</span>
                    <div className="flex items-center gap-3">
                      {app.enabled && (
                        <button
                          onClick={() => onTest?.(app.name)}
                          className="rounded-btn border border-pause-border px-3 py-1 text-xs font-medium text-pause-muted transition-colors hover:border-pause-accent hover:text-pause-accent"
                        >
                          Test
                        </button>
                      )}
                      <button
                        onClick={() => toggleApp(app.index)}
                        className={`relative h-6 w-11 rounded-full transition-colors ${
                          app.enabled ? "bg-pause-accent" : "bg-pause-border"
                        }`}
                        role="switch"
                        aria-checked={app.enabled}
                        aria-label={`Monitor ${app.name}`}
                      >
                        <motion.div
                          className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm"
                          animate={{ left: app.enabled ? 20 : 2 }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </Section>

        {/* Messaging style */}
        <Section title="Messaging Style">
          <div className="grid grid-cols-2 gap-3">
            {MESSAGING_STYLES.map((style) => {
              const Icon = style.icon;
              const active = messagingStyle === style.id;
              return (
                <button
                  key={style.id}
                  onClick={() => setMessagingStyle(style.id)}
                  className={`flex flex-col items-center gap-2 rounded-card border-2 p-4 text-center transition-all ${
                    active
                      ? "border-pause-accent bg-pause-accent-light"
                      : "border-pause-border bg-white hover:border-pause-muted-light"
                  }`}
                >
                  <Icon className={`h-6 w-6 ${active ? "text-pause-accent" : "text-pause-muted"}`} />
                  <span className="text-sm font-semibold text-pause-primary">{style.label}</span>
                  <span className="text-xs text-pause-muted">{style.description}</span>
                </button>
              );
            })}
          </div>
          <p className="mt-3 text-center text-xs text-pause-muted-light">
            This affects how interception messages sound
          </p>
        </Section>

        {/* Goals */}
        <Section title="My Goals">
          <div className="flex flex-col gap-2">
            {goals.map((goal, i) => (
              <div key={i} className="flex items-center gap-2 rounded-card border border-pause-border bg-white p-3">
                {editingGoal === i ? (
                  <input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onBlur={saveGoal}
                    onKeyDown={(e) => e.key === "Enter" && saveGoal()}
                    className="flex-1 bg-transparent text-sm text-pause-primary outline-none"
                    autoFocus
                  />
                ) : (
                  <span className="flex-1 text-sm text-pause-primary">{goal}</span>
                )}
                <button onClick={() => startEditGoal(i)} className="p-1.5 text-pause-muted hover:text-pause-accent" aria-label="Edit"><Pencil className="h-3.5 w-3.5" /></button>
                <button onClick={() => setGoals(goals.filter((_, j) => j !== i))} className="p-1.5 text-pause-muted hover:text-pause-danger" aria-label="Remove"><X className="h-3.5 w-3.5" /></button>
              </div>
            ))}
            <button
              onClick={() => { setGoals([...goals, "New goal"]); startEditGoal(goals.length); }}
              className="flex items-center justify-center gap-2 rounded-card border-2 border-dashed border-pause-border p-3 text-sm font-medium text-pause-muted hover:border-pause-accent hover:text-pause-accent"
            >
              <Plus className="h-4 w-4" /> Add Goal
            </button>
          </div>
        </Section>

        {/* My Why */}
        <Section title="My Why">
          <textarea
            value={whyText}
            onChange={(e) => setWhyText(e.target.value)}
            placeholder="When you're about to override a pause, this is what you'll see..."
            rows={3}
            className="w-full resize-none rounded-card border border-pause-border bg-white p-4 text-sm text-pause-primary placeholder-pause-muted-light outline-none focus:border-pause-accent"
          />
        </Section>

        {/* Retake */}
        <Section title="Retake Questionnaire">
          {retakeEligible ? (
            <button className="w-full rounded-btn bg-pause-accent py-3.5 text-sm font-semibold text-white shadow-md hover:brightness-110">
              See if your profile has evolved
            </button>
          ) : (
            <div className="rounded-card bg-pause-bg p-4 text-center">
              <p className="text-sm text-pause-muted">
                <span className="font-semibold">{daysUntilRetake} days</span> and{" "}
                <span className="font-semibold">{pointsUntilRetake} pts</span> remaining
              </p>
              <p className="mt-1 text-xs text-pause-muted-light">
                Complete 30 days + earn 200 pts to retake
              </p>
            </div>
          )}
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6 rounded-card bg-white p-4 shadow-sm">
      <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-pause-muted">
        {title}
      </h2>
      {children}
    </div>
  );
}
