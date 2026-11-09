# MediCore Clinic Management System
## Missing Features & Technical Limitations Audit Log

**Product:** MediCore Clinic Management System  
**Audit Date:** November 9, 2026  
**Auditor:** Senior Software Architect & Clinical Product Specialist  

---

### 1. Remediated Deficiencies (Identified & Resolved in Phase 2)

During the Phase 2 deep technical audit, the following functional gaps were discovered and immediately remediated:

1. **Dermatology, Pediatrics, and Physiotherapy Persistence:**
   - *Previous State:* Database tables existed, but dedicated store endpoints and modal interfaces were missing.
   - *Resolution:* Added `addDermatology`, `addPediatricGrowth`, and `addPhysiotherapy` actions in `ConsultationController`, declared routes, and integrated interactive recording modals in `Consultations/Show.tsx`.
2. **Database Backup Restoration:**
   - *Previous State:* System could snapshot backups but lacked an automated database restoration method.
   - *Resolution:* Implemented `BackupService::restoreDatabaseBackup`, added corrupted archive validation, route `backups.restore`, controller action, and frontend "Restore" UI button with confirmation prompt.
3. **Patient Lifecycle Archival (Soft Delete):**
   - *Previous State:* `PatientController` lacked a `destroy` method for archival.
   - *Resolution:* Implemented `destroy` with soft deletion, deactivation flag, and immutable audit logging.
4. **Hardcoded Doctor ID in Ophthalmology:**
   - *Previous State:* Hardcoded fallback `doctor_id = 3` in `OphthalmologyController`.
   - *Resolution:* Switched to dynamic lookup via `Doctor::where('specialty', 'ophthalmology')->first()`.
5. **TypeScript Compiler Strictness:**
   - *Previous State:* Deprecated `tsconfig.json` options caused `npx tsc --noEmit` failures.
   - *Resolution:* Modernized `tsconfig.json` (`moduleResolution: "bundler"`, `types: ["vite/client"]`), resolved all missing types in `index.d.ts`. TypeScript check now passes with 0 errors.

---

### 2. Known Architecture Boundaries & Limitations (By Design)

The following architectural choices are intentional by design in adherence to the **Self-Hosted, One-Time Purchase, Zero SaaS Dependency** model:

1. **Direct PACS/DICOM Hardware C-STORE Protocol:**
   - *Current Implementation:* Diagnostic imaging module manages requisitions, modality tagging (X-Ray, Ultrasound, CT, MRI, Mammography), and radiologist diagnostic reporting.
   - *Boundary:* The application does not run a raw background DICOM C-STORE daemon listening on TCP port 104, as shared cPanel hosting does not permit running standalone persistent daemon listeners. Requisitions and reports operate via standard web protocols.
2. **Clinical Decision Support & Drug-Drug Interactions:**
   - *Current Implementation:* System validates medication dosages, frequencies, routes, and flags patient-recorded allergies upon prescription creation.
   - *Boundary:* Does not include an external real-time pharmacological proprietary API (such as Lexicomp or First Databank) because such APIs require mandatory paid third-party monthly subscriptions, violating the self-hosted one-time purchase model.
3. **Zero Mandatory Cloud Telemetry:**
   - *Boundary:* No centralized remote license tracking server exists.

---

### 3. Future Roadmap Recommendations (Post v1.0.0 Optional Extensions)

- **Optional Cloud Storage Driver:** Plugin to mirror encrypted backups to Amazon S3, Wasabi, or Google Cloud Storage if the client requests cloud redundancy.
- **SMS Gateway Drivers:** Optional adapters for Twilio or local GSM SMS gateways for appointment reminder text messages.
- **Biometric Hardware Fingerprint Reader:** Integration via WebAuthn for clinic staff biometric clock-in.
