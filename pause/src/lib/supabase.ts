import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Create client only when credentials are available; otherwise use a null-safe stub
function createSupabaseClient(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseAnonKey) return null;
  return createClient(supabaseUrl, supabaseAnonKey);
}

const _client = createSupabaseClient();

// Proxy that silently no-ops when Supabase is not configured
const noopResult = { data: null, error: null };
const noopQuery = {
  select: () => noopQuery,
  insert: () => noopQuery,
  update: () => noopQuery,
  delete: () => noopQuery,
  eq: () => noopQuery,
  single: () => Promise.resolve(noopResult),
  order: () => noopQuery,
  then: (cb?: (v: typeof noopResult) => void) => {
    if (cb) cb(noopResult);
    return Promise.resolve(noopResult);
  },
};

export const supabase = _client || {
  from: () => noopQuery,
} as unknown as SupabaseClient;
