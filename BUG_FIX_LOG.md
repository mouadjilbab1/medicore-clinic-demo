# MediCore Clinic Management System
## Bug Discovery & Remediation Log (Phases 1 & 2)

**Product:** MediCore Clinic Management System  
**Audit Period:** November 9, 2026  
**Auditors:** QA Lead & Senior Backend Architect  

---

### Detailed Defect & Remediation Register

#### Bug #01 — Vite React Plugin ERESOLVE Dependency Conflict
- **Severity:** High (Build Blocker)
- **Component:** Frontend Tooling (`package.json`)
- **Symptom:** Running `npm install @vitejs/plugin-react` installed v6.3.0 which demanded `vite: ^8.0.0`, conflicting with project's `vite@7.3.8`.
- **Root Cause:** Upstream npm package default latest tag was targeted to unreleased Vite 8.
- **Remediation:** Installed `@vitejs/plugin-react@^5.2.0` which is officially certified for Vite 7.x. All 183 packages resolved cleanly with 0 vulnerabilities.

#### Bug #02 — Default ExampleTest 302 Redirection Assertion
- **Severity:** Low (Test Suite Failure)
- **Component:** `tests/Feature/ExampleTest.php`
- **Symptom:** `GET /` returned HTTP 302 instead of HTTP 200.
- **Root Cause:** MediCore strictly protects `/` behind `auth` middleware, redirecting unauthenticated guests to `/login`.
- **Remediation:** Updated test assertion to verify `GET /login` returns HTTP 200, confirming guest entry point.

#### Bug #03 — Route Naming Inconsistency in Backups & Consultations
- **Severity:** Medium (Runtime Exception)
- **Component:** `routes/web.php` & `Backup.tsx`
- **Symptom:** `RouteNotFoundException: Route [backups.create] not defined`.
- **Root Cause:** Routes were registered as `backup.create` (singular) while UI referenced `backups.create` (plural).
- **Remediation:** Normalized all backup routes to `backups.index`, `backups.create`, `backups.restore`, and `backups.download` across routes, controllers, and frontend links.

#### Bug #04 — SQLite Date vs. DateTime String Comparison in Conflict Detector
- **Severity:** High (Clinical Conflict False Negative)
- **Component:** `SchedulingService.php`
- **Symptom:** `hasConflict` returned `false` for overlapping appointments in SQLite tests.
- **Root Cause:** In SQLite `:memory:`, Eloquent formatted `appointment_date` as `2026-06-01 00:00:00`. String equality `where('appointment_date', '2026-06-01')` evaluated to false.
- **Remediation:** Replaced `where('appointment_date', $date)` with `whereDate('appointment_date', $date)`. Works identically across MySQL and SQLite.

#### Bug #05 — Hardcoded Doctor ID in Ophthalmology Controller
- **Severity:** High (Integrity Vulnerability)
- **Component:** `OphthalmologyController.php`
- **Symptom:** Creating an eye exam without an existing consultation hardcoded `doctor_id => 3`.
- **Root Cause:** Hardcoded developer seed assumption.
- **Remediation:** Replaced with dynamic specialist query: `Doctor::where('specialty', 'ophthalmology')->first() ?? Doctor::first()`.

#### Bug #06 — Hardcoded Encounter ID in Specialty Form Responses
- **Severity:** High (Integrity Vulnerability)
- **Component:** `SpecialtyFormController.php`
- **Symptom:** Submitting specialty form answers hardcoded `consultation_id => 1`.
- **Root Cause:** Static placeholder from initial controller scaffold.
- **Remediation:** Implemented dynamic encounter discovery: searches patient's active consultations or creates a structured intake encounter on demand.

#### Bug #07 — Missing Patient Soft Deletion / Archival Endpoint
- **Severity:** Medium (Missing CRUD)
- **Component:** `PatientController.php`
- **Symptom:** Resource route had no `destroy` method; clicking deactivate or delete in UI would trigger 405 Method Not Allowed.
- **Remediation:** Implemented `destroy(Request $request, int $id)` with soft deletion, deactivation flag, and immutable audit logging.

#### Bug #08 — Missing Database Restore Functionality
- **Severity:** High (Disaster Recovery Gap)
- **Component:** `BackupService.php` & `BackupController.php`
- **Symptom:** System could create snapshots but had no mechanism to restore them from the web UI or service layer.
- **Remediation:** Implemented `restoreDatabaseBackup`, archive header integrity check, controller action, and frontend "Restore" button with confirmation alert.

#### Bug #09 — Deprecated TypeScript Compiler Flags & Missing Declarations
- **Severity:** Medium (Compiler Warning)
- **Component:** `tsconfig.json` & `resources/js/types/index.d.ts`
- **Symptom:** `npx tsc --noEmit` failed with TS5108 (`esModuleInterop=false` removed) and TS2552 (`Cannot find name 'route'`).
- **Remediation:** Modernized `tsconfig.json` (`moduleResolution: "bundler"`, `types: ["vite/client"]`), added global `route` declaration, and added `Department` and `BackupRecord` interfaces. `npx tsc --noEmit` now passes with 0 errors.

#### Bug #10 — Incomplete Specialty Persistences (Dermatology, Pediatrics, Physio)
- **Severity:** High (Clinical Completeness)
- **Component:** `ConsultationController.php` & `Show.tsx`
- **Symptom:** Relational tables existed for dermatology, growth charts, and physiotherapy, but no controller endpoints existed to store them from consultations.
- **Remediation:** Added `addDermatology`, `addPediatricGrowth`, and `addPhysiotherapy` actions in `ConsultationController`, declared routes, and added interactive modals in `Show.tsx`.
