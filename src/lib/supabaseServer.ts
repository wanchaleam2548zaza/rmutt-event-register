import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseEnv } from "./env";

// Client ที่สวมสิทธิ์ผู้ใช้งาน/แอดมินที่ล็อกอินแล้ว โดยส่ง Access Token เข้ามา
// ห้ามใช้ service role key โดยเด็ดขาด ใช้คีย์สาธารณะเดิมร่วมกับ JWT Bearer token
export function getSupabaseWithAuth(accessToken: string): SupabaseClient {
  const { url, anonKey } = getSupabaseEnv();

  return createClient(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  });
}
