<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" dir="{{ app()->getLocale() === 'ar' ? 'rtl' : 'ltr' }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title inertia>{{ config('app.name', 'MediCore Clinic') }}</title>

    <!-- Google Fonts: Inter & Tajawal (Arabic) -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Tajawal:wght@400;500;700;800&display=swap" rel="stylesheet">

    <!-- Client-Side Route Map -->
    <script>
        const __routes = {
            'dashboard': '/',
            'login': '/login',
            'logout': '/logout',
            'locale.set': '/locale/set',
            'branch.switch': '/branch/switch',
            'patients.index': '/patients',
            'patients.create': '/patients/create',
            'patients.store': '/patients',
            'patients.show': '/patients/{id}',
            'patients.edit': '/patients/{id}/edit',
            'patients.update': '/patients/{id}',
            'patients.destroy': '/patients/{id}',
            'patients.check-duplicates': '/patients/check-duplicates',
            'patients.merge': '/patients/merge',
            'appointments.index': '/appointments',
            'appointments.store': '/appointments',
            'appointments.update-status': '/appointments/{id}/status',
            'appointments.slots': '/appointments/available-slots',
            'waiting-room.index': '/waiting-room',
            'waiting-room.display': '/waiting-room/display',
            'waiting-room.check-in': '/waiting-room/check-in',
            'waiting-room.call': '/waiting-room/{id}/call',
            'waiting-room.complete': '/waiting-room/{id}/complete',
            'waiting-room.skip': '/waiting-room/{id}/skip',
            'waiting-room.transfer': '/waiting-room/{id}/transfer',
            'consultations.index': '/consultations',
            'consultations.create': '/consultations/create',
            'consultations.store': '/consultations',
            'consultations.show': '/consultations/{id}',
            'consultations.update': '/consultations/{id}',
            'consultations.sign': '/consultations/{id}/sign',
            'consultations.diagnosis': '/consultations/{id}/diagnosis',
            'consultations.vitals': '/consultations/{id}/vitals',
            'dental.index': '/specialties/dental',
            'dental.chart': '/specialties/dental/chart',
            'dental.treatment': '/specialties/dental/treatment',
            'ophthalmology.index': '/specialties/ophthalmology',
            'ophthalmology.store': '/specialties/ophthalmology',
            'form-builder.index': '/specialties/form-builder',
            'form-builder.create': '/specialties/form-builder/create',
            'form-builder.store': '/specialties/form-builder',
            'form-builder.show': '/specialties/form-builder/{id}',
            'form-builder.entry': '/specialties/form-builder/{id}/entry',
            'prescriptions.index': '/prescriptions',
            'prescriptions.create': '/prescriptions/create',
            'prescriptions.store': '/prescriptions',
            'prescriptions.show': '/prescriptions/{id}',
            'prescriptions.print': '/prescriptions/{id}/print',
            'billing.index': '/billing',
            'billing.store': '/billing',
            'billing.show': '/billing/{id}',
            'billing.payment': '/billing/{id}/payment',
            'financial.index': '/financial',
            'financial.close-register': '/financial/close-register',
            'financial.expenses.store': '/financial/expenses',
            'inventory.index': '/inventory',
            'inventory.store': '/inventory',
            'inventory.adjust': '/inventory/adjust',
            'laboratory.index': '/laboratory',
            'imaging.index': '/imaging',
            'staff.index': '/staff',
            'staff.store': '/staff',
            'staff.update': '/staff/{id}',
            'settings.clinic': '/settings/clinic',
            'settings.clinic.update': '/settings/clinic',
            'backups.index': '/settings/backup',
            'backup.index': '/settings/backup',
            'backups.create': '/settings/backup/create',
            'backups.download': '/settings/backup/{id}/download',
            'backups.restore': '/settings/backup/{id}/restore',
            'install.index': '/install',
            'install.db.test': '/install/test-db',
            'install.complete': '/install/complete',
            'portal.dashboard': '/portal',
            'portal.appointments.request': '/portal/appointments/request'
        };
        window.route = function(name, params) {
            let url = __routes[name] || '/' + (name ? name.replace(/\./g, '/') : '');
            if (params !== undefined) {
                if (typeof params === 'object') {
                    for (const [k, v] of Object.entries(params)) {
                        url = url.replace('{' + k + '}', v).replace(/\{[^}]+\}/, v);
                    }
                } else {
                    url = url.replace(/\{[^}]+\}/, params);
                }
            }
            return url;
        };
    </script>

    <!-- Scripts and Styles -->
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.tsx'])
    @inertiaHead
</head>
<body class="font-sans antialiased bg-slate-50 text-slate-900 selection:bg-teal-500 selection:text-white">
    @inertia
</body>
</html>
