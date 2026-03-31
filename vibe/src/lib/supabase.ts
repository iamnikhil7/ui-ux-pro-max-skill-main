import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- Vibe Cards ---

export async function getPublicVibeCards(limit = 20) {
  return supabase
    .from("vibe_cards")
    .select("*, profiles(display_name, username, avatar_url)")
    .eq("is_public", true)
    .order("created_at", { ascending: false })
    .limit(limit);
}

export async function getUserVibeCards(userId: string) {
  return supabase
    .from("vibe_cards")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
}

export async function createVibeCard(card: {
  user_id: string;
  mood: string;
  message?: string;
  photo_url?: string;
  background_color?: string;
  is_public?: boolean;
}) {
  return supabase.from("vibe_cards").insert(card).select().single();
}

export async function deleteVibeCard(id: string) {
  return supabase.from("vibe_cards").delete().eq("id", id);
}

// --- Photo Upload ---

export async function uploadVibePhoto(userId: string, file: File) {
  const fileExt = file.name.split(".").pop();
  const filePath = `${userId}/${Date.now()}.${fileExt}`;

  const { error } = await supabase.storage
    .from("vibe-photos")
    .upload(filePath, file);

  if (error) return { data: null, error };

  const {
    data: { publicUrl },
  } = supabase.storage.from("vibe-photos").getPublicUrl(filePath);

  return { data: { url: publicUrl }, error: null };
}

// --- Auth Helpers ---

export async function signInWithGoogle() {
  return supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${window.location.origin}/` },
  });
}

export async function signOut() {
  return supabase.auth.signOut();
}

export async function getCurrentUser() {
  return supabase.auth.getUser();
}
