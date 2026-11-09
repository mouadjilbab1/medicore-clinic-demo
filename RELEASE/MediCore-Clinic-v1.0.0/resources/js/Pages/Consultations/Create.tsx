import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useTranslation } from '@/Utils/translations';
import { Stethoscope, ArrowLeft, AlertTriangle } from 'lucide-react';
import { Patient, Doctor } from '@/types';

interface Props {
    patient?: Patient | null;
    patients: Patient[];
    doctors: Doctor[];
    appointment_id?: string | number | null;
}

export default function ConsultationsCreate({ patient, patients, doctors, appointment_id }: Props) {
    const { t } = useTranslation();

    const { data, setData, post, processing, errors } = useForm({
        patient_id: patient?.id ? String(patient.id) : '',
        doctor_id: doctors[0]?.id ? String(doctors[0].id) : '',
        appointment_id: appointment_id ? String(appointment_id) : '',
        chief_complaint: '',
        history_present_illness: '',
        physical_examination: '',
        clinical_assessment: '',
        treatment_plan: '',
        follow_up_instructions: '',
        follow_up_date: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('consultations.store'));
    };

    return (
        <AuthenticatedLayout>
            <Head title="Open Medical Consultation - MediCore" />

            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex items-center gap-2">
                    <Link href={route('consultations.index')} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                            Start Clinical Consultation
                        </h1>
                        <p className="text-xs text-slate-500">Record clinical history, findings, and diagnostic assessment</p>
                    </div>
                </div>

                {patient?.allergies_summary && (
                    <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-center gap-3">
                        <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0" />
                        <div>
                            <span className="font-bold block uppercase tracking-wider text-[10px] text-rose-700">
                                Patient Allergy Alert
                            </span>
                            <span>{patient.allergies_summary}</span>
                        </div>
                    </div>
                )}

                <form onSubmit={submit} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6 text-xs">
                    {/* Header Selection */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-slate-100">
                        <div>
                            <label className="block font-semibold text-slate-700 mb-1">Select Patient *</label>
                            <select
                                required
                                value={data.patient_id}
                                onChange={(e) => setData('patient_id', e.target.value)}
                                className="w-full p-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-teal-500"
                            >
                                <option value="">Choose patient from registry...</option>
                                {patients.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.full_name} ({p.patient_uid})
                                    </option>
                                ))}
                            </select>
                            {errors.patient_id && <p className="text-rose-600 text-[10px] mt-1">{errors.patient_id}</p>}
                        </div>

                        <div>
                            <label className="block font-semibold text-slate-700 mb-1">Attending Physician *</label>
                            <select
                                required
                                value={data.doctor_id}
                                onChange={(e) => setData('doctor_id', e.target.value)}
                                className="w-full p-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-teal-500"
                            >
                                {doctors.map((d) => (
                                    <option key={d.id} value={d.id}>
                                        {d.user?.name} ({d.specialty})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Chief Complaint */}
                    <div>
                        <label className="block font-semibold text-slate-800 text-sm mb-1">
                            Chief Complaint (Reason for Visit) *
                        </label>
                        <input
                            type="text"
                            required
                            value={data.chief_complaint}
                            onChange={(e) => setData('chief_complaint', e.target.value)}
                            placeholder="e.g. Severe throbbing headache, acute epigastric pain..."
                            className="w-full p-3 border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-500"
                        />
                        {errors.chief_complaint && <p className="text-rose-600 text-[10px] mt-1">{errors.chief_complaint}</p>}
                    </div>

                    {/* Present Illness */}
                    <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                            History of Present Illness (HPI)
                        </label>
                        <textarea
                            rows={3}
                            value={data.history_present_illness}
                            onChange={(e) => setData('history_present_illness', e.target.value)}
                            placeholder="Onset, duration, severity, radiation, aggravating and relieving factors..."
                            className="w-full p-2.5 border border-slate-300 rounded-xl outline-none"
                        />
                    </div>

                    {/* Physical Examination */}
                    <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                            Physical Examination Findings
                        </label>
                        <textarea
                            rows={3}
                            value={data.physical_examination}
                            onChange={(e) => setData('physical_examination', e.target.value)}
                            placeholder="General appearance, HEENT, cardiovascular, respiratory, abdominal..."
                            className="w-full p-2.5 border border-slate-300 rounded-xl outline-none"
                        />
                    </div>

                    {/* Assessment & Treatment Plan */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block font-semibold text-slate-700 mb-1">
                                Clinical Assessment & Impression
                            </label>
                            <textarea
                                rows={3}
                                value={data.clinical_assessment}
                                onChange={(e) => setData('clinical_assessment', e.target.value)}
                                placeholder="Diagnostic synthesis, differential diagnoses..."
                                className="w-full p-2.5 border border-slate-300 rounded-xl outline-none"
                            />
                        </div>

                        <div>
                            <label className="block font-semibold text-slate-700 mb-1">
                                Management & Treatment Plan
                            </label>
                            <textarea
                                rows={3}
                                value={data.treatment_plan}
                                onChange={(e) => setData('treatment_plan', e.target.value)}
                                placeholder="Pharmacological orders, procedures, lifestyle advice..."
                                className="w-full p-2.5 border border-slate-300 rounded-xl outline-none"
                            />
                        </div>
                    </div>

                    {/* Follow-up */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block font-semibold text-slate-700 mb-1">
                                Follow-up Instructions
                            </label>
                            <input
                                type="text"
                                value={data.follow_up_instructions}
                                onChange={(e) => setData('follow_up_instructions', e.target.value)}
                                placeholder="e.g. Return if fever persists over 48 hours..."
                                className="w-full p-2.5 border border-slate-300 rounded-xl outline-none"
                            />
                        </div>

                        <div>
                            <label className="block font-semibold text-slate-700 mb-1">
                                Follow-up Date
                            </label>
                            <input
                                type="date"
                                value={data.follow_up_date}
                                onChange={(e) => setData('follow_up_date', e.target.value)}
                                className="w-full p-2.5 border border-slate-300 rounded-xl outline-none"
                            />
                        </div>
                    </div>

                    {/* Submit Actions */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                        <Link
                            href={route('consultations.index')}
                            className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl shadow-sm"
                        >
                            {processing ? 'Saving Encounter...' : 'Save Draft & Open Clinical Chart'}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
