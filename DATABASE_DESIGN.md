# MediCore Clinic Management System
## Database Schema Design & Entity-Relationship Model

---

### 1. Database Standards & Conventions
- **Database Engine:** MySQL 8.0+ (InnoDB) / SQLite 3 for local tests.
- **Character Set & Collation:** `utf8mb4` with `utf8mb4_unicode_ci` (full Arabic and emoji support).
- **Primary Keys:** Auto-incrementing unsigned 64-bit BigInt (`id`).
- **Foreign Keys:** Explicit foreign key constraints with index on child tables and restricted or cascade deletes as appropriate.
- **Timestamps:** `created_at` and `updated_at` (UTC standard).
- **Soft Deletes:** `deleted_at` on clinical and financial records to prevent permanent destruction of sensitive data.
- **Audit Columns:** `created_by`, `updated_by` on clinical notes and financial entries.

---

### 2. Entity Groups & Table Definitions

```
                     +---------------------------------------+
                     |                CLINICS                |
                     +---------------------------------------+
                                         | 1:N
                                         v
                     +---------------------------------------+
                     |               BRANCHES                |
                     +---------------------------------------+
                         | 1:N                       | 1:N
                         v                           v
             +-----------------------+   +-----------------------+
             |         ROOMS         |   |      DEPARTMENTS      |
             +-----------------------+   +-----------------------+
                         |                           |
                         |                           v
                         |               +-----------------------+
                         |               |         USERS         |
                         |               +-----------------------+
                         |                           |
                         |          +----------------+----------------+
                         |          | 1:1                             | 1:1
                         |          v                                 v
                         |  +---------------+                 +---------------+
                         |  |    DOCTORS    |                 |   EMPLOYEES   |
                         |  +---------------+                 +---------------+
                         |          |                                 |
                         +----+     | 1:N                             |
                              |     v                                 |
                     +---------------------------------------+        |
                     |               PATIENTS                |        |
                     +---------------------------------------+        |
                                    | 1:N                             |
          +-------------------------+-------------------------+       |
          |                         |                         |       |
          v                         v                         v       v
+-------------------+     +-------------------+     +-------------------+
|   APPOINTMENTS    |     |   CONSULTATIONS   |     |     INVOICES      |
+-------------------+     +-------------------+     +-------------------+
          |                         |                         |
          v                         +-------+-------+         v
+-------------------+               |       |       |  +-------------------+
|   WAITING_QUEUE   |               v       v       v  |     PAYMENTS      |
+-------------------+        +------------+ | +------------+ +-------------------+
                             |DIAGNOSES   | | |PRESCRIPTION|
                             +------------+ | +------------+
                                            v
                                     +------------+
                                     |  SPECIALTY |
                                     |   CHARTS   |
                                     +------------+
```

---

### 3. Detailed Table Schema Catalog

#### 3.1 Organization & Multi-Branch Core
1. **`clinics`**: System-wide clinic entity.
   - `id`, `name`, `legal_name`, `tax_number`, `phone`, `email`, `website`, `address`, `country`, `timezone`, `currency`, `logo_path`, `settings` (JSON), `created_at`, `updated_at`.
2. **`branches`**: Physical locations and satellite clinics.
   - `id`, `clinic_id` (FK), `name`, `code`, `phone`, `email`, `address`, `is_main`, `is_active`, `created_at`, `updated_at`, `deleted_at`.
3. **`departments`**: Medical and administrative departments.
   - `id`, `branch_id` (FK), `name`, `code`, `description`, `created_at`, `updated_at`.
4. **`rooms`**: Consultation rooms, dental operatories, procedure suites, diagnostic booths.
   - `id`, `branch_id` (FK), `name`, `room_number`, `type` (`consultation`, `dental`, `procedure`, `lab`, `imaging`), `is_active`, `created_at`, `updated_at`.

#### 3.2 User Management & RBAC
5. **`users`**: All system users (staff, physicians, patients).
   - `id`, `branch_id` (FK, nullable), `name`, `email` (unique), `phone`, `password`, `role` (`admin`, `director`, `manager`, `doctor`, `dentist`, `nurse`, `receptionist`, `accountant`, `pharmacist`, `lab_tech`, `imaging_tech`, `inventory_mgr`, `patient`), `locale` (`ar`, `fr`, `en`), `is_active`, `avatar_path`, `two_factor_secret`, `two_factor_recovery_codes`, `last_login_at`, `created_at`, `updated_at`, `deleted_at`.
6. **`roles`** & **`permissions`** & **`role_permissions`** & **`user_roles`**: Granular role-permission system.

