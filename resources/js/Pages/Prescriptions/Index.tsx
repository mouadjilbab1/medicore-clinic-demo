import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useTranslation } from '@/Utils/translations';
import { Pill, Plus, Printer, Trash2, User, Stethoscope } from 'lucide-react';
import { Prescription, Patient, Doctor, PaginatedData } from '@/types';

interface Props {
    prescriptions: PaginatedData<Prescription>;
    patients: Patient[];
    doctors: Doctor[];
}

export default function PrescriptionsIndex({ prescriptions, patients, doctors }: Props) {
    const { t } = useTranslation();
    const [createModalOpen, setCreateModalOpen] = useState(false);

    const { data, setData, post, processing, reset } = useForm({
        patient_id: '',
        doctor_id: doctors[0]?.id ? String(doctors[0].id) : '',
        instructions: 'Take medications strictly according to the indicated dosages.',
        items: [
            {
                medicine_name: '',
                dosage: '500mg',
                frequency: '3 times daily after meals',
                duration: '7 Days',
                route: 'oral',
                quantity: 1,
                instructions: '',
            },
        ],
    });

    const addItem = () => {
        setData('items', [
            ...data.items,
            {
                medicine_name: '',
                dosage: '',
                frequency: 'Twice daily',
                duration: '5 Days',
                route: 'oral',
                quantity: 1,
                instructions: '',
            },
        ]);
    };

    const removeItem = (idx: number) => {
        setData('items', data.items.filter((_, i) => i !== idx));
    };

    const updateItem = (idx: number, field: string, val: any) => {
        const next = [...data.items];
        // @ts-ignore
        next[idx][field] = val;
        setData('items', next);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('prescriptions.store'), {
            onSuccess: () => {
                setCreateModalOpen(false);
                reset();
            },
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Prescriptions Management - MediCore" />

            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                            <Pill className="w-6 h-6 text-teal-600" />
                            <span>Prescriptions & Drug Regimens</span>
                        </h1>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Author digital medical prescriptions, drug posology, and generate printable clinic templates
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => setCreateModalOpen(true)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 shadow-sm transition"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Issue Prescription</span>
                    </button>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-start text-xs">
                            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-3.5 text-start font-semibold">Prescription #</th>
                                    <th className="px-6 py-3.5 text-start font-semibold">Date</th>
                                    <th className="px-6 py-3.5 text-start font-semibold">Patient</th>
                                    <th className="px-6 py-3.5 text-start font-semibold">Prescribing Doctor</th>
                                    <th className="px-6 py-3.5 text-start font-semibold">Medications</th>
                                    <th className="px-6 py-3.5 text-start font-semibold">Status</th>
                                    <th className="px-6 py-3.5 text-end font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-700">
                                {prescriptions.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                                            No prescriptions registered.
                                        </td>
                                    </tr>
                                ) : (
                                    prescriptions.data.map((rx) => (
                                        <tr key={rx.id} className="hover:bg-slate-50/80 transition">
                                            <td className="px-6 py-3.5 font-mono font-bold text-teal-700">
                                                {rx.prescription_number}
                                            </td>
                                            <td className="px-6 py-3.5 text-slate-500">
                                                {new Date(rx.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-3.5">
                                                <Link
                                                    href={route('patients.show', rx.patient_id)}
                                                    className="font-bold text-slate-900 hover:text-teal-600 block"
                                                >
                                                    {rx.patient?.full_name}
                                                </Link>
                                                <span className="text-[10px] text-slate-400">{rx.patient?.patient_uid}</span>
                                            </td>
                                            <td className="px-6 py-3.5 font-medium">{rx.doctor?.user?.name}</td>
                                            <td className="px-6 py-3.5">
                                                <span className="font-semibold text-slate-800">
                                                    {rx.items?.length || 0} items ({rx.items?.map((i) => i.medicine_name).join(', ')})
                                                </span>
                                            </td>
                                            <td className="px-6 py-3.5">
                                                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 uppercase">
                                                    {rx.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3.5 text-end">
                                                <a
                                                    href={route('prescriptions.print', rx.id)}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-teal-50 text-teal-700 hover:bg-teal-100 font-semibold text-xs"
                                                >
                                                    <Printer className="w-3.5 h-3.5" />
                                                    <span>Print Rx</span>
                                                </a>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Issue Prescription Modal */}
            {createModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
                        <h3 className="font-bold text-slate-900 text-base mb-4 flex items-center gap-2">
                            <Pill className="w-5 h-5 text-teal-600" />
                            <span>Author Medical Prescription (Rx)</span>
                        </h3>

                        <form onSubmit={submit} className="space-y-4 text-xs">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-semibold text-slate-700 mb-1">Patient *</label>
                                    <select
                                        required
                                        value={data.patient_id}
                                        onChange={(e) => setData('patient_id', e.target.value)}
                                        className="w-full p-2 border border-slate-300 rounded-xl outline-none"
                                    >
                                        <option value="">Select patient...</option>
                                        {patients.map((p) => (
                                            <option key={p.id} value={p.id}>
                                                {p.full_name} ({p.patient_uid})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block font-semibold text-slate-700 mb-1">Prescribing Doctor *</label>
                                    <select
                                        required
                                        value={data.doctor_id}
                                        onChange={(e) => setData('doctor_id', e.target.value)}
                                        className="w-full p-2 border border-slate-300 rounded-xl outline-none"
                                    >
                                        {doctors.map((d) => (
                                            <option key={d.id} value={d.id}>
                                                {d.user?.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Medication Line Items */}
                            <div className="space-y-3 pt-2">
                                <div className="flex items-center justify-between">
                                    <label className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                                        Prescribed Medicines & Posology
                                    </label>
                                    <button
                                        type="button"
                                        onClick={addItem}
                                        className="text-xs font-semibold text-teal-700 hover:underline flex items-center gap-1"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                        <span>Add Another Drug</span>
                                    </button>
                                </div>

                                {data.items.map((item, idx) => (
                                    <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="font-bold text-slate-700">Drug #{idx + 1}</span>
                                            {data.items.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeItem(idx)}
                                                    className="text-rose-600 hover:text-rose-800"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-3 gap-2">
                                            <div className="col-span-2">
                                                <input
                                                    type="text"
                                                    required
                                                    value={item.medicine_name}
                                                    onChange={(e) => updateItem(idx, 'medicine_name', e.target.value)}
                                                    placeholder="Medication name (e.g. Amoxicillin)"
                                                    className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                                                />
                                            </div>
                                            <div>
                                                <input
                                                    type="text"
                                                    required
                                                    value={item.dosage}
                                                    onChange={(e) => updateItem(idx, 'dosage', e.target.value)}
                                                    placeholder="Dosage (e.g. 500mg)"
                                                    className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-2">
                                            <div>
                                                <input
                                                    type="text"
                                                    value={item.frequency}
                                                    onChange={(e) => updateItem(idx, 'frequency', e.target.value)}
                                                    placeholder="Frequency (e.g. 3x daily)"
                                                    className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                                                />
                                            </div>
                                            <div>
                                                <input
                                                    type="text"
                                                    value={item.duration}
                                                    onChange={(e) => updateItem(idx, 'duration', e.target.value)}
                                                    placeholder="Duration (e.g. 7 days)"
                                                    className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                                                />
                                            </div>
                                            <div>
                                                <select
                                                    value={item.route}
                                                    onChange={(e) => updateItem(idx, 'route', e.target.value)}
                                                    className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                                                >
                                                    <option value="oral">Oral</option>
                                                    <option value="topical">Topical</option>
                                                    <option value="iv">Intravenous (IV)</option>
                                                    <option value="im">Intramuscular (IM)</option>
                                                    <option value="inhalation">Inhalation</option>
                                                    <option value="ophthalmic">Eye Drops</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">General Patient Instructions</label>
                                <textarea
                                    rows={2}
                                    value={data.instructions}
                                    onChange={(e) => setData('instructions', e.target.value)}
                                    className="w-full p-2 border border-slate-300 rounded-xl outline-none"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setCreateModalOpen(false)}
                                    className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-xl"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl"
                                >
                                    Issue & Digitally Sign
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
