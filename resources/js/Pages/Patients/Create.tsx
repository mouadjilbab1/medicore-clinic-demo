import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useTranslation } from '@/Utils/translations';
import { UserPlus, ArrowLeft, AlertTriangle, ShieldCheck, Phone, User, Calendar, MapPin, HeartPulse } from 'lucide-react';
import axios from 'axios';

interface Props {
    suggested_uid: string;
}

export default function PatientsCreate({ suggested_uid }: Props) {
    const { t } = useTranslation();
    const { data, setData, post, processing, errors } = useForm({
        first_name: '',
        last_name: '',
        gender: 'male',
        date_of_birth: '1990-01-01',
        phone: '+212 ',
        email: '',
        national_id: '',
        blood_group: 'O+',
        address: '',
        city: 'Casablanca',
        emergency_contact_name: '',
        emergency_contact_phone: '',
        allergies_summary: '',
        chronic_conditions_summary: '',
        medical_notes: '',
    });

    const [duplicates, setDuplicates] = useState<any[]>([]);

    const checkDuplicates = async () => {
        if (data.phone.length > 8 || data.national_id.length > 3) {
            try {
                const res = await axios.post(route('patients.check-duplicates'), {
                    phone: data.phone,
                    national_id: data.national_id,
                    email: data.email,
                });
                setDuplicates(res.data.duplicates || []);
            } catch (e) {
                // Ignore silent duplicate check error
            }
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('patients.store'));
    };

    return (
        <AuthenticatedLayout>
            <Head title="New Patient Intake - MediCore" />

            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <Link href={route('patients.index')} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                                <ArrowLeft className="w-5 h-5" />
                            </Link>
                            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                                New Patient Registration
                            </h1>
                        </div>
                        <p className="text-xs text-slate-500 ms-7 mt-0.5">
                            Assigned Patient UID: <span className="font-mono font-bold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded">{suggested_uid}</span>
                        </p>
                    </div>
                </div>

                {/* Duplicates Alert Box */}
                {duplicates.length > 0 && (
                    <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900">
                        <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider mb-2 text-amber-800">
                            <AlertTriangle className="w-4 h-4 text-amber-600" />
                            <span>Potential Duplicate Record Detected ({duplicates.length} match)</span>
                        </div>
                        <div className="text-xs space-y-1">
                            {duplicates.map((dup) => (
                                <div key={dup.id} className="flex items-center justify-between bg-white/70 p-2 rounded-lg">
                                    <span>
                                        <strong>{dup.first_name} {dup.last_name}</strong> ({dup.patient_uid}) — Phone: {dup.phone} — CIN: {dup.national_id || 'N/A'}
                                    </span>
                                    <Link
                                        href={route('patients.show', dup.id)}
                                        className="text-teal-700 font-semibold hover:underline"
                                    >
                                        View Existing Profile →
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Form Card */}
                <form onSubmit={submit} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                    {/* Demographics Section */}
                    <div>
                        <div className="flex items-center gap-2 text-sm font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
                            <User className="w-4 h-4 text-teal-600" />
                            <span>1. Demographic & Identification</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">First Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={data.first_name}
                                    onChange={(e) => setData('first_name', e.target.value)}
                                    className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                                    placeholder="Ahmed"
                                />
                                {errors.first_name && <p className="text-red-500 text-[10px] mt-1">{errors.first_name}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">Last Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={data.last_name}
                                    onChange={(e) => setData('last_name', e.target.value)}
                                    className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                                    placeholder="El Amrani"
                                />
                                {errors.last_name && <p className="text-red-500 text-[10px] mt-1">{errors.last_name}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">Gender *</label>
                                <select
                                    value={data.gender}
                                    onChange={(e) => setData('gender', e.target.value as any)}
                                    className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                                >
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">Date of Birth *</label>
                                <input
                                    type="date"
                                    required
                                    value={data.date_of_birth}
                                    onChange={(e) => setData('date_of_birth', e.target.value)}
                                    className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">Blood Group</label>
                                <select
                                    value={data.blood_group}
                                    onChange={(e) => setData('blood_group', e.target.value)}
                                    className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                                >
                                    <option value="A+">A+</option>
                                    <option value="A-">A-</option>
                                    <option value="B+">B+</option>
                                    <option value="B-">B-</option>
                                    <option value="AB+">AB+</option>
                                    <option value="AB-">AB-</option>
                                    <option value="O+">O+</option>
                                    <option value="O-">O-</option>
                                    <option value="unknown">Unknown</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">National ID / Passport (CIN)</label>
                                <input
                                    type="text"
                                    value={data.national_id}
                                    onBlur={checkDuplicates}
                                    onChange={(e) => setData('national_id', e.target.value)}
                                    className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                                    placeholder="e.g. BE123456"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Contact Information Section */}
                    <div>
                        <div className="flex items-center gap-2 text-sm font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
                            <Phone className="w-4 h-4 text-teal-600" />
                            <span>2. Contact & Emergency Details</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number *</label>
                                <input
                                    type="text"
                                    required
                                    value={data.phone}
                                    onBlur={checkDuplicates}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none font-mono"
                                    placeholder="+212 600 000000"
                                />
                                {errors.phone && <p className="text-red-500 text-[10px] mt-1">{errors.phone}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                                    placeholder="patient@example.com"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
                                <input
                                    type="text"
                                    value={data.city}
                                    onChange={(e) => setData('city', e.target.value)}
                                    className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                                />
                            </div>

                            <div className="sm:col-span-3">
                                <label className="block text-xs font-semibold text-slate-700 mb-1">Residential Address</label>
                                <input
                                    type="text"
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                    className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                                    placeholder="Street, District, Apartment Number"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">Emergency Contact Name</label>
                                <input
                                    type="text"
                                    value={data.emergency_contact_name}
                                    onChange={(e) => setData('emergency_contact_name', e.target.value)}
                                    className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                                    placeholder="Name (Relationship)"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">Emergency Contact Phone</label>
                                <input
                                    type="text"
                                    value={data.emergency_contact_phone}
                                    onChange={(e) => setData('emergency_contact_phone', e.target.value)}
                                    className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                                    placeholder="+212 600..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Medical Baseline & Alerts */}
                    <div>
                        <div className="flex items-center gap-2 text-sm font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
                            <HeartPulse className="w-4 h-4 text-rose-600" />
                            <span>3. Medical Baseline & Clinical Safety Alerts</span>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-rose-700 mb-1">
                                    Drug & Environmental Allergies (Will trigger high-visibility alerts on all charts)
                                </label>
                                <textarea
                                    rows={2}
                                    value={data.allergies_summary}
                                    onChange={(e) => setData('allergies_summary', e.target.value)}
                                    className="w-full p-2.5 text-xs border border-rose-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none bg-rose-50/20"
                                    placeholder="e.g. Penicillin, NSAIDs, Latex, Anesthetics..."
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">Chronic Medical Conditions</label>
                                    <textarea
                                        rows={2}
                                        value={data.chronic_conditions_summary}
                                        onChange={(e) => setData('chronic_conditions_summary', e.target.value)}
                                        className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                                        placeholder="e.g. Hypertension, Diabetes Type 2, Asthma..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">General Medical Notes</label>
                                    <textarea
                                        rows={2}
                                        value={data.medical_notes}
                                        onChange={(e) => setData('medical_notes', e.target.value)}
                                        className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                                        placeholder="Special considerations, past surgeries, implants..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                        <Link
                            href={route('patients.index')}
                            className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 active:bg-teal-800 shadow-md shadow-teal-600/20 transition disabled:opacity-50"
                        >
                            {processing ? 'Enrolling Patient...' : 'Complete Patient Intake'}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
