# MediCore Clinic Management System
## Changelog

All notable changes to the MediCore Clinic Management System will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

### [1.0.0] - 2026-11-09
#### Added
- Complete Enterprise Architecture and Documentation Suite (`PROJECT_MASTER_PLAN.md`, `PRODUCT_REQUIREMENTS.md`, `SYSTEM_ARCHITECTURE.md`, `DATABASE_DESIGN.md`, `SECURITY_PLAN.md`, `API_SPECIFICATION.md`, `IMPLEMENTATION_ROADMAP.md`, `TESTING_STRATEGY.md`, `DEPLOYMENT_GUIDE.md`).
- Multi-branch relational database schema supporting organizations, branches, clinics, departments, rooms, and users.
- Role-based Access Control (RBAC) with 14 distinct roles (Admin, Doctor, Dentist, Nurse, Receptionist, Cashier, Pharmacist, Lab Tech, Imaging Tech, Patient, etc.).
- Patient Management engine with Unique Patient UID, demographic registry, emergency contacts, allergy matrix, duplicate detection, and merging.
- Smart Appointment Scheduling engine with calendar views (Day, Week, Month, Doctor resource grid) and strict double-booking conflict prevention.
- Waiting Room Live Queue system with sequential ticketing, urgency triage tags, and doctor calling dashboard.
- Electronic Medical Records (EMR) with Chief Complaint, HPI, Physical Exam, Vital Signs, ICD-10 diagnostic library, and doctor digital signature lock.
- Specialty Clinical Modules:
  - Interactive FDI 2-digit Dental Odontogram with 5 tooth surfaces and multi-stage treatment planning.
  - Ophthalmology Examination with OD/OS visual acuity, refraction parameters, IOP, and glasses prescription.
  - Dermatology Lesion Canvas with anatomical mapping and photo comparison.
  - Cardiology Diagnostic Center with BP, ECG, and echocardiogram notes.
  - Pediatrics Growth Chart with WHO percentile calculations and immunization schedule.
  - Physiotherapy Module with VAS Pain Scale, ROM tracking, and exercise regimens.
  - Dynamic Specialty Form Builder supporting custom clinical branches with JSON schema definitions.
- Prescription Management with drug frequency, dosage, route, duration, and printable PDF prescription generator.
- Medical Document Generator for Sick Leave Certificates, Referrals, and Fitness Certificates.
- Invoicing, Cashier & Financial Management supporting itemized charges, partial payments, split payment methods, refunds, and daily cash closing reconciliation.
- Inventory & Pharmacy Control with SKU barcodes, batch expiry tracking, and low-stock threshold alerts.
- Laboratory & Diagnostic Imaging hubs with normal reference ranges and workflow sign-offs.
- Staff & HR Management with attendance records and leave tracking.
- Dedicated Secure Patient Portal for online appointment booking and document downloads.
- 8-Step First-Time Web Installation Wizard with environment verification, migration execution, and setup locking.
- Database and file vault backup & restore system.
- Full trilingual support: Arabic (with native RTL), French (LTR), and English (LTR).
