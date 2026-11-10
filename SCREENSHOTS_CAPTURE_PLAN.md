# MediCore Clinic v1.0.0 — Official Screenshots Capture Plan

**Document Reference:** `MC-SCREEN-PLAN-2026-001`  
**System Name:** MediCore Clinic Management System  
**Commercial Version:** `1.0.0` (Production Release)  
**Date:** November 10, 2026  
**Audience:** Marketing Team, Graphic Designers, Release Managers  
**Standards:** 100% Real UI Capture Only · No External Conceptual Mockups or Fictitious Interfaces  

---

## 1. Technical Standards for Screenshot Production

To maintain authentic commercial presentation and ensure marketplace approval (Envato/CodeCanyon standards), all screenshots must be captured directly from a running instance of MediCore Clinic:

- **Target Resolution:** Standard `1920 x 1080` (Full HD, 16:9 aspect ratio) with high DPI scaling (100% browser zoom).
- **Theme & Appearance:** Clean modern browser frame (Chrome/Safari dark-slate or minimalist borderless style).
- **Data Integrity:** High-fidelity, medically realistic demonstration data (no placeholder text such as "lorem ipsum", "asdf", or "test test").
- **Language Coverage:** Minimum 10 screenshots in English (LTR) plus dedicated high-visibility screenshots showing the Arabic (RTL) experience.
- **Graphic Overlays:** Elegant floating callout badges (cyan/teal accents) highlighting key functional features for marketplace thumbnail presentations.

---

## 2. Screenshot Inventory & Execution Specifications

```
+---------------------------------------------------------------------------------------------------+
| #  | Screenshot Name          | URL Route                 | Primary Value Displayed               |
+---------------------------------------------------------------------------------------------------+
| 01 | Executive Dashboard      | /                         | Overall clinic KPI stats, queue, rev  |
| 02 | Patient Directory (MPI)  | /patients                 | Master patient list, quick search, ID |
| 03 | Comprehensive Profile    | /patients/1               | Medical timeline, allergies, history  |
| 04 | Appointment Scheduling   | /appointments             | Multi-doctor calendar, slot status    |
| 05 | Waiting Room Queue       | /waiting-room             | Sequential tickets, triage call board |
| 06 | Public TV Queue Display  | /waiting-room/display     | Fullscreen waiting room monitor UI    |
| 07 | Clinical Consultation    | /consultations/1          | SOAP notes, vitals, ICD-10, signing   |
| 08 | Dental Odontogram (FDI)  | /specialties/dental       | Interactive 32/20 tooth anatomical map|
| 09 | Ophthalmology Refraction | /specialties/ophthalmology| OD/OS optical chart, IOP tonometry    |
| 10 | Electronic Rx Printout   | /prescriptions/1/print    | Official printable A4 prescription    |
| 11 | Invoices & Billing       | /billing                  | Itemized invoice list & split payments|
| 12 | Pharmacy Stock Inventory | /inventory                | Drug catalog, batch expiry, movements |
| 13 | Database Backup Center   | /settings/backup          | One-click snapshot & restore table    |
| 14 | Arabic RTL Dashboard     | /?lang=ar                 | Native RTL layout with Tajawal font   |
+---------------------------------------------------------------------------------------------------+
```

---

## 3. Detailed Per-Screenshot Execution Guidelines

### Screenshot 01: Executive Clinical Dashboard
- **Route:** `GET /`
- **User Role:** Medical Director / Clinic Manager (`director` or `admin`)
- **Required Demo Data:**
  - KPI Stat Cards: Total Active Patients (e.g., `1,284`), Today's Appointments (`24`), Waiting Queue (`6`), Today's Revenue (`$3,450.00`).
  - Active Doctor Operatories: Dr. Sarah Jenkins (Cardiology), Dr. Ahmed Mansoor (Dental Surgery), Dr. Elena Rostova (Ophthalmology).
  - Recent Consultations Widget: 4 recently completed patient visits with status `Signed`.
- **Presentation Focus:** Clean high-density layout, dark slate sidebar, cyan active indicators, and quick action buttons (+ New Patient, + Book Slot).
- **Marketplace Caption:** *"Unified Clinic Dashboard — Real-time patient volume, active appointments, queue status, and revenue KPIs."*

---

