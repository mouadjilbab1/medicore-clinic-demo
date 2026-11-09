# MediCore Clinic Management System
## Database Backup, Disaster Recovery & Retention Guide

**Product:** MediCore Clinic Management System  
**Version:** 1.0.0 Commercial Release  
**Storage Architecture:** Local Sovereign Relational Database (SQLite or MySQL 8.0+)  

---

## 1. Overview & Sovereignty Principle

MediCore Clinic Management System adheres strictly to an on-premise, sovereign storage model. All patient medical records, clinical notes, appointment bookings, and financial ledgers are stored strictly on the local host.

No customer data is ever mirrored or transmitted to external third-party developer clouds. Consequently, the clinic system administrator is responsible for maintaining disciplined, routine off-site backups.

---

## 2. Backup Methods

### Method 1: Browser One-Click Snapshot (Administrative UI)
1. Sign in as a System Administrator.
2. Navigate to **Settings > Database Backup** (`/settings/backup`).
3. Click **Create Backup Snapshot**.
4. The system locks an atomic read transaction, copies the relational storage engine into a compressed snapshot in `storage/app/backups/`, and displays the file in the snapshot table.
5. Click **Download** to save the archive to an external USB drive or secure local storage.

### Method 2: Automated Background Cron (Laravel Scheduler)
The system is pre-configured with a daily backup job scheduled at 02:00 AM local clinic time.

Ensure the Laravel scheduler is active in your server crontab:
```bash
* * * * * cd /path/to/medicore && php artisan schedule:run >> /dev/null 2>&1
```
On cPanel hosting, add a Cron Job every minute pointing to `php /home/username/public_html/medicore/artisan schedule:run`.

### Method 3: Command Line Snapshot (CLI)
You can trigger a database backup at any time from terminal or PowerShell:
```bash
php artisan backup:run --only-db
```
Or for direct SQLite copy:
```bash
cp database/database.sqlite storage/app/backups/manual_backup_$(date +%Y%m%d_%H%M%S).sqlite
```
Or for MySQL 8.0+:
```bash
mysqldump -u root -p medicore_clinic > storage/app/backups/manual_mysql_$(date +%Y%m%d_%H%M%S).sql
```

---

## 3. Disaster Recovery & Restoration Procedure

### Scenario A: Restoring from UI (Web Browser)
1. Navigate to **Settings > Database Backup**.
2. Locate the desired historical snapshot in the archive table.
3. Click **Restore**.
4. Confirm the warning dialog. The system replaces current relational tables with the verified snapshot state.

### Scenario B: Restoring from File on Disk (Server Recovery)
If server hardware fails and you are migrating to a replacement VPS or hosting account:

1. Deploy a clean copy of the MediCore Clinic codebase.
2. If using SQLite:
   ```bash
   cp /path/to/your/backup_archive.sqlite database/database.sqlite
   chmod 664 database/database.sqlite
   ```
3. If using MySQL:
   ```bash
   mysql -u root -p medicore_clinic < /path/to/your/backup_archive.sql
   ```
4. Verify directory permissions:
   ```bash
   chmod -R 775 storage bootstrap/cache
   ```
5. Clear cached application config:
   ```bash
   php artisan config:clear
   php artisan cache:clear
   ```
6. Sign in to your recovered instance. All historical patients, appointments, and invoices will be intact.

---

## 4. Archive Retention & Storage Hygiene

- **Retention Window:** By default, MediCore retains snapshots for 30 rolling days.
- **Off-Site Air-Gapping:** It is strongly recommended to copy monthly snapshots onto an encrypted physical drive stored in a secure fireproof vault at the clinic.
- **Corrupted Archive Prevention:** Never edit snapshot files in a text editor as this invalidates the binary SQLite header or SQL transaction statements.
