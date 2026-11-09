# MediCore Clinic — Backup & Disaster Recovery Guide

This runbook provides complete operational procedures for creating, verifying, scheduling, and restoring database backups in **MediCore Clinic Management System**.

---

## 1. Backup Strategy Overview

Medical records, odontograms, optical refractions, and patient accounting data require a strict **3-2-1 backup strategy**:
- **3 copies** of all clinical data.
- **2 different media types** (e.g., local server SSD + external NAS or secondary hard drive).
- **1 copy stored off-site** or on an encrypted, air-gapped storage device.

MediCore Clinic features a built-in automated backup subsystem that produces self-contained, verified database snapshots with zero external cloud dependencies.

---

## 2. On-Demand Backup via Administrator GUI

Super Administrators (`admin`) and Medical Directors (`director`) can generate and restore backups directly from the web interface:

### Step-by-Step Manual Backup:
1. Log in to the MediCore Clinic administrative console.
2. Navigate to **Settings > Database Backup** (`/settings/backup`).
3. Click the **Create Backup Now** button.
4. The system executes an atomic snapshot:
   - For **SQLite**: A complete atomic copy of the physical database file with WAL flush.
   - For **MySQL**: A complete ANSI SQL dump with foreign key checks and transaction wrappers.
5. The snapshot is stored in `storage/app/backups/medicore_backup_YYYY-MM-DD_HH-mm-ss.[sql|sqlite]`.
6. Click the **Download** icon to save the archive to your local workstation.

---

## 3. Disaster Recovery & Restoration

### Restoring from the Admin Web Interface
1. Navigate to **Settings > Database Backup**.
2. Locate the target backup in the history table.
3. Click **Restore**.
4. Confirm the warning prompt:
   > *Caution: Restoring a backup snapshot will overwrite the current active database with the state captured in the selected archive.*
5. The system restores the database and purges connection caches.

### Manual Disaster Recovery via Command Line

If the web server is unavailable due to hardware failure, you can restore manually:

#### For SQLite Deployments:
```bash
# 1. Stop web server temporarily
sudo systemctl stop nginx

# 2. Copy the backup file over the active database
cp storage/app/backups/medicore_backup_2026-11-09_12-00-00.sqlite database/database.sqlite

# 3. Ensure proper file permissions
sudo chown -R www-data:www-data database/database.sqlite
sudo chmod 664 database/database.sqlite

# 4. Restart web server
sudo systemctl start nginx
```

#### For MySQL 8.0 Deployments:
```bash
# 1. Restore the SQL dump into the active MySQL database
mysql -u medicore_user -p medicore_clinic < storage/app/backups/medicore_backup_2026-11-09_12-00-00.sql

# 2. Clear Laravel cached schema
php artisan cache:clear
php artisan optimize:clear
```

---

## 4. Automated Nightly Backups (Cron Schedule)

To ensure backups occur automatically without human intervention, configure a scheduled cron job:

### Step 1: Verify Laravel Scheduler
Ensure Laravel's task scheduler is running in your server's crontab:
```bash
* * * * * cd /var/www/medicore && php artisan schedule:run >> /dev/null 2>&1
```

### Step 2: Custom Daily Backup Script (Optional Linux Script)
Create a standalone bash script `/usr/local/bin/backup-medicore.sh`:
```bash
#!/bin/bash
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
BACKUP_DIR="/var/backups/medicore"
APP_DIR="/var/www/medicore"

mkdir -p $BACKUP_DIR

# Trigger Laravel internal backup
cd $APP_DIR && php artisan tinker --execute="app(\App\Services\BackupService::class)->createDatabaseBackup(1);"

# Copy latest backup to external secondary storage
cp $APP_DIR/storage/app/backups/* $BACKUP_DIR/

# Delete backups older than 30 days
find $BACKUP_DIR -type f -name "*.sqlite" -mtime +30 -delete
find $BACKUP_DIR -type f -name "*.sql" -mtime +30 -delete
```
Make the script executable:
```bash
chmod +x /usr/local/bin/backup-medicore.sh
```
Schedule it to run every night at 2:00 AM:
```bash
0 2 * * * /usr/local/bin/backup-medicore.sh >> /var/log/medicore_backup.log 2>&1
```

---

## 5. Backup Archive Integrity Verification

MediCore Clinic includes automated header integrity checks. When a backup is selected for restore:
- The system checks that the file exists and is readable on disk.
- The system checks that the archive size is greater than the minimum threshold (rejecting 0-byte or corrupted archives).
- If corruption is detected, an `InvalidArgumentException` is thrown and the active database is left untouched.
