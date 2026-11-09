import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useTranslation } from '@/Utils/translations';
import { Eye, Plus, CheckCircle2, User } from 'lucide-react';
import { Patient, PaginatedData } from '@/types';

interface Props {
    records: PaginatedData<any>;
    patients: Patient[];
}

export default function OphthalmologyIndex({ records, patients }: Props) {
    const { t } = useTranslation();
    const [examModalOpen, setExamModalOpen] = useState(false);

    const { data, setData, post, processing, reset } = useForm({
        patient_id: '',
        od_va_distance: '20/20',
        od_va_near: 'J1',
        od_sph: 0.0,
        od_cyl: 0.0,
        od_axis: 0,
        od_add: 0.0,
        od_iop: 15.0,
        os_va_distance: '20/20',
        os_va_near: 'J1',
        os_sph: 0.0,
        os_cyl: 0.0,
        os_axis: 0,
        os_add: 0.0,
        os_iop: 15.0,
        pd: 63.0,
        glasses_prescription_notes: '',
        contact_lens_notes: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('ophthalmology.store'), {
            onSuccess: () => {
                setExamModalOpen(false);
                reset();
            },
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Ophthalmology & Optometry Exams - MediCore" />

            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                            <Eye className="w-6 h-6 text-teal-600" />
                            <span>Ophthalmology & Vision Refraction Center</span>
                        </h1>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Visual acuity testing, OD/OS refraction metrics, IOP tonometry, and glasses prescription
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => setExamModalOpen(true)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 shadow-sm transition"
                    >
                        <Plus className="w-4 h-4" />
                        <span>New Vision Examination</span>
                    </button>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-start text-xs">
                            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-3.5 text-start font-semibold">Date</th>
                                    <th className="px-6 py-3.5 text-start font-semibold">Patient</th>
                                    <th className="px-6 py-3.5 text-start font-semibold">Right Eye (OD) Refraction</th>
                                    <th className="px-6 py-3.5 text-start font-semibold">Left Eye (OS) Refraction</th>
                                    <th className="px-6 py-3.5 text-start font-semibold">PD (mm)</th>
                                    <th className="px-6 py-3.5 text-start font-semibold">IOP (Tonometry)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-700">
                                {records.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                                            No ophthalmology examinations recorded yet.
                                        </td>
                                    </tr>
                                ) : (
                                    records.data.map((r) => (
                                        <tr key={r.id} className="hover:bg-slate-50/80 transition">
                                            <td className="px-6 py-3.5 font-mono text-slate-800">
                                                {new Date(r.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-3.5">
                                                <Link
                                                    href={route('patients.show', r.patient_id)}
                                                    className="font-bold text-teal-700 hover:underline block"
                                                >
                                                    {r.patient?.full_name}
                                                </Link>
                                                <span className="text-[10px] text-slate-400">{r.patient?.patient_uid}</span>
                                            </td>
                                            <td className="px-6 py-3.5 font-mono">
                                                SPH: <strong>{r.od_sph || '0.00'}</strong> | CYL: {r.od_cyl || '0.00'} | AXIS: {r.od_axis || 0}°
                                            </td>
                                            <td className="px-6 py-3.5 font-mono">
                                                SPH: <strong>{r.os_sph || '0.00'}</strong> | CYL: {r.os_cyl || '0.00'} | AXIS: {r.os_axis || 0}°
                                            </td>
                                            <td className="px-6 py-3.5 font-bold font-mono text-slate-900">{r.pd || '—'} mm</td>
                                            <td className="px-6 py-3.5 font-mono text-xs">
                                                OD: {r.od_iop || '—'} | OS: {r.os_iop || '—'} mmHg
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Vision Exam Modal */}
            {examModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
                        <h3 className="font-bold text-slate-900 text-base mb-4 flex items-center gap-2">
                            <Eye className="w-5 h-5 text-teal-600" />
                            <span>Record Vision Refraction Examination</span>
                        </h3>

                        <form onSubmit={submit} className="space-y-4 text-xs">
                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">Select Patient *</label>
                                <select
                                    required
                                    value={data.patient_id}
                                    onChange={(e) => setData('patient_id', e.target.value)}
                                    className="w-full p-2.5 border border-slate-300 rounded-xl outline-none"
                                >
                                    <option value="">Choose patient...</option>
                                    {patients.map((p) => (
                                        <option key={p.id} value={p.id}>
                                            {p.full_name} ({p.patient_uid})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Right Eye (OD) Box */}
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                <span className="font-bold text-xs text-slate-800 block mb-2 uppercase tracking-wider text-teal-800">
                                    Right Eye (OD - Oculus Dexter)
                                </span>
                                <div className="grid grid-cols-4 gap-2">
                                    <div>
                                        <label className="block text-[10px] text-slate-500">SPH (Sphere)</label>
                                        <input
                                            type="number"
                                            step="0.25"
                                            value={data.od_sph}
                                            onChange={(e) => setData('od_sph', Number(e.target.value))}
                                            className="w-full p-1.5 border rounded-lg bg-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] text-slate-500">CYL (Cylinder)</label>
                                        <input
                                            type="number"
                                            step="0.25"
                                            value={data.od_cyl}
                                            onChange={(e) => setData('od_cyl', Number(e.target.value))}
                                            className="w-full p-1.5 border rounded-lg bg-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] text-slate-500">AXIS (0-180°)</label>
                                        <input
                                            type="number"
                                            value={data.od_axis}
                                            onChange={(e) => setData('od_axis', Number(e.target.value))}
                                            className="w-full p-1.5 border rounded-lg bg-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] text-slate-500">IOP (mmHg)</label>
                                        <input
                                            type="number"
                                            step="0.5"
                                            value={data.od_iop}
                                            onChange={(e) => setData('od_iop', Number(e.target.value))}
                                            className="w-full p-1.5 border rounded-lg bg-white"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Left Eye (OS) Box */}
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                <span className="font-bold text-xs text-slate-800 block mb-2 uppercase tracking-wider text-teal-800">
                                    Left Eye (OS - Oculus Sinister)
                                </span>
                                <div className="grid grid-cols-4 gap-2">
                                    <div>
                                        <label className="block text-[10px] text-slate-500">SPH (Sphere)</label>
                                        <input
                                            type="number"
                                            step="0.25"
                                            value={data.os_sph}
                                            onChange={(e) => setData('os_sph', Number(e.target.value))}
                                            className="w-full p-1.5 border rounded-lg bg-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] text-slate-500">CYL (Cylinder)</label>
                                        <input
                                            type="number"
                                            step="0.25"
                                            value={data.os_cyl}
                                            onChange={(e) => setData('os_cyl', Number(e.target.value))}
                                            className="w-full p-1.5 border rounded-lg bg-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] text-slate-500">AXIS (0-180°)</label>
                                        <input
                                            type="number"
                                            value={data.os_axis}
                                            onChange={(e) => setData('os_axis', Number(e.target.value))}
                                            className="w-full p-1.5 border rounded-lg bg-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] text-slate-500">IOP (mmHg)</label>
                                        <input
                                            type="number"
                                            step="0.5"
                                            value={data.os_iop}
                                            onChange={(e) => setData('os_iop', Number(e.target.value))}
                                            className="w-full p-1.5 border rounded-lg bg-white"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">Pupillary Distance (PD in mm)</label>
                                <input
                                    type="number"
                                    step="0.5"
                                    value={data.pd}
                                    onChange={(e) => setData('pd', Number(e.target.value))}
                                    className="w-32 p-2 border border-slate-300 rounded-xl"
                                />
                            </div>

                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">Glasses Prescription & Lens Coating Notes</label>
                                <textarea
                                    rows={2}
                                    value={data.glasses_prescription_notes}
                                    onChange={(e) => setData('glasses_prescription_notes', e.target.value)}
                                    placeholder="e.g. Progressive lenses with blue-light filter recommended..."
                                    className="w-full p-2 border border-slate-300 rounded-xl outline-none"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setExamModalOpen(false)}
                                    className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-xl"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl"
                                >
                                    Save Vision Record
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
