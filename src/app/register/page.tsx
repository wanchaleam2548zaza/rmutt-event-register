"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CheckCircle2, AlertCircle, Copy, Check, ArrowLeft, Loader2 } from "lucide-react";

const RMUTT_FACULTIES = [
  "คณะวิศวกรรมศาสตร์",
  "คณะบริหารธุรกิจ",
  "คณะเทคโนโลยีคหกรรมศาสตร์",
  "คณะศิลปกรรมศาสตร์",
  "คณะเทคโนโลยีการเกษตร",
  "คณะครุศาสตร์อุตสาหกรรม",
  "คณะวิทยาศาสตร์และเทคโนโลยี",
  "คณะเทคโนโลยีสื่อสารมวลชน",
  "คณะศิลปศาสตร์",
  "คณะสถาปัตยกรรมศาสตร์",
  "คณะการแพทย์บูรณาการ",
  "คณะพยาบาลศาสตร์",
  "วิทยาลัยการแพทย์แผนไทย",
  "หน่วยงานภายนอก / บุคคลทั่วไป",
];

const SHIRT_SIZES = ["S (36\")", "M (38\")", "L (40\")", "XL (42\")", "2XL (44\")", "3XL (46\")"];

export default function RegisterPage() {
  const [eventId, setEventId] = useState<string>("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [faculty, setFaculty] = useState("");
  const [shirtSize, setShirtSize] = useState("");
  const [consent, setConsent] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [ticketCode, setTicketCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // ดึง ID กิจกรรมล่าสุด
    async function loadEvent() {
      try {
        const res = await fetch("/api/register");
        if (res.ok) {
          const data = await res.json();
          if (data.event?.id) {
            setEventId(data.event.id);
          }
        }
      } catch {
        // หากดึงไม่สำเร็จ ให้ผู้ใช้ลองรีเฟรช
      }
    }
    loadEvent();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // R3 — ตรวจความถูกต้องของฟอร์มฝั่ง Client
    if (!fullName.trim()) {
      setErrorMessage("กรุณากรอกชื่อ-นามสกุล");
      return;
    }

    const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!emailPattern.test(email.trim())) {
      setErrorMessage("รูปแบบอีเมลไม่ถูกต้อง");
      return;
    }

    const phonePattern = /^[0-9]{10}$/;
    if (!phonePattern.test(phone.trim())) {
      setErrorMessage("เบอร์โทรศัพท์ต้องเป็นตัวเลข 10 หลักพอดี");
      return;
    }

    if (!consent) {
      setErrorMessage("กรุณายอมรับเงื่อนไขการเก็บข้อมูลส่วนบุคคลก่อนลงทะเบียน");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId,
          fullName: fullName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          faculty: faculty.trim() || undefined,
          shirtSize: shirtSize || undefined,
          consent,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.ok) {
        setErrorMessage(result.error || "การลงทะเบียนไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
        setLoading(false);
        return;
      }

      setTicketCode(result.ticketCode);
    } catch {
      setErrorMessage("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์ กรุณาลองใหม่");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!ticketCode) return;
    navigator.clipboard.writeText(ticketCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (ticketCode) {
    return (
      <div className="max-w-lg mx-auto my-8 p-8 bg-white rounded-2xl shadow-xl border-2 border-emerald-500/30 text-center space-y-6">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-800">ลงทะเบียนสำเร็จ!</h2>
          <p className="text-slate-600 text-sm">
            บันทึกข้อมูลเข้าระบบเรียบร้อยแล้ว กรุณาเก็บรหัสลงทะเบียนนี้ไว้แสดงหน้างาน
          </p>
        </div>

        <div className="bg-slate-50 border-2 border-dashed border-[#132d77]/40 rounded-xl p-6">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest block mb-1">
            รหัสลงทะเบียน (TICKET CODE)
          </span>
          <div className="text-3xl font-mono font-extrabold text-[#132d77] tracking-wider my-2">
            {ticketCode}
          </div>
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 mt-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-medium rounded-md transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "คัดลอกเรียบร้อย" : "คัดลอกรหัส"}</span>
          </button>
        </div>

        <div className="text-xs text-slate-500 space-y-1">
          <p>ชื่อผู้ลงทะเบียน: <span className="font-semibold text-slate-700">{fullName}</span></p>
          <p>อีเมล: <span className="font-semibold text-slate-700">{email}</span></p>
        </div>

        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#132d77] hover:text-[#091a4a]"
          >
            <ArrowLeft className="w-4 h-4" />
            กลับหน้าแรก
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto my-6 bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
      <div className="bg-[#132d77] text-white p-6 border-b-4 border-[#fbaf4a]">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-slate-200 hover:text-white mb-2">
          <ArrowLeft className="w-3.5 h-3.5" />
          ย้อนกลับหน้าแรก
        </Link>
        <h1 className="text-xl sm:text-2xl font-bold">แบบฟอร์มลงทะเบียนกิจกรรม</h1>
        <p className="text-xs sm:text-sm text-slate-200 mt-1">
          มหาวิทยาลัยเทคโนโลยีราชมงคลธัญบุรี (RMUTT)
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
        {errorMessage && (
          <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>{errorMessage}</div>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              ชื่อ - นามสกุล <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="นายสมชาย ใจดี"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#132d77] focus:border-transparent text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                อีเมล <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@rmutt.ac.th"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#132d77] focus:border-transparent text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                เบอร์โทรศัพท์ (10 หลัก) <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                required
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                placeholder="0812345678"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#132d77] focus:border-transparent text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                คณะ / หน่วยงาน
              </label>
              <select
                value={faculty}
                onChange={(e) => setFaculty(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#132d77] focus:border-transparent text-sm bg-white"
              >
                <option value="">-- กรุณาเลือกคณะ/หน่วยงาน --</option>
                {RMUTT_FACULTIES.map((fac) => (
                  <option key={fac} value={fac}>
                    {fac}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                ขนาดเสื้อที่ระลึก
              </label>
              <select
                value={shirtSize}
                onChange={(e) => setShirtSize(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#132d77] focus:border-transparent text-sm bg-white"
              >
                <option value="">-- กรุณาเลือกขนาดเสื้อ --</option>
                {SHIRT_SIZES.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* กล่องข้อตกลง PDPA */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 text-xs text-slate-600">
          <div className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#fbaf4a]" />
            ข้อตกลงการคุ้มครองข้อมูลส่วนบุคคล (PDPA)
          </div>
          <p className="leading-relaxed">
            ข้าพเจ้ายินยอมให้มหาวิทยาลัยเทคโนโลยีราชมงคลธัญบุรี จัดเก็บและใช้ข้อมูลส่วนบุคคล
            ได้แก่ ชื่อ-นามสกุล อีเมล เบอร์โทรศัพท์ และข้อมูลสังกัด เพื่อใช้ในการจัดเตรียมที่นั่ง
            เช็คอินเข้าร่วมกิจกรรม และติดต่อประสานงานเท่านั้น
          </p>
          <label className="flex items-start gap-2.5 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#132d77] focus:ring-[#132d77]"
            />
            <span className="text-slate-800 font-medium">
              ข้าพเจ้าเข้าใจและยอมรับเงื่อนไขการเก็บข้อมูลส่วนบุคคล <span className="text-red-500">*</span>
            </span>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 px-4 bg-[#fbaf4a] hover:bg-[#e09426] text-slate-950 font-bold rounded-lg shadow transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-base cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>กำลังบันทึกข้อมูล...</span>
            </>
          ) : (
            <span>ยืนยันการลงทะเบียน</span>
          )}
        </button>
      </form>
    </div>
  );
}
