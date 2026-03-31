"use client";

import { supabase } from "./supabase";
import { ArchetypeKey, ArchetypeScores, MessagingStyle, SafetyGateResponse } from "./types";

const STORAGE_KEY = "pause_user";
const WINS_KEY = "pause_wins";

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

export interface StoredWin {
  id: string;
  action_type: string;
  points_earned: number;
  created_at: string;
}

// --- Local cache helpers ---

function cacheUser(user: StoredUser) {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  }
}

function getCachedUser(): StoredUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredUser;
  } catch {
    return null;
  }
}

function cacheWins(wins: StoredWin[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(WINS_KEY, JSON.stringify(wins));
  }
}

function getCachedWins(): StoredWin[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(WINS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as StoredWin[];
  } catch {
    return [];
  }
}

// --- Supabase operations ---

function isSupabaseConfigured(): boolean {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

// --- Public API (sync reads from cache, async writes to Supabase) ---

export function getUser(): StoredUser | null {
  return getCachedUser();
}

export function createUser(): StoredUser {
  const user: StoredUser = {
    id: crypto.randomUUID(),
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
  cacheUser(user);

  // Fire-and-forget: persist to Supabase
  if (isSupabaseConfigured()) {
    supabase.from("users").insert({
      id: user.id,
      safety_gate_response: user.safety_gate_response,
    }).then();
  }

  return user;
}

export function updateUser(updates: Partial<StoredUser>): StoredUser {
  const current = getCachedUser() || createUser();
  const updated = { ...current, ...updates };
  cacheUser(updated);

  // Fire-and-forget: sync to Supabase
  if (isSupabaseConfigured()) {
    const dbPayload: Record<string, unknown> = {};
    if (updates.assigned_archetype !== undefined) dbPayload.assigned_archetype = updates.assigned_archetype;
    if (updates.archetype_scores !== undefined) dbPayload.archetype_scores = updates.archetype_scores;
    if (updates.wellness_baseline !== undefined) dbPayload.wellness_baseline = updates.wellness_baseline;
    if (updates.current_level !== undefined) dbPayload.current_level = updates.current_level;
    if (updates.total_points !== undefined) dbPayload.total_points = updates.total_points;
    if (updates.current_streak !== undefined) dbPayload.current_streak = updates.current_streak;
    if (updates.last_win_date !== undefined) dbPayload.last_win_date = updates.last_win_date;
    if (updates.messaging_style !== undefined) dbPayload.messaging_style = updates.messaging_style;
    if (updates.user_why !== undefined) dbPayload.user_why = updates.user_why;
    if (updates.goals !== undefined) dbPayload.goals = updates.goals;
    if (updates.safety_gate_response !== undefined) dbPayload.safety_gate_response = updates.safety_gate_response;
    if (updates.questionnaire_completed !== undefined) dbPayload.questionnaire_completed = updates.questionnaire_completed;
    if (updates.questionnaire_answers !== undefined) dbPayload.questionnaire_answers = updates.questionnaire_answers;
    if (updates.open_text_responses !== undefined) dbPayload.open_text_responses = updates.open_text_responses;

    if (Object.keys(dbPayload).length > 0) {
      supabase.from("users").update(dbPayload).eq("id", updated.id).then();
    }
  }

  return updated;
}

export function clearUser(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(WINS_KEY);
  }
}

export function getWins(): StoredWin[] {
  return getCachedWins();
}

export function addWin(actionType: string, points: number): StoredWin {
  const wins = getCachedWins();
  const user = getCachedUser();
  const win: StoredWin = {
    id: crypto.randomUUID(),
    action_type: actionType,
    points_earned: points,
    created_at: new Date().toISOString(),
  };
  wins.push(win);
  cacheWins(wins);

  // Update user points, streak, level
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

  // Fire-and-forget: persist win to Supabase
  if (isSupabaseConfigured() && user) {
    supabase.from("wins").insert({
      id: win.id,
      user_id: user.id,
      action_type: win.action_type,
      points_earned: win.points_earned,
    }).then();
  }

  return win;
}

// Load user from Supabase by ID (for returning sessions)
export async function loadUserFromSupabase(userId: string): Promise<StoredUser | null> {
  if (!isSupabaseConfigured()) return null;

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error || !data) return null;

  const user: StoredUser = {
    id: data.id,
    assigned_archetype: data.assigned_archetype,
    archetype_scores: data.archetype_scores || null,
    wellness_baseline: data.wellness_baseline || 55,
    current_level: data.current_level || 1,
    total_points: data.total_points || 0,
    current_streak: data.current_streak || 0,
    last_win_date: data.last_win_date || null,
    messaging_style: data.messaging_style || null,
    user_why: data.user_why || null,
    goals: data.goals || [],
    safety_gate_response: data.safety_gate_response || null,
    questionnaire_completed: data.questionnaire_completed || false,
    questionnaire_answers: data.questionnaire_answers || {},
    open_text_responses: data.open_text_responses || {},
  };

  cacheUser(user);
  return user;
}

// Load wins from Supabase
export async function loadWinsFromSupabase(userId: string): Promise<StoredWin[]> {
  if (!isSupabaseConfigured()) return [];

  const { data, error } = await supabase
    .from("wins")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (error || !data) return [];

  const wins: StoredWin[] = data.map((w) => ({
    id: w.id,
    action_type: w.action_type,
    points_earned: w.points_earned,
    created_at: w.created_at,
  }));

  cacheWins(wins);
  return wins;
}
