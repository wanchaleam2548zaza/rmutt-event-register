import Link from "next/link";
import { getCurrentEvent, getSeatsTaken } from "@/lib/db";
import { isSupabaseConfigured } from "@/lib/env";
import { Calendar, MapPin, Users, CheckCircle2, AlertCircle } from "lucide-react";

export const dynamic = "force-dynamic";

function formatThaiDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateString;
  }
}

export default async function HomePage() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="max-w-2xl mx-auto my-12 p-8 bg-white rounded-xl shadow-md border border-amber-200">
        <div className="flex items-center gap-3 text-amber-600 mb-4">
          <AlertCircle className="w-8 h-8 flex-shrink-0" />
          <h2 className="text-xl font-bold">ระบบยังไม่ได้เชื่อมต่อฐานข้อมูล Supabase</h2>
        </div>
        <p className="text-slate-600 mb-4">
          กรุณาตั้งค่าตัวแปรในไฟล์ <code className="bg-slate-100 px-2 py-1 rounded text-red-600 font-mono">.env.local</code> โดยคัดลอกจาก Supabase Dashboard:
        </p>
        <div className="bg-slate-900 text-slate-100 p-4 rounded-lg font-mono text-xs overflow-x-auto mb-6">
          <p>NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co</p>
          <p>NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...</p>
        </div>
        <div className="text-sm text-slate-500">
          หลังจากบันทึกไฟล์แล้ว ให้รีสตาร์ทเซิร์ฟเวอร์ด้วยคำสั่ง <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono">npm run dev</code>
        </div>
      </div>
    );
  }

  const event = await getCurrentEvent();

  if (!event) {
    return (
      <div className="max-w-xl mx-auto my-16 text-center p-8 bg-white rounded-xl shadow border border-slate-200">
        <div className="w-16 h-16 bg-blue-50 text-[#132d77] rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">ยังไม่มีข้อมูลกิจกรรม</h2>
        <p className="text-slate-600 text-sm mb-6">
          กรุณารันคำสั่งในไฟล์ <code className="bg-slate-100 px-2 py-1 rounded font-mono">db/seed.sql</code> ใน Supabase SQL Editor เพื่อสร้างกิจกรรมแรก
        </p>
      </div>
    );
  }

  const seatsTaken = await getSeatsTaken(event.id);
  const seatsLeft = Math.max(0, event.capacity - seatsTaken);
  const isFull = seatsLeft <= 0;
  const percentTaken = Math.min(100, Math.round((seatsTaken / event.capacity) * 100));

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* ส่วนหัวแบนเนอร์ Hero Banner */}
      <div className="bg-gradient-to-br from-[#132d77] via-[#091a4a] to-[#040d28] rounded-2xl text-white p-6 sm:p-10 shadow-xl relative overflow-hidden border-2 border-[#fbaf4a]/30">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#fbaf4a]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fbaf4a]/20 border border-[#fbaf4a]/40 text-[#fbaf4a] text-xs font-semibold uppercase tracking-wider">
            <span>กิจกรรมอย่างเป็นทางการ</span>
            <span>•</span>
            <span>มทร.ธัญบุรี</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-snug">
            {event.name}
          </h1>

          {event.description && (
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
              {event.description}
            </p>
          )}

          <div className="pt-4 flex flex-wrap gap-4 text-xs sm:text-sm text-slate-200">
            <div className="flex items-center gap-2 bg-white/10 px-3.5 py-2 rounded-lg backdrop-blur-xs">
              <Calendar className="w-4 h-4 text-[#fbaf4a]" />
              <span>{formatThaiDate(event.event_date)}</span>
            </div>
            {event.location && (
              <div className="flex items-center gap-2 bg-white/10 px-3.5 py-2 rounded-lg backdrop-blur-xs">
                <MapPin className="w-4 h-4 text-[#fbaf4a]" />
                <span>{event.location}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* บัตรสถานะที่นั่งคงเหลือ Status & Capacity (R2) */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        <div className="space-y-1">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            จำนวนที่นั่งทั้งหมด
          </div>
          <div className="text-3xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-[#132d77]" />
            <span>{event.capacity}</span>
            <span className="text-sm font-normal text-slate-500">ที่นั่ง</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs font-medium text-slate-600">
            <span>ลงทะเบียนแล้ว {seatsTaken} ที่นั่ง</span>
            <span className={isFull ? "text-red-600 font-bold" : "text-[#132d77] font-bold"}>
              เหลือ {seatsLeft} ที่นั่ง
            </span>
          </div>
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                isFull ? "bg-red-500" : percentTaken > 80 ? "bg-amber-500" : "bg-[#132d77]"
              }`}
              style={{ width: `${percentTaken}%` }}
            />
          </div>
        </div>

        <div className="flex justify-end">
          {isFull ? (
            <div className="w-full sm:w-auto text-center px-6 py-3 bg-slate-100 text-slate-500 rounded-lg font-medium border border-slate-200 cursor-not-allowed">
              ขออภัย ที่นั่งเต็มแล้ว (ปิดรับสมัคร)
            </div>
          ) : (
            <Link
              href="/register"
              className="w-full sm:w-auto text-center px-8 py-3.5 bg-[#fbaf4a] hover:bg-[#e09426] text-slate-950 font-bold rounded-lg shadow-md hover:shadow-lg transition-all transform active:scale-95"
            >
              ลงทะเบียนเข้าร่วมงาน →
            </Link>
          )}
        </div>
      </div>

      {/* ข้อมูลการเตรียมตัวเข้าร่วม */}
      <div className="bg-slate-100/70 rounded-xl p-6 border border-slate-200">
        <h3 className="text-base font-bold text-slate-800 mb-3 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          ขั้นตอนการลงทะเบียนและเข้าร่วมกิจกรรม
        </h3>
        <ol className="list-decimal list-inside text-sm text-slate-600 space-y-2">
          <li>กรอกข้อมูลในแบบฟอร์มลงทะเบียนออนไลน์ให้ครบถ้วน</li>
          <li>รับรหัสลงทะเบียน (Ticket Code) หลังส่งข้อมูลสำเร็จ</li>
          <li>แสดงรหัสลงทะเบียนต่อเจ้าหน้าที่หน้าห้องสัมมนาเพื่อเช็คอิน</li>
        </ol>
      </div>
    </div>
  );
}
