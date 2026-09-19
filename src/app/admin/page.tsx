"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Lock,
  Search,
  Download,
  CheckCircle,
  XCircle,
  LogOut,
  RefreshCw,
  Users,
  UserCheck,
  UserX,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { RegistrationRow, EventRow } from "@/lib/types";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);

  const [event, setEvent] = useState<EventRow | null>(null);
  const [registrations, setRegistrations] = useState<RegistrationRow[]>([]);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchRegistrations = useCallback(async () => {
    setFetchLoading(true);
    try {
      const res = await fetch("/api/admin/registrations");
      if (res.status === 401 || res.status === 403) {
        setIsAuthenticated(false);
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setEvent(data.event);
        setRegistrations(data.registrations || []);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch {
      setIsAuthenticated(false);
    } finally {
      setFetchLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRegistrations();
  }, [fetchRegistrations]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoginLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        setLoginError(data.error || "เข้าสู่ระบบไม่สำเร็จ");
        return;
      }

      setIsAuthenticated(true);
      fetchRegistrations();
    } catch {
      setLoginError("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } finally {
      setIsAuthenticated(false);
      setRegistrations([]);
    }
  };

  const handleToggleCheckin = async (row: RegistrationRow) => {
    setUpdatingId(row.id);
    const newStatus = !row.checked_in;

    try {
      const res = await fetch("/api/admin/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          registrationId: row.id,
          checkedIn: newStatus,
        }),
      });

      if (res.ok) {
        setRegistrations((prev) =>
          prev.map((item) =>
            item.id === row.id ? { ...item, checked_in: newStatus } : item
          )
        );
      }
    } catch {
      // Error handling
    } finally {
      setUpdatingId(null);
    }
  };

  // กรองรายการตามคำค้นหา (ชื่อ, อีเมล, รหัสตั๋ว) ไม่สนตัวพิมพ์เล็ก-ใหญ่
  const filteredRegistrations = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return registrations;

    return registrations.filter((r) => {
      const nameMatch = r.full_name?.toLowerCase().includes(q);
      const emailMatch = r.email?.toLowerCase().includes(q);
      const ticketMatch = r.ticket_code?.toLowerCase().includes(q);
      const phoneMatch = r.phone?.includes(q);
      const facultyMatch = r.faculty?.toLowerCase().includes(q);
      return nameMatch || emailMatch || ticketMatch || phoneMatch || facultyMatch;
    });
  }, [registrations, searchQuery]);

  const stats = useMemo(() => {
    const total = registrations.length;
    const checked = registrations.filter((r) => r.checked_in).length;
    const pending = total - checked;
    return { total, checked, pending };
  }, [registrations]);

  // ส่งออก CSV โดยใช้ BOM ป้องกันภาษาไทยเพี้ยน และ format เบอร์โทร
  const handleExportCSV = () => {
    if (filteredRegistrations.length === 0) return;

    const headers = [
      "รหัสลงทะเบียน",
      "ชื่อ-นามสกุล",
      "อีเมล",
      "เบอร์โทรศัพท์",
      "คณะ/หน่วยงาน",
      "ขนาดเสื้อ",
      "สถานะเช็คอิน",
      "เวลาลงทะเบียน",
    ];

    // ฟังก์ชันป้องกัน Formula Injection และ format สำหรับ Excel
    const escapeCSV = (value: string | null | undefined): string => {
      if (value === null || value === undefined) return '""';
      let str = String(value).trim();
      // ป้องกัน CSV Injection
      if (/^[=+\-@\t\r]/.test(str)) {
        str = `'${str}`;
      }
      return `"${str.replace(/"/g, '""')}"`;
    };

    const rows = filteredRegistrations.map((r) => [
      escapeCSV(r.ticket_code),
      escapeCSV(r.full_name),
      escapeCSV(r.email),
      `"=""${r.phone}"""`, // บังคับให้ Excel มองเป็นข้อความเพื่อไม่ให้เลข 0 หาย
      escapeCSV(r.faculty || "-"),
      escapeCSV(r.shirt_size || "-"),
      escapeCSV(r.checked_in ? "เช็คอินแล้ว" : "ยังไม่เช็คอิน"),
      escapeCSV(new Date(r.created_at).toLocaleString("th-TH")),
    ]);

    // เติม UTF-8 BOM (\uFEFF) นำหน้าไฟล์
    const csvContent =
      "\uFEFF" +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\r\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `rmutt_registrations_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // กำลังตรวจสิทธิ์เริ่มต้น
  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center my-24 text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin text-[#132d77]" />
        <span className="ml-3 text-sm">กำลังตรวจสอบสิทธิ์...</span>
      </div>
    );
  }

  // หากยังไม่เข้าสู่ระบบ แสดงฟอร์มล็อกอิน
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="bg-[#132d77] text-white p-6 text-center border-b-4 border-[#fbaf4a]">
          <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
            <Lock className="w-6 h-6 text-[#fbaf4a]" />
          </div>
          <h1 className="text-xl font-bold">เข้าสู่ระบบผู้ดูแลกิจกรรม</h1>
          <p className="text-xs text-slate-200 mt-1">
            เฉพาะบัญชีแอดมินที่ได้รับสิทธิ์เท่านั้น
          </p>
        </div>

        <form onSubmit={handleLogin} className="p-6 sm:p-8 space-y-5">
          {loginError && (
            <div className="flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs leading-relaxed">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{loginError}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wider">
              อีเมลผู้ดูแล
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@rmutt.ac.th"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#132d77] text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wider">
              รหัสผ่าน
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#132d77] text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loginLoading}
            className="w-full py-3 bg-[#132d77] hover:bg-[#091a4a] text-white font-bold rounded-lg shadow transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-sm cursor-pointer"
          >
            {loginLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>กำลังเข้าสู่ระบบ...</span>
              </>
            ) : (
              <span>เข้าสู่ระบบ</span>
            )}
          </button>
        </form>
      </div>
    );
  }

  // หน้าจอหลักของแอดมิน
  return (
    <div className="space-y-6">
      {/* แถบด้านบนของแอดมิน */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-slate-200 flex flex-wrap justify-between items-center gap-4">
        <div>
          <span className="text-xs font-semibold text-[#132d77] uppercase tracking-wider block">
            ระบบจัดการผู้เข้าร่วมงาน
          </span>
          <h1 className="text-lg sm:text-2xl font-bold text-slate-800">
            {event?.name || "RMUTT Event Register"}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchRegistrations()}
            disabled={fetchLoading}
            title="รีเฟรชข้อมูล"
            className="p-2 text-slate-600 hover:text-[#132d77] hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${fetchLoading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg border border-red-200 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>ออกจากระบบ</span>
          </button>
        </div>
      </div>

      {/* สรุปสถิติ 3 กล่อง */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-blue-50 text-[#132d77] flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">ผู้ลงทะเบียนทั้งหมด</div>
            <div className="text-2xl font-bold text-slate-800">{stats.total} คน</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">เช็คอินหน้างานแล้ว</div>
            <div className="text-2xl font-bold text-emerald-600">{stats.checked} คน</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <UserX className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">ยังไม่เช็คอิน</div>
            <div className="text-2xl font-bold text-amber-600">{stats.pending} คน</div>
          </div>
        </div>
      </div>

      {/* แถบค้นหาและปุ่มส่งออก CSV */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap gap-3 justify-between items-center">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ค้นหาชื่อ, อีเมล, รหัสตั๋ว หรือเบอร์โทร..."
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#132d77]"
          />
        </div>

        <button
          onClick={handleExportCSV}
          disabled={filteredRegistrations.length === 0}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>ส่งออก CSV ({filteredRegistrations.length})</span>
        </button>
      </div>

      {/* ตารางผู้ลงทะเบียน */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">สถานะ</th>
                <th className="py-3.5 px-4">รหัสลงทะเบียน</th>
                <th className="py-3.5 px-4">ชื่อ - นามสกุล</th>
                <th className="py-3.5 px-4">อีเมล / เบอร์โทร</th>
                <th className="py-3.5 px-4">คณะ/หน่วยงาน</th>
                <th className="py-3.5 px-4">เสื้อ</th>
                <th className="py-3.5 px-4 text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRegistrations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    ไม่พบข้อมูลผู้ลงทะเบียน
                  </td>
                </tr>
              ) : (
                filteredRegistrations.map((row) => (
                  <tr
                    key={row.id}
                    className={`hover:bg-slate-50 transition-colors ${
                      row.checked_in ? "bg-emerald-50/30" : ""
                    }`}
                  >
                    <td className="py-3.5 px-4">
                      {row.checked_in ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>มาแล้ว</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>ยังไม่มา</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-[#132d77]">
                      {row.ticket_code}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-900">
                      {row.full_name}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 space-y-0.5">
                      <div>{row.email}</div>
                      <div className="text-xs text-slate-400">{row.phone}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {row.faculty || "-"}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {row.shirt_size || "-"}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleToggleCheckin(row)}
                        disabled={updatingId === row.id}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          row.checked_in
                            ? "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300"
                            : "bg-[#132d77] hover:bg-[#091a4a] text-white shadow-xs"
                        }`}
                      >
                        {updatingId === row.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin mx-auto" />
                        ) : row.checked_in ? (
                          "ยกเลิกเช็คอิน"
                        ) : (
                          "เช็คอิน"
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
