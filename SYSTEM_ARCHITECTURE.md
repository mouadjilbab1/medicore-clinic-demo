# MediCore Clinic Management System
## System Architecture & Technical Specifications

---

### 1. Architectural Overview

MediCore Clinic Management System utilizes a modern, monolithic, single-page application (SPA) architecture built on **Laravel** and **React with Inertia.js**. This design eliminates the complexity of decoupled microservices and token synchronization issues while retaining the high-fidelity user experience of a client-side SPA.

```
+----------------------------------------------------------------------------------------------------+
|                                         PRESENTATION LAYER                                         |
|                                                                                                    |
|  [ React 18+ SPA ]  <--->  [ Inertia.js Bridge ]  <--->  [ Tailwind CSS + Lucide + Recharts ]      |
|  - Layout Engine (Sidebar, Topbar, RTL/LTR Direction, Dark/Light Mode)                             |
|  - Dynamic Clinical Canvas (Dental FDI Odontogram, Ophthalmology Refraction, Body Mapper)          |
|  - Real-Time Live Queue Polling / Inertia Reload Engine                                            |
|  - Form Engine (React Hook Form + Zod Client Validation)                                           |
+----------------------------------------------------------------------------------------------------+
                                                 ▲
                                                 │ HTTP / Inertia JSON Protocol
                                                 ▼
+----------------------------------------------------------------------------------------------------+
|                                         APPLICATION LAYER                                          |
|                                                                                                    |
|  [ Laravel Kernel ]                                                                                |
|    ├── Middlewares: [ EnsureInstalled, Authenticate, SetLocale, CheckRolePermission, SecurityHeaders ] |
|    ├── Routing: [ web.php (Inertia), api.php (Sanctum/REST), portal.php, install.php ]              |
|    ├── Form Requests: Input sanitization, strict MIME-type checks, clinical validation rules        |
|    ├── Controllers: Thin dispatchers delegating to domain services                                  |
|    ├── Policies: Granular model-level authorization (Doctor, Patient, Invoice, Document)           |
|    └── Event Listeners: AppointmentCreated, PatientCheckedIn, InvoicePaid, StockLowAlert           |
+----------------------------------------------------------------------------------------------------+
                                                 ▲
                                                 │ Method Calls / Domain Events
                                                 ▼
+----------------------------------------------------------------------------------------------------+
|                                           SERVICE LAYER                                            |
|                                                                                                    |
|  ├── SchedulingService: Conflict checking, doctor availability, room clash prevention              |
|  ├── QueueService: Waiting room ticket generation, triage priority escalation, doctor handover    |
|  ├── ClinicalRecordService: Note versioning, ICD-10 linking, doctor cryptographic signing         |
|  ├── SpecialtyEngine: Odontogram state resolver, ophthalmology prescription, growth percentiles    |
|  ├── BillingService: Invoice compilation, tax calculation, partial payments, refund credits        |
|  ├── InventoryService: FIFO stock movement, reorder thresholds, automated consultation deductions  |
|  ├── DocumentService: PDF rendering for Prescriptions, Invoices, Sick Leaves, Lab Reports         |
|  ├── BackupService: Database mysqldump/sqlite snapshotting, private archive encryption             |
|  └── AuditLogService: Pre/Post mutation diffs, IP tracking, user action logging                   |
+----------------------------------------------------------------------------------------------------+
                                                 ▲
                                                 │ Eloquent ORM / Query Builder
                                                 ▼
+----------------------------------------------------------------------------------------------------+
|                                      DATA & PERSISTENCE LAYER                                      |
|                                                                                                    |
|  [ Relational DB: MySQL 8+ / SQLite ]                                                              |
|    - InnoDB engine, strict foreign key constraints, composite index optimizations                 |
|    - Soft deletes on sensitive medical and transactional entities                                  |
|  [ Local Encrypted Storage Vault: storage/app/private/ ]                                           |
|    - Medical attachments, scans, lab PDFs, digital signatures, daily encrypted backups           |
+----------------------------------------------------------------------------------------------------+
```

---

### 2. Security & Data Protection Pipeline

