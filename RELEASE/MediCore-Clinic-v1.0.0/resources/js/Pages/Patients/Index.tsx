import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useTranslation } from '@/Utils/translations';
import {
    Users,
    Search,
    UserPlus,
    Filter,
    ChevronRight,
    AlertTriangle,
    Eye,
    Edit,
    Phone,
    FileSpreadsheet,
    GitMerge,
} from 'lucide-react';
import { PaginatedData, Patient } from '@/types';

interface Props {
    patients: PaginatedData<Patient>;
    filters: {
        search?: string;
        gender?: string;
        blood_group?: string;
    };
}

export default function PatientsIndex({ patients, filters }: Props) {
    const { t } = useTranslation();
    const [search, setSearch] = useState(filters.search || '');
    const [gender, setGender] = useState(filters.gender || '');
    const [bloodGroup, setBloodGroup] = useState(filters.blood_group || '');
    const [mergeModalOpen, setMergeModalOpen] = useState(false);
    const [sourceId, setSourceId] = useState('');
    const [targetId, setTargetId] = useState('');
    const [mergeReason, setMergeReason] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            route('patients.index'),
            { search, gender, blood_group: bloodGroup },
            { preserveState: true, replace: true }
        );
    };

    const handleMergeSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(
            route('patients.merge'),
            {
                source_patient_id: sourceId,
                target_patient_id: targetId,
                reason: mergeReason,
            },
            {
                onSuccess: () => {
                    setMergeModalOpen(false);
                    setSourceId('');
                    setTargetId('');
                    setMergeReason('');
                },
            }
        );
    };

    return (
        <AuthenticatedLayout>
            <Head title="Patient Directory - MediCore" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                            {t('nav.patients', 'Master Patient Registry')}
                        </h1>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Search, register and manage electronic health records and clinical history
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setMergeModalOpen(true)}
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-sm transition"
                        >
                            <GitMerge className="w-4 h-4 text-slate-500" />
                            <span>Merge Duplicate</span>
                        </button>

                        <Link
                            href={route('patients.create')}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 shadow-sm transition"
                        >
                            <UserPlus className="w-4 h-4" />
                            <span>{t('common.add', 'New Patient Intake')}</span>
                        </Link>
                    </div>
                </div>

                {/* Search & Filters Bar */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                    <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                        <div className="sm:col-span-2 relative">
                            <Search className="w-4 h-4 text-slate-400 absolute start-3 top-3" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by name, phone (+212...), ID card, or Patient UID..."
                                className="w-full ps-9 pe-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                            />
                        </div>

                        <div>
                            <select
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                                className="w-full py-2 px-3 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none text-slate-600"
                            >
                                <option value="">All Genders</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="w-full py-2 px-4 rounded-xl text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition shadow-sm"
                            >
                                Apply Filters
                            </button>
                        </div>
                    </form>
                </div>

                {/* Patient Records Table */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-start text-xs">
                            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-3.5 text-start font-semibold">Patient UID</th>
                                    <th className="px-6 py-3.5 text-start font-semibold">Patient Full Name</th>
                                    <th className="px-6 py-3.5 text-start font-semibold">Phone Number</th>
                                    <th className="px-6 py-3.5 text-start font-semibold">Age / Gender</th>
                                    <th className="px-6 py-3.5 text-start font-semibold">Blood Group</th>
                                    <th className="px-6 py-3.5 text-start font-semibold">Allergies</th>
                                    <th className="px-6 py-3.5 text-end font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-700">
                                {patients.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                                            No patients found matching your search criteria.
                                        </td>
                                    </tr>
                                ) : (
                                    patients.data.map((p) => (
                                        <tr key={p.id} className="hover:bg-slate-50/80 transition">
                                            <td className="px-6 py-3.5">
                                                <span className="font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                                                    {p.patient_uid}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3.5 font-semibold text-slate-900">
                                                <Link href={route('patients.show', p.id)} className="hover:text-teal-600">
                                                    {p.first_name} {p.last_name}
                                                </Link>
                                                {p.national_id && (
                                                    <span className="block text-[10px] text-slate-400">
                                                        CIN: {p.national_id}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-3.5">
                                                <div className="flex items-center gap-1.5 font-mono text-slate-600">
                                                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                                                    <span>{p.phone}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-3.5 capitalize">
                                                {p.date_of_birth ? `${new Date().getFullYear() - new Date(p.date_of_birth).getFullYear()} yrs` : '—'} / {p.gender}
                                            </td>
                                            <td className="px-6 py-3.5 font-bold text-slate-800">
                                                {p.blood_group ? (
                                                    <span className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200">
                                                        {p.blood_group}
                                                    </span>
                                                ) : '—'}
                                            </td>
                                            <td className="px-6 py-3.5">
                                                {p.allergies_summary ? (
                                                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                                                        <AlertTriangle className="w-3 h-3" />
                                                        <span>{p.allergies_summary.substring(0, 25)}...</span>
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-400 text-[11px]">None recorded</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-3.5 text-end space-x-2">
                                                <Link
                                                    href={route('patients.show', p.id)}
                                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-50 text-teal-700 hover:bg-teal-100 font-semibold text-[11px] transition"
                                                >
                                                    <Eye className="w-3.5 h-3.5" />
                                                    <span>View Chart</span>
                                                </Link>
                                                <Link
                                                    href={route('patients.edit', p.id)}
                                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold text-[11px] transition"
                                                >
                                                    <Edit className="w-3.5 h-3.5" />
                                                    <span>Edit</span>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {patients.total > patients.per_page && (
                        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                            <div>
                                Showing {patients.from} to {patients.to} of {patients.total} patients
                            </div>
                            <div className="flex items-center gap-1">
                                {patients.current_page > 1 && (
                                    <Link
                                        href={route('patients.index', { ...filters, page: patients.current_page - 1 })}
                                        className="px-2.5 py-1 rounded border border-slate-200 bg-white hover:bg-slate-50 font-medium"
                                    >
                                        Previous
                                    </Link>
                                )}
                                {patients.current_page < patients.last_page && (
                                    <Link
                                        href={route('patients.index', { ...filters, page: patients.current_page + 1 })}
                                        className="px-2.5 py-1 rounded border border-slate-200 bg-white hover:bg-slate-50 font-medium"
                                    >
                                        Next
                                    </Link>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Merge Patients Modal */}
            {mergeModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                                <GitMerge className="w-5 h-5 text-teal-600" />
                                <span>Merge Duplicate Patient Records</span>
                            </h3>
                            <button
                                onClick={() => setMergeModalOpen(false)}
                                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
                            >
                                ✕
                            </button>
                        </div>
                        <p className="text-xs text-slate-500 mb-4">
                            Consolidate all appointments, medical notes, invoices, and dental history from a duplicate profile into the master profile. The source profile will be archived.
                        </p>

                        <form onSubmit={handleMergeSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Source Patient ID (Duplicate to archive)
                                </label>
                                <input
                                    type="number"
                                    required
                                    value={sourceId}
                                    onChange={(e) => setSourceId(e.target.value)}
                                    placeholder="e.g. 2"
                                    className="w-full p-2.5 text-xs border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-teal-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Target Patient ID (Master Record to retain)
                                </label>
                                <input
                                    type="number"
                                    required
                                    value={targetId}
                                    onChange={(e) => setTargetId(e.target.value)}
                                    placeholder="e.g. 1"
                                    className="w-full p-2.5 text-xs border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-teal-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Clinical Justification / Reason
                                </label>
                                <textarea
                                    required
                                    rows={2}
                                    value={mergeReason}
                                    onChange={(e) => setMergeReason(e.target.value)}
                                    placeholder="Duplicate registration created during emergency check-in..."
                                    className="w-full p-2.5 text-xs border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-teal-500"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setMergeModalOpen(false)}
                                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 shadow-sm"
                                >
                                    Confirm Merge
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
