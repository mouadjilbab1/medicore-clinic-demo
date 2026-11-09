import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useTranslation } from '@/Utils/translations';
import {
    Clock,
    UserCheck,
    Volume2,
    ArrowRight,
    AlertCircle,
    CheckCircle2,
    SkipForward,
    ArrowRightLeft,
    Plus,
    ExternalLink,
} from 'lucide-react';
import { QueueItem, Doctor, Patient } from '@/types';

interface Props {
    queue: QueueItem[];
    doctors: Doctor[];
    patients: Patient[];
    selectedDoctorId: number | null;
}

export default function WaitingRoomIndex({
    queue,
    doctors,
    patients,
    selectedDoctorId,
}: Props) {
    const { t } = useTranslation();
    const [checkInModalOpen, setCheckInModalOpen] = useState(false);
    const [transferModalOpen, setTransferModalOpen] = useState(false);
    const [transferQueueId, setTransferQueueId] = useState<number | null>(null);
    const [newDoctorId, setNewDoctorId] = useState('');

    const { data, setData, post, processing, reset } = useForm({
        patient_id: '',
        doctor_id: doctors[0]?.id ? String(doctors[0].id) : '',
        priority: 'normal',
        notes: '',
    });

    const handleCheckIn = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('waiting-room.check-in'), {
            onSuccess: () => {
                setCheckInModalOpen(false);
                reset();
            },
        });
    };

    const callNext = (id: number) => {
        router.post(route('waiting-room.call', id));
    };

    const completePatient = (id: number) => {
        router.post(route('waiting-room.complete', id));
    };

    const skipPatient = (id: number) => {
        router.post(route('waiting-room.skip', id));
    };

    const handleTransferSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (transferQueueId && newDoctorId) {
            router.post(route('waiting-room.transfer', transferQueueId), {
                new_doctor_id: newDoctorId,
            }, {
                onSuccess: () => setTransferModalOpen(false),
            });
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Live Waiting Room & Queue - MediCore" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                            {t('nav.waiting_room', 'Live Waiting Room & Triage Queue')}
                        </h1>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Real-time patient flow, automated queue tickets, calling screen, and doctor handover
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link
                            href={route('waiting-room.display')}
                            target="_blank"
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-sm transition"
                        >
                            <ExternalLink className="w-4 h-4 text-teal-600" />
                            <span>Launch Public Board</span>
                        </Link>

                        <button
                            type="button"
                            onClick={() => setCheckInModalOpen(true)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 shadow-sm transition"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Patient Check-In</span>
                        </button>
                    </div>
                </div>

                {/* Queue Statistics & Doctor Filter */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs">
                        <span className="font-bold text-slate-800">Active Queue: {queue.length} Patients</span>
                        <span>•</span>
                        <span className="text-amber-600 font-semibold">
                            {queue.filter((q) => q.status === 'waiting').length} Waiting
                        </span>
                        <span>•</span>
                        <span className="text-blue-600 font-semibold">
                            {queue.filter((q) => q.status === 'called' || q.status === 'in_consultation').length} With Doctor
                        </span>
                    </div>

                    <select
                        value={selectedDoctorId || ''}
                        onChange={(e) => {
                            router.get(route('waiting-room.index'), {
                                doctor_id: e.target.value || undefined,
                            });
                        }}
                        className="text-xs p-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 outline-none text-slate-700"
                    >
                        <option value="">All Physician Queues</option>
                        {doctors.map((d) => (
                            <option key={d.id} value={d.id}>
                                {d.user?.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Live Queue Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {queue.length === 0 ? (
                        <div className="col-span-3 bg-white p-12 text-center text-slate-400 text-xs rounded-2xl border border-slate-200">
                            No patients currently in the waiting lounge.
                        </div>
                    ) : (
                        queue.map((item) => (
                            <div
                                key={item.id}
                                className={`bg-white rounded-2xl border p-5 shadow-sm flex flex-col justify-between transition ${
                                    item.status === 'called'
                                        ? 'border-blue-400 bg-blue-50/20'
                                        : item.priority === 'emergency'
                                        ? 'border-rose-400 bg-rose-50/20'
                                        : 'border-slate-200'
                                }`}
                            >
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <span className="text-2xl font-black font-mono text-slate-900 bg-slate-100 px-3 py-1 rounded-xl">
                                                #{item.queue_number}
                                            </span>
                                            <span
                                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                                                    item.priority === 'emergency'
                                                        ? 'bg-rose-100 text-rose-800 animate-pulse'
                                                        : item.priority === 'urgent'
                                                        ? 'bg-amber-100 text-amber-800'
                                                        : 'bg-slate-100 text-slate-700'
                                                }`}
                                            >
                                                {item.priority}
                                            </span>
                                        </div>

                                        <span
                                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                                                item.status === 'called'
                                                    ? 'bg-blue-600 text-white'
                                                    : item.status === 'in_consultation'
                                                    ? 'bg-teal-600 text-white'
                                                    : 'bg-amber-100 text-amber-800'
                                            }`}
                                        >
                                            {item.status.replace('_', ' ')}
                                        </span>
                                    </div>

                                    <h3 className="font-bold text-slate-900 text-base">
                                        {item.patient?.full_name}
                                    </h3>
                                    <div className="text-xs text-slate-500 mt-0.5">
                                        {item.patient?.patient_uid} — Phone: {item.patient?.phone}
                                    </div>

                                    <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-1">
                                        <div>
                                            Assigned Doctor: <strong>{item.doctor?.user?.name}</strong>
                                        </div>
                                        <div className="text-[11px] text-slate-400">
                                            Checked in at: {new Date(item.check_in_time).toLocaleTimeString()}
                                        </div>
                                        {item.notes && (
                                            <div className="text-[11px] italic text-slate-500">
                                                Note: {item.notes}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Queue Action Controls */}
                                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                                    {item.status === 'waiting' && (
                                        <button
                                            type="button"
                                            onClick={() => callNext(item.id)}
                                            className="w-full py-2 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm"
                                        >
                                            <Volume2 className="w-4 h-4" />
                                            <span>Call Patient</span>
                                        </button>
                                    )}

                                    {item.status === 'called' && (
                                        <div className="w-full flex items-center gap-2">
                                            <Link
                                                href={route('consultations.create', { patient_id: item.patient_id, appointment_id: item.appointment_id })}
                                                className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs text-center"
                                            >
                                                Start Encounter
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={() => completePatient(item.id)}
                                                className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs"
                                            >
                                                Done
                                            </button>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-1">
                                        <button
                                            type="button"
                                            title="Transfer Doctor"
                                            onClick={() => {
                                                setTransferQueueId(item.id);
                                                setTransferModalOpen(true);
                                            }}
                                            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                                        >
                                            <ArrowRightLeft className="w-4 h-4" />
                                        </button>
                                        <button
                                            type="button"
                                            title="Skip Ticket"
                                            onClick={() => skipPatient(item.id)}
                                            className="p-2 text-slate-400 hover:text-amber-600 rounded-lg hover:bg-amber-50"
                                        >
                                            <SkipForward className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Check-In Modal */}
            {checkInModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-slate-900 text-base">Check-In Waiting Patient</h3>
                            <button onClick={() => setCheckInModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleCheckIn} className="space-y-4 text-xs">
                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">Patient Profile *</label>
                                <select
                                    required
                                    value={data.patient_id}
                                    onChange={(e) => setData('patient_id', e.target.value)}
                                    className="w-full p-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-teal-500"
                                >
                                    <option value="">Select Patient from Registry...</option>
                                    {patients.map((p) => (
                                        <option key={p.id} value={p.id}>
                                            {p.full_name} ({p.patient_uid})
                                        </option>
                                    ))}
                                </select>
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

                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">Triage Priority</label>
                                <select
                                    value={data.priority}
                                    onChange={(e) => setData('priority', e.target.value)}
                                    className="w-full p-2.5 border border-slate-300 rounded-xl outline-none"
                                >
                                    <option value="normal">Normal (Sequential)</option>
                                    <option value="urgent">Urgent</option>
                                    <option value="emergency">Emergency Priority</option>
                                    <option value="special_needs">Special Needs / Elderly</option>
                                </select>
                            </div>

                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">Reception Notes</label>
                                <input
                                    type="text"
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    placeholder="e.g. Needs wheelchair, acute toothache..."
                                    className="w-full p-2.5 border border-slate-300 rounded-xl outline-none"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setCheckInModalOpen(false)}
                                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl"
                                >
                                    Issue Ticket
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Transfer Doctor Modal */}
            {transferModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200">
                        <h3 className="font-bold text-slate-900 text-sm mb-3">Transfer Patient to Another Doctor</h3>
                        <form onSubmit={handleTransferSubmit} className="space-y-4 text-xs">
                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">New Doctor</label>
                                <select
                                    required
                                    value={newDoctorId}
                                    onChange={(e) => setNewDoctorId(e.target.value)}
                                    className="w-full p-2.5 border border-slate-300 rounded-xl outline-none"
                                >
                                    <option value="">Select Doctor...</option>
                                    {doctors.map((d) => (
                                        <option key={d.id} value={d.id}>
                                            {d.user?.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setTransferModalOpen(false)}
                                    className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-xl"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl"
                                >
                                    Transfer
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
