export type Mood = "happy" | "chill" | "fired-up" | "dreamy" | "zen" | "bold";

export interface Profile {
  id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface VibeCard {
  id: string;
  user_id: string;
  photo_url: string | null;
  mood: Mood;
  message: string | null;
  background_color: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export const MOOD_CONFIG: Record<
  Mood,
  { label: string; color: string; gradient: string }
> = {
  happy: {
    label: "Happy",
    color: "#FDE68A",
    gradient: "from-amber-200 to-yellow-300",
  },
  chill: {
    label: "Chill",
    color: "#BAE6FD",
    gradient: "from-sky-200 to-blue-300",
  },
  "fired-up": {
    label: "Fired Up",
    color: "#FCA5A5",
    gradient: "from-red-200 to-rose-300",
  },
  dreamy: {
    label: "Dreamy",
    color: "#C4B5FD",
    gradient: "from-violet-200 to-purple-300",
  },
  zen: {
    label: "Zen",
    color: "#BBF7D0",
    gradient: "from-green-200 to-emerald-300",
  },
  bold: {
    label: "Bold",
    color: "#FBCFE8",
    gradient: "from-pink-200 to-fuchsia-300",
  },
};
