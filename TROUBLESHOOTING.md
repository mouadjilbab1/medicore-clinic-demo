# MediCore Clinic — Troubleshooting & Support Runbook

This document addresses common installation, configuration, and runtime issues encountered across different self-hosted environments.

---

## 1. Installation Wizard Issues

### Issue: The browser shows a 500 Internal Server Error when opening `/install`
- **Cause:** Missing file permissions on `storage/` or `bootstrap/cache/`, or missing `.env` file.
- **Solution:**
  1. Ensure `.env` exists in the application root (copy from `.env.production.example`).
  2. Run `chmod -R 775 storage bootstrap/cache`.
  3. Ensure the web server user owns the directory: `chown -R www-data:www-data /var/www/medicore`.

### Issue: Visiting the site redirects in an infinite loop
- **Cause:** Incorrect web server Document Root configuration or missing `APP_URL`.
- **Solution:**
  - Verify your web server Document Root points directly to `/var/www/medicore/public` (NOT the parent `/var/www/medicore`).
  - Verify that `APP_URL` in `.env` matches your exact protocol and domain (e.g., `https://clinic.example.com`).

### Issue: "The installer is locked" or cannot access `/install`
- **Cause:** The system creates `storage/installed` upon completing installation to prevent unauthorized resets.
- **Solution:**
  - If you legitimately need to re-run the wizard on a fresh installation, delete the lock file:
    ```bash
    rm storage/installed
    ```
  - *Warning: Never delete `storage/installed` on a production clinic database with active patient records.*

---

## 2. Database Connection Issues

### Issue: `SQLSTATE[HY000] [1045] Access denied for user 'root'@'localhost'`
- **Cause:** MySQL requires a password or the specified database user does not have permissions on the clinic database.
- **Solution:**
  1. Verify your MySQL credentials by logging in directly from terminal:
     ```bash
     mysql -u medicore_user -p medicore_clinic
     ```
  2. Grant all privileges to the user:
     ```sql
     GRANT ALL PRIVILEGES ON medicore_clinic.* TO 'medicore_user'@'localhost';
     FLUSH PRIVILEGES;
     ```
  3. Update `.env` with the exact credentials.

### Issue: `SQLSTATE[HY000] [2002] Connection refused`
- **Cause:** MySQL service is not running or is listening on a different port/socket.
- **Solution:**
  - Check service status: `sudo systemctl status mysql` (Linux) or `Get-Service MySQL*` (Windows).
  - Use `127.0.0.1` instead of `localhost` in `.env` to enforce TCP socket connection.

---

## 3. White Screen or React Assets Not Loading

### Issue: Page displays a blank white screen with console error: `Failed to load module script`
- **Cause:** The web server is not serving files from `/public/build` with proper MIME types, or assets were not pre-compiled.
- **Solution:**
  1. Confirm that `public/build/manifest.json` exists.
  2. Verify Nginx/Apache configuration allows access to `/public/build/assets/`.
  3. If you modified React source files, recompile the production bundles:
     ```bash
     npm run build
     ```

---

## 4. Permission Denied on File Uploads & Backups

### Issue: Error when uploading patient documents or generating database backups
- **Cause:** Web server lacks write access to `storage/app/backups` or `storage/app/public`.
- **Solution:**
  ```bash
  mkdir -p storage/app/backups
  sudo chown -R www-data:www-data storage
  sudo chmod -R 775 storage
  ```

---

## 5. Queue & Background Task Stoppage

### Issue: Email notifications or asynchronous tasks are not sending
- **Cause:** Queue driver is set to `database` or `redis` but no background worker is running.
- **Solution:**
  1. For simple deployments, set `QUEUE_CONNECTION=sync` in `.env` to process tasks synchronously.
  2. For high-volume clinics, run the worker via Supervisor or terminal:
     ```bash
     php artisan queue:work --tries=3
     ```
