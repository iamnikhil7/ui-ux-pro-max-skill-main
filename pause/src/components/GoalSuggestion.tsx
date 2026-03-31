"use client";

import { useState } from "react";
import { Pencil, Plus, X, ArrowRight } from "lucide-react";

const DEFAULT_GOALS = [
  "Protect your mornings \u2014 even 20 minutes before the day takes over",
  "Move your body at least once before 7pm \u2014 not for fitness, for how it makes tomorrow feel",
  "Put your phone down an hour before you sleep \u2014 you said nights are where you lose yourself",
  "Eat one meal this week that the version of you from before would recognize",
  "Spend one evening this week the way your past self would have chosen to",
  "Before you open a delivery app, ask yourself one question: is this what I actually want right now?",
];

interface Props {
  answers: Record<string, string | string[] | number>;
  onComplete: (goals: string[], userWhy: string) => void;
}

export default function GoalSuggestion({ onComplete }: Props) {
  const [goals, setGoals] = useState<string[]>(DEFAULT_GOALS.slice(0, 5));
  const [editing, setEditing] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [newGoal, setNewGoal] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [userWhy, setUserWhy] = useState("");
  const [phase, setPhase] = useState<"goals" | "why">("goals");

  const startEdit = (idx: number) => {
    setEditing(idx);
    setEditText(goals[idx]);
  };

  const saveEdit = () => {
    if (editing !== null && editText.trim()) {
      const updated = [...goals];
      updated[editing] = editText.trim();
      setGoals(updated);
    }
    setEditing(null);
    setEditText("");
  };

  const removeGoal = (idx: number) => {
    setGoals(goals.filter((_, i) => i !== idx));
  };

  const addGoal = () => {
    if (newGoal.trim()) {
      setGoals([...goals, newGoal.trim()]);
      setNewGoal("");
      setShowAdd(false);
    }
  };

  if (phase === "why") {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-xl">
          <h2 className="text-2xl font-bold mb-4">Write Your Why</h2>
          <p className="text-pause-muted mb-8 leading-relaxed">
            In your own words. When you&apos;re about to override a pause, this is what you&apos;ll see.
            Make it something that only you would write.
          </p>
          <textarea
            value={userWhy}
            onChange={(e) => setUserWhy(e.target.value)}
            placeholder="I want to change because..."
            rows={4}
            className="w-full bg-pause-card border border-pause-border rounded-xl px-4 py-3 text-pause-text placeholder:text-pause-muted/50 focus:outline-none focus:border-pause-accent resize-none mb-8"
          />
          <button
            onClick={() => onComplete(goals, userWhy)}
            className="w-full py-4 bg-pause-accent hover:bg-pause-accent-light text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
          >
            Build My Profile
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-xl">
        <h2 className="text-2xl font-bold mb-2">Your Goals</h2>
        <p className="text-pause-muted mb-8 leading-relaxed">
          These are based on what you shared. They&apos;re yours to shape &mdash; edit any of them,
          remove what doesn&apos;t fit, and add anything the app missed.
        </p>

        <div className="flex flex-col gap-3 mb-6">
          {goals.map((goal, idx) => (
            <div
              key={idx}
              className="bg-pause-card border border-pause-border rounded-xl px-5 py-4 flex items-start gap-3 group"
            >
              {editing === idx ? (
                <div className="flex-1">
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    rows={2}
                    className="w-full bg-transparent border border-pause-accent rounded-lg px-3 py-2 text-pause-text focus:outline-none resize-none"
                    autoFocus
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={saveEdit}
                      className="px-3 py-1 bg-pause-accent text-white text-sm rounded-lg"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditing(null)}
                      className="px-3 py-1 text-pause-muted text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <span className="text-pause-accent mt-0.5">&lsaquo;</span>
                  <p className="flex-1 text-sm leading-relaxed">{goal}</p>
                  <button
                    onClick={() => startEdit(idx)}
                    className="opacity-0 group-hover:opacity-100 text-pause-muted hover:text-pause-accent transition-all"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeGoal(idx)}
                    className="opacity-0 group-hover:opacity-100 text-pause-muted hover:text-red-400 transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          ))}
        </div>

        {showAdd ? (
          <div className="bg-pause-card border border-pause-border rounded-xl px-5 py-4 mb-8">
            <textarea
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              placeholder="Add your own goal..."
              rows={2}
              className="w-full bg-transparent border border-pause-accent rounded-lg px-3 py-2 text-pause-text placeholder:text-pause-muted/50 focus:outline-none resize-none"
              autoFocus
            />
            <div className="flex gap-2 mt-2">
              <button onClick={addGoal} className="px-3 py-1 bg-pause-accent text-white text-sm rounded-lg">
                Add
              </button>
              <button onClick={() => setShowAdd(false)} className="px-3 py-1 text-pause-muted text-sm">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 text-pause-accent hover:text-pause-accent-light text-sm mb-8 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add your own goal
          </button>
        )}

        <button
          onClick={() => setPhase("why")}
          className="w-full py-4 bg-pause-accent hover:bg-pause-accent-light text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
        >
          Continue
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
