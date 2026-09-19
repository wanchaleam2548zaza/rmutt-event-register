import { SupabaseClient, User } from "@supabase/supabase-js";
import { getSupabaseWithAuth } from "./supabaseServer";

export const ADMIN_COOKIE_NAME = "sb_admin_token";

export interface AdminAuthSuccess {
  authorized: true;
  user: User;
  client: SupabaseClient;
}

export interface AdminAuthFailure {
  authorized: false;
  status: 401 | 403;
  error: string;
}

export type AdminAuthResult = AdminAuthSuccess | AdminAuthFailure;

function extractTokenFromRequest(request: Request): string | null {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(";").map((c) => c.trim());
  const targetPrefix = `${ADMIN_COOKIE_NAME}=`;
  const found = cookies.find((c) => c.startsWith(targetPrefix));

  if (!found) return null;
  return decodeURIComponent(found.substring(targetPrefix.length));
}

export async function requireAdmin(request: Request): Promise<AdminAuthResult> {
  const token = extractTokenFromRequest(request);

  if (!token) {
    return {
      authorized: false,
      status: 401,
      error: "กรุณาเข้าสู่ระบบก่อน",
    };
  }

  const client = getSupabaseWithAuth(token);

  // ด่าน 1: Token ถูกต้องและยังไม่หมดอายุ (Supabase Auth ตอบ)
  const {
    data: { user },
    error: userError,
  } = await client.auth.getUser(token);

  if (userError || !user) {
    return {
      authorized: false,
      status: 401,
      error: "Session หมดอายุหรือไม่ถูกต้อง กรุณาเข้าสู่ระบบใหม่",
    };
  }

  // ด่าน 2: ผู้ใช้อยู่ในตาราง admins จริงหรือไม่ (ฟังก์ชัน is_admin ตอบ)
  const { data: isAdmin, error: adminError } = await client.rpc("is_admin");

  if (adminError || !isAdmin) {
    return {
      authorized: false,
      status: 403,
      error: "บัญชีนี้ไม่มีสิทธิ์เข้าถึงระบบผู้ดูแล (ไม่อยู่ในตาราง admins)",
    };
  }

  return {
    authorized: true,
    user,
    client,
  };
}
