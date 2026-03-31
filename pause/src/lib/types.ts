export type ArchetypeKey =
  | "burnt_out"
  | "former_athlete"
  | "overwhelmed_parent"
  | "social_butterfly"
  | "night_owl"
  | "emotional_eater"
  | "serial_starter"
  | "mindless_grazer"
  | "perfectionist_quitter"
  | "mindful_aspirant";

export type MessagingStyle = "Tough Love" | "Data-Driven" | "Gentle Nudge" | "Balanced";

export type SafetyGateResponse = "ok" | "sensitive";

export type QuestionType = "open_text" | "choice" | "multi_select" | "slider";

export interface QuestionOption {
  key: string;
  label: string;
}

export interface Question {
  id: string;
  section: number;
  sectionTitle: string;
  text: string;
  type: QuestionType;
  options?: QuestionOption[];
  placeholder?: string;
  sliderMin?: number;
  sliderMax?: number;
  sliderMinLabel?: string;
  sliderMaxLabel?: string;
  maxLength?: number;
}

export interface ArchetypeScores {
  burnt_out: number;
  former_athlete: number;
  overwhelmed_parent: number;
  social_butterfly: number;
  night_owl: number;
  emotional_eater: number;
  serial_starter: number;
  mindless_grazer: number;
  perfectionist_quitter: number;
  mindful_aspirant: number;
}

export interface Archetype {
  key: ArchetypeKey;
  name: string;
  description: string;
  wellnessBaseline: number;
  traits: string[];
  triggerPoints: string[];
  avatarColor: string;
  avatarBg: string;
}

export interface UserProfile {
  id: string;
  assigned_archetype: ArchetypeKey | null;
  archetype_scores: ArchetypeScores;
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

export type WinActionType =
  | "closed_app"
  | "chose_water"
  | "worked_out"
  | "cancelled_order"
  | "healthy_swap"
  | "resisted_craving"
  | "box_breathing"
  | "mindful_moment"
  | "decision_sprint";

export interface Win {
  id: string;
  user_id: string;
  action_type: WinActionType;
  points_earned: number;
  created_at: string;
}

export const WIN_POINTS: Record<WinActionType, number> = {
  closed_app: 8,
  chose_water: 5,
  worked_out: 10,
  cancelled_order: 12,
  healthy_swap: 8,
  resisted_craving: 10,
  box_breathing: 5,
  mindful_moment: 5,
  decision_sprint: 3,
};

export const LEVEL_MILESTONES = [
  { level: 1, name: "Awakening", minPoints: 0 },
  { level: 2, name: "Noticing", minPoints: 50 },
  { level: 3, name: "Shifting", minPoints: 100 },
  { level: 4, name: "Building", minPoints: 150 },
  { level: 5, name: "Thriving", minPoints: 250 },
  { level: 6, name: "Evolving", minPoints: 400 },
];

export function getLevel(totalPoints: number) {
  let current = LEVEL_MILESTONES[0];
  for (const milestone of LEVEL_MILESTONES) {
    if (totalPoints >= milestone.minPoints) current = milestone;
    else break;
  }
  const nextIdx = LEVEL_MILESTONES.findIndex((m) => m.level === current.level) + 1;
  const next = LEVEL_MILESTONES[nextIdx] || null;
  const progressInLevel = next
    ? totalPoints - current.minPoints
    : totalPoints - current.minPoints;
  const pointsForNext = next
    ? next.minPoints - current.minPoints
    : 50;
  return { ...current, progress: progressInLevel, needed: pointsForNext, next };
}
