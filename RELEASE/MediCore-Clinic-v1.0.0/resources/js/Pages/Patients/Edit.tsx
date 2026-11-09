import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { ArrowLeft, Save, User } from 'lucide-react';
import { Patient } from '@/types';

interface Props {
    patient: Patient;
}

export default function PatientsEdit({ patient }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        first_name: patient.first_name,
        last_name: patient.last_name,
        gender: patient.gender,
        date_of_birth: patient.date_of_birth,
        phone: patient.phone,
        email: patient.email || '',
        national_id: patient.national_id || '',
        blood_group: patient.blood_group || 'O+',
        address: patient.address || '',
        city: patient.city || 'Casablanca',
        emergency_contact_name: patient.emergency_contact_name || '',
        emergency_contact_phone: patient.emergency_contact_phone || '',
        allergies_summary: patient.allergies_summary || '',
        chronic_conditions_summary: patient.chronic_conditions_summary || '',
        medical_notes: patient.medical_notes || '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('patients.update', patient.id));
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Edit ${patient.full_name} - MediCore`} />

            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex items-center gap-2">
                    <Link href={route('patients.show', patient.id)} className="p-1 text-slate-400 hover:text-slate-600">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900">
                            Edit Demographic Details: {patient.full_name}
                        </h1>
                        <p className="text-xs text-slate-500">Record UID: {patient.patient_uid}</p>
                    </div>
                </div>

                <form onSubmit={submit} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">First Name *</label>
                            <input
                                type="text"
                                required
                                value={data.first_name}
                                onChange={(e) => setData('first_name', e.target.value)}
                                className="w-full p-2.5 text-xs border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Last Name *</label>
                            <input
                                type="text"
                                required
                                value={data.last_name}
                                onChange={(e) => setData('last_name', e.target.value)}
                                className="w-full p-2.5 text-xs border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number *</label>
                            <input
                                type="text"
                                required
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                className="w-full p-2.5 text-xs border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-500 font-mono"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">National ID (CIN)</label>
                            <input
                                type="text"
                                value={data.national_id}
                                onChange={(e) => setData('national_id', e.target.value)}
                                className="w-full p-2.5 text-xs border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Blood Group</label>
                            <input
                                type="text"
                                value={data.blood_group}
                                onChange={(e) => setData('blood_group', e.target.value)}
                                className="w-full p-2.5 text-xs border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
                            <input
                                type="text"
                                value={data.city}
                                onChange={(e) => setData('city', e.target.value)}
                                className="w-full p-2.5 text-xs border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-rose-700 mb-1">Drug Allergies</label>
                        <textarea
                            rows={2}
                            value={data.allergies_summary}
                            onChange={(e) => setData('allergies_summary', e.target.value)}
                            className="w-full p-2.5 text-xs border border-rose-200 rounded-xl outline-none bg-rose-50/20"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Chronic Diseases</label>
                        <textarea
                            rows={2}
                            value={data.chronic_conditions_summary}
                            onChange={(e) => setData('chronic_conditions_summary', e.target.value)}
                            className="w-full p-2.5 text-xs border border-slate-200 rounded-xl outline-none"
                        />
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                        <Link
                            href={route('patients.show', patient.id)}
                            className="px-5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-2.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-sm flex items-center gap-2"
                        >
                            <Save className="w-4 h-4" />
                            <span>Save Changes</span>
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