### Screenshot 02: Master Patient Index (Directory)
- **Route:** `GET /patients`
- **User Role:** Receptionist / Doctor (`receptionist`)
- **Required Demo Data:**
  - 8 realistic patient records with distinct medical IDs:
    - `PID-20261109-0001`: Robert Vance (Male, 48) — National ID `ID-8849120` — Blood `A+` — Phone `+1 (555) 234-8901`
    - `PID-20261109-0002`: Amina Al-Hassan (Female, 34) — National ID `ID-7729104` — Blood `O+` — Severe Penicillin Allergy badge
    - `PID-20261109-0003`: Marcus Chen (Male, 12) — Pediatric profile — Blood `B+`
  - Quick Search bar populated with `"Amina"` showing instant filter response.
- **Presentation Focus:** Clear table columns, blood type badges, allergy warning flags, and quick action icons (View Profile, Book Appointment, Edit).
- **Marketplace Caption:** *"Master Patient Index — Instant demographic search, allergy warning badges, and duplicate-safe intake."*

---

### Screenshot 03: Longitudinal Patient Medical File
- **Route:** `GET /patients/1` (e.g., Robert Vance)
- **User Role:** Attending Doctor (`doctor`)
- **Required Demo Data:**
  - Demographic Summary: Photo, Age 48, Blood Type A+, Civil Registration #.
  - Active Clinical Warnings: Red badge: `"Allergic to Penicillin (Anaphylaxis)"`; Amber badge: `"Hypertension (Stage 2)"`.
  - Encounter History Timeline:
    - 2026-11-08: General Consultation (Hypertension Follow-up) — Dr. Jenkins
    - 2026-10-15: Dental Cleaning & Scaling — Dr. Mansoor
  - Attached Files: ECG trace PDF, Blood Chemistry panel lab report.
- **Presentation Focus:** Tabbed layout (Overview, Consultations, Dental Chart, Optical Refractions, Invoices, Documents).
- **Marketplace Caption:** *"360° Patient Medical File — Comprehensive longitudinal history, allergy alerts, past consultations, and invoices in one view."*

---

### Screenshot 04: Smart Appointments & Doctor Calendar
- **Route:** `GET /appointments`
- **User Role:** Receptionist / Doctor (`receptionist`)
- **Required Demo Data:**
  - Day/Week View showing scheduled slots across 3 doctor columns.
  - Color-coded appointment chips:
    - Green (`Completed`), Blue (`Scheduled`), Amber (`In Waiting Room`), Purple (`In Consultation`).
  - Active Modal: "Book New Appointment" showing doctor selection, service dropdown, and automatic collision validation status: `"Slot Available (No Conflicts)"`.
- **Presentation Focus:** Modern calendar grid, doctor operatory filters, and collision prevention badges.
- **Marketplace Caption:** *"Smart Scheduling Calendar — Multi-doctor views, appointment status tracking, and automated double-booking prevention."*

---

### Screenshot 05: Waiting Room Queue Management
- **Route:** `GET /waiting-room`
- **User Role:** Clinical Nurse / Receptionist (`nurse`)
- **Required Demo Data:**
  - Queue Table with active daily tickets:
    - Ticket `A012`: Amina Al-Hassan — Priority: `Urgent` (Red badge) — Assigned: Dr. Jenkins (Room 102) — Waiting: `8 mins` — Action: `[Call Next]`
    - Ticket `A013`: Robert Vance — Priority: `Normal` (Slate badge) — Assigned: Dr. Mansoor (Dental Suite) — Waiting: `15 mins`
    - Ticket `A014`: Marcus Chen — Priority: `Normal` — Waiting: `4 mins`
- **Presentation Focus:** Triage priority indicators, elapsed waiting timer, and one-click operatory calling controls.
- **Marketplace Caption:** *"Digital Triage & Queue Board — Sequential ticketing, urgency prioritization, and live call management."*

---

### Screenshot 06: Full-Screen Waiting Room Public Display
- **Route:** `GET /waiting-room/display`
- **Viewport:** Clean 16:9 screen simulating a clinic waiting lounge TV monitor.
- **Required Demo Data:**
  - Main Active Call Card (High-Contrast Large Display):
    - **Now Serving:** `Ticket A012`
    - **Patient:** Amina Al-Hassan
    - **Proceed to:** `Room 102 — Dr. S. Jenkins`
  - Side List: Next 4 tickets in queue with estimated wait times.
  - Clinic Branding: Clinic Logo, current time, date, and reassuring health advisory ticker.
- **Presentation Focus:** Clean, distraction-free television display designed for wall-mounted patient displays.
- **Marketplace Caption:** *"Public Lounge Display Monitor — High-contrast, full-screen waiting room board for clinic TV displays."*

---

