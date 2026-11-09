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
        dermatologyRecord?: any;
        pediatricGrowthRecord?: any;
        physiotherapySession?: any;
    };
}

export default function ConsultationsShow({ consultation }: Props) {
    const { t } = useTranslation();
    const [vitalsModalOpen, setVitalsModalOpen] = useState(false);
    const [diagnosisModalOpen, setDiagnosisModalOpen] = useState(false);
    const [revisionModalOpen, setRevisionModalOpen] = useState(false);
    const [dermModalOpen, setDermModalOpen] = useState(false);
    const [pediatricModalOpen, setPediatricModalOpen] = useState(false);
    const [physioModalOpen, setPhysioModalOpen] = useState(false);

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

    // Dermatology Form
    const dermForm = useForm({
        body_location_key: 'face',
        condition_type: '',
        lesion_description: '',
        session_number: 1,
    });

    // Pediatric Growth Form
    const pediatricForm = useForm({
        age_months: 12,
        height_cm: '',
        weight_kg: '',
        head_circumference_cm: '',
    });

    // Physiotherapy Form
    const physioForm = useForm({
        pain_vas_score: 3,
        joint_assessed: '',
        rom_measurement: '',
        mobility_score: 'Moderate',
        exercises_prescribed: '',
        notes: '',
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

    const handleDermSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        dermForm.post(route('consultations.dermatology', consultation.id), {
            onSuccess: () => {
                setDermModalOpen(false);
                dermForm.reset();
            },
        });
    };

    const handlePediatricSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        pediatricForm.post(route('consultations.pediatrics', consultation.id), {
            onSuccess: () => {
                setPediatricModalOpen(false);
                pediatricForm.reset();
            },
        });
    };

    const handlePhysioSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        physioForm.post(route('consultations.physiotherapy', consultation.id), {
            onSuccess: () => {
                setPhysioModalOpen(false);
                physioForm.reset();
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

                    {/* Integrated Specialty Clinical Records */}
                    <div className="pt-4 border-t border-slate-100 space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">
                                Integrated Specialty Clinical Records
                            </span>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setDermModalOpen(true)}
                                    className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 font-semibold text-[11px] flex items-center gap-1 transition-all"
                                >
                                    <Plus className="w-3 h-3" />
                                    Dermatology
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setPediatricModalOpen(true)}
                                    className="px-2.5 py-1 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 font-semibold text-[11px] flex items-center gap-1 transition-all"
                                >
                                    <Plus className="w-3 h-3" />
                                    Pediatrics (WHO)
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setPhysioModalOpen(true)}
                                    className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold text-[11px] flex items-center gap-1 transition-all"
                                >
                                    <Plus className="w-3 h-3" />
                                    Physiotherapy
                                </button>
                            </div>
                        </div>

                        {/* Display existing specialty records */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {consultation.dermatologyRecord && (
                                <div className="p-3 rounded-xl bg-rose-50/50 border border-rose-200">
                                    <span className="font-bold text-[10px] text-rose-800 uppercase block">Dermatology Finding</span>
                                    <div className="font-semibold text-slate-800 mt-1">{consultation.dermatologyRecord.condition_type}</div>
                                    <div className="text-[11px] text-slate-500">Location: {consultation.dermatologyRecord.body_location_key}</div>
                                    {consultation.dermatologyRecord.lesion_description && (
                                        <div className="text-[11px] text-slate-600 mt-1">{consultation.dermatologyRecord.lesion_description}</div>
                                    )}
                                </div>
                            )}

                            {consultation.pediatricGrowthRecord && (
                                <div className="p-3 rounded-xl bg-sky-50/50 border border-sky-200">
                                    <span className="font-bold text-[10px] text-sky-800 uppercase block">Pediatric Growth (WHO)</span>
                                    <div className="font-semibold text-slate-800 mt-1">Age: {consultation.pediatricGrowthRecord.age_months} mo</div>
                                    <div className="text-[11px] text-slate-600">
                                        Ht: {consultation.pediatricGrowthRecord.height_cm} cm (P{consultation.pediatricGrowthRecord.height_percentile}%) • 
                                        Wt: {consultation.pediatricGrowthRecord.weight_kg} kg (P{consultation.pediatricGrowthRecord.weight_percentile}%)
                                    </div>
                                </div>
                            )}

                            {consultation.physiotherapySession && (
                                <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-200">
                                    <span className="font-bold text-[10px] text-emerald-800 uppercase block">Physiotherapy Rehab</span>
                                    <div className="font-semibold text-slate-800 mt-1">VAS Pain: {consultation.physiotherapySession.pain_vas_score}/10</div>
                                    <div className="text-[11px] text-slate-600">
                                        Joint: {consultation.physiotherapySession.joint_assessed} • ROM: {consultation.physiotherapySession.rom_measurement || 'Normal'}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

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

            {/* Dermatology Record Modal */}
            {dermModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
                        <h3 className="font-bold text-slate-900 text-base mb-3">Record Dermatology Lesion</h3>
                        <form onSubmit={handleDermSubmit} className="space-y-3 text-xs">
                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">Body Anatomical Location *</label>
                                <select
                                    value={dermForm.data.body_location_key}
                                    onChange={(e) => dermForm.setData('body_location_key', e.target.value)}
                                    className="w-full p-2 border border-slate-300 rounded-xl"
                                >
                                    <option value="face">Face / Head</option>
                                    <option value="scalp">Scalp</option>
                                    <option value="neck">Neck</option>
                                    <option value="chest">Anterior Chest</option>
                                    <option value="back">Upper / Lower Back</option>
                                    <option value="arms">Arms / Hands</option>
                                    <option value="legs">Legs / Feet</option>
                                    <option value="abdomen">Abdomen</option>
                                </select>
                            </div>

                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">Condition / Lesion Type *</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Atypical pigmented macule, Eczema plaque"
                                    value={dermForm.data.condition_type}
                                    onChange={(e) => dermForm.setData('condition_type', e.target.value)}
                                    className="w-full p-2 border border-slate-300 rounded-xl"
                                />
                            </div>

                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">Lesion Characteristics / Dermoscopy</label>
                                <textarea
                                    rows={3}
                                    placeholder="Enter diameter, symmetry, borders, color variation, ABCDE criteria..."
                                    value={dermForm.data.lesion_description}
                                    onChange={(e) => dermForm.setData('lesion_description', e.target.value)}
                                    className="w-full p-2 border border-slate-300 rounded-xl"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setDermModalOpen(false)}
                                    className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-xl"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={dermForm.processing}
                                    className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl"
                                >
                                    Save Dermatology Record
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Pediatrics Growth Record Modal */}
            {pediatricModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
                        <h3 className="font-bold text-slate-900 text-base mb-3">Record Pediatric Growth Metrics (WHO)</h3>
                        <form onSubmit={handlePediatricSubmit} className="space-y-3 text-xs">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-semibold text-slate-700 mb-1">Age (Months) *</label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        max="240"
                                        value={pediatricForm.data.age_months}
                                        onChange={(e) => pediatricForm.setData('age_months', parseInt(e.target.value) || 0)}
                                        className="w-full p-2 border border-slate-300 rounded-xl"
                                    />
                                </div>
                                <div>
                                    <label className="block font-semibold text-slate-700 mb-1">Height (cm)</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        placeholder="e.g. 75.5"
                                        value={pediatricForm.data.height_cm}
                                        onChange={(e) => pediatricForm.setData('height_cm', e.target.value)}
                                        className="w-full p-2 border border-slate-300 rounded-xl"
                                    />
                                </div>
                                <div>
                                    <label className="block font-semibold text-slate-700 mb-1">Weight (kg)</label>
                                    <input
                                        type="number"
                                        step="0.05"
                                        placeholder="e.g. 10.2"
                                        value={pediatricForm.data.weight_kg}
                                        onChange={(e) => pediatricForm.setData('weight_kg', e.target.value)}
                                        className="w-full p-2 border border-slate-300 rounded-xl"
                                    />
                                </div>
                                <div>
                                    <label className="block font-semibold text-slate-700 mb-1">Head Circ. (cm)</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        placeholder="e.g. 46.0"
                                        value={pediatricForm.data.head_circumference_cm}
                                        onChange={(e) => pediatricForm.setData('head_circumference_cm', e.target.value)}
                                        className="w-full p-2 border border-slate-300 rounded-xl"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setPediatricModalOpen(false)}
                                    className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-xl"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={pediatricForm.processing}
                                    className="px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl"
                                >
                                    Save Growth Record
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Physiotherapy Session Modal */}
            {physioModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
                        <h3 className="font-bold text-slate-900 text-base mb-3">Record Physiotherapy Session</h3>
                        <form onSubmit={handlePhysioSubmit} className="space-y-3 text-xs">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-semibold text-slate-700 mb-1">Pain VAS Score (0-10)</label>
                                    <select
                                        value={physioForm.data.pain_vas_score}
                                        onChange={(e) => physioForm.setData('pain_vas_score', parseInt(e.target.value) || 0)}
                                        className="w-full p-2 border border-slate-300 rounded-xl font-bold"
                                    >
                                        {[0,1,2,3,4,5,6,7,8,9,10].map(s => (
                                            <option key={s} value={s}>{s} - {s === 0 ? 'No Pain' : s <= 3 ? 'Mild' : s <= 6 ? 'Moderate' : 'Severe'}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block font-semibold text-slate-700 mb-1">Joint / Region *</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Left Knee, Lumbar"
                                        value={physioForm.data.joint_assessed}
                                        onChange={(e) => physioForm.setData('joint_assessed', e.target.value)}
                                        className="w-full p-2 border border-slate-300 rounded-xl"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-semibold text-slate-700 mb-1">ROM Assessment</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Flexion 110°, Ext 0°"
                                        value={physioForm.data.rom_measurement}
                                        onChange={(e) => physioForm.setData('rom_measurement', e.target.value)}
                                        className="w-full p-2 border border-slate-300 rounded-xl"
                                    />
                                </div>
                                <div>
                                    <label className="block font-semibold text-slate-700 mb-1">Mobility Index</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Weight-bearing, Cane"
                                        value={physioForm.data.mobility_score}
                                        onChange={(e) => physioForm.setData('mobility_score', e.target.value)}
                                        className="w-full p-2 border border-slate-300 rounded-xl"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">Prescribed Rehab Exercises</label>
                                <textarea
                                    rows={2}
                                    placeholder="e.g. Quadriceps sets, straight leg raises, passive hamstring stretch 3x10..."
                                    value={physioForm.data.exercises_prescribed}
                                    onChange={(e) => physioForm.setData('exercises_prescribed', e.target.value)}
                                    className="w-full p-2 border border-slate-300 rounded-xl"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setPhysioModalOpen(false)}
                                    className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-xl"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={physioForm.processing}
                                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl"
                                >
                                    Save Rehab Session
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
