# MediCore Clinic Management System
## Testing Strategy & Quality Assurance Plan

---

### 1. QA Philosophy
MediCore Clinic Management System manages medical records, clinical notes, patient safety alerts, and financial transactions. As such:
- **No Mock Data in Production:** All features must operate against live database models and real relationships.
- **Zero Broken Clicks:** Every interactive element (buttons, filters, action menus) must trigger a real action or display an explicit disabled reason.
- **Clinical Integrity Verification:** Test cases must specifically enforce that medical notes, once signed, cannot be mutated without a recorded addendum.

---

### 2. Testing Pyramid & Tooling

```
               / \
              /   \
             / E2E \       Playwright / Laravel Dusk Critical Medical Scenarios
            /-------\
           / Feature \     Laravel Feature Tests (HTTP Requests, Policies, RBAC, DB)
          /-----------\
         / Unit & Form \   PHPUnit Model calculations, Financial Math, Scheduling conflict
        /---------------\
       / Vitest Frontend \ Component rendering, Odontogram SVG interactions, Zod validation
      /-------------------\
```

- **Backend Testing Framework:** PHPUnit / Pest with in-memory SQLite database transactions for ultra-fast, isolated test execution.
- **Frontend Testing Framework:** Vitest + React Testing Library for component unit testing.
- **End-to-End Scenarios:** Automated integration scripts verifying end-to-end multi-step flows.

---

### 3. Critical Test Scenarios Suite

#### 3.1 Patient Management Suite
- `test_patient_can_be_created_with_unique_uid()`
- `test_duplicate_patient_detected_by_phone_or_national_id()`
- `test_patient_merge_transfers_appointments_and_invoices_and_audits_source()`
- `test_soft_deleted_patient_does_not_appear_in_active_lists()`

#### 3.2 Appointment Scheduling & Conflict Suite
- `test_appointment_created_successfully_in_available_slot()`
- `test_appointment_rejected_when_doctor_has_overlapping_booking()`
- `test_appointment_rejected_when_room_has_overlapping_procedure()`
- `test_appointment_status_transitions_valid_lifecycle()`

#### 3.3 Clinical Consultation & Integrity Suite
- `test_consultation_draft_can_be_updated_by_attending_doctor()`
- `test_unauthorized_doctor_cannot_modify_other_doctor_consultation()`
- `test_signed_consultation_becomes_read_only()`
- `test_addendum_creates_revision_record_with_reason_and_timestamp()`
- `test_prescription_requires_valid_medications_and_dosage()`

#### 3.4 Dental Odontogram Suite
- `test_tooth_condition_state_persisted_correctly_with_fdi_number()`
- `test_surface_level_decay_and_filling_updates_individual_surfaces()`
- `test_multi_stage_dental_treatment_plan_calculates_total_costs()`

#### 3.5 Billing, Cashier & Financial Integrity Suite
- `test_invoice_calculates_correct_subtotal_discount_tax_and_total()`
- `test_partial_payment_updates_balance_due_and_status()`
- `test_full_payment_marks_invoice_as_paid()`
- `test_refund_creates_audit_trail_and_credit_adjustment()`
- `test_daily_cash_register_reconciles_cash_and_card_totals()`

#### 3.6 Security, RBAC & Privacy Suite
- `test_unauthenticated_request_redirected_to_login()`
- `test_receptionist_cannot_access_clinical_consultation_signing()`
- `test_doctor_cannot_access_clinic_financial_reports_without_permission()`
- `test_medical_file_download_requires_signed_authorization_policy()`
- `test_patient_portal_user_cannot_access_internal_doctor_notes()`
- `test_rate_limiter_blocks_excessive_failed_logins()`

#### 3.7 Installation Wizard Suite
- `test_uninstalled_system_redirects_to_install_route()`
- `test_installer_validates_database_connection()`
- `test_installer_creates_admin_and_seeds_clinic_defaults()`
- `test_installer_locks_setup_file_preventing_reinstallation()`