#### 3.3 Medical Staff & Doctors
7. **`doctors`**: Physician-specific profile and clinical credentials.
   - `id`, `user_id` (FK, unique), `specialty` (`general`, `dental`, `ophthalmology`, `dermatology`, `cardiology`, `pediatrics`, `physiotherapy`, `ent`, `gynecology`, `other`), `license_number`, `qualifications`, `biography`, `consultation_fee` (Decimal 10,2), `followup_fee` (Decimal 10,2), `slot_duration_minutes` (Int, default 30), `commission_rate` (Decimal 5,2), `is_available`, `created_at`, `updated_at`, `deleted_at`.
8. **`doctor_schedules`**: Recurring weekly working hours.
   - `id`, `doctor_id` (FK), `branch_id` (FK), `day_of_week` (0=Sun..6=Sat), `start_time` (Time), `end_time` (Time), `break_start` (Time, nullable), `break_end` (Time, nullable), `is_active`, `created_at`, `updated_at`.
9. **`doctor_leaves`**: Vacation, conferences, and emergency leaves.
   - `id`, `doctor_id` (FK), `start_date` (Date), `end_date` (Date), `reason`, `approved_by` (FK), `status` (`pending`, `approved`, `rejected`), `created_at`, `updated_at`.

#### 3.4 Patient Records & Medical Baseline
10. **`patients`**: Master patient identity registry.
    - `id`, `branch_id` (FK), `patient_uid` (String, unique, indexed), `first_name`, `last_name`, `gender` (`male`, `female`, `other`), `date_of_birth` (Date), `blood_group` (`A+`, `A-`, `B+`, `B-`, `AB+`, `AB-`, `O+`, `O-`, `unknown`), `phone` (indexed), `email`, `national_id`, `address`, `city`, `emergency_contact_name`, `emergency_contact_phone`, `marital_status`, `occupation`, `photo_path`, `insurance_company_id` (FK, nullable), `insurance_policy_number`, `medical_notes` (Text), `allergies_summary` (Text), `chronic_conditions_summary` (Text), `is_active`, `created_at`, `updated_at`, `deleted_at`.
11. **`patient_allergies`**: Categorized allergy entries with severity.
    - `id`, `patient_id` (FK), `allergen`, `allergy_type` (`drug`, `food`, `environmental`, `other`), `severity` (`mild`, `moderate`, `severe`, `life_threatening`), `reaction`, `noted_at` (Date), `created_at`, `updated_at`.
12. **`patient_documents`**: Stored clinical scans, consents, reports, and identity cards.
    - `id`, `patient_id` (FK), `uploaded_by` (FK), `title`, `document_type` (`id_card`, `lab_report`, `imaging_scan`, `referral`, `consent_form`, `other`), `file_path`, `file_size`, `mime_type`, `notes`, `created_at`, `updated_at`, `deleted_at`.

#### 3.5 Appointments & Waiting Queue
13. **`appointments`**: Scheduled and walk-in appointments.
    - `id`, `branch_id` (FK), `patient_id` (FK), `doctor_id` (FK), `room_id` (FK, nullable), `appointment_date` (Date, indexed), `start_time` (Time), `end_time` (Time), `type` (`consultation`, `follow_up`, `procedure`, `emergency`, `walk_in`), `status` (`scheduled`, `confirmed`, `arrived`, `waiting`, `in_consultation`, `completed`, `cancelled`, `no_show`), `reason_for_visit`, `notes`, `cancellation_reason`, `created_by` (FK), `created_at`, `updated_at`, `deleted_at`.
14. **`waiting_queue`**: Live waiting room queue status.
    - `id`, `branch_id` (FK), `appointment_id` (FK, nullable), `patient_id` (FK), `doctor_id` (FK), `queue_number` (Int), `priority` (`normal`, `urgent`, `emergency`, `special_needs`), `status` (`waiting`, `called`, `in_consultation`, `completed`, `skipped`), `check_in_time` (DateTime), `called_time` (DateTime, nullable), `completed_time` (DateTime, nullable), `notes`, `created_at`, `updated_at`.

#### 3.6 Consultations, Diagnoses & EMR
15. **`consultations`**: Comprehensive medical encounter record.
    - `id`, `appointment_id` (FK, nullable), `patient_id` (FK), `doctor_id` (FK), `branch_id` (FK), `consultation_date` (DateTime), `chief_complaint`, `history_present_illness` (Text), `physical_examination` (Text), `clinical_assessment` (Text), `treatment_plan` (Text), `follow_up_instructions` (Text), `follow_up_date` (Date, nullable), `is_finalized` (Boolean), `signed_at` (DateTime, nullable), `signed_by` (FK, nullable), `created_at`, `updated_at`, `deleted_at`.