### Screenshot 07: Clinical Consultation & SOAP Notes (EMR)
- **Route:** `GET /consultations/1`
- **User Role:** Attending Doctor (`doctor`)
- **Required Demo Data:**
  - Vitals Panel: Temp `37.1 °C`, Pulse `74 bpm`, BP `138/88 mmHg`, SpO2 `98%`, Height `178 cm`, Weight `82 kg`, BMI `25.9 kg/m²` (Overweight badge).
  - SOAP Notes Editor:
    - **S (Subjective):** Patient presents with intermittent morning headaches for past 2 weeks.
    - **O (Objective):** Alert, oriented. Heart sounds regular S1/S2. Mild bilateral pedal edema.
    - **A (Assessment):** Primary Essential Hypertension (ICD-10: `I10`).
    - **P (Plan):** Prescribe Amlodipine 5mg daily. Low-sodium diet. Repeat BP in 2 weeks.
  - Status: Signed by Dr. Sarah Jenkins with timestamp badge `"Signed & Locked: 2026-11-09 10:45 AM"`.
- **Presentation Focus:** Professional clinical documentation layout, clean typography, vitals telemetry cards, and locked security seal.
- **Marketplace Caption:** *"Clinical Encounter & EMR Charting — Structured SOAP notes, automated BMI calculation, ICD-10 coding, and tamper-proof electronic signing."*

---

### Screenshot 08: Dental Surgery (Interactive FDI Odontogram)
- **Route:** `GET /specialties/dental`
- **User Role:** Dental Surgeon (`dentist`)
- **Required Demo Data:**
  - Patient: Robert Vance (Adult Odontogram, 32 Teeth).
  - Active Tooth Mappings on FDI Visual Chart:
    - Tooth `16` (Upper Right 1st Molar): Occlusal surface highlighted in Red (`Caries`).
    - Tooth `24` (Upper Left 1st Premolar): Mesial-Occlusal highlighted in Blue (`Composite Filling`).
    - Tooth `36` (Lower Left 1st Molar): Highlighted in Gold (`Full Zirconia Crown`).
    - Tooth `48` (Lower Right 3rd Molar): Marked in Gray (`Impacted`).
  - Active Treatment Plan: 1 procedure planned (`Tooth 16: Composite Resin Restoration — $140.00`).
- **Presentation Focus:** High-resolution vector tooth anatomy, 5 anatomical surfaces per tooth, clean FDI numbering, and treatment cost linking.
- **Marketplace Caption:** *"Interactive Dental Odontogram — Full 32 adult / 20 child FDI tooth numbering with 5-surface pathology mapping and procedure pricing."*

---

### Screenshot 09: Ophthalmology & Optical Refraction
- **Route:** `GET /specialties/ophthalmology`
- **User Role:** Optometrist / Ophthalmologist (`doctor`)
- **Required Demo Data:**
  - Patient: David Miller (Age 52).
  - Refraction Chart Table:
    - **OD (Right Eye):** SPH `-2.25`, CYL `-0.75`, Axis `85°`, ADD `+1.75`, PD `31.5 mm`, Visual Acuity `20/20`.
    - **OS (Left Eye):** SPH `-2.50`, CYL `-0.50`, Axis `95°`, ADD `+1.75`, PD `32.0 mm`, Visual Acuity `20/20`.
  - Tonometry: IOP Right: `15 mmHg`, IOP Left: `16 mmHg` (Normal range).
  - Slit Lamp / Fundus: Clear cornea, cup-to-disc ratio `0.3`, no retinal microaneurysms.
- **Presentation Focus:** Specialized optometric tabular layout, optical metric notation, and instant corrective lens prescription preview.
- **Marketplace Caption:** *"Ophthalmology & Optometry Suite — Complete OD/OS optical refraction charting, IOP tonometry, and optical lens prescriptions."*

---

### Screenshot 10: Official Electronic Prescription (e-Rx)
- **Route:** `GET /prescriptions/1/print`
- **Viewport:** High-resolution printable document view simulating an A4 prescription sheet.
- **Required Demo Data:**
  - Clinic Header: MediCore Medical Plaza, Address, Phone, Doctor License #.
  - Patient Info: Robert Vance, Age 48, Date `Nov 10, 2026`.
  - Itemized Medications:
    - 1. **Amlodipine 5mg Tablet** — 1 tablet orally once daily in morning — Qty: 30 — Duration: 30 days.
    - 2. **Atorvastatin 20mg Tablet** — 1 tablet orally at bedtime — Qty: 30 — Duration: 30 days.
  - Doctor Digital Signature Block and barcode/QR verification block.
