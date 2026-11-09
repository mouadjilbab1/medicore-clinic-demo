import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useTranslation } from '@/Utils/translations';
import {
    Stethoscope,
    ArrowLeft,
    HeartPulse,
    AlertTriangle,
    Lock,
    Edit3,
    FileText,
    Pill,
    Receipt,
    Plus,
    CheckCircle2,
    Calendar,
    User,
} from 'lucide-react';
import { Consultation } from '@/types';

interface Props {
    consultation: Consultation & {
        patient: any;
        doctor: any;
        vitals: any[];
        diagnoses: any[];
        prescriptions: any[];
        revisions: any[];
    };
}

export default function ConsultationsShow({ consultation }: Props) {
    const { t } = useTranslation();
    const [vitalsModalOpen, setVitalsModalOpen] = useState(false);
    const [diagnosisModalOpen, setDiagnosisModalOpen] = useState(false);
    const [revisionModalOpen, setRevisionModalOpen] = useState(false);

    // Vitals Form
    const vitalsForm = useForm({
        systolic_bp: '',
        diastolic_bp: '',
        heart_rate: '',
        respiratory_rate: '',
        temperature: '',
        oxygen_saturation: '',
        weight: '',
        height: '',
    });

    // Diagnosis Form
    const diagForm = useForm({
        diagnosis_name: '',
        icd10_code: '',
        type: 'primary',
        status: 'active',
        notes: '',
    });

    // Revision Form
    const revForm = useForm({
        revision_reason: '',
        chief_complaint: consultation.chief_complaint,
        history_present_illness: consultation.history_present_illness || '',
        physical_examination: consultation.physical_examination || '',
        clinical_assessment: consultation.clinical_assessment || '',
        treatment_plan: consultation.treatment_plan || '',
    });

    const handleVitalsSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        vitalsForm.post(route('consultations.vitals', consultation.id), {
            onSuccess: () => {
                setVitalsModalOpen(false);
                vitalsForm.reset();
            },
        });
    };

    const handleDiagSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        diagForm.post(route('consultations.diagnoses', consultation.id), {
            onSuccess: () => {
                setDiagnosisModalOpen(false);
                diagForm.reset();
            },
        });
    };

    const handleRevisionSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        revForm.post(route('consultations.revisions', consultation.id), {
            onSuccess: () => {
                setRevisionModalOpen(false);
                revForm.reset();
            },
        });
    };

    const handleSign = () => {
        if (confirm('Are you sure you wish to lock and sign this medical record? Any further alterations will require an audit revision addendum.')) {
            router.post(route('consultations.sign', consultation.id));
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Consultation - ${consultation.patient?.full_name} - MediCore`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <Link href={route('consultations.index')} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                                    Medical Consultation Record
                                </h1>
                                <span
                                    className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                        consultation.is_finalized
                                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                                    }`}
                                >
                                    {consultation.is_finalized ? 'Finalized & Digitally Signed' : 'Draft In Progress'}
                                </span>
                            </div>
                            <p className="text-xs text-slate-500">
                                Patient: <strong>{consultation.patient?.full_name}</strong> ({consultation.patient?.patient_uid}) • Attending: <strong>{consultation.doctor?.user?.name}</strong>
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link
                            href={route('prescriptions.index', { patient_id: consultation.patient_id })}
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-sm"
                        >
                            <Pill className="w-4 h-4 text-teal-600" />
                            <span>Prescriptions</span>
                        </Link>

                        {!consultation.is_finalized ? (
                            <button
                                type="button"
                                onClick={handleSign}
                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 shadow-sm"
                            >
                                <Lock className="w-4 h-4" />
                                <span>Sign & Finalize Record</span>
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={() => setRevisionModalOpen(true)}
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200"
                            >
                                <Edit3 className="w-4 h-4" />
                                <span>Attach Addendum</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Vitals Summary Widget */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2">
                            <HeartPulse className="w-4 h-4 text-rose-600" />
                            <span>Recorded Vital Indicators</span>
                        </h3>
                        <button
                            type="button"
                            onClick={() => setVitalsModalOpen(true)}
                            className="text-xs font-semibold text-teal-700 hover:underline flex items-center gap-1"
                        >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Record Vitals</span>
                        </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-center text-xs">
                        {consultation.vitals && consultation.vitals.length > 0 ? (
                            <>
                                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                                    <span className="text-[10px] text-slate-400 block font-semibold">BLOOD PRESSURE</span>
                                    <span className="font-bold text-sm text-slate-900">
                                        {consultation.vitals[0].systolic_bp || '—'} / {consultation.vitals[0].diastolic_bp || '—'}
                                    </span>
                                    <span className="text-[9px] text-slate-400 block">mmHg</span>
                                </div>
                                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                                    <span className="text-[10px] text-slate-400 block font-semibold">HEART RATE</span>
                                    <span className="font-bold text-sm text-slate-900">
                                        {consultation.vitals[0].heart_rate || '—'}
                                    </span>
                                    <span className="text-[9px] text-slate-400 block">bpm</span>
                                </div>
                                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                                    <span className="text-[10px] text-slate-400 block font-semibold">RESP. RATE</span>
                                    <span className="font-bold text-sm text-slate-900">
                                        {consultation.vitals[0].respiratory_rate || '—'}
                                    </span>
                                    <span className="text-[9px] text-slate-400 block">/min</span>
                                </div>
                                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                                    <span className="text-[10px] text-slate-400 block font-semibold">TEMP</span>
                                    <span className="font-bold text-sm text-slate-900">
                                        {consultation.vitals[0].temperature || '—'}
                                    </span>
                                    <span className="text-[9px] text-slate-400 block">°C</span>
                                </div>
                                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                                    <span className="text-[10px] text-slate-400 block font-semibold">SPO2</span>
                                    <span className="font-bold text-sm text-slate-900">
                                        {consultation.vitals[0].oxygen_saturation || '—'}
                                    </span>
                                    <span className="text-[9px] text-slate-400 block">%</span>
                                </div>
                                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                                    <span className="text-[10px] text-slate-400 block font-semibold">WEIGHT</span>
                                    <span className="font-bold text-sm text-slate-900">
                                        {consultation.vitals[0].weight || '—'}
                                    </span>
                                    <span className="text-[9px] text-slate-400 block">kg</span>
                                </div>
                                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                                    <span className="text-[10px] text-slate-400 block font-semibold">BMI</span>
                                    <span className="font-bold text-sm text-teal-700">
                                        {consultation.vitals[0].bmi || '—'}
                                    </span>
                                    <span className="text-[9px] text-slate-400 block">kg/m²</span>
                                </div>
                            </>
                        ) : (
                            <div className="col-span-7 py-3 text-slate-400 text-xs">
                                No triage vitals recorded for this encounter yet.
                            </div>
                        )}
                    </div>
                </div>

                {/* Consultation Details Card */}
                <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6 text-xs">
                    <div>
                        <span className="font-bold uppercase tracking-wider text-slate-400 text-[10px] block mb-1">
                            Chief Complaint
                        </span>
                        <div className="text-base font-bold text-slate-900 bg-slate-50 p-3 rounded-xl border border-slate-100">
                            {consultation.chief_complaint}
                        </div>
                    </div>

                    {consultation.history_present_illness && (
                        <div>
                            <span className="font-bold uppercase tracking-wider text-slate-400 text-[10px] block mb-1">
                                History of Present Illness (HPI)
                            </span>
                            <div className="text-slate-700 whitespace-pre-line leading-relaxed">
                                {consultation.history_present_illness}
                            </div>
                        </div>
                    )}

                    {consultation.physical_examination && (
                        <div>
                            <span className="font-bold uppercase tracking-wider text-slate-400 text-[10px] block mb-1">
                                Physical Examination
                            </span>
                            <div className="text-slate-700 whitespace-pre-line leading-relaxed">
                                {consultation.physical_examination}
                            </div>
                        </div>
                    )}

                    {consultation.clinical_assessment && (
                        <div>
                            <span className="font-bold uppercase tracking-wider text-slate-400 text-[10px] block mb-1">
                                Clinical Assessment & Impression
                            </span>
                            <div className="text-slate-800 font-medium whitespace-pre-line leading-relaxed">
                                {consultation.clinical_assessment}
                            </div>
                        </div>
                    )}

                    {/* Diagnoses (ICD-10) Tagging Box */}
                    <div className="pt-4 border-t border-slate-100">
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">
                                Coded Diagnoses (ICD-10)
                            </span>
                            <button
                                type="button"
                                onClick={() => setDiagnosisModalOpen(true)}
                                className="text-teal-700 font-semibold hover:underline flex items-center gap-1"
                            >
                                <Plus className="w-3.5 h-3.5" />
                                <span>Add Diagnosis</span>
                            </button>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {consultation.diagnoses && consultation.diagnoses.length > 0 ? (
                                consultation.diagnoses.map((d: any) => (
                                    <div
                                        key={d.id}
                                        className="p-2 px-3 rounded-xl bg-teal-50 border border-teal-200 text-teal-900 flex items-center gap-2"
                                    >
                                        <span className="font-mono font-bold text-xs bg-teal-200/80 px-1.5 py-0.5 rounded">
                                            {d.icd10_code || 'CLIN'}
                                        </span>
                                        <span className="font-semibold">{d.diagnosis_name}</span>
                                        <span className="text-[10px] text-teal-700 uppercase">({d.type})</span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-slate-400">No diagnoses assigned yet.</p>
                            )}
                        </div>
                    </div>

                    {consultation.treatment_plan && (
                        <div className="pt-4 border-t border-slate-100">
                            <span className="font-bold uppercase tracking-wider text-slate-400 text-[10px] block mb-1">
                                Management & Treatment Plan
                            </span>
                            <div className="text-slate-700 whitespace-pre-line leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100 font-mono">
                                {consultation.treatment_plan}
                            </div>
                        </div>
                    )}

                    {/* Follow-up Notes */}
                    {consultation.follow_up_instructions && (
                        <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-blue-900">
                            <span className="font-bold block text-[10px] uppercase tracking-wider text-blue-700 mb-0.5">
                                Follow-up Instructions
                            </span>
                            <span>{consultation.follow_up_instructions}</span>
                            {consultation.follow_up_date && (
                                <div className="text-[11px] font-semibold mt-1">
                                    Next visit scheduled on: {consultation.follow_up_date}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Addendum & Revision Audit History */}
                    {consultation.revisions && consultation.revisions.length > 0 && (
                        <div className="pt-4 border-t border-slate-100">
                            <span className="font-bold uppercase tracking-wider text-amber-700 text-[10px] block mb-2">
                                Tracked Clinical Addendums & Amendments ({consultation.revisions.length})
                            </span>
                            <div className="space-y-2">
                                {consultation.revisions.map((rev: any) => (
                                    <div key={rev.id} className="p-3 rounded-xl bg-amber-50/60 border border-amber-200 text-xs">
                                        <div className="flex items-center justify-between text-[11px] text-amber-800 font-bold mb-1">
                                            <span>Amendment by {rev.reviser?.name}</span>
                                            <span className="font-mono">{new Date(rev.created_at).toLocaleString()}</span>
                                        </div>
                                        <p className="text-slate-700">Reason: {rev.revision_reason}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Vitals Recording Modal */}
            {vitalsModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
                        <h3 className="font-bold text-slate-900 text-base mb-3 flex items-center gap-2">
                            <HeartPulse className="w-5 h-5 text-rose-600" />
                            <span>Record Vital Indicators</span>
                        </h3>
                        <form onSubmit={handleVitalsSubmit} className="space-y-3 text-xs">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-semibold text-slate-700 mb-1">Systolic BP (mmHg)</label>
                                    <input
                                        type="number"
                                        value={vitalsForm.data.systolic_bp}
                                        onChange={(e) => vitalsForm.setData('systolic_bp', e.target.value)}
                                        placeholder="120"
                                        className="w-full p-2 border border-slate-300 rounded-xl"
                                    />
                                </div>
                                <div>
                                    <label className="block font-semibold text-slate-700 mb-1">Diastolic BP (mmHg)</label>
                                    <input
                                        type="number"
                                        value={vitalsForm.data.diastolic_bp}
                                        onChange={(e) => vitalsForm.setData('diastolic_bp', e.target.value)}
                                        placeholder="80"
                                        className="w-full p-2 border border-slate-300 rounded-xl"
                                    />
                                </div>
                                <div>
                                    <label className="block font-semibold text-slate-700 mb-1">Heart Rate (bpm)</label>
                                    <input
                                        type="number"
                                        value={vitalsForm.data.heart_rate}
                                        onChange={(e) => vitalsForm.setData('heart_rate', e.target.value)}
                                        placeholder="75"
                                        className="w-full p-2 border border-slate-300 rounded-xl"
                                    />
                                </div>
                                <div>
                                    <label className="block font-semibold text-slate-700 mb-1">Temp (°C)</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={vitalsForm.data.temperature}
                                        onChange={(e) => vitalsForm.setData('temperature', e.target.value)}
                                        placeholder="37.0"
                                        className="w-full p-2 border border-slate-300 rounded-xl"
                                    />
                                </div>
                                <div>
                                    <label className="block font-semibold text-slate-700 mb-1">Weight (kg)</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={vitalsForm.data.weight}
                                        onChange={(e) => vitalsForm.setData('weight', e.target.value)}
                                        placeholder="70"
                                        className="w-full p-2 border border-slate-300 rounded-xl"
                                    />
                                </div>
                                <div>
                                    <label className="block font-semibold text-slate-700 mb-1">Height (cm)</label>
                                    <input
                                        type="number"
                                        step="0.5"
                                        value={vitalsForm.data.height}
                                        onChange={(e) => vitalsForm.setData('height', e.target.value)}
                                        placeholder="175"
                                        className="w-full p-2 border border-slate-300 rounded-xl"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setVitalsModalOpen(false)}
                                    className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-xl"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={vitalsForm.processing}
                                    className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl"
                                >
                                    Save Vitals
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Diagnosis Modal */}
            {diagnosisModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
                        <h3 className="font-bold text-slate-900 text-base mb-3">Add Diagnosis (ICD-10)</h3>
                        <form onSubmit={handleDiagSubmit} className="space-y-3 text-xs">
                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">Diagnosis Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={diagForm.data.diagnosis_name}
                                    onChange={(e) => diagForm.setData('diagnosis_name', e.target.value)}
                                    placeholder="e.g. Type 2 Diabetes Mellitus"
                                    className="w-full p-2 border border-slate-300 rounded-xl outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-semibold text-slate-700 mb-1">ICD-10 Code</label>
                                    <input
                                        type="text"
                                        value={diagForm.data.icd10_code}
                                        onChange={(e) => diagForm.setData('icd10_code', e.target.value)}
                                        placeholder="e.g. E11.9"
                                        className="w-full p-2 border border-slate-300 rounded-xl outline-none font-mono"
                                    />
                                </div>
                                <div>
                                    <label className="block font-semibold text-slate-700 mb-1">Diagnosis Type</label>
                                    <select
                                        value={diagForm.data.type}
                                        onChange={(e) => diagForm.setData('type', e.target.value as any)}
                                        className="w-full p-2 border border-slate-300 rounded-xl outline-none"
                                    >
                                        <option value="primary">Primary</option>
                                        <option value="secondary">Secondary</option>
                                        <option value="differential">Differential</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setDiagnosisModalOpen(false)}
                                    className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-xl"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl"
                                >
                                    Add Diagnosis
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Addendum / Revision Modal */}
            {revisionModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
                        <h3 className="font-bold text-slate-900 text-base mb-2">Attach Clinical Addendum</h3>
                        <p className="text-xs text-slate-500 mb-4">
                            Because this record is finalized, modifications must include an audit justification.
                        </p>
                        <form onSubmit={handleRevisionSubmit} className="space-y-3 text-xs">
                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">Reason for Revision *</label>
                                <textarea
                                    required
                                    rows={2}
                                    value={revForm.data.revision_reason}
                                    onChange={(e) => revForm.setData('revision_reason', e.target.value)}
                                    placeholder="e.g. Added secondary observation following lab result delivery..."
                                    className="w-full p-2.5 border border-slate-300 rounded-xl outline-none"
                                />
                            </div>

                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">Updated Assessment</label>
                                <textarea
                                    rows={3}
                                    value={revForm.data.clinical_assessment}
                                    onChange={(e) => revForm.setData('clinical_assessment', e.target.value)}
                                    className="w-full p-2.5 border border-slate-300 rounded-xl outline-none"
                                />
                            </div>

                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">Updated Treatment Plan</label>
                                <textarea
                                    rows={3}
                                    value={revForm.data.treatment_plan}
                                    onChange={(e) => revForm.setData('treatment_plan', e.target.value)}
                                    className="w-full p-2.5 border border-slate-300 rounded-xl outline-none"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setRevisionModalOpen(false)}
                                    className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-xl"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl"
                                >
                                    Attach Addendum
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
