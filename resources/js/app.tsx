import '../css/app.css';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';

// Ensure route() helper is universally available across all client environments
if (typeof (window as any).route === 'undefined') {
    const defaultRoutes: Record<string, string> = {
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
        'backups.index': '/settings/backup',
        'backups.create': '/settings/backup/create',
        'backups.download': '/settings/backup/{id}/download',
        'backups.restore': '/settings/backup/{id}/restore',
        'install.index': '/install',
        'install.db.test': '/install/test-db',
        'install.complete': '/install/complete',
        'portal.dashboard': '/portal',
        'portal.appointments.request': '/portal/appointments/request',
    };

    (window as any).route = (name?: string, params?: any) => {
        const routes: Record<string, string> = (window as any).__routes || defaultRoutes;
        let url = routes[name || ''] || '/' + (name ? name.replace(/\./g, '/') : '');
        if (params !== undefined) {
            if (typeof params === 'object') {
                for (const [k, v] of Object.entries(params)) {
                    url = url.replace('{' + k + '}', String(v)).replace(/\{[^}]+\}/, String(v));
                }
            } else {
                url = url.replace(/\{[^}]+\}/, String(params));
            }
        }
        return url;
    };
}

const appName = import.meta.env.VITE_APP_NAME || 'MediCore Clinic';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob('./Pages/**/*.tsx')
        ) as any,
    setup({ el, App, props }) {
        if (el) {
            const root = createRoot(el);
            root.render(<App {...props} />);
        }
    },
    progress: {
        color: '#0d9488',
        showSpinner: true,
    },
});