16. **`vital_signs`**: Vital indicators recorded during triage or consultation.
    - `id`, `consultation_id` (FK, nullable), `patient_id` (FK), `recorded_by` (FK), `systolic_bp` (Int), `diastolic_bp` (Int), `heart_rate` (Int), `respiratory_rate` (Int), `temperature` (Decimal 4,1), `oxygen_saturation` (Int), `weight` (Decimal 5,2), `height` (Decimal 5,2), `bmi` (Decimal 4,1), `recorded_at` (DateTime), `created_at`, `updated_at`.
17. **`diagnoses`**: Coded and free-text diagnoses.
    - `id`, `consultation_id` (FK), `patient_id` (FK), `icd10_code` (String, nullable), `diagnosis_name`, `type` (`primary`, `secondary`, `differential`), `status` (`active`, `resolved`, `chronic`), `notes`, `created_at`, `updated_at`.
18. **`clinical_note_revisions`**: Audit snapshots of signed notes.
    - `id`, `consultation_id` (FK), `revised_by` (FK), `revision_reason`, `previous_content` (JSON), `created_at`.

#### 3.7 Specialty Engines
19. **`dental_teeth`**: FDI Odontogram tooth conditions.
    - `id`, `patient_id` (FK), `tooth_number` (Int, 11-48 adult, 51-85 deciduous), `surface_occlusal` (`healthy`, `caries`, `filled`, `sealant`), `surface_mesial` (`healthy`, `caries`, `filled`), `surface_distal` (`healthy`, `caries`, `filled`), `surface_buccal` (`healthy`, `caries`, `filled`), `surface_lingual` (`healthy`, `caries`, `filled`), `overall_condition` (`healthy`, `caries`, `filled`, `missing`, `extracted`, `crown`, `root_canal`, `implant`, `bridge_abutment`, `bridge_pontic`), `mobility_grade` (0..3), `notes`, `updated_by` (FK), `created_at`, `updated_at`.
20. **`dental_treatments`**: Planned, executing, and completed dental operations.
    - `id`, `patient_id` (FK), `doctor_id` (FK), `consultation_id` (FK, nullable), `tooth_number` (Int, nullable), `procedure_name`, `stage` (`planned`, `in_progress`, `completed`), `cost` (Decimal 10,2), `notes`, `created_at`, `updated_at`.
21. **`ophthalmology_records`**: Vision exams and refraction measurements.
    - `id`, `consultation_id` (FK), `patient_id` (FK), `od_va_distance`, `od_va_near`, `od_sph`, `od_cyl`, `od_axis`, `od_add`, `od_iop`, `os_va_distance`, `os_va_near`, `os_sph`, `os_cyl`, `os_axis`, `os_add`, `os_iop`, `pd`, `glasses_prescription_notes`, `contact_lens_notes`, `created_at`, `updated_at`.
22. **`dermatology_records`**: Skin lesion maps and photo assessments.
    - `id`, `consultation_id` (FK), `patient_id` (FK), `body_location_key` (`face`, `neck`, `chest`, `back`, `left_arm`, `right_arm`, `left_leg`, `right_leg`), `condition_type`, `lesion_description`, `before_photo_path`, `after_photo_path`, `session_number`, `created_at`, `updated_at`.
23. **`pediatric_growth_records`**: WHO growth percentiles.
    - `id`, `consultation_id` (FK, nullable), `patient_id` (FK), `age_months` (Int), `height_cm` (Decimal 5,2), `height_percentile` (Decimal 5,2), `weight_kg` (Decimal 5,2), `weight_percentile` (Decimal 5,2), `head_circumference_cm` (Decimal 5,2), `head_percentile` (Decimal 5,2), `created_at`, `updated_at`.
24. **`physiotherapy_sessions`**: ROM, Pain VAS, exercises.
    - `id`, `consultation_id` (FK, nullable), `patient_id` (FK), `therapist_id` (FK), `pain_vas_score` (Int, 0-10), `mobility_score`, `joint_assessed`, `rom_measurement`, `exercises_prescribed` (Text), `notes`, `created_at`, `updated_at`.
25. **`specialty_forms`**, **`specialty_form_fields`**, **`specialty_form_responses`**: Extensible schema engine.

#### 3.8 Prescriptions & Medical Documents
26. **`prescriptions`**: Patient prescriptions with digital signature.
    - `id`, `consultation_id` (FK, nullable), `patient_id` (FK), `doctor_id` (FK), `prescription_number` (String, unique), `status` (`active`, `dispensed`, `cancelled`), `instructions`, `signed_at` (DateTime), `created_at`, `updated_at`, `deleted_at`.
