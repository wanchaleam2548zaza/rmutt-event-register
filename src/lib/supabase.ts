import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseEnv } from "./env";

let supabaseClient: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!supabaseClient) {
    const { url, anonKey } = getSupabaseEnv();
    supabaseClient = createClient(url, anonKey, {
      auth: {
        persistSession: false,
      },
    });
  }
  return supabaseClient;
}
