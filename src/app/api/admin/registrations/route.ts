import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { getCurrentEvent, listRegistrations } from "@/lib/db";

export async function GET(request: NextRequest) {
  // ด่านตรวจสิทธิ์แอดมินบรรทัดแรก
  const auth = await requireAdmin(request);
  if (!auth.authorized) {
    return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });
  }

  try {
    const event = await getCurrentEvent();
    if (!event) {
      return NextResponse.json({ ok: false, error: "ไม่พบกิจกรรม" }, { status: 404 });
    }

    const registrations = await listRegistrations(auth.client, event.id);

    return NextResponse.json({
      ok: true,
      event,
      registrations,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "เกิดข้อผิดพลาดในการดึงข้อมูลผู้ลงทะเบียน" },
      { status: 500 }
    );
  }
}
