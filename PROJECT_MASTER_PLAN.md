# MediCore Clinic Management System
## Master Architecture & Project Master Plan

---

### 1. Executive Summary
**MediCore Clinic Management System** is an enterprise-grade, self-hosted, multi-specialty clinical and practice management software designed for independent medical clinics, multi-specialty centers, and multi-branch healthcare practices.

#### Business & Operational Model
- **Self-Hosted Delivery:** 100% self-hosted on client infrastructure (cPanel, Cloud VPS, dedicated Linux/Windows servers, or containerized environments).
- **One-Time Purchase / Perpetual License:** Complete source code ownership, zero forced recurring subscriptions, zero remote license validation kill-switches, and zero external cloud dependencies for core medical functions.
- **Data Sovereignty & Independence:** Each clinic maintains its own isolated database, private local file storage for electronic health records (EHR) and medical imaging, with zero telemetry or unconsented external data transfer.
- **Multi-Branch Support:** Single clinic installation can manage multiple physical locations, satellite clinics, departments, and consultation rooms with granular location-based access control.

---

### 2. High-Level System Architecture

```
+---------------------------------------------------------------------------------------+
|                                    CLIENT TIER                                        |
|  React 18+ / TypeScript / Inertia.js / Vite / Tailwind CSS / Lucide Icons / Recharts  |
|  - Reception / Frontdesk Desk Interface       - Patient Self-Service Portal           |
|  - Doctor / Specialist Clinical Workspace    - Dental FDI Odontogram Interactive SVG  |
|  - Laboratory & Imaging Diagnostic Hub       - Ophthalmology / Dermatology Canvases   |
|  - Pharmacy & Inventory Management Desk      - Billing, Cashier & Financial Reports   |
+---------------------------------------------------------------------------------------+
                                           |
                                  HTTPS / Inertia Protocol / REST API
                                           |
+---------------------------------------------------------------------------------------+
|                                APPLICATION SERVER TIER                                |
|                             PHP 8.2+ / 8.3 & Laravel Core                             |
|  - HTTP Kernel, Routing & Sanctum Auth        - Form Requests & Validation Rules      |
|  - Role-Based Access Control (Policies/Gates) - Audit Logging & Clinical Integrity    |
|  - Medical Workflow & Scheduling Engine       - Multi-Specialty Form Builder Engine   |
|  - Notification & Automated Recall Queues     - Local Encrypted Document Storage      |
+---------------------------------------------------------------------------------------+
                                           |
                    PDO / SQL Database Connection (MySQL 8+ / SQLite)
                                           |
+---------------------------------------------------------------------------------------+
|                                     DATA TIER                                         |
|  - Relational Schema with Foreign Keys, Composite Indexes & Referential Integrity     |
|  - Immutable Clinical Audit Logs (Old/New Values, Author, Timestamp, IP)              |
|  - Soft-Delete Archive for Compliance & Restoration                                   |
|  - Local File Vault (Encrypted Prescriptions, Lab Results, DICOM/Images, Invoices)    |
+---------------------------------------------------------------------------------------+
```

---

### 3. Core Architectural Principles

1. **Enterprise Reliability & No Mock Data:** All screens, statistics, charts, tables, and workflows are directly backed by database queries and transactions.
2. **Clinical Data Integrity & Legal Audit Trail:** Clinical notes, diagnoses, and medical prescriptions undergo formal doctor sign-off. Once finalized, records cannot be destructively overwritten; modifications create revision snapshots with logged clinical justifications.
3. **Double-Booking & Conflict Prevention:** Real-time checking on doctor availability, working schedules, room reservations, and patient appointment clashes.
4. **Offline & Self-Contained First:** Works without mandatory internet access. External integrations (SMS, WhatsApp, SMTP, Payment Gateways, DICOM PACS, AI assistance) are modular adapters with graceful fallbacks.
5. **Multilingual & Bidirectional UI:** Native support for Arabic (RTL with `direction: rtl`), French (LTR), and English (LTR). Language preferences are persistent per-user and per-clinic.
6. **Regulatory Compliance Readiness:** Designed to adhere to global privacy frameworks (HIPAA data isolation, GDPR principles) and Moroccan Law 09-08 / CNDP health data requirements.

---

### 4. Implementation Phasing Strategy

