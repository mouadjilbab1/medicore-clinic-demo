import React, { useState, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { useTranslation } from '@/Utils/translations';
import {
    LayoutDashboard,
    Users,
    Calendar,
    Clock,
    Stethoscope,
    FileText,
    Smile,
    Eye,
    FormInput,
    Pill,
    Receipt,
    DollarSign,
    Package,
    FlaskConical,
    Camera,
    UserCheck,
    HardDriveDownload,
    LogOut,
    Menu,
    X,
    Globe,
    Building2,
    ChevronDown,
    AlertTriangle,
    CheckCircle2,
    Info,
    ExternalLink,
} from 'lucide-react';

interface Props {
    children: React.ReactNode;
    title?: string;
}

export default function AuthenticatedLayout({ children, title }: Props) {
    const { props } = usePage<PageProps>();
    const { auth, clinic, flash } = props;
    const { t, locale, isRtl } = useTranslation();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [localeDropdownOpen, setLocaleDropdownOpen] = useState(false);
    const [branchDropdownOpen, setBranchDropdownOpen] = useState(false);

    // Synchronize HTML direction attribute
    useEffect(() => {
        document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
        document.documentElement.lang = locale;
    }, [isRtl, locale]);

    const navItems = [
        { name: t('nav.dashboard', 'Dashboard'), href: route('dashboard'), icon: LayoutDashboard },
        { name: t('nav.patients', 'Patients'), href: route('patients.index'), icon: Users },
        { name: t('nav.appointments', 'Appointments'), href: route('appointments.index'), icon: Calendar },
        { name: t('nav.waiting_room', 'Waiting Room'), href: route('waiting-room.index'), icon: Clock },
        { name: t('nav.consultations', 'Consultations'), href: route('consultations.index'), icon: Stethoscope },
        { name: t('nav.dental', 'Dental (Odontogram)'), href: route('dental.index'), icon: Smile },
        { name: t('nav.ophthalmology', 'Ophthalmology'), href: route('ophthalmology.index'), icon: Eye },
        { name: t('nav.form_builder', 'Form Builder'), href: route('form-builder.index'), icon: FormInput },
        { name: t('nav.prescriptions', 'Prescriptions'), href: route('prescriptions.index'), icon: Pill },
        { name: t('nav.billing', 'Billing & Invoices'), href: route('billing.index'), icon: Receipt },
        { name: t('nav.expenses', 'Financial & Cash'), href: route('financial.index'), icon: DollarSign },
        { name: t('nav.inventory', 'Pharmacy & Stock'), href: route('inventory.index'), icon: Package },
        { name: t('nav.laboratory', 'Laboratory'), href: route('laboratory.index'), icon: FlaskConical },
        { name: t('nav.imaging', 'Imaging & Radiology'), href: route('imaging.index'), icon: Camera },
        { name: t('nav.staff', 'Staff & Doctors'), href: route('staff.index'), icon: UserCheck },
        { name: 'Database Backup', href: route('backup.index'), icon: HardDriveDownload },
    ];

    const changeLocale = (newLocale: string) => {
        setLocaleDropdownOpen(false);
        router.post(route('locale.set'), { locale: newLocale }, { preserveScroll: true });
    };

    const switchBranch = (branchId: number) => {
        setBranchDropdownOpen(false);
        router.post(route('branch.switch'), { branch_id: branchId }, { preserveScroll: true });
    };

    return (
        <div className={`min-h-screen bg-slate-50 flex flex-col ${isRtl ? 'font-arabic' : 'font-sans'}`}>
            {/* Top Navigation Bar */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
                <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
                        >
                            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                        <Link href={route('dashboard')} className="flex items-center gap-2">
                            <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                                M
                            </div>
                            <div className="hidden sm:block">
                                <span className="font-bold text-lg text-slate-800 tracking-tight">MediCore</span>
                                <span className="text-teal-600 font-semibold text-xs ms-1.5 uppercase tracking-wider px-1.5 py-0.5 bg-teal-50 rounded border border-teal-200">
                                    Clinic
                                </span>
                            </div>
                        </Link>
                    </div>

                    {/* Middle: Active Clinic & Branch Context */}
                    <div className="hidden md:flex items-center gap-4 text-sm">
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setBranchDropdownOpen(!branchDropdownOpen)}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition"
                            >
                                <Building2 className="w-4 h-4 text-teal-600" />
                                <span>{auth?.current_branch?.name || clinic?.name || 'Main Clinic'}</span>
                                <ChevronDown className="w-4 h-4 text-slate-400" />
                            </button>

                            {branchDropdownOpen && auth?.branches && auth.branches.length > 0 && (
                                <div className={`absolute top-full mt-1 w-56 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50 ${isRtl ? 'left-0' : 'right-0'}`}>
                                    <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase">
                                        {t('nav.branch', 'Branches')}
                                    </div>
                                    {auth.branches.map((b) => (
                                        <button
                                            key={b.id}
                                            onClick={() => switchBranch(b.id)}
                                            className={`w-full text-start px-3 py-2 text-sm hover:bg-slate-50 flex items-center justify-between ${
                                                auth.current_branch?.id === b.id ? 'text-teal-600 font-semibold bg-teal-50/50' : 'text-slate-700'
                                            }`}
                                        >
                                            <span>{b.name}</span>
                                            {b.is_main && (
                                                <span className="text-[10px] bg-slate-200 text-slate-600 px-1 rounded">Main</span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Public Waiting Display Shortcut */}
                        <Link
                            href={route('waiting-room.display')}
                            target="_blank"
                            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-teal-600 bg-slate-100 hover:bg-teal-50 px-2.5 py-1.5 rounded-lg border border-slate-200 transition"
                        >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Waiting Board</span>
                        </Link>
                    </div>

                    {/* Right: Language Switcher, User Dropdown */}
                    <div className="flex items-center gap-3">
                        {/* Language Selector */}
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setLocaleDropdownOpen(!localeDropdownOpen)}
                                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 text-sm font-medium"
                            >
                                <Globe className="w-4 h-4 text-slate-500" />
                                <span className="uppercase">{locale}</span>
                                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                            </button>

                            {localeDropdownOpen && (
                                <div className={`absolute top-full mt-1 w-32 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50 ${isRtl ? 'left-0' : 'right-0'}`}>
                                    <button
                                        onClick={() => changeLocale('ar')}
                                        className="w-full text-start px-3 py-1.5 text-sm hover:bg-slate-50 flex items-center justify-between text-slate-700"
                                    >
                                        <span>العربية</span>
                                        {locale === 'ar' && <span className="text-teal-600 font-bold">✓</span>}
                                    </button>
                                    <button
                                        onClick={() => changeLocale('fr')}
                                        className="w-full text-start px-3 py-1.5 text-sm hover:bg-slate-50 flex items-center justify-between text-slate-700"
                                    >
                                        <span>Français</span>
                                        {locale === 'fr' && <span className="text-teal-600 font-bold">✓</span>}
                                    </button>
                                    <button
                                        onClick={() => changeLocale('en')}
                                        className="w-full text-start px-3 py-1.5 text-sm hover:bg-slate-50 flex items-center justify-between text-slate-700"
                                    >
                                        <span>English</span>
                                        {locale === 'en' && <span className="text-teal-600 font-bold">✓</span>}
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* User Profile */}
                        <div className="flex items-center gap-2 ps-2 border-s border-slate-200">
                            <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs uppercase">
                                {auth?.user?.name ? auth.user.name.charAt(0) : 'U'}
                            </div>
                            <div className="hidden lg:block text-start">
                                <div className="text-xs font-semibold text-slate-800 leading-tight">
                                    {auth?.user?.name}
                                </div>
                                <div className="text-[10px] text-slate-500 capitalize">
                                    {auth?.user?.role}
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => router.post(route('logout'))}
                                title={t('nav.logout', 'Log Out')}
                                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                            >
                                <LogOut className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Application Body */}
            <div className="flex-1 flex">
                {/* Desktop Sidebar */}
                <aside className="hidden lg:block w-64 bg-white border-e border-slate-200 flex-shrink-0">
                    <div className="p-4 space-y-1">
                        <div className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                            Clinical Modules
                        </div>
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = window.location.pathname === new URL(item.href, window.location.origin).pathname;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                                        isActive
                                            ? 'bg-teal-50 text-teal-700 border-s-4 border-teal-600 font-semibold'
                                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                    }`}
                                >
                                    <Icon className={`w-4 h-4 ${isActive ? 'text-teal-600' : 'text-slate-400'}`} />
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                    </div>
                </aside>

                {/* Mobile Sidebar Drawer */}
                {sidebarOpen && (
                    <div className="lg:hidden fixed inset-0 z-50 flex">
                        <div
                            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
                            onClick={() => setSidebarOpen(false)}
                        />
                        <div className="relative w-72 bg-white h-full shadow-2xl p-4 overflow-y-auto">
                            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-4">
                                <span className="font-bold text-slate-800 text-lg">Navigation</span>
                                <button
                                    onClick={() => setSidebarOpen(false)}
                                    className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="space-y-1">
                                {navItems.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={() => setSidebarOpen(false)}
                                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
                                        >
                                            <Icon className="w-4 h-4 text-slate-400" />
                                            <span>{item.name}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {/* Main Content Area */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
                    {/* Flash Notifications */}
                    {flash?.success && (
                        <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 shadow-sm">
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                            <span className="text-sm font-medium">{flash.success}</span>
                        </div>
                    )}
                    {flash?.error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 flex items-center gap-3 shadow-sm">
                            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
                            <span className="text-sm font-medium">{flash.error}</span>
                        </div>
                    )}
                    {flash?.warning && (
                        <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 flex items-center gap-3 shadow-sm">
                            <Info className="w-5 h-5 text-amber-600 flex-shrink-0" />
                            <span className="text-sm font-medium">{flash.warning}</span>
                        </div>
                    )}

                    {children}
                </main>
            </div>
        </div>
    );
}
