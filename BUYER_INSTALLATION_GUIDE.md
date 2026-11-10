# MediCore Clinic — Buyer's Quick Installation Guide
### Ready-to-Install Commercial Edition (No SSH, No Composer, No Node.js Required)

Welcome to **MediCore Clinic Management System**! 

This guide provides simple, step-by-step instructions for installing your new clinic software on **cPanel, Plesk, or any standard web hosting** using only your web browser and hosting file manager.

---

## What You Need Before You Start

1. **A Domain or Subdomain** (e.g., `clinic.yourdomain.com`).
2. **Web Hosting** supporting PHP 8.2 or 8.3 and MySQL 8.0 / MariaDB.
3. Your downloaded file: `MediCore-Clinic-v1.0.0-Ready-to-Install.zip`.

> [!TIP]
> This edition comes with all software dependencies (`vendor/`) and design assets (`public/build/`) completely pre-installed. You do **NOT** need to use SSH, Terminal, Composer, or Node.js.

---

## 5-Step cPanel Installation Walkthrough

```mermaid
flowchart LR
    A["Step 1<br/>Upload & Extract ZIP"] --> B["Step 2<br/>Set Document Root to /public"]
    B --> C["Step 3<br/>Create MySQL Database"]
    C --> D["Step 4<br/>Run /install in Browser"]
    D --> E["Step 5<br/>Log in to Dashboard!"]
```

### Step 1: Upload and Extract the ZIP File
1. Log in to your hosting **cPanel**.
2. Open **File Manager**.
3. Navigate to your user home directory (for example: `/home/username/`).
4. Click **Upload** and upload `MediCore-Clinic-v1.0.0-Ready-to-Install.zip`.
5. Once uploaded, right-click the ZIP file and select **Extract**.
6. Extract the files into a folder named `medicore` (resulting in `/home/username/medicore/`).

---

### Step 2: Point Your Domain to the `/public` Folder
> [!IMPORTANT]
> Like modern web applications, MediCore Clinic requires your domain to point to the `public/` subfolder. This protects your core files from public internet access.

1. In cPanel, click **Domains** (or **Subdomains**).
2. Create or edit your domain (e.g., `clinic.yourdomain.com`).
3. Set the **Document Root** to:
   ```
   /home/username/medicore/public
   ```
4. Save the changes.

---

### Step 3: Create a MySQL Database
1. In cPanel, open **MySQL Database Wizard**.
2. **Step 1:** Enter a database name (e.g., `medicore_db`) and click *Next Step*.
3. **Step 2:** Create a database user (e.g., `medicore_user`) and a strong password. Click *Create User*.
4. **Step 3:** Check the box **ALL PRIVILEGES** and click *Make Changes*.
5. Keep your database name, username, and password handy for the next step!

---

### Step 4: Run the Web Installation Wizard
1. Open your web browser and navigate to:
   ```
   https://clinic.yourdomain.com/install
   ```
2. **Step 1 — System Check:** The wizard automatically verifies your server meets the requirements. Click **Continue**.
3. **Step 2 — Database Setup:**
   - Select **MySQL**.
   - Enter your Database Host (`127.0.0.1` or `localhost`).
   - Enter your Database Port (`3306`).
   - Enter your Database Name, Username, and Password from Step 3.
   - Click **Test Database Connection** to confirm everything connects.
4. **Step 3 — Clinic Setup & Master Admin:**
   - Enter your Clinic Name, Phone, Email, Address, and Currency.
   - Create your personal Administrator Name, Email, and Password.
   - *(Optional)* Check **Seed Demo Data** if you want sample patients and doctors to explore. Leave it unchecked for a fresh, clean start.
5. Click **Complete Installation**.

---

### Step 5: Log In and Start Managing Your Clinic!
The installer automatically builds your database tables, secures the system, and redirects you to the login page.
1. Enter your newly created Administrator Email and Password.
2. Welcome to your **MediCore Clinic Dashboard**!

---

## Important Maintenance Notes

### 1. Enabling HTTPS / SSL
Ensure your domain has an active SSL certificate (such as free Let's Encrypt / cPanel AutoSSL) so all patient health records and logins are encrypted.

### 2. File Permissions
If your server reports permission warnings, ensure the following folders are writable:
- `storage/` (chmod 775)
- `bootstrap/cache/` (chmod 775)

### 3. Automated Daily Backups
To enable automated backups and appointment reminders, go to cPanel **Cron Jobs** and add:
```bash
* * * * * cd /home/username/medicore && php artisan schedule:run >> /dev/null 2>&1
```

---

## Need Assistance?
Consult the included operational guides:
- [USER_MANUAL.md](USER_MANUAL.md) — Operational guide for doctors, receptionists, and accountants.
- [ADMIN_GUIDE.md](ADMIN_GUIDE.md) — Staff management, branch setup, and permissions.
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) — Common questions and solutions.
