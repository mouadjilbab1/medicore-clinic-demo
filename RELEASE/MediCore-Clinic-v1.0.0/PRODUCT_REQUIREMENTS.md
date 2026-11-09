# MediCore Clinic Management System
## Product Requirements Document (PRD)

---

### 1. Product Vision & Scope
MediCore Clinic Management System is an end-to-end medical practice management software designed to serve solo practitioners, group practices, specialized polyclinics, and multi-branch healthcare centers. The system replaces disconnected tools (paper charts, separate billing spreadsheets, isolated appointment books) with an integrated clinical operating system.

---

### 2. User Personas & Roles

| Role | Responsibilities | Key Needs |
|---|---|---|
| **System Administrator** | Server setup, backups, updates, audit log inspection, technical settings. | Unrestricted configuration, reliable maintenance tools, system logs. |
| **Clinic Owner / Director** | Practice oversight, revenue analysis, doctor performance, strategic reports. | Executive dashboard, P&L reports, physician commission tracking. |
| **Clinic Manager** | Day-to-day operations, scheduling rules, inventory threshold approvals. | Operational overview, staff schedules, branch allocation. |
| **Doctor / Specialist** | Consultations, clinical notes, diagnosis (ICD-10), treatment plans, prescriptions. | Fast documentation, specialty charts (Dental, Eye, etc.), patient history. |
| **Dentist** | Odontogram charting, periodontal scoring, multi-stage dental procedures. | Interactive FDI tooth map, surface-level condition records. |
| **Receptionist / Frontdesk** | Patient intake, scheduling, waiting room check-in, cashier collection. | Rapid patient lookup, quick appointment booking, queue caller. |
| **Nurse / Medical Assistant** | Triage, vital signs recording, sample collection, dressing/injection execution. | Clear queue list, rapid vitals entry, clinical alerts. |
| **Accountant / Cashier** | Invoicing, payments, refunds, cash register close-out, expense tracking. | Strict audit log, receipt printing, daily closing reconciliation. |
| **Pharmacist / Dispensary** | Prescription fulfillment, inventory stock control, batch & expiry check. | Quick prescription lookup, stock deduction, minimum stock alerts. |
| **Lab / Imaging Technician** | Diagnostic test execution, report authoring, attachment upload. | Request queue, normal range verification, printable reports. |
| **Patient (Portal)** | Book appointments, view approved lab reports, download prescriptions & bills. | Secure PIN/Password login, mobile responsiveness, simple interface. |

---

### 3. Functional Requirements by Module

#### 3.1 Patient Management
- **FR-PAT-001:** Unique Patient Identification Number generated with configurable clinic prefix (e.g., `PAT-2026-0001`).
- **FR-PAT-002:** Comprehensive demographic capture: Full Name (multilingual), National ID / Passport, DOB, Gender, Phone, Email, Address, Emergency Contact.
- **FR-PAT-003:** Baseline medical baseline: Blood group, known drug allergies (with visual high-priority badges), chronic conditions, current long-term medications, surgical history, family history.
- **FR-PAT-004:** Duplicate patient detection matching on phone number, email, or national ID with side-by-side comparison.
- **FR-PAT-005:** Safe Patient Merge workflow allowing consolidation of duplicate records into a master profile with immutable audit trail.
- **FR-PAT-006:** Patient Timeline combining appointments, vitals, consultations, lab results, prescriptions, and billing transactions chronologically.

#### 3.2 Appointment Scheduling & Smart Conflict Prevention
- **FR-APT-001:** Calendar views: Day, Week, Month, and Doctor Resource Grid.
- **FR-APT-002:** Strict Conflict Prevention: System prevents double-booking the same doctor at overlapping times, unless explicitly overridden by authorized manager with an emergency reason.
- **FR-APT-003:** Room & Equipment Resource Conflict Prevention: Rooms cannot be scheduled for two concurrent procedures.
- **FR-APT-004:** Appointment Status Lifecycle: `Scheduled` -> `Confirmed` -> `Arrived / Checked In` -> `In Consultation` -> `Completed` / `Cancelled` / `No Show`.
- **FR-APT-005:** Configurable appointment slots per doctor (e.g., 15m, 20m, 30m, 45m, 60m).
- **FR-APT-006:** Waiting list queue allowing receptionist to assign cancelled slots to waiting patients.

