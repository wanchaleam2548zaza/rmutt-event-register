---
name: rmuttskill
description: Complete design system, brand identity, layout architecture, and component standards for Rajamangala University of Technology Thanyaburi (RMUTT - มหาวิทยาลัยเทคโนโลยีราชมงคลธัญบุรี) website templates and web applications.
license: MIT
---

# RMUTT Web Design System & Template Skill (rmuttskill)

This skill provides comprehensive instructions, design tokens, layout specifications, and reusable code patterns for creating websites, portals, and digital services adhering to the official branding and web design standards of **Rajamangala University of Technology Thanyaburi (RMUTT - มหาวิทยาลัยเทคโนโลยีราชมงคลธัญบุรี)**.

---

## 1. Brand Identity & Overview

- **Institution:** Rajamangala University of Technology Thanyaburi (มทร.ธัญบุรี / RMUTT)
- **Identity:** Innovative University (มหาวิทยาลัยนวัตกรรม) focusing on hands-on graduates, innovators, and entrepreneurs.
- **Emblem:** Royal Phra Maha Phichai Mongkut with the divine lotus flower (บัวสวรรค์).
- **Official Portal:** `https://www.rmutt.ac.th/`
- **Official Address:** 39 หมู่ที่ 1 ตำบลคลองหก อำเภอคลองหลวง จังหวัดปทุมธานี 12120

---

## 2. Color Palette & Design Tokens

RMUTT uses a distinctive royal blue and gold palette representing prestige, technological excellence, and royal heritage.

```css
:root {
  /* Brand Primary Colors */
  --rmutt-blue-primary: #132d77;      /* Deep Royal Navy (Header & Brand) */
  --rmutt-blue-dark: #091a4a;         /* Dark Navy for footer and accents */
  --rmutt-blue-medium: #213b7c;       /* Secondary Navy */
  --rmutt-blue-accent: #0095eb;       /* Vibrant Sky/Cyan Blue */
  --rmutt-blue-hover: #007cc3;        /* Hover state for links & buttons */
  
  /* Brand Gold / Warm Accents (Lotus Gold) */
  --rmutt-gold: #fbaf4a;              /* Official Warm Gold */
  --rmutt-gold-dark: #e09426;         /* Dark Gold for borders & text */
  --rmutt-gold-light: #fff3df;        /* Soft gold tint for highlights */
  
  /* Neutral Palette */
  --rmutt-bg: #ffffff;                /* Main surface background */
  --rmutt-bg-alt: #f4f6f9;            /* Light gray background for sections */
  --rmutt-bg-subtle: #eaedf2;         /* Borders & dividers */
  --rmutt-text-dark: #1e293b;         /* Primary text */
  --rmutt-text-muted: #64748b;        /* Secondary/Metadata text */
  --rmutt-text-light: #ffffff;        /* White text for dark headers */
  
  /* Status Colors */
  --rmutt-success: #10b981;
  --rmutt-danger: #ef4444;
  --rmutt-warning: #f59e0b;
  
  /* Typography */
  --rmutt-font-thai: 'Prompt', 'Kanit', 'Noto Sans Thai', 'Sarabun', -apple-system, sans-serif;
  --rmutt-font-sans: 'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif;
  
  /* Border Radius & Elevation */
  --rmutt-radius-sm: 4px;
  --rmutt-radius-md: 8px;
  --rmutt-radius-lg: 16px;
  --rmutt-shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.05);
  --rmutt-shadow-md: 0 4px 12px rgba(19, 45, 119, 0.08);
  --rmutt-shadow-lg: 0 10px 30px rgba(19, 45, 119, 0.12);
}
```

---

## 3. Typography Standards

1. **Headings:**
   - Display & Hero: `Prompt` or `Kanit` (Weight: 600 or 700), Line height 1.25.
   - Section Titles: 1.75rem – 2.25rem, deep royal blue (`#132d77`) with subtle gold border underline or gold accent badge.
2. **Body Text:**
   - `Prompt` or `Sarabun`, Font size 0.95rem – 1rem, Line height 1.6 – 1.7 for high readability in Thai script.
3. **Labels & Metadata:**
   - Font size 0.8rem – 0.85rem, Color `--rmutt-text-muted`.

---

## 4. Layout Architecture (The RMUTT Anatomy)

An authentic RMUTT template consists of the following hierarchical structure:

```
+-----------------------------------------------------------------------+
| 1. Top Utility Bar (Audience links: Personnel, Alumni, Library, Lang) |
+-----------------------------------------------------------------------+
| 2. Main Header (Official RMUTT Logo + Title + Search Bar + Main Menu)  |
+-----------------------------------------------------------------------+
| 3. Hero Carousel / High-Impact Banner Slider                          |
+-----------------------------------------------------------------------+
| 4. Quick e-Services (OREG, Admissions, Email, WiFi, Library, ITA)     |
+-----------------------------------------------------------------------+
| 5. News & Announcements (Tabs: PR, Admissions, Procurement, Events)   |
+-----------------------------------------------------------------------+
| 6. Faculties & Academic Divisions Grid (12 Faculties + 1 College)     |
+-----------------------------------------------------------------------+
| 7. Virtual Tour / Media & Video Highlights                            |
+-----------------------------------------------------------------------+
| 8. Official University Footer (Address, Contact, OREG info, Map)     |
+-----------------------------------------------------------------------+
```

