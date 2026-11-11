# MediCore Clinic v1.0.0 — دليل نشر واستضافة العرض التجريبي (Demo) على GitHub

**المرجع:** `MC-GITHUB-DEMO-GUIDE-2026`  
**الحساب المستهدف:** `mouadjilbab1`  
**اسم المستودع المقترح:** `medicore-clinic-demo` أو `medicore-clinic`  
**التقنيات المستخدمة:** GitHub Codespaces (ديمو سحابي كامل بضغطة زر) + Render.com (رابط مباشر مجاني)  

---

## 1. الحقيقة التقنية: كيف يعمل "الديمو على GitHub"؟

نظام **MediCore Clinic** مبني على تقنيات Full-Stack حقيقية:
- خادم **PHP 8.2+ / Laravel 11**
- واجهة أمامية **React 18 / TypeScript / Tailwind CSS**
- قاعدة بيانات **SQLite أو MySQL** وجلسات مصادقة آمنة (Sessions & Cookies)

> [!NOTE] الفرق بين GitHub Pages و GitHub Codespaces
> - **GitHub Pages:** يدعم فقط الملفات الثابتة (Static HTML/CSS/JS). لا يمكنه تشغيل كود PHP أو قاعدة البيانات مباشرة.
> - **GitHub Codespaces (الحل المثالي على GitHub):** يمنحك GitHub سيرفر Linux سحابي مجاني (Cloud Container) داخل المتصفح. بمجرد ضغط الزائر على زر **"Open in GitHub Codespaces"**، يتم تشغيل بيئة PHP و Laravel وقاعدة بيانات SQLite تلقائياً، ويفتح التطبيق الحقيقي داخل المتصفح بكامل وظائفه خلال 45 ثانية!

---

## 2. ما تم تجهيزه بالفعل في المشروع

لقد قمنا بإعداد وتضمين الملفات التالية داخل المشروع لتشغيل الديمو على GitHub تلقائياً:

1. **مجلد `.devcontainer/`:**
   - ملف `devcontainer.json`: يعرّف بيئة حاوية الديمو مع PHP 8.2 و Node.js 20 وتوجيه المنفذ 8000 لفتحه تلقائياً في المتصفح.
   - ملف `setup.sh`: سكريبت أوتوماتيكي يقوم بتثبيت حزم Composer، وضبط قاعدة بيانات SQLite التجريبية، وتوليد المفتاح، وتنفيذ الترحيلات وتهيئة بيانات المرضى والعيادات الوهمية (`php artisan migrate:fresh --seed`).
2. **ملف `render.yaml`:**
   - يتيح لك ربط مستودع GitHub بحسابك المجاني على [Render.com](https://render.com) للحصول على رابط ديمو حي يعمل 24/7 (مثلاً: `https://medicore-clinic-demo.onrender.com`).
3. **ملف `README.md` الاحترافي:**
   - تم تزويده بشارات التشغيل الفوري (Codespaces Badge)، بيانات تسجيل الدخول التجريبية الجاهزة، ومعرض الصور الاحترافية للشاشات.

---

## 3. خطوات رفع المشروع على حسابك في GitHub (خطوة بخطوة)

### الخطوة 1: إنشاء مستودع جديد على GitHub
1. افتح متصفحك وسجّل الدخول إلى حسابك على GitHub: [https://github.com/new](https://github.com/new)
2. اكتب اسم المستودع (Repository Name):
   `medicore-clinic-demo`
3. اختر نوع المستودع:
   - **Public** (عام) إذا أردت أن يتمكن المشترون والعملاء من تجربة الديمو مباشرة.
   - أو **Private** (خاص) إن كنت تريد إعطاء الوصول لأشخاص محددين.
4. **تنبيه:** لا تضع علامة صح أمام "Add a README file" أو "Add .gitignore" لأنها موجودة وجاهزة بالفعل في المشروع.
5. اضغط على زر **Create repository**.

---

### الخطوة 2: ربط المشروع المحلي ورفعه (أوامر Git)

افتح موجه الأوامر (PowerShell أو Terminal) داخل مجلد المشروع: `d:\work\MEDICORE-CLINIC` ونفّذ الأوامر التالية بالترتيب:

```bash
# 1. إضافة التغييرات والملفات المجهزة (ملفات الديمو، الديف كونتينر، ودليل النشر)
git add .devcontainer/ render.yaml README.md RELEASE/Commercial-Launch/

# 2. إنشاء Commit رسمي للديمو
git commit -m "feat(demo): configure 1-click GitHub Codespaces and commercial demo showcase"

# 3. التأكد من أن الفرع الرئيسي هو main
git branch -M main

# 4. ربط المستودع المحلي بحسابك على GitHub (استبدل mouadjilbab1 إذا كان الحساب مختلفاً)
git remote add origin https://github.com/mouadjilbab1/medicore-clinic-demo.git

# 5. رفع الكود إلى GitHub
git push -u origin main
```

*(إذا طلب منك GitHub تسجيل الدخول، أدخل اسم المستخدم و Personal Access Token أو سجل عبر المتصفح).*

---

## 4. كيف يجرب المشتري أو الطبيب الديمو من GitHub؟

بمجرد فتح صفحة المستودع على GitHub: `https://github.com/mouadjilbab1/medicore-clinic-demo`

### الخيار أ: تشغيل الديمو السحابي بضغطة زر (GitHub Codespaces)
1. يضغط الزائر على شارة:
   [![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/mouadjilbab1/medicore-clinic-demo)
2. يقوم GitHub بتجهيز السيرفر خلال ثوانٍ معدودة.
3. يفتح تطبيق MediCore Clinic مباشرة في المتصفح على العنوان المحلي الموجه.
4. يسجل الدخول بأي من الحسابات التجريبية المسبقة:
   - **حساب الطبيب العام:** `doctor@medicore.local` | كلمة المرور: `DoctorPass123!`
   - **حساب طبيب الأسنان:** `dentist@medicore.local` | كلمة المرور: `DentistPass123!`
   - **حساب الاستقبال:** `receptionist@medicore.local` | كلمة المرور: `ReceptionPass123!`
   - **حساب المدير العام:** `admin@medicore.local` | كلمة المرور: `AdminPass123!`

---

### الخيار ب: الحصول على رابط ديمو دائم 24/7 عبر Render.com (مجاناً)
إذا أردت رابطاً مباشراً مثل `https://medicore-demo.onrender.com` يفتحه العميل بنقرة واحدة من الموبايل أو الكمبيوتر دون الدخول إلى GitHub:
1. اذهب إلى موقع [Render.com](https://render.com) وسجّل الدخول بحساب GitHub الخاص بك.
2. اضغط على **New +** ثم اختر **Blueprint**.
3. اختر مستودع `medicore-clinic-demo`.
4. سيتعرف Render تلقائياً على ملف `render.yaml` المرفق ويقوم بتثبيت التطبيق وتشغيله مجاناً.
5. ستحصل على رابط مباشر دائم يمكنك إرساله للأطباء عبر الواتساب والإيميل.
