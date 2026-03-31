"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getUser, updateUser, StoredUser } from "@/lib/store";
import { MessagingStyle, WIN_POINTS } from "@/lib/types";
import { APP_INTERCEPTIONS, getStyledMessage } from "@/lib/interceptions";
import InterceptionModal from "@/components/InterceptionModal";
import { ArrowLeft, Pencil, RotateCcw } from "lucide-react";

const MESSAGING_STYLES: MessagingStyle[] = ["Tough Love", "Data-Driven", "Gentle Nudge", "Balanced"];

interface AppToggle {
  app: string;
  category: "TRIGGER" | "WATCH" | "SAFE";
  active: boolean;
}

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<StoredUser | null>(null);
  const [apps, setApps] = useState<AppToggle[]>([]);
  const [editingGoals, setEditingGoals] = useState(false);
  const [goals, setGoals] = useState<string[]>([]);
  const [editingWhy, setEditingWhy] = useState(false);
  const [userWhy, setUserWhy] = useState("");
  const [testModal, setTestModal] = useState<{ app: string; message: string } | null>(null);

  const refresh = useCallback(() => {
    const u = getUser();
    if (!u || !u.questionnaire_completed) {
      router.push("/questionnaire");
      return;
    }
    setUser(u);
    setGoals(u.goals || []);
    setUserWhy(u.user_why || "");
    setApps(
      APP_INTERCEPTIONS.map((a) => ({
        app: a.app,
        category: a.category,
        active: a.defaultActive,
      }))
    );
  }, [router]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const toggleApp = (idx: number) => {
    setApps((prev) => prev.map((a, i) => (i === idx ? { ...a, active: !a.active } : a)));
  };

  const saveGoals = () => {
    updateUser({ goals });
    setEditingGoals(false);
  };

  const saveWhy = () => {
    updateUser({ user_why: userWhy });
    setEditingWhy(false);
  };

  const changeMessaging = (style: MessagingStyle) => {
    updateUser({ messaging_style: style });
    setUser((u) => (u ? { ...u, messaging_style: style } : u));
  };

  const testApp = (appToggle: AppToggle) => {
    if (!user?.messaging_style) return;
    const interception = APP_INTERCEPTIONS.find((a) => a.app === appToggle.app);
    if (!interception?.baseMessage) return;
    const message = getStyledMessage(interception.baseMessage, user.messaging_style, appToggle.app);
    setTestModal({ app: appToggle.app, message });
  };

  if (!user || !user.assigned_archetype) return null;

  const categoryColors = { TRIGGER: "text-red-400", WATCH: "text-yellow-400", SAFE: "text-green-400" };

  return (
    <div className="min-h-screen pb-20">
      <header className="sticky top-0 z-10 bg-pause-darker/90 backdrop-blur-sm border-b border-pause-border px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <button onClick={() => router.push("/dashboard")} className="text-pause-muted hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-bold text-lg">Settings</h1>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-8 space-y-8">
        {/* Messaging Style */}
        <div>
          <h2 className="text-sm font-medium text-pause-muted uppercase tracking-wider mb-3">
            Messaging Style
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {MESSAGING_STYLES.map((style) => (
              <button
                key={style}
                onClick={() => changeMessaging(style)}
                className={`px-4 py-3 rounded-xl text-sm font-medium border transition-all ${
                  user.messaging_style === style
                    ? "bg-pause-accent/15 border-pause-accent text-white"
                    : "bg-pause-card border-pause-border text-pause-muted hover:border-pause-accent/40"
                }`}
              >
                {style}
              </button>
            ))}
          </div>
        </div>

        {/* App Monitoring */}
        <div>
          <h2 className="text-sm font-medium text-pause-muted uppercase tracking-wider mb-3">
            App Monitoring
          </h2>
          <div className="flex flex-col gap-2">
            {apps.map((app, idx) => (
              <div
                key={app.app}
                className="flex items-center justify-between bg-pause-card border border-pause-border rounded-xl px-5 py-3"
              >
                <div className="flex items-center gap-3">
                  <span className="font-medium text-sm">{app.app}</span>
                  <span className={`text-xs font-medium ${categoryColors[app.category]}`}>
                    {app.category}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {app.active && app.category !== "SAFE" && (
                    <button
                      onClick={() => testApp(app)}
                      className="text-xs text-pause-accent hover:text-pause-accent-light"
                    >
                      TEST
                    </button>
                  )}
                  <button
                    onClick={() => toggleApp(idx)}
                    className={`w-11 h-6 rounded-full transition-all relative ${
                      app.active ? "bg-pause-accent" : "bg-pause-border"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${
                        app.active ? "left-5.5" : "left-0.5"
                      }`}
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Goals */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-pause-muted uppercase tracking-wider">
              Your Goals
            </h2>
            <button
              onClick={() => (editingGoals ? saveGoals() : setEditingGoals(true))}
              className="text-pause-accent text-sm flex items-center gap-1"
            >
              <Pencil className="w-3.5 h-3.5" />
              {editingGoals ? "Save" : "Edit"}
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {goals.map((goal, i) =>
              editingGoals ? (
                <textarea
                  key={i}
                  value={goal}
                  onChange={(e) => {
                    const updated = [...goals];
                    updated[i] = e.target.value;
                    setGoals(updated);
                  }}
                  rows={2}
                  className="w-full bg-pause-card border border-pause-accent rounded-xl px-4 py-3 text-sm text-pause-text focus:outline-none resize-none"
                />
              ) : (
                <div key={i} className="bg-pause-card border border-pause-border rounded-xl px-5 py-3">
                  <p className="text-sm">{goal}</p>
                </div>
              )
            )}
          </div>
        </div>

        {/* My Why */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-pause-muted uppercase tracking-wider">
              My Why
            </h2>
            <button
              onClick={() => (editingWhy ? saveWhy() : setEditingWhy(true))}
              className="text-pause-accent text-sm flex items-center gap-1"
            >
              <Pencil className="w-3.5 h-3.5" />
              {editingWhy ? "Save" : "Edit"}
            </button>
          </div>
          {editingWhy ? (
            <textarea
              value={userWhy}
              onChange={(e) => setUserWhy(e.target.value)}
              rows={3}
              className="w-full bg-pause-card border border-pause-accent rounded-xl px-4 py-3 text-sm text-pause-text focus:outline-none resize-none"
            />
          ) : (
            <div className="bg-pause-accent/10 border border-pause-accent/20 rounded-xl p-5">
              <p className="italic text-sm">{userWhy || "No why written yet"}</p>
            </div>
          )}
        </div>

        {/* Retake Questionnaire */}
        <button
          onClick={() => {
            localStorage.removeItem("pause_user");
            localStorage.removeItem("pause_wins");
            router.push("/questionnaire");
          }}
          className="w-full py-3 bg-pause-card border border-pause-border hover:border-red-400/40 rounded-xl text-sm text-pause-muted hover:text-red-400 transition-all flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Retake Questionnaire
        </button>
      </div>

      {/* Test Modal */}
      {testModal && user.assigned_archetype && (
        <InterceptionModal
          appName={testModal.app}
          message={testModal.message}
          userWhy={user.user_why}
          archetypeKey={user.assigned_archetype}
          onPause={() => setTestModal(null)}
          onContinue={() => setTestModal(null)}
        />
      )}
    </div>
  );
}
