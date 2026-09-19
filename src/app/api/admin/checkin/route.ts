import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { setCheckedIn } from "@/lib/db";

export async function POST(request: NextRequest) {
  // ตรวจสิทธิ์แอดมินบรรทัดแรก
  const auth = await requireAdmin(request);
  if (!auth.authorized) {
    return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });
  }

  try {
    const { registrationId, checkedIn } = await request.json();

    if (!registrationId) {
      return NextResponse.json(
        { ok: false, error: "ระบุ ID ผู้ลงทะเบียนไม่ถูกต้อง" },
        { status: 400 }
      );
    }

    const result = await setCheckedIn(
      auth.client,
      registrationId,
      typeof checkedIn === "boolean" ? checkedIn : true
    );

    if (!result.ok) {
      return NextResponse.json(
        { ok: false, error: result.error || "ไม่สามารถอัปเดตสถานะเช็คอินได้" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: "เกิดข้อผิดพลาดในการบันทึกสถานะเช็คอิน" },
      { status: 500 }
    );
  }
}
