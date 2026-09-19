import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { getSupabaseWithAuth } from "@/lib/supabaseServer";
import { ADMIN_COOKIE_NAME } from "@/lib/adminAuth";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { ok: false, error: "กรุณากรอกอีเมลและรหัสผ่าน" },
        { status: 400 }
      );
    }

    const publicClient = getSupabase();

    // ด่าน 1: ล็อกอินผ่าน Supabase Auth
    const { data: authData, error: authError } =
      await publicClient.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

    if (authError || !authData.session) {
      return NextResponse.json(
        { ok: false, error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" },
        { status: 401 }
      );
    }

    const token = authData.session.access_token;
    const authClient = getSupabaseWithAuth(token);

    // ด่าน 2: ตรวจสอบว่าเป็นแอดมินจริงหรือไม่ (อยู่ในตาราง admins)
    const { data: isAdmin, error: adminError } = await authClient.rpc("is_admin");

    if (adminError || !isAdmin) {
      return NextResponse.json(
        {
          ok: false,
          error: "บัญชีนี้ไม่มีสิทธิ์เข้าถึงระบบผู้ดูแล (ไม่อยู่ในตาราง admins)",
        },
        { status: 403 }
      );
    }

    // ผ่านทั้ง 2 ด่าน -> บันทึก access token ใน httpOnly cookie
    const response = NextResponse.json({
      ok: true,
      user: {
        id: authData.user.id,
        email: authData.user.email,
      },
    });

    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: authData.session.expires_in || 3600,
    });

    return response;
  } catch {
    return NextResponse.json(
      { ok: false, error: "เกิดข้อผิดพลาดในการเข้าสู่ระบบ" },
      { status: 500 }
    );
  }
}
