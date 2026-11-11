import React from 'react';
import { useForm, Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useTranslation } from '@/Utils/translations';
import { Clinic } from '@/types';
import {
    Building2,
    Save,
    Phone,
    Mail,
    Globe,
    MapPin,
    FileText,
    Receipt,
    Percent,
    Clock,
    CheckCircle2,
    ShieldCheck
} from 'lucide-react';

interface Props {
    clinic: Clinic;
}

export default function ClinicSettings({ clinic }: Props) {
    const { t, isRtl } = useTranslation();

    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        name: clinic?.name || '',
        legal_name: clinic?.legal_name || '',
        tax_number: clinic?.tax_number || '',
        phone: clinic?.phone || '',
        email: clinic?.email || '',
        website: clinic?.website || '',
        address: clinic?.address || '',
        country: clinic?.country || 'Morocco',
        timezone: clinic?.timezone || 'Africa/Casablanca',
        currency: clinic?.currency || 'MAD',
        settings: {
            appointment_interval: clinic?.settings?.appointment_interval ?? 30,
            require_phone: clinic?.settings?.require_phone ?? true,
            enable_odontogram: clinic?.settings?.enable_odontogram ?? true,
            enable_ophthalmology: clinic?.settings?.enable_ophthalmology ?? true,
            vat_percentage: clinic?.settings?.vat_percentage ?? 0,
        },
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('settings.clinic.update'));
    };

    return (
        <AuthenticatedLayout>
            <Head title={isRtl ? 'إعدادات وبيانات العيادة - ميديكور' : 'Clinic Settings & Profile - MediCore'} />

            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 text-teal-600 flex items-center justify-center font-bold">
                            <Building2 className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-slate-900">
                                {isRtl ? 'إعدادات وبيانات العيادة الرسمية' : 'Clinic Profile & Official Settings'}
                            </h1>
                            <p className="text-xs text-slate-500 mt-1">
                                {isRtl
                                    ? 'تظهر هذه المعلومات تلقائياً في ترويسة جميع الفواتير الرسمية، الوصفات الطبية (Ordonnances)، ووصولات المرضى.'
                                    : 'These corporate details appear automatically on all official invoices, prescriptions, and patient receipts.'}
                            </p>
                        </div>
                    </div>

                    {recentlySuccessful && (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-xs font-semibold animate-fade-in">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>{isRtl ? 'تم حفظ التعديلات بنجاح!' : 'Settings successfully saved!'}</span>
                        </div>
                    )}
                </div>

                <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left 2 Columns: Main Input Form */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Section 1: Identity & Legal Info */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                                <Building2 className="w-4 h-4 text-teal-600" />
                                <span>{isRtl ? 'الهوية والبيانات القانونية للعيادة' : 'General & Legal Entity Information'}</span>
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="sm:col-span-2">
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                                        {isRtl ? 'اسم العيادة التجاري (الذي يظهر في الواجهة والتقارير)' : 'Clinic Operating Name *'}
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="مثال: عيادة النور التخصصية / Centre Médical Anfa"
                                        className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                                    />
                                    {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                                        {isRtl ? 'الاسم القانوني للشركة / العيادة' : 'Legal / Corporate Registered Name'}
                                    </label>
                                    <input
                                        type="text"
                                        value={data.legal_name}
                                        onChange={(e) => setData('legal_name', e.target.value)}
                                        placeholder="مثال: Clinique Médicale SARL"
                                        className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                                        {isRtl ? 'المعرف الضريبي / الموحد (IF / ICE / Tax ID)' : 'Tax Number / Business Registry / ICE'}
                                    </label>
                                    <input
                                        type="text"
                                        value={data.tax_number}
                                        onChange={(e) => setData('tax_number', e.target.value)}
                                        placeholder="مثال: IF-48291039 / ICE-002918274000082"
                                        className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Contact Information */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                                <Phone className="w-4 h-4 text-teal-600" />
                                <span>{isRtl ? 'معلومات التواصل والعنوان الميداني' : 'Contact Information & Clinic Address'}</span>
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                                        {isRtl ? 'رقم الهاتف الرسمي / الواتساب' : 'Official Phone / WhatsApp'}
                                    </label>
                                    <div className="relative">
                                        <Phone className="w-4 h-4 text-slate-400 absolute start-3 top-2.5" />
                                        <input
                                            type="text"
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            placeholder="+212 522 998877"
                                            className="w-full ps-9 pe-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                                        {isRtl ? 'البريد الإلكتروني للعيادة' : 'Official Clinic Email'}
                                    </label>
                                    <div className="relative">
                                        <Mail className="w-4 h-4 text-slate-400 absolute start-3 top-2.5" />
                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            placeholder="contact@clinic-name.com"
                                            className="w-full ps-9 pe-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                                        {isRtl ? 'الموقع الإلكتروني (إن وجد)' : 'Website URL'}
                                    </label>
                                    <div className="relative">
                                        <Globe className="w-4 h-4 text-slate-400 absolute start-3 top-2.5" />
                                        <input
                                            type="text"
                                            value={data.website}
                                            onChange={(e) => setData('website', e.target.value)}
                                            placeholder="https://clinic-name.com"
                                            className="w-full ps-9 pe-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                                        {isRtl ? 'العملة الافتراضية' : 'Default Currency Code'}
                                    </label>
                                    <input
                                        type="text"
                                        value={data.currency}
                                        onChange={(e) => setData('currency', e.target.value.toUpperCase())}
                                        placeholder="MAD, EUR, USD, SAR"
                                        className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm font-semibold uppercase focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                                    />
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                                        {isRtl ? 'العنوان الجغرافي للعيادة (الشارع، الطابق، المدينة)' : 'Full Clinic Street Address (Prints on Invoices)'}
                                    </label>
                                    <div className="relative">
                                        <MapPin className="w-4 h-4 text-slate-400 absolute start-3 top-2.5" />
                                        <textarea
                                            rows={2}
                                            value={data.address}
                                            onChange={(e) => setData('address', e.target.value)}
                                            placeholder="مثال: شارع أنفا رقم 145، الطابق 4، الدار البيضاء، المغرب"
                                            className="w-full ps-9 pe-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Financial & Operational Rules */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                                <Receipt className="w-4 h-4 text-teal-600" />
                                <span>{isRtl ? 'الإعدادات المالية والتشغيلية' : 'Financial Rules & Clinical Defaults'}</span>
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                                        {isRtl ? 'نسبة الضريبة الافتراضية (TVA %)' : 'Default VAT / Tax Rate (%)'}
                                    </label>
                                    <div className="relative">
                                        <Percent className="w-4 h-4 text-slate-400 absolute start-3 top-2.5" />
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            step="0.1"
                                            value={data.settings.vat_percentage}
                                            onChange={(e) =>
                                                setData('settings', {
                                                    ...data.settings,
                                                    vat_percentage: parseFloat(e.target.value) || 0,
                                                })
                                            }
                                            className="w-full ps-9 pe-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                                        {isRtl ? 'المدة الافتراضية للموعد الطبي (بالدقائق)' : 'Default Consultation Interval (Minutes)'}
                                    </label>
                                    <div className="relative">
                                        <Clock className="w-4 h-4 text-slate-400 absolute start-3 top-2.5" />
                                        <input
                                            type="number"
                                            min="5"
                                            max="180"
                                            step="5"
                                            value={data.settings.appointment_interval}
                                            onChange={(e) =>
                                                setData('settings', {
                                                    ...data.settings,
                                                    appointment_interval: parseInt(e.target.value) || 30,
                                                })
                                            }
                                            className="w-full ps-9 pe-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Save Button */}
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex items-center gap-2 px-6 py-2.5 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white rounded-xl text-sm font-semibold shadow-md shadow-teal-600/20 transition disabled:opacity-50"
                            >
                                <Save className="w-4 h-4" />
                                <span>{processing ? (isRtl ? 'جارٍ الحفظ...' : 'Saving...') : (isRtl ? 'حفظ وتطبيق البيانات' : 'Save & Apply to Invoices')}</span>
                            </button>
                        </div>
                    </div>

                    {/* Right Column: Live Invoice / Prescription Preview */}
                    <div className="space-y-4">
                        <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-sm space-y-4">
                            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center gap-2">
                                    <FileText className="w-4 h-4" />
                                    <span>{isRtl ? 'معاينة ترويسة الفاتورة والوصفة' : 'Live Document Header Preview'}</span>
                                </h3>
                                <span className="text-[10px] bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded-full font-medium">
                                    {isRtl ? 'مباشر' : 'Live'}
                                </span>
                            </div>

                            <p className="text-xs text-slate-400">
                                {isRtl
                                    ? 'هكذا ستظهر معلومات عيادتك في أعلى ورقة الفاتورة الرسمية (Invoice) والوصفة الطبية (Ordonnance):'
                                    : 'This is exactly how your clinic details will print at the top of patient invoices and medical prescriptions:'}
                            </p>

                            {/* Simulated Paper Header */}
                            <div className="bg-white text-slate-900 p-4 rounded-xl border border-slate-200 shadow-inner text-center space-y-1">
                                <div className="inline-flex w-8 h-8 rounded-lg bg-teal-600 text-white items-center justify-center font-bold text-sm mb-1">
                                    M
                                </div>
                                <h4 className="text-sm font-extrabold text-slate-900">
                                    {data.name || (isRtl ? 'اسم العيادة سيظهر هنا' : 'Your Clinic Name Here')}
                                </h4>
                                {data.legal_name && (
                                    <p className="text-[11px] font-medium text-slate-600">{data.legal_name}</p>
                                )}
                                <p className="text-[10px] text-slate-500">
                                    {data.address || (isRtl ? 'عنوان العيادة، الطابق، المدينة' : '123 Healthcare Ave, Floor 2, City')}
                                </p>
                                <div className="text-[10px] text-slate-500 flex flex-wrap items-center justify-center gap-2 pt-1 border-t border-slate-100 mt-2">
                                    {data.phone && <span>📞 {data.phone}</span>}
                                    {data.email && <span>✉️ {data.email}</span>}
                                    {data.tax_number && (
                                        <span className="font-semibold text-slate-700">Tax ID: {data.tax_number}</span>
                                    )}
                                </div>
                            </div>

                            <div className="pt-2 text-[11px] text-slate-400 flex items-start gap-2">
                                <ShieldCheck className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
                                <span>
                                    {isRtl
                                        ? 'يتم تحديث هذه البيانات فوراً في قاعدة البيانات وتنعكس على جميع وثائق العيادة الصادرة دون الحاجة لأي إعادة تشغيل.'
                                        : 'Updates are committed immediately to the database and reflect across all clinic invoices without requiring a restart.'}
                                </span>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
