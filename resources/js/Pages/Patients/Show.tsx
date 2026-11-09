import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useTranslation, formatCurrency } from '@/Utils/translations';
import {
    User,
    Phone,
    Mail,
    MapPin,
    AlertTriangle,
    Calendar,
    Stethoscope,
    Receipt,
    Smile,
    FileText,
    HeartPulse,
    ArrowLeft,
    Clock,
    Plus,
    CreditCard,
    Pill,
    Printer,
    Download,
} from 'lucide-react';
import { Patient } from '@/types';

interface Props {
    patient: Patient & {
        allergies: any[];
        documents: any[];
        appointments: any[];
        consultations: any[];
        invoices: any[];
        dentalTreatments: any[];
        dentalTeeth: any[];
    };
    timeline: Array<{
        type: string;
        date: string;
        title: string;
        description: string;
        doctor?: string;
        status?: string;
        amount?: number;
        id: number;
    }>;
}

export default function PatientsShow({ patient, timeline }: Props) {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<'timeline' | 'consultations' | 'dental' | 'prescriptions' | 'billing'>('timeline');

    return (
        <AuthenticatedLayout>
            <Head title={`${patient.full_name} (${patient.patient_uid}) - MediCore`} />

            <div className="space-y-6">
                {/* Back Link & Quick Actions Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <Link href={route('patients.index')} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                            Electronic Health Record (EHR)
                        </h1>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link
                            href={route('consultations.create', { patient_id: patient.id })}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 shadow-sm transition"
                        >
                            <Stethoscope className="w-4 h-4" />
                            <span>Start Consultation</span>
                        </Link>
                        <Link
                            href={route('dental.index', { patient_id: patient.id })}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-sm transition"
                        >
                            <Smile className="w-4 h-4 text-teal-600" />
                            <span>Odontogram</span>
                        </Link>
                        <Link
                            href={route('patients.edit', patient.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition"
                        >
                            <span>Edit Demographics</span>
                        </Link>
                    </div>
                </div>

                {/* Patient Profile Card & Clinical Flags Banner */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-2xl bg-teal-700 text-white flex items-center justify-center font-bold text-2xl shadow-md uppercase">
                                    {patient.first_name.charAt(0)}{patient.last_name.charAt(0)}
                                </div>
                                <div>
                                    <div className="flex items-center gap-3">
                                        <h2 className="text-xl font-bold text-slate-900">
                                            {patient.full_name}
                                        </h2>
                                        <span className="font-mono text-xs font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                                            {patient.patient_uid}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-500 mt-1">
                                        <span>Age: <strong>{patient.age ? `${patient.age} years` : '—'}</strong> ({patient.date_of_birth})</span>
                                        <span>•</span>
                                        <span className="capitalize">Gender: <strong>{patient.gender}</strong></span>
                                        <span>•</span>
                                        <span>Blood: <strong className="text-rose-600">{patient.blood_group || 'Unknown'}</strong></span>
                                        {patient.national_id && (
                                            <>
                                                <span>•</span>
                                                <span>CIN: <strong>{patient.national_id}</strong></span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Contact Snippets */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                                <div className="flex items-center gap-2 text-slate-700">
                                    <Phone className="w-4 h-4 text-slate-400" />
                                    <span className="font-mono">{patient.phone}</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-700">
                                    <MapPin className="w-4 h-4 text-slate-400" />
                                    <span>{patient.city || 'Casablanca'}</span>
                                </div>
                                {patient.emergency_contact_phone && (
                                    <div className="sm:col-span-2 text-[11px] text-slate-500">
                                        Emergency: <strong>{patient.emergency_contact_name}</strong> ({patient.emergency_contact_phone})
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Critical Allergies & Chronic Alert Banner */}
                        {(patient.allergies_summary || patient.chronic_conditions_summary) && (
                            <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-3">
                                {patient.allergies_summary && (
                                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 flex items-start gap-2.5">
                                        <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <span className="font-bold uppercase tracking-wider text-[10px] text-rose-700 block">
                                                Active Drug & Substance Allergies
                                            </span>
                                            <span>{patient.allergies_summary}</span>
                                        </div>
                                    </div>
                                )}

                                {patient.chronic_conditions_summary && (
                                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
                                        <HeartPulse className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <span className="font-bold uppercase tracking-wider text-[10px] text-amber-700 block">
                                                Chronic Diseases / Ongoing Care
                                            </span>
                                            <span>{patient.chronic_conditions_summary}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Navigation Tabs */}
                    <div className="px-6 border-t border-slate-200 bg-slate-50 flex items-center gap-2 overflow-x-auto">
                        <button
                            onClick={() => setActiveTab('timeline')}
                            className={`py-3 px-3 text-xs font-semibold border-b-2 transition ${
                                activeTab === 'timeline'
                                    ? 'border-teal-600 text-teal-700'
                                    : 'border-transparent text-slate-500 hover:text-slate-700'
                            }`}
                        >
                            Chronological Timeline ({timeline.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('consultations')}
                            className={`py-3 px-3 text-xs font-semibold border-b-2 transition ${
                                activeTab === 'consultations'
                                    ? 'border-teal-600 text-teal-700'
                                    : 'border-transparent text-slate-500 hover:text-slate-700'
                            }`}
                        >
                            Clinical Encounters ({patient.consultations?.length || 0})
                        </button>
                        <button
                            onClick={() => setActiveTab('dental')}
                            className={`py-3 px-3 text-xs font-semibold border-b-2 transition ${
                                activeTab === 'dental'
                                    ? 'border-teal-600 text-teal-700'
                                    : 'border-transparent text-slate-500 hover:text-slate-700'
                            }`}
                        >
                            Dental Treatments ({patient.dentalTreatments?.length || 0})
                        </button>
                        <button
                            onClick={() => setActiveTab('billing')}
                            className={`py-3 px-3 text-xs font-semibold border-b-2 transition ${
                                activeTab === 'billing'
                                    ? 'border-teal-600 text-teal-700'
                                    : 'border-transparent text-slate-500 hover:text-slate-700'
                            }`}
                        >
                            Invoices & Receipts ({patient.invoices?.length || 0})
                        </button>
                    </div>
                </div>

                {/* Tab Content 1: Unified Medical Timeline */}
                {activeTab === 'timeline' && (
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <h3 className="font-bold text-slate-900 text-sm mb-4">Patient Journey Timeline</h3>
                        <div className="relative border-s-2 border-slate-200 ms-4 space-y-6">
                            {timeline.length === 0 ? (
                                <p className="text-xs text-slate-400 ps-4">No events recorded in patient timeline yet.</p>
                            ) : (
                                timeline.map((item, idx) => (
                                    <div key={idx} className="relative ps-6">
                                        <div className="absolute -start-2 top-1 w-4 h-4 rounded-full bg-white border-2 border-teal-600" />
                                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 hover:bg-slate-100/60 transition">
                                            <div className="flex items-center justify-between text-xs mb-1">
                                                <span className="font-bold text-slate-900">{item.title}</span>
                                                <span className="text-[11px] text-slate-400 font-mono">{item.date}</span>
                                            </div>
                                            <p className="text-xs text-slate-600">{item.description}</p>
                                            {item.doctor && (
                                                <div className="text-[11px] text-teal-700 font-medium mt-1">
                                                    Attending: {item.doctor}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {/* Tab Content 2: Consultations List */}
                {activeTab === 'consultations' && (
                    <div className="space-y-4">
                        {patient.consultations.length === 0 ? (
                            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-400 text-xs">
                                No clinical consultations recorded for this patient.
                            </div>
                        ) : (
                            patient.consultations.map((c) => (
                                <div key={c.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                        <div>
                                            <div className="text-sm font-bold text-slate-900">{c.chief_complaint}</div>
                                            <div className="text-xs text-slate-400">
                                                {new Date(c.consultation_date).toLocaleDateString()} with {c.doctor?.user?.name}
                                            </div>
                                        </div>
                                        <Link
                                            href={route('consultations.show', c.id)}
                                            className="px-3 py-1.5 rounded-lg bg-teal-50 text-teal-700 hover:bg-teal-100 font-semibold text-xs transition"
                                        >
                                            View Full Consultation Record →
                                        </Link>
                                    </div>

                                    {c.clinical_assessment && (
                                        <div className="text-xs text-slate-700">
                                            <span className="font-semibold text-slate-900">Assessment: </span>
                                            {c.clinical_assessment}
                                        </div>
                                    )}

                                    {c.diagnoses && c.diagnoses.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 pt-2">
                                            {c.diagnoses.map((d: any) => (
                                                <span key={d.id} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-semibold border border-slate-200">
                                                    {d.icd10_code ? `[${d.icd10_code}] ` : ''}{d.diagnosis_name}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* Tab Content 3: Dental Treatments */}
                {activeTab === 'dental' && (
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-slate-900 text-sm">Dental Procedures & Treatment Plan</h3>
                            <Link
                                href={route('dental.index', { patient_id: patient.id })}
                                className="text-xs font-semibold text-teal-700 hover:underline"
                            >
                                Open Interactive 2D Odontogram →
                            </Link>
                        </div>

                        {patient.dentalTreatments.length === 0 ? (
                            <p className="text-xs text-slate-400 py-4">No dental procedures recorded.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-start text-xs">
                                    <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                                        <tr>
                                            <th className="px-4 py-2.5 text-start font-semibold">Tooth #</th>
                                            <th className="px-4 py-2.5 text-start font-semibold">Procedure</th>
                                            <th className="px-4 py-2.5 text-start font-semibold">Dentist</th>
                                            <th className="px-4 py-2.5 text-start font-semibold">Stage</th>
                                            <th className="px-4 py-2.5 text-end font-semibold">Fee</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {patient.dentalTreatments.map((tr) => (
                                            <tr key={tr.id}>
                                                <td className="px-4 py-3 font-bold font-mono text-teal-700">
                                                    {tr.tooth_number ? `Tooth #${tr.tooth_number}` : 'General'}
                                                </td>
                                                <td className="px-4 py-3 font-medium text-slate-800">{tr.procedure_name}</td>
                                                <td className="px-4 py-3">{tr.doctor?.user?.name}</td>
                                                <td className="px-4 py-3">
                                                    <span className="capitalize px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700">
                                                        {tr.stage}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-end font-bold text-slate-900">{tr.cost} MAD</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* Tab Content 4: Invoices & Billing */}
                {activeTab === 'billing' && (
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-slate-900 text-sm">Financial Invoices & Payment Ledger</h3>
                            <Link
                                href={route('billing.index')}
                                className="text-xs font-semibold text-teal-700 hover:underline"
                            >
                                Cashier Module →
                            </Link>
                        </div>

                        {patient.invoices.length === 0 ? (
                            <p className="text-xs text-slate-400 py-4">No billing transactions recorded.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-start text-xs">
                                    <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                                        <tr>
                                            <th className="px-4 py-2.5 text-start font-semibold">Invoice #</th>
                                            <th className="px-4 py-2.5 text-start font-semibold">Date</th>
                                            <th className="px-4 py-2.5 text-start font-semibold">Total</th>
                                            <th className="px-4 py-2.5 text-start font-semibold">Paid</th>
                                            <th className="px-4 py-2.5 text-start font-semibold">Balance</th>
                                            <th className="px-4 py-2.5 text-start font-semibold">Status</th>
                                            <th className="px-4 py-2.5 text-end font-semibold">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {patient.invoices.map((inv) => (
                                            <tr key={inv.id}>
                                                <td className="px-4 py-3 font-mono font-bold text-teal-700">{inv.invoice_number}</td>
                                                <td className="px-4 py-3">{inv.invoice_date}</td>
                                                <td className="px-4 py-3 font-bold">{inv.total_amount} MAD</td>
                                                <td className="px-4 py-3 text-emerald-600 font-semibold">{inv.paid_amount} MAD</td>
                                                <td className="px-4 py-3 text-rose-600 font-semibold">{inv.balance_due} MAD</td>
                                                <td className="px-4 py-3">
                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                                                        inv.status === 'paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                                                    }`}>
                                                        {inv.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-end">
                                                    <Link
                                                        href={route('billing.show', inv.id)}
                                                        className="text-teal-700 font-semibold hover:underline"
                                                    >
                                                        Receipt / Statement →
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