- **Presentation Focus:** Crisp, formal clinical layout ready for direct office printing or digital PDF export.
- **Marketplace Caption:** *"Official Prescription Generator — Formatted A4 printable prescriptions with dosage instructions, duration, and signature block."*

---

### Screenshot 11: Invoicing & Billing Ledger
- **Route:** `GET /billing`
- **User Role:** Financial Accountant / Receptionist (`accountant`)
- **Required Demo Data:**
  - Invoice Summary Header: Total Billed (`$18,450.00`), Collected (`$16,200.00`), Pending Balance (`$2,250.00`).
  - Invoice Table with 6 realistic records:
    - `INV-2026-0089`: Robert Vance — Total `$210.00` — Paid `$210.00` (Credit Card) — Status: `Paid` (Green badge).
    - `INV-2026-0090`: Amina Al-Hassan — Total `$380.00` — Paid `$150.00` — Balance `$230.00` (Insurance pending) — Status: `Partial` (Amber badge).
- **Presentation Focus:** Multi-currency formatting, split-payment receipt modal, and itemized invoice breakdown.
- **Marketplace Caption:** *"Invoicing & Billing Center — Itemized procedure billing, split payment receipting, and insurance balance tracking."*

---

### Screenshot 12: Pharmacy & Medical Supplies Inventory
- **Route:** `GET /inventory`
- **User Role:** Pharmacist / Inventory Manager (`pharmacist`)
- **Required Demo Data:**
  - Inventory Metrics: Total SKUs (`142`), Low Stock Alerts (`3`), Expirations < 30 Days (`2`).
  - Catalog Table:
    - `Amoxicillin 500mg (Box of 20)` — Batch `BT-9901` — Expiry: `2027-08-15` — Stock: `85 Boxes` — Status: `Normal`.
    - `Dental Composite Syringe A2` — Batch `DC-4421` — Expiry: `2026-12-05` — Stock: `4 Units` — Status: `Low Stock & Expiring Soon` (Red warning badge).
- **Presentation Focus:** Batch tracking tags, expiration warning badges, and quick stock adjustment controls.
- **Marketplace Caption:** *"Pharmacy & Supplies Inventory — Medication catalog, batch expiry tracking, and stock movement adjustments."*

---

### Screenshot 13: Integrated Database Backup & Restore Center
- **Route:** `GET /settings/backup`
- **User Role:** Super Administrator (`admin`)
- **Required Demo Data:**
  - Backup Archives Table:
    - `medicore_backup_2026-11-10_13-11-48.sqlite` — Size: `464 KB` — Created by: `Dr. Admin` — Status: `Verified`.
    - `medicore_backup_2026-11-03_02-00-01.sql` — Size: `1.2 MB` — Status: `Verified`.
  - Actions: `[Download Archive]` button and `[Restore Snapshot]` button with security confirmation dialog.
- **Presentation Focus:** Transparent data management, manual snapshot button, and clean disaster recovery controls.
- **Marketplace Caption:** *"Database Backup & Disaster Recovery — One-click full database snapshots, download, and instant browser restoration."*

---

### Screenshot 14: Native Arabic (RTL) Clinical Dashboard
- **Route:** `GET /?lang=ar`
- **User Role:** Administrator / Doctor (`admin`)
- **Required Demo Data:**
  - Full RTL mirror of Screenshot 01:
    - Sidebar mirrored to the right side with Arabic typography (`Tajawal`).
    - Navigation items: `لوحة التحكم`, `سجل المرضى`, `المواعيد`, `غرفة الانتظار`, `الاستشارات الطبية`, `الفواتير والمالية`, `المخزون والصيدلية`.
    - Stats in Arabic: `إجمالي المرضى`, `مواعيد اليوم`, `قائمة الانتظار`, `إيرادات اليوم`.
- **Presentation Focus:** Flawless right-to-left layout alignment, native Arabic font rendering, and Arabic numerals/text.
- **Marketplace Caption:** *"Native Arabic (RTL) Interface — Complete Right-to-Left layout with Tajawal typography for Arab world polyclinics."*

---

## 4. Quality Checklist for Final Asset Publishing

Before submitting screenshot assets to the marketplace:
- [ ] Every screenshot is captured at `1920x1080` without scaling artifacts.
- [ ] No browser bookmarks bars, extensions, or operating system taskbars visible.
- [ ] No placeholder names ("John Doe", "Test Test") — all names and clinical data look authentic.
- [ ] All badges and text are crisp and readable.
- [ ] Both LTR (English) and RTL (Arabic) interfaces are showcased.
