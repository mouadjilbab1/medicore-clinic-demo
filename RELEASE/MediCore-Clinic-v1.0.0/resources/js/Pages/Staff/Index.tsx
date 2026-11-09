import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useTranslation } from '@/Utils/translations';
import { Users, Plus, ShieldCheck, Stethoscope, Briefcase, Phone, Mail, Building, X, Award } from 'lucide-react';
import { User, Branch, Department } from '@/types';

interface StaffUser extends User {
    branch?: Branch;
    doctor?: {
        id: number;
        specialty: string;
        license_number: string;
        consultation_fee: number;
        followup_fee: number;
        slot_duration_minutes: number;
        is_available: boolean;
        schedules?: any[];
    };
}

interface Props {
    staff: StaffUser[];
    departments: Department[];
    branches: Branch[];
}

export default function StaffIndex({ staff, departments, branches }: Props) {
    const { t } = useTranslation();
    const [staffModalOpen, setStaffModalOpen] = useState(false);
    const [roleFilter, setRoleFilter] = useState('all');

    const form = useForm({
        name: '',
        email: '',
        phone: '',
        password: '',
        role: 'doctor',
        branch_id: branches[0]?.id || '',
        specialty: 'general',
        license_number: '',
        consultation_fee: 250,
    });

    const handleCreateStaff = (e: React.FormEvent) => {
        e.preventDefault();
        form.post(route('staff.store'), {
            onSuccess: () => {
                setStaffModalOpen(false);
                form.reset();
            },
        });
    };

    const roleBadge = (role: string) => {
        const roleMap: Record<string, { label: string; bg: string; text: string }> = {
            admin: { label: 'Administrator', bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-800 dark:text-purple-300' },
            director: { label: 'Clinic Director', bg: 'bg-indigo-100 dark:bg-indigo-900/30', text: 'text-indigo-800 dark:text-indigo-300' },
            manager: { label: 'Practice Manager', bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-800 dark:text-blue-300' },
            doctor: { label: 'Physician / Doctor', bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-800 dark:text-emerald-300' },
            dentist: { label: 'Dental Surgeon', bg: 'bg-teal-100 dark:bg-teal-900/30', text: 'text-teal-800 dark:text-teal-300' },
            nurse: { label: 'Clinical Nurse', bg: 'bg-rose-100 dark:bg-rose-900/30', text: 'text-rose-800 dark:text-rose-300' },
            receptionist: { label: 'Front Desk', bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-800 dark:text-amber-300' },
            accountant: { label: 'Accountant / Cashier', bg: 'bg-cyan-100 dark:bg-cyan-900/30', text: 'text-cyan-800 dark:text-cyan-300' },
            pharmacist: { label: 'Pharmacist', bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-800 dark:text-green-300' },
            lab_tech: { label: 'Lab Technologist', bg: 'bg-teal-100 dark:bg-teal-900/30', text: 'text-teal-800 dark:text-teal-300' },
            imaging_tech: { label: 'Radiology Tech', bg: 'bg-indigo-100 dark:bg-indigo-900/30', text: 'text-indigo-800 dark:text-indigo-300' },
            inventory_mgr: { label: 'Inventory Manager', bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-800 dark:text-orange-300' },
        };

        const config = roleMap[role] || { label: role, bg: 'bg-slate-100', text: 'text-slate-800' };

        return (
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
                {config.label}
            </span>
        );
    };

    const filteredStaff = roleFilter === 'all'
        ? staff
        : staff.filter(s => s.role === roleFilter);

    return (
        <AuthenticatedLayout>
            <Head title="Staff Directory & Medical HR - MediCore" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-xl">
                            <Users className="w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Medical Staff & HR Directory</h1>
                            <p className="text-sm text-slate-500">Manage physicians, specialists, nurses, and administrative personnel</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setStaffModalOpen(true)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium shadow-sm transition-all"
                    >
                        <Plus className="w-4 h-4" />
                        Enroll Staff Member
                    </button>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                    {['all', 'doctor', 'dentist', 'nurse', 'receptionist', 'accountant', 'admin'].map((role) => (
                        <button
                            key={role}
                            onClick={() => setRoleFilter(role)}
                            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                                roleFilter === role
                                    ? 'bg-blue-600 text-white shadow-sm'
                                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 border border-slate-200 dark:border-slate-700'
                            }`}
                        >
                            {role === 'all' ? 'All Staff Members' : role.charAt(0).toUpperCase() + role.slice(1) + 's'}
                        </button>
                    ))}
                </div>

                {/* Staff Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredStaff.map((member) => (
                        <div
                            key={member.id}
                            className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 hover:shadow-md transition-shadow relative overflow-hidden"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold flex items-center justify-center text-lg border border-slate-200 dark:border-slate-600">
                                        {member.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 dark:text-white leading-tight">{member.name}</h3>
                                        <p className="text-xs text-slate-400 mt-0.5">{member.email}</p>
                                    </div>
                                </div>
                                <div>
                                    {roleBadge(member.role)}
                                </div>
                            </div>

                            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-700/60 pt-4">
                                <div className="flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                                    <span>{member.phone || 'No phone recorded'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Building className="w-4 h-4 text-slate-400 shrink-0" />
                                    <span>Branch: {member.branch?.name || 'Primary Clinic'}</span>
                                </div>

                                {member.doctor && (
                                    <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-900/40 rounded-xl space-y-1 border border-slate-100 dark:border-slate-700/60">
                                        <div className="flex items-center justify-between">
                                            <span className="text-slate-500 font-medium">Specialty:</span>
                                            <span className="font-semibold text-slate-800 dark:text-slate-200 capitalize">{member.doctor.specialty}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-slate-500 font-medium">License #:</span>
                                            <span className="font-mono text-slate-700 dark:text-slate-300">{member.doctor.license_number}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-slate-500 font-medium">Consultation Fee:</span>
                                            <span className="font-bold text-blue-600">${Number(member.doctor.consultation_fee).toFixed(2)}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal: Enroll Staff Member */}
            {staffModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-lg border border-slate-200 dark:border-slate-700 overflow-hidden max-h-[90vh] flex flex-col">
                        <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                            <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                                <Users className="w-5 h-5 text-blue-600" />
                                Enroll New Staff Member
                            </h3>
                            <button onClick={() => setStaffModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleCreateStaff} className="p-6 overflow-y-auto space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Full Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Dr. Sarah Jenkins"
                                    value={form.data.name}
                                    onChange={(e) => form.setData('name', e.target.value)}
                                    className="w-full px-3 py-2 border rounded-xl dark:bg-slate-700 dark:border-slate-600 text-sm"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Email Address</label>
                                    <input
                                        type="email"
                                        placeholder="sarah@medicore.local"
                                        value={form.data.email}
                                        onChange={(e) => form.setData('email', e.target.value)}
                                        className="w-full px-3 py-2 border rounded-xl dark:bg-slate-700 dark:border-slate-600 text-sm"
                                        required
                                    />
                                    {form.errors.email && <div className="text-xs text-rose-500 mt-1">{form.errors.email}</div>}
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Phone Number</label>
                                    <input
                                        type="text"
                                        placeholder="+1 555-0199"
                                        value={form.data.phone}
                                        onChange={(e) => form.setData('phone', e.target.value)}
                                        className="w-full px-3 py-2 border rounded-xl dark:bg-slate-700 dark:border-slate-600 text-sm"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Primary Role</label>
                                    <select
                                        value={form.data.role}
                                        onChange={(e) => form.setData('role', e.target.value)}
                                        className="w-full px-3 py-2 border rounded-xl dark:bg-slate-700 dark:border-slate-600 text-sm"
                                        required
                                    >
                                        <option value="doctor">Physician / Doctor</option>
                                        <option value="dentist">Dental Surgeon</option>
                                        <option value="nurse">Nurse</option>
                                        <option value="receptionist">Receptionist</option>
                                        <option value="accountant">Accountant / Cashier</option>
                                        <option value="pharmacist">Pharmacist</option>
                                        <option value="lab_tech">Lab Technologist</option>
                                        <option value="imaging_tech">Radiology Tech</option>
                                        <option value="inventory_mgr">Inventory Manager</option>
                                        <option value="manager">Practice Manager</option>
                                        <option value="director">Medical Director</option>
                                        <option value="admin">System Administrator</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Assigned Branch</label>
                                    <select
                                        value={form.data.branch_id}
                                        onChange={(e) => form.setData('branch_id', e.target.value)}
                                        className="w-full px-3 py-2 border rounded-xl dark:bg-slate-700 dark:border-slate-600 text-sm"
                                    >
                                        {branches.map((b) => (
                                            <option key={b.id} value={b.id}>{b.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Password</label>
                                <input
                                    type="password"
                                    placeholder="Minimum 8 characters"
                                    value={form.data.password}
                                    onChange={(e) => form.setData('password', e.target.value)}
                                    className="w-full px-3 py-2 border rounded-xl dark:bg-slate-700 dark:border-slate-600 text-sm"
                                    required
                                />
                            </div>

                            {['doctor', 'dentist'].includes(form.data.role) && (
                                <div className="p-4 bg-slate-50 dark:bg-slate-900/40 rounded-xl space-y-3 border border-slate-200 dark:border-slate-700">
                                    <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">Clinical Credentialing</h4>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Specialty</label>
                                            <input
                                                type="text"
                                                placeholder={form.data.role === 'dentist' ? 'dental' : 'general, cardiology...'}
                                                value={form.data.specialty}
                                                onChange={(e) => form.setData('specialty', e.target.value)}
                                                className="w-full px-3 py-1.5 border rounded-lg dark:bg-slate-800 dark:border-slate-600 text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Medical License #</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. MED-88219"
                                                value={form.data.license_number}
                                                onChange={(e) => form.setData('license_number', e.target.value)}
                                                className="w-full px-3 py-1.5 border rounded-lg dark:bg-slate-800 dark:border-slate-600 text-sm"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Standard Consultation Fee ($)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={form.data.consultation_fee}
                                            onChange={(e) => form.setData('consultation_fee', parseFloat(e.target.value) || 0)}
                                            className="w-full px-3 py-1.5 border rounded-lg dark:bg-slate-800 dark:border-slate-600 text-sm"
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                                <button
                                    type="button"
                                    onClick={() => setStaffModalOpen(false)}
                                    className="px-4 py-2 border rounded-xl text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={form.processing}
                                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-sm"
                                >
                                    Enroll Staff
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