- **Phase 1:** System Foundation, Laravel + Inertia + React setup, Tailwind, Database Engine.
- **Phase 2:** Authentication, RBAC (14 distinct roles), Multi-branch, Clinic Profile.
- **Phase 3:** Patient Management (Registry, Allergies, History, Document Vault, Merging, Duplicates).
- **Phase 4:** Doctor Directory, Schedules, Shift Management, Fees, Room Assignments.
- **Phase 5:** Appointments Scheduling Engine, Calendar (Daily/Weekly/Monthly), Conflict Prevention.
- **Phase 6:** Waiting Room Live Queue System, Calling screen, Doctor hand-off.
- **Phase 7:** Electronic Medical Records (EMR), Consultation Desk, ICD-10 Diagnosis, Vital Signs.
- **Phase 8:** Specialty Medical Engines:
  - Interactive FDI Dental Odontogram (Primary & Permanent teeth, 5 surfaces, condition mapping).
  - Ophthalmology Vision Examination (OD/OS, Refraction, IOP, Visual Acuity, Glasses Prescription).
  - Dermatology Body Mapping & Lesion Tracking.
  - Cardiology Diagnostic Records (BP, ECG, Echo).
  - Pediatrics Growth Tracker (WHO Percentiles for Height, Weight, Head Circumference).
  - Physiotherapy ROM, Pain VAS, Mobility, Session Plans.
  - Extensible Specialty Form Builder for any custom clinical branch.
- **Phase 9:** Prescriptions Management, Templates, Drug Instructions, PDF Generation.
- **Phase 10:** Invoicing, Cashier, Multi-Payment Methods, Partial Payments, Discounts, Tax rules.
- **Phase 11:** Accounting, Financial Closing, Doctor Commissions, P&L Reports.
- **Phase 12:** Inventory, Stock Movements, Expiry & Batch Tracking, Minimum Stock Warnings.
- **Phase 13:** Laboratory & Diagnostic Imaging Management, Reference Ranges, Workflow Approvals.
- **Phase 14:** Staff Management, Attendance, Leaves, Tasks.
- **Phase 15:** Insurance Management, Policy Limits, Claim Generation & Status.
- **Phase 16:** CRM, Recalls, Communication Logs, Follow-ups.
- **Phase 17:** Patient Portal (Self-Service Appointments, Prescriptions, Receipts).
- **Phase 18:** Document Generator (Sick leaves, Referrals, Medical Certificates with Signatures).
- **Phase 19:** Installation Wizard (Web-based 8-step setup with hardware check, DB migration, wizard lock).
- **Phase 20:** Automated Database Backup, Restore, Integrity Verification, and Hardening.

---

### 5. Repository Structure Standard

```
MEDICORE-CLINIC/
├── app/
│   ├── Actions/            # Single-purpose business domain actions
│   ├── Enums/              # Typed clinical and operational enums
│   ├── Http/
│   │   ├── Controllers/    # Inertia & API controllers
│   │   ├── Middleware/     # Auth, Role/Permission, Language, Installation check
│   │   └── Requests/       # Form requests with strict validation rules
│   ├── Models/             # Eloquent models with typed relationships & scopes
│   ├── Policies/           # Authorization policies per medical entity
│   ├── Providers/          # Service providers
│   └── Services/           # Business domain services (Scheduling, Invoicing, Backup, etc.)
├── database/
│   ├── factories/          # Test data generators
│   ├── migrations/         # Relational database schema migrations
│   └── seeders/            # Baseline roles, permissions, demo medical catalog
├── resources/
│   ├── css/                # Tailwind CSS and RTL adaptations
│   ├── js/
│   │   ├── Components/     # Reusable UI components (Modals, Badges, Tables, Charts)
│   │   ├── Layouts/        # Authenticated, Portal, Installation, and Blank Layouts
│   │   ├── Pages/          # Inertia view pages grouped by domain module
│   │   ├── Types/          # TypeScript interface definitions
│   │   └── Locales/        # Arabic, French, and English translation dictionaries
│   └── views/              # Root Blade templates
├── routes/
│   ├── web.php             # Authenticated clinical application routes
│   ├── api.php             # REST API endpoints
│   ├── portal.php          # Dedicated Patient Portal routes
│   └── install.php         # Dedicated First-Time Installation Wizard routes
├── tests/
│   ├── Feature/            # End-to-end and feature functional tests
│   └── Unit/               # Service and calculation unit tests
└── docs/                   # Complete commercial product documentation
```
