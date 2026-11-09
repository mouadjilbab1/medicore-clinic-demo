# MediCore Clinic — System Administration & Operations Guide

**Audience:** Clinic Owners, Medical Directors, Practice Managers, and System Administrators  
**Applies to:** MediCore Clinic Management System v1.0.0

---

## 1. System Architecture & Administrative Roles

MediCore Clinic enforces a strict 4-tier Role-Based Access Control (RBAC) model. As an administrator, you govern clinical data access, user accounts, and system configuration.

### Administrative Roles Overview
- **`admin` (System Administrator):** Complete technical, operational, and database management access. Has exclusive access to system backups, user provisioning, and environment parameters.
- **`director` (Medical Director / Clinic Owner):** Full access across all clinical specialties, doctor schedules, financial registers, audit logs, and system backups.
- **`manager` (Practice Operations Manager):** Oversees daily patient workflows, appointments, waiting queue throughput, inventory management, billing, and staff schedules. (Cannot access low-level system backups).

---

## 2. Staff Management & Account Provisioning

### Creating Staff Accounts
1. Log in with an `admin`, `director`, or `manager` account.
2. Navigate to **Staff & HR** (`/staff`) from the main sidebar.
3. Click **Add New Staff Member**.
4. Fill in the required fields:
   - **Full Name:** Official employee name.
   - **Email:** Unique email used for system authentication.
   - **Phone Number:** Mobile contact number.
   - **Branch Assignment:** Primary clinic branch location.
   - **Assigned Role:** Select from `doctor`, `dentist`, `nurse`, `receptionist`, `accountant`, `pharmacist`, `lab_tech`, `imaging_tech`, `inventory_mgr`.
   - **Default Language:** Arabic, English, or French.
   - **Initial Password:** Minimum 8 characters.
5. Click **Create Staff Member**.

### Doctor Specialty Profiles & Scheduling
When adding a `doctor` or `dentist`:
1. The system creates a linked specialist profile in the `doctors` table.
2. Specify the doctor's **Specialty** (`general_practice`, `dental`, `ophthalmology`, `dermatology`, `pediatrics`, `cardiology`, `orthopedics`, `physiotherapy`).
3. Set the doctor's **License / Registration Number**.
4. Set the **Consultation Fee** and **Follow-up Fee** (used to pre-fill billing invoices).
5. Configure the doctor's **Working Hours & Weekly Schedule** to enable automated conflict detection on the appointment calendar.

---

## 3. Clinic & Branch Management

MediCore Clinic supports multi-branch practices within a single clinic organization.

### Multi-Branch Configuration
1. Navigate to **Settings > Clinic & Branches**.
2. To create a satellite clinic branch:
   - Provide the **Branch Name**, **Unique Code** (e.g., `BRN-NORTH`), phone number, and physical address.
   - Set operating hours and timezone.
3. **Staff Branch Switching:** Staff members assigned to multiple branches can switch active branch context seamlessly via the branch switcher in the top navigation bar.

---

## 4. Disaster Recovery & Database Backups

Regular backups are essential for medical data integrity and regulatory compliance.

### Creating a Manual Backup Snapshot
1. Navigate to **Settings > Database Backup** (`/settings/backup`).
2. Click **Create Backup Now**.
3. The system generates an atomic, verified snapshot in `storage/app/backups/` and logs the archive size, timestamp, and status.
4. Click **Download** to save an encrypted copy to a secure offline drive.

### Restoring from an Existing Backup
1. In **Settings > Database Backup**, identify the snapshot you wish to restore.
2. Click the **Restore** button next to the archive.
3. Confirm the restoration warning dialog.
4. The system restores the database and re-verifies referential integrity across all 46 relational tables.

---

## 5. Security & Audit Trail Governance

### Reviewing the System Audit Trail
MediCore Clinic logs all security-sensitive operations to the immutable `audit_logs` table:
- Patient record creations and updates.
- Duplicate patient profile mergers.
- Electronic signatures on medical encounters.
- Cash payments and receipt generation.
- Daily cash register reconciliations.

Each audit entry captures:
- Actor User ID and Name.
- Client IP Address.
- Browser User Agent.
- Action Name and Entity Type.
- JSON diff of previous values vs. new values.

---

## 6. Maintenance & Performance Optimization

### Clearing Application Cache
If you update configuration files or localized translations, execute the following commands via terminal:
```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### Rotating Storage Logs
Application logs are stored in `storage/logs/laravel.log`. To prevent log files from growing excessively:
- Ensure `.env` specifies `LOG_STACK=daily` or configure a system logrotate daemon.
