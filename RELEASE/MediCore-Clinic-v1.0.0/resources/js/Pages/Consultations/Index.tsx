import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useTranslation } from '@/Utils/translations';
import { Stethoscope, Plus, Eye, CheckCircle2, FileEdit } from 'lucide-react';
import { Consultation, Doctor, PaginatedData } from '@/types';

interface Props {
    consultations: PaginatedData<Consultation>;
    doctors: Doctor[];
}

export default function ConsultationsIndex({ consultations, doctors }: Props) {
    const { t } = useTranslation();

    return (
        <AuthenticatedLayout>
            <Head title="Clinical Consultations - MediCore" />

            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                            {t('nav.consultations', 'Clinical Encounters & Consultations')}
                        </h1>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Electronic medical notes, vital indicators, ICD-10 diagnoses, and physician digital sign-offs
                        </p>
                    </div>

                    <Link
                        href={route('consultations.create')}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 shadow-sm transition"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Start New Encounter</span>
                    </Link>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-start text-xs">
                            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-3.5 text-start font-semibold">Date & Time</th>
                                    <th className="px-6 py-3.5 text-start font-semibold">Patient</th>
                                    <th className="px-6 py-3.5 text-start font-semibold">Attending Doctor</th>
                                    <th className="px-6 py-3.5 text-start font-semibold">Chief Complaint</th>
                                    <th className="px-6 py-3.5 text-start font-semibold">Diagnoses (ICD-10)</th>
                                    <th className="px-6 py-3.5 text-start font-semibold">Status</th>
                                    <th className="px-6 py-3.5 text-end font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-700">
                                {consultations.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                                            No clinical consultations recorded.
                                        </td>
                                    </tr>
                                ) : (
                                    consultations.data.map((c) => (
                                        <tr key={c.id} className="hover:bg-slate-50/80 transition">
                                            <td className="px-6 py-3.5 font-mono text-slate-800 font-semibold">
                                                {new Date(c.consultation_date).toLocaleDateString()} {new Date(c.consultation_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </td>
                                            <td className="px-6 py-3.5">
                                                <Link
                                                    href={route('patients.show', c.patient_id)}
                                                    className="font-bold text-teal-700 hover:underline block"
                                                >
                                                    {c.patient?.full_name}
                                                </Link>
                                                <span className="text-[10px] text-slate-400">{c.patient?.patient_uid}</span>
                                            </td>
                                            <td className="px-6 py-3.5 font-medium">{c.doctor?.user?.name}</td>
                                            <td className="px-6 py-3.5 max-w-xs truncate text-slate-900 font-medium">
                                                {c.chief_complaint}
                                            </td>
                                            <td className="px-6 py-3.5">
                                                {c.diagnoses && c.diagnoses.length > 0 ? (
                                                    <span className="font-semibold text-slate-800">
                                                        {c.diagnoses[0].diagnosis_name}
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-400">Unspecified</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-3.5">
                                                <span
                                                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                                        c.is_finalized
                                                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                                                    }`}
                                                >
                                                    {c.is_finalized ? 'Finalized & Signed' : 'Draft In Progress'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3.5 text-end">
                                                <Link
                                                    href={route('consultations.show', c.id)}
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-teal-50 text-teal-700 hover:bg-teal-100 font-semibold text-xs"
                                                >
                                                    <Eye className="w-3.5 h-3.5" />
                                                    <span>Open Record</span>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