27. **`prescription_items`**: Line items for medicines.
    - `id`, `prescription_id` (FK), `medicine_name`, `dosage`, `frequency` (e.g. "Three times daily after meals"), `duration` (e.g. "7 days"), `route` (`oral`, `topical`, `intravenous`, `inhalation`, `ophthalmic`), `quantity`, `instructions`, `created_at`, `updated_at`.
28. **`clinical_documents`**: Certificates, Sick Leaves, Referral Letters.
    - `id`, `patient_id` (FK), `doctor_id` (FK), `type` (`sick_leave`, `medical_certificate`, `referral_letter`, `fitness_certificate`), `document_number` (String, unique), `start_date` (Date, nullable), `end_date` (Date, nullable), `diagnosis_summary`, `content` (Text), `created_at`, `updated_at`.

#### 3.9 Billing, Cashier & Accounting
29. **`invoices`**: Invoices for patient services and pharmacy.
    - `id`, `branch_id` (FK), `patient_id` (FK), `consultation_id` (FK, nullable), `invoice_number` (String, unique, indexed), `invoice_date` (Date), `due_date` (Date), `subtotal` (Decimal 10,2), `discount_amount` (Decimal 10,2), `tax_amount` (Decimal 10,2), `total_amount` (Decimal 10,2), `paid_amount` (Decimal 10,2), `balance_due` (Decimal 10,2), `status` (`draft`, `unpaid`, `partially_paid`, `paid`, `refunded`, `cancelled`), `notes`, `created_by` (FK), `created_at`, `updated_at`, `deleted_at`.
30. **`invoice_items`**: Itemized charges.
    - `id`, `invoice_id` (FK), `service_id` (FK, nullable), `item_name`, `item_type` (`consultation`, `procedure`, `medication`, `lab`, `imaging`, `dental`), `quantity` (Int), `unit_price` (Decimal 10,2), `discount` (Decimal 10,2), `tax_rate` (Decimal 5,2), `total` (Decimal 10,2), `created_at`, `updated_at`.
31. **`payments`**: Payment transactions.
    - `id`, `invoice_id` (FK), `patient_id` (FK), `receipt_number` (String, unique), `amount` (Decimal 10,2), `payment_method` (`cash`, `card`, `bank_transfer`, `insurance`, `cheque`, `other`), `transaction_reference`, `payment_date` (DateTime), `received_by` (FK), `notes`, `created_at`, `updated_at`.
32. **`expenses`**: Clinic operational expenditures.
    - `id`, `branch_id` (FK), `category` (`rent`, `salaries`, `utilities`, `supplies`, `maintenance`, `marketing`, `tax`, `other`), `title`, `amount` (Decimal 10,2), `expense_date` (Date), `paid_to`, `payment_method`, `receipt_attachment_path`, `recorded_by` (FK), `created_at`, `updated_at`.

#### 3.10 Inventory, Lab & Imaging
33. **`inventory_products`**: Pharmaceuticals, surgical disposables, dental materials.
    - `id`, `branch_id` (FK), `name`, `sku` (String, unique), `barcode`, `category` (`medication`, `disposable`, `dental_material`, `equipment`), `unit` (`box`, `piece`, `vial`, `tablet`, `kit`), `purchase_price` (Decimal 10,2), `selling_price` (Decimal 10,2), `current_stock` (Int), `minimum_stock_alert` (Int), `is_active`, `created_at`, `updated_at`, `deleted_at`.
34. **`inventory_batches`**: Batches with expiration dates.
    - `id`, `product_id` (FK), `batch_number`, `expiry_date` (Date, indexed), `quantity_received`, `quantity_remaining`, `created_at`, `updated_at`.
35. **`lab_requests`** & **`lab_results`**: Pathological and clinical laboratory orders.
36. **`imaging_requests`** & **`imaging_reports`**: Radiographic, ultrasonic, and MRI diagnostics.

#### 3.11 Audit, Security & Configuration
37. **`audit_logs`**: Immutable security and clinical audit journal.
    - `id`, `user_id` (FK, nullable), `action` (String), `auditable_type` (String, indexed), `auditable_id` (BigInt, indexed), `old_values` (JSON, nullable), `new_values` (JSON, nullable), `ip_address`, `user_agent`, `created_at`.
38. **`system_settings`**: Key-value settings with category prefixes.
    - `id`, `category` (`general`, `clinic`, `localization`, `billing`, `clinical`, `integrations`), `key` (unique), `value` (Text), `is_encrypted` (Boolean), `created_at`, `updated_at`.