#### 3.3 Waiting Room & Real-Time Queue
- **FR-QUE-001:** Automatic queue ticket assignment upon patient check-in at reception.
- **FR-QUE-002:** Priority triage flags: `Normal`, `Urgent`, `Emergency`, `Elderly / Special Needs`.
- **FR-QUE-003:** Live Doctor Queue Dashboard allowing the physician to view waiting patients and click "Call Next Patient".
- **FR-QUE-004:** Waiting room public screen view (sound notification chime, queue number display, assigned room number).
- **FR-QUE-005:** Transfer patient to another doctor or diagnostic station (Lab, X-Ray) without losing queue context.

#### 3.4 Electronic Medical Records & Consultations
- **FR-EMR-001:** Structured clinical notes: Chief Complaint, History of Present Illness (HPI), Review of Systems (ROS), Physical Examination, Vital Signs (BP, Heart Rate, Respiratory Rate, Temp, SpO2, BMI calculation).
- **FR-EMR-002:** Diagnosis coding with searchable ICD-10 database and custom clinic diagnosis library.
- **FR-EMR-003:** Clinical note signing: Drafts can be updated; once finalized and signed by the doctor, notes become read-only.
- **FR-EMR-004:** Addendum / Revision workflow: Any corrections to finalized notes require a formal Addendum with reason, author, and timestamp.
- **FR-EMR-005:** Integrated prescription, lab request, and document generation directly inside the consultation screen.

#### 3.5 Specialty Modules
- **FR-SPC-001 (Dental):** Interactive SVG Odontogram supporting FDI two-digit tooth notation (Adult teeth 11-48, Pediatric deciduous teeth 51-85). Five surfaces per tooth (Occlusal/Incisal, Mesial, Distal, Buccal/Labial, Lingual/Palatal). Interactive condition assignment: Healthy, Caries, Filled, Crown, Root Canal, Missing, Extracted, Implant, Bridge. Multi-stage dental treatment planning with tooth-specific pricing.
- **FR-SPC-002 (Ophthalmology):** Visual acuity examination (Right Eye OD, Left Eye OS), Refraction measurements (Sphere SPH, Cylinder CYL, Axis, Addition ADD, Pupillary Distance PD, Intraocular Pressure IOP). Automated Glasses Prescription generator.
- **FR-SPC-003 (Dermatology):** Interactive anatomical body map to pinpoint lesion locations, capture skin condition type, clinical photography storage, before/after session comparison.
- **FR-SPC-004 (Cardiology):** Cardiac vitals capture, ECG strip file attachment, Echocardiography measurement summaries.
- **FR-SPC-005 (Pediatrics):** Growth charts tracking Height, Weight, and Head Circumference plotted against standard WHO Growth Standards (percentiles). Vaccination tracking schedule with due date reminders.
- **FR-SPC-006 (Physiotherapy):** Visual pain scale (VAS 0-10), Range of Motion (ROM) assessment by joint/spine, treatment session goals, home exercise prescription.
- **FR-SPC-007 (Form Builder):** No-code specialty form builder allowing clinics to create specialized assessment sheets (e.g. Gynecology, ENT, Orthopedics) with 14 field types, validation rules, and versioning.