#### 2.1 Medical File Vault Architecture
Medical records, laboratory attachments, imaging scans, and patient documents are **never stored in the public web root** (`public/storage`). 
- Storage Path: `storage/app/private/patients/{patient_id}/...`
- Access Control: Files can only be retrieved via signed streaming endpoints (`/app/documents/{id}/stream`), guarded by `DocumentPolicy`.
- Verification: The streaming controller checks if the authenticated user has explicit authorization to view the patient's records, and logs the access in `audit_logs`.

#### 2.2 Clinical Audit Log Engine
Every critical clinical and financial transaction (patient edits, clinical note updates, prescription issuance, invoice modification, user role alteration) writes an immutable record to the `audit_logs` table:
- `user_id`: Operator responsible for the action.
- `action`: `created`, `updated`, `deleted`, `signed`, `cancelled`, `restored`.
- `auditable_type`: The Eloquent model class (e.g., `App\Models\Consultation`).
- `auditable_id`: The ID of the record.
- `old_values`: JSON snapshot before modification.
- `new_values`: JSON snapshot after modification.
- `ip_address`: Client IP address.
- `user_agent`: Browser/Client fingerprint.

#### 2.3 Role-Based Access Control (RBAC) Matrix
Permissions are enforced at three distinct levels:
1. **Route Middleware:** `role:admin|doctor|receptionist` checks user roles on route groups.
2. **Controller Policies:** `authorize('update', $consultation)` verifies specific ownership and permissions (e.g. only the attending doctor or a medical director can sign a clinical note).
3. **Frontend Inertia Shared Props:** Permissions are shared via `auth.permissions` and `auth.role` allowing the UI to adapt navigation, action buttons, and edit fields dynamically.

---

### 3. Specialty Architecture & Extensibility Engine

#### 3.1 Dental Odontogram Architecture
The dental engine represents tooth data in standard **FDI Two-Digit Notation**:
- **Quadrants:** 1 (Upper Right), 2 (Upper Left), 3 (Lower Left), 4 (Lower Right).
- **Primary Quadrants:** 5 (Upper Right Deciduous), 6 (Upper Left Deciduous), 7 (Lower Left Deciduous), 8 (Lower Right Deciduous).
- **Surfaces:** O (Occlusal/Incisal), M (Mesial), D (Distal), B (Buccal/Labial), L (Lingual/Palatal).
- **State Serialization:** Each tooth is persisted as a relational record linked to the patient's chart, tracking current conditions, planned procedures, completed treatments, and historical changes.

#### 3.2 Dynamic Specialty Form Builder Engine
For specialties not covered by dedicated UI canvases (e.g. ENT, Gynecology, Rheumatology), the **Specialty Form Builder** engine allows clinic managers to define dynamic form templates:
1. **Form Schema Definition:** Stored in `specialty_forms` (Name, Specialty Code, Version, Active Flag).
2. **Form Fields:** Stored in `specialty_form_fields` (Label, Key, Type: `text|number|date|select|radio|checkbox|measurement|repeater`, Options, Validation rules, Ordering).
3. **Clinical Responses:** Stored in `specialty_form_responses` linked to `consultation_id` and `patient_id` as structured JSON, preserving data integrity even if the form schema is later revised.

---

### 4. Multilingual & Directional Architecture

```
[ HTTP Request ] -> [ SetLocale Middleware ] -> Resolves Locale (User Profile > Session > Clinic Default)
                                              -> Sets App::setLocale()
                                              -> Injects locale + RTL flag into Inertia Shared Props
                                              -> React Root sets <html dir="rtl" lang="ar"> or <html dir="ltr">
                                              -> CSS utilizes logical Tailwind classes (ms-*, me-*, start-*, end-*)
```

Supported languages:
- **Arabic (`ar`):** Direction `rtl`, localized dates (Hijri / Gregorian formatted in Arabic), right-aligned navigation.
- **French (`fr`):** Direction `ltr`, standard French clinical terminology.
- **English (`en`):** Direction `ltr`, international clinical standard terminology.

---

### 5. Deployment & Self-Hosted Constraints

- **Database:** Works with MySQL 8.0+ and SQLite 3.35+.
- **Web Server:** Compatible with Apache (`.htaccess` included), Nginx, and cPanel setups.
- **Queues & Scheduling:** Uses Laravel's `database` queue driver by default (eliminating Redis dependency for entry-level deployments) and standard cron-based scheduler.
- **Mail & SMS:** Built-in SMTP, Log (development), and pluggable SMS/WhatsApp gateway abstractions.
