# MediCore Clinic Management System
## Changelog

All notable changes to the MediCore Clinic Management System will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

### [1.0.0] - 2026-11-09
#### Commercial Release Candidate & Production Certification
- **Complete Enterprise Architecture & Documentation Suite:** Comprehensive technical manuals, API guides, deployment runbooks, and legal license agreements.
- **Multi-Branch Relational Database Schema:** 46 tables with full MySQL 8.0 (InnoDB) and SQLite compatibility, foreign key cascading, and optimized composite indexes.
- **Strict Role-Based Access Control (RBAC):** HTTP-level boundary security enforcing 13 roles (`admin`, `director`, `manager`, `doctor`, `dentist`, `nurse`, `receptionist`, `accountant`, `pharmacist`, `lab_tech`, `imaging_tech`, `inventory_mgr`, `patient`). Receptionists and cashiers strictly barred from medical notes with HTTP 403 Forbidden.
- **Patient Management Engine:** Demographic intake, unique `PAT-YYYY-XXXX` identifiers, allergy alerts, duplicate detection, and audited record merging.
- **Smart Appointment Scheduling Engine:** Conflict detection for overlapping doctor schedules, operatory room collisions, and approved leaves.
- **Waiting Room Live Queue System:** Sequential daily ticketing, triage prioritization (normal, urgent, emergency, special needs), operatory calling, and public display screen.
- **Electronic Medical Records (EMR):** Comprehensive encounter charting, chief complaints, physical examinations, vital signs with automated BMI calculation, ICD-10 diagnostic coding, and digital signature lock preventing in-place alteration.
- **Specialty Clinical Modules:**
  - Interactive FDI 2-digit Dental Odontogram with 5 tooth surfaces and multi-stage treatment planning.
  - Ophthalmology Examination with OD/OS visual acuity, refraction parameters, IOP, and optical prescriptions.
  - Dermatology lesion tracking with anatomical mapping.
  - Pediatrics growth charts with WHO percentiles scoring.
  - Physiotherapy module with VAS pain scale and ROM tracking.
  - Dynamic Specialty Form Builder supporting custom intake templates.
- **Prescription Management:** Structured medication administration, dosages, frequencies, and clean printable prescription layouts.
- **Revenue Cycle Management:** Commercial invoicing, multi-method payments, partial payment tracking, receipts generation, and daily cash register closing with discrepancy auditing.
- **Patient Self-Service Portal:** Strictly isolated portal allowing patients to securely request appointments and view their personal prescriptions and invoices.
- **Disaster Recovery Subsystem:** Built-in atomic database snapshot creation and 100% data fidelity restoration.
- **First-Time Web Installation Wizard (`/install`):** Safe 3-step setup wizard with requirements verification, database connection testing, and permanent deployment lock file (`storage/installed`).
- **Trilingual Localization:** Arabic (native RTL), English (LTR), and French (LTR).