#### 3.6 Invoicing, Cashier & Financial Control
- **FR-FIN-001:** Itemized invoicing with line-item discounts, consultation charges, procedure fees, medications, and lab tests.
- **FR-FIN-002:** Support for partial payments, split payment methods (e.g. 50% Cash, 50% Card), and insurance co-pay splits.
- **FR-FIN-003:** Daily Cash Register closing (Cash Drawer balance reconciliation at end of shift with cashier discrepancy report).
- **FR-FIN-004:** Formal Credit Notes and Refund authorizations with audit rationale. Invoices cannot be hard-deleted from database.
- **FR-FIN-005:** Doctor commission calculation (percentage-based or fixed fee per consultation/procedure).

#### 3.7 Inventory & Pharmacy
- **FR-INV-001:** Product catalog categorized by medications, consumables, equipment, and dental/surgical supplies.
- **FR-INV-002:** Stock movement tracking (Stock In, Stock Out, Consumption in Consultation, Expiry disposal, Inventory audit adjustment).
- **FR-INV-003:** Expiration date tracking and Batch/Lot number management.
- **FR-INV-004:** Automated low-stock alerts when quantity drops below configured reorder threshold.

#### 3.8 Laboratory & Diagnostic Imaging
- **FR-LAB-001:** Catalog of laboratory tests with normal reference ranges by age and gender.
- **FR-LAB-002:** Lab sample status lifecycle: `Ordered` -> `Sample Collected` -> `In Analysis` -> `Results Ready` -> `Approved by Pathologist`.
- **FR-IMG-001:** Imaging modalities support: X-Ray, Ultrasound, CT Scan, MRI, Mammography.
- **FR-IMG-002:** Attachment viewer for PNG, JPG, PDF, and medical scans, with zoom and pan tools.

#### 3.9 Multi-Branch Operations
- **FR-BRN-001:** Creation of multiple clinic branches with branch-specific addresses, telephone numbers, and operating schedules.
- **FR-BRN-002:** Assignment of doctors, receptionists, rooms, and inventory warehouses to specific branches.
- **FR-BRN-003:** Branch switcher in top navigation for authorized managers; strict branch scoping for location-bound staff.

#### 3.10 Patient Portal
- **FR-POR-001:** Secure patient login using Patient ID / Email / Phone and secure password.
- **FR-POR-002:** Patient can view upcoming appointments, request new appointments, view signed prescriptions, download invoices, and view authorized lab results.
- **FR-POR-003:** Doctor private clinical notes, internal staff comments, and draft records are strictly blocked from patient portal views.

#### 3.11 Installation Wizard
- **FR-INS-001:** Web-based setup at `/install` when the system is not yet configured.
- **FR-INS-002:** Prerequisites check (PHP version >= 8.2, PDO, OpenSSL, Mbstring, Fileinfo, writable `storage/` and `bootstrap/cache/`).
- **FR-INS-003:** Database setup with live connection verification, running migrations and default seeders.
- **FR-INS-004:** Administrator initial account setup and clinic profile configuration (Name, Currency, Timezone, Language).
- **FR-INS-005:** Wizard lockdown mechanism upon completion (creating an immutable lock file preventing unauthorized reinstallation).

---

### 4. Non-Functional Requirements (NFR)

1. **Security & Privacy:**
   - Passwords hashed using bcrypt / Argon2id.
   - Medical documents stored in private non-public disk partitions; served exclusively via signed, authenticated authorization gates.
   - Granular RBAC with backend Policy authorization checks on every endpoint.
   - Session timeout, CSRF token validation on every mutating request, SQL injection prevention via Eloquent ORM parameterized queries.
2. **Performance & Scalability:**
   - Fast page loads (< 400ms for standard views) via Inertia.js single-page application protocol.
   - Database queries optimized with appropriate compound indexes (`patient_id`, `doctor_id`, `branch_id`, `appointment_date`, `status`).
3. **Accessibility & Usability:**
   - Fully responsive layout adapting from 4K medical monitors to tablets and mobile phones.
   - First-class RTL (Right-to-Left) typography and layout for Arabic, alongside seamless LTR for French and English.
   - High-contrast clinical indicators for allergy warnings and emergency triage.
