import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "ระบบลงทะเบียนกิจกรรม RMUTT | มทร.ธัญบุรี",
  description: "ระบบลงทะเบียนและเช็คอินกิจกรรม มหาวิทยาลัยเทคโนโลยีราชมงคลธัญบุรี (RMUTT Event Register)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased">
        {/* แถบด้านบน Top Utility Bar */}
        <div className="bg-[#091a4a] text-slate-300 text-xs py-1.5 px-4 border-b border-blue-950">
          <div className="max-w-6xl mx-auto flex flex-wrap justify-between items-center gap-2">
            <div className="flex items-center gap-4">
              <span>มหาวิทยาลัยเทคโนโลยีราชมงคลธัญบุรี (RMUTT)</span>
              <span className="hidden sm:inline text-slate-500">|</span>
              <span className="hidden sm:inline">Innovative University</span>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="https://www.rmutt.ac.th"
                target="_blank"
                rel="noreferrer"
                className="hover:text-amber-300 transition-colors"
              >
                rmutt.ac.th
              </a>
              <span className="text-slate-500">|</span>
              <a
                href="https://oreg.rmutt.ac.th"
                target="_blank"
                rel="noreferrer"
                className="hover:text-amber-300 transition-colors"
              >
                OREG
              </a>
            </div>
          </div>
        </div>

        {/* แถบเมนูหลัก Main Header */}
        <header className="bg-[#132d77] text-white shadow-md sticky top-0 z-30 border-b-2 border-[#fbaf4a]">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 hover:opacity-95 transition-opacity">
              <div className="bg-white rounded-md p-1 flex items-center justify-center shadow-sm">
                <Image
                  src="/image.png"
                  alt="RMUTT Logo"
                  width={140}
                  height={45}
                  className="object-contain h-9 w-auto"
                  priority
                />
              </div>
              <div className="hidden md:block">
                <div className="text-base font-bold tracking-tight text-white leading-tight">
                  ระบบลงทะเบียนกิจกรรม
                </div>
                <div className="text-xs text-amber-300">
                  มหาวิทยาลัยเทคโนโลยีราชมงคลธัญบุรี
                </div>
              </div>
            </Link>

            <nav className="flex items-center gap-3 sm:gap-4 text-sm font-medium">
              <Link
                href="/"
                className="px-3 py-1.5 rounded-md hover:bg-white/10 text-white transition-colors"
              >
                หน้าแรก
              </Link>
              <Link
                href="/register"
                className="px-3.5 py-1.5 rounded-md bg-[#fbaf4a] hover:bg-[#e09426] text-slate-950 font-semibold shadow transition-colors"
              >
                ลงทะเบียน
              </Link>
              <Link
                href="/admin"
                className="px-3 py-1.5 rounded-md border border-white/30 text-white hover:bg-white/10 text-xs sm:text-sm transition-colors"
              >
                สำหรับเจ้าหน้าที่
              </Link>
            </nav>
          </div>
        </header>

        {/* เนื้อหาหลัก */}
        <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>

        {/* ฟุตเตอร์ Footer & PDPA */}
        <footer className="bg-[#091a4a] text-slate-300 text-sm mt-auto border-t-2 border-[#fbaf4a]">
          <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="font-bold text-white text-base mb-2 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#fbaf4a]" />
                มหาวิทยาลัยเทคโนโลยีราชมงคลธัญบุรี
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                39 หมู่ที่ 1 ตำบลคลองหก อำเภอคลองหลวง จังหวัดปทุมธานี 12120
              </p>
              <p className="text-xs text-slate-400 mt-2">
                โทรศัพท์: 0-2549-3333 | โทรสาร: 0-2577-1157
              </p>
            </div>

            <div>
              <div className="font-semibold text-white mb-2">หน่วยงานที่เกี่ยวข้อง</div>
              <ul className="text-xs space-y-1.5 text-slate-400">
                <li>
                  <a href="https://www.rmutt.ac.th" className="hover:text-amber-300">
                    เว็บไซต์หลัก มทร.ธัญบุรี
                  </a>
                </li>
                <li>
                  <a href="https://oreg.rmutt.ac.th" className="hover:text-amber-300">
                    สำนักส่งเสริมวิชาการและงานทะเบียน (OREG)
                  </a>
                </li>
                <li>
                  <a href="https://arit.rmutt.ac.th" className="hover:text-amber-300">
                    สำนักวิทยบริการและเทคโนโลยีสารสนเทศ (ARIT)
                  </a>
                </li>
              </ul>
            </div>

            <div className="border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6">
              <div className="font-semibold text-amber-300 text-xs uppercase tracking-wider mb-2">
                นโยบายคุ้มครองข้อมูลส่วนบุคคล (PDPA)
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                ระบบนี้จัดเก็บข้อมูลเพื่อการบริหารจัดการกิจกรรมเท่านั้น
                ผู้เข้าร่วมมีสิทธิขอดู หรือขอลบข้อมูลส่วนบุคคลของตนเองได้
                โดยติดต่อผู้ดูแลระบบได้ที่อีเมล:{" "}
                <span className="text-white underline">admin@rmutt.ac.th</span>
              </p>
            </div>
          </div>

          <div className="bg-[#050e29] text-center text-xs text-slate-400 py-3 border-t border-slate-800">
            © {new Date().getFullYear()} Rajamangala University of Technology Thanyaburi. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
