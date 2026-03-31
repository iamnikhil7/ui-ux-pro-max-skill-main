"use client";

import { ArchetypeKey, ArchetypeScores, MessagingStyle, SafetyGateResponse } from "./types";

const STORAGE_KEY = "pause_user";

export interface StoredUser {
  id: string;
  assigned_archetype: ArchetypeKey | null;
  archetype_scores: ArchetypeScores | null;
  wellness_baseline: number;
  current_level: number;
  total_points: number;
  current_streak: number;
  last_win_date: string | null;
  messaging_style: MessagingStyle | null;
  user_why: string | null;
  goals: string[];
  safety_gate_response: SafetyGateResponse | null;
  questionnaire_completed: boolean;
  questionnaire_answers: Record<string, string | string[] | number>;
  open_text_responses: Record<string, string>;
}

function generateId(): string {
  return crypto.randomUUID();
}

export function getUser(): StoredUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredUser;
  } catch {
    return null;
  }
}

export function createUser(): StoredUser {
  const user: StoredUser = {
    id: generateId(),
    assigned_archetype: null,
    archetype_scores: null,
    wellness_baseline: 55,
    current_level: 1,
    total_points: 0,
    current_streak: 0,
    last_win_date: null,
    messaging_style: null,
    user_why: null,
    goals: [],
    safety_gate_response: null,
    questionnaire_completed: false,
    questionnaire_answers: {},
    open_text_responses: {},
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  return user;
}

export function updateUser(updates: Partial<StoredUser>): StoredUser {
  const current = getUser() || createUser();
  const updated = { ...current, ...updates };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function clearUser(): void {
  localStorage.removeItem(STORAGE_KEY);
}

// Wins stored separately
const WINS_KEY = "pause_wins";

export interface StoredWin {
  id: string;
  action_type: string;
  points_earned: number;
  created_at: string;
}

export function getWins(): StoredWin[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(WINS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as StoredWin[];
  } catch {
    return [];
  }
}

export function addWin(actionType: string, points: number): StoredWin {
  const wins = getWins();
  const win: StoredWin = {
    id: crypto.randomUUID(),
    action_type: actionType,
    points_earned: points,
    created_at: new Date().toISOString(),
  };
  wins.push(win);
  localStorage.setItem(WINS_KEY, JSON.stringify(wins));

  // Update user points, streak, level
  const user = getUser();
  if (user) {
    const newTotal = user.total_points + points;
    const today = new Date().toISOString().split("T")[0];
    const lastWin = user.last_win_date;
    let streak = user.current_streak;

    if (lastWin === today) {
      // Same day, streak unchanged
    } else if (lastWin) {
      const lastDate = new Date(lastWin);
      const todayDate = new Date(today);
      const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / 86400000);
      streak = diffDays === 1 ? streak + 1 : 1;
    } else {
      streak = 1;
    }

    updateUser({
      total_points: newTotal,
      current_level: Math.floor(newTotal / 50) || 1,
      current_streak: streak,
      last_win_date: today,
    });
  }
  return win;
}