### 4.1. Top Utility Bar
Targeted toward specific audience groups and utility actions:
- บุคลากร (Personnel)
- ศิษย์เก่า (Alumni)
- ห้องสมุด (Library - library.rmutt.ac.th)
- คณะ/หน่วยงาน (Faculties & Divisions)
- ประชาสัมพันธ์ (PR News)
- บริการสังคม (USR)
- การประเมินคุณธรรมและความโปร่งใส (ITA)
- FAQ & ติดต่อเรา (Contact)
- RMUTT VR Tour (vr.rmutt.ac.th)
- Language Toggle: TH | EN

### 4.2. Main Navigation Bar
- **หน้าแรก** (Home)
- **เกี่ยวกับเรา** (About Us)
  - ประวัติความเป็นมา (History)
  - วิสัยทัศน์และพันธกิจ (Vision & Mission)
  - โครงสร้างส่วนราชการ (Organization Structure)
  - ทำเนียบผู้บริหาร (University Executives)
- **หลักสูตรการศึกษา** (Academics / Programs)
  - ปริญญาตรี (Undergraduate)
  - บัณฑิตศึกษา (Graduate Studies)
  - หลักสูตรนานาชาติ (International Programs)
- **การรับสมัครนักศึกษา** (Admissions / TCAS)
- **วิจัยและนวัตกรรม** (Research & Innovation)
- **บริการนักศึกษา** (Student Services / OREG)
- **ติดต่อเรา** (Contact Us)

### 4.3. Quick Access e-Services (6-Card Grid)
1. **ระบบรับสมัครนักศึกษา (Admissions TCAS):** ข้อมูลรอบโควตา MOU และสอบตรง
2. **สำนักส่งเสริมวิชาการและงานทะเบียน (OREG):** ตารางเรียน ผลการเรียน ลงทะเบียนเรียน
3. **ระบบ E-Mail & WiFi:** บริการ Office 365, Google Workspace, RMUTT-WiFi
4. **สำนักวิทยบริการฯ (Library):** บริการสืบค้นหนังสือ วารสาร และฐานข้อมูลวิจัยออนไลน์
5. **ปฏิทินการศึกษา (Academic Calendar):** กำหนดการเปิด-ปิดภาคเรียน และวันสำคัญ
6. **ระบบการประเมิน ITA:** รายงานความโปร่งใสและธรรมาภิบาลของมหาวิทยาลัย

### 4.4. 12 Faculties & College Directory
1. คณะวิศวกรรมศาสตร์ (Faculty of Engineering)
2. คณะบริหารธุรกิจ (Faculty of Business Administration)
3. คณะเทคโนโลยีคหกรรมศาสตร์ (Faculty of Home Economics Technology)
4. คณะศิลปกรรมศาสตร์ (Faculty of Fine and Applied Arts)
5. คณะเทคโนโลยีการเกษตร (Faculty of Agricultural Technology)
6. คณะครุศาสตร์อุตสาหกรรม (Faculty of Technical Education)
7. คณะวิทยาศาสตร์และเทคโนโลยี (Faculty of Science and Technology)
8. คณะเทคโนโลยีสื่อสารมวลชน (Faculty of Mass Communication Technology)
9. คณะศิลปศาสตร์ (Faculty of Liberal Arts)
10. คณะสถาปัตยกรรมศาสตร์ (Faculty of Architecture)
11. คณะการแพทย์บูรณาการ (Faculty of Integrative Medicine)
12. คณะพยาบาลศาสตร์ (Faculty of Nursing)
13. วิทยาลัยการแพทย์แผนไทย (College of Thai Traditional Medicine)

---

## 5. Official Assets & URLs

- **Logo Image:** `https://www.rmutt.ac.th/wp-content/uploads/2020/03/20200310-LOGO-RMUTT.png`
- **Fallback Vector Logo:** Employs the Royal Lotus Crown silhouette in `#fbaf4a` on `#132d77`.
- **Primary Domain:** `rmutt.ac.th`
- **Student Registration Portal (OREG):** `oreg.rmutt.ac.th`
- **Virtual Reality Tour:** `vr.rmutt.ac.th`
- **Library System:** `library.rmutt.ac.th`

---

## 6. Official Footer Requirements (ITA Compliance)

Every RMUTT page footer must contain the verified contact and organizational details:
- **Created & Maintained by:** ฝ่ายพัฒนาและเผยแพร่เว็บไซต์ สำนักวิทยบริการและเทคโนโลยีสารสนเทศ มหาวิทยาลัยเทคโนโลยีราชมงคลธัญบุรี
- **Address:** 39 หมู่ที่ 1 ตำบลคลองหก อำเภอคลองหลวง จังหวัดปทุมธานี 12120
- **Academic & Registration (OREG):** Facebook: `@oregrmutt`, E-mail: `oreg@rmutt.ac.th`
- **Public Relations (PR):** E-mail: `rmutt_news@rmutt.ac.th`
- **Web Development Team:** Facebook: `@WeblogRMUTT`

---

## 7. Implementation Checklist

When building a template or page for RMUTT:
- [x] Use RMUTT Royal Blue (`#132d77`) as primary header and gold (`#fbaf4a`) as accent.
- [x] Include the Top Utility Bar with links for บุคลากร, ศิษย์เก่า, คณะ, and ITA.
- [x] Implement responsive navigation with a clean mobile drawer.
- [x] Embed Quick Access e-Service shortcuts with accessible icons.
- [x] Provide tabbed news categorization (ประชาสัมพันธ์, การศึกษา, จัดซื้อจัดจ้าง).
- [x] Display the complete directory of faculties with official Thai and English names.
- [x] Ensure 100% responsive design across smartphone, tablet, and desktop viewports.
- [x] Adhere to government accessibility guidelines (ITA & WCAG 2.1 AA).
