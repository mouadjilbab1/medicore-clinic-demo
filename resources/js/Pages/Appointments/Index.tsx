import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useTranslation } from '@/Utils/translations';
import {
    Calendar as CalendarIcon,
    Clock,
    User,
    Plus,
    Filter,
    AlertCircle,
    CheckCircle,
    XCircle,
    Building,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import { Appointment, Doctor, Room } from '@/types';
import axios from 'axios';

interface Props {
    appointments: Appointment[];
    doctors: Doctor[];
    rooms: Room[];
    selectedDate: string;
    selectedDoctorId: number | null;
    selectedStatus: string | null;
}

export default function AppointmentsIndex({
    appointments,
    doctors,
    rooms,
    selectedDate,
    selectedDoctorId,
    selectedStatus,
}: Props) {
    const { t } = useTranslation();
    const [modalOpen, setModalOpen] = useState(false);
    const [availableSlots, setAvailableSlots] = useState<any[]>([]);
    const [loadingSlots, setLoadingSlots] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        patient_id: '',
        doctor_id: selectedDoctorId ? String(selectedDoctorId) : (doctors[0]?.id ? String(doctors[0].id) : ''),
        room_id: '',
        appointment_date: selectedDate,
        start_time: '09:00:00',
        end_time: '09:30:00',
        type: 'consultation',
        reason_for_visit: '',
        notes: '',
    });

    const loadSlots = async (docId: string, dt: string) => {
        if (!docId || !dt) return;
        setLoadingSlots(true);
        try {
            const res = await axios.get(route('appointments.slots'), {
                params: { doctor_id: docId, date: dt },
            });
            setAvailableSlots(res.data.slots || []);
        } catch (e) {
            setAvailableSlots([]);
        } finally {
            setLoadingSlots(false);
        }
    };

    const handleDoctorChange = (docId: string) => {
        setData('doctor_id', docId);
        loadSlots(docId, data.appointment_date);
    };

    const handleDateChange = (dt: string) => {
        setData('appointment_date', dt);
        loadSlots(data.doctor_id, dt);
    };

    const openBookingModal = () => {
        setModalOpen(true);
        loadSlots(data.doctor_id, data.appointment_date);
    };

    const handleScheduleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('appointments.store'), {
            onSuccess: () => {
                setModalOpen(false);
                reset();
            },
        });
    };

    const updateStatus = (aptId: number, newStatus: string) => {
        router.patch(route('appointments.update-status', aptId), {
            status: newStatus,
        });
    };

    const shiftDate = (days: number) => {
        const d = new Date(selectedDate);
        d.setDate(d.getDate() + days);
        const nextDateStr = d.toISOString().split('T')[0];
        router.get(route('appointments.index'), {
            date: nextDateStr,
            doctor_id: selectedDoctorId,
            status: selectedStatus,
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Appointments & Clinic Schedule - MediCore" />

            <div className="space-y-6">
                {/* Header with Navigation and Date Controller */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                            {t('nav.appointments', 'Appointments & Clinical Schedule')}
                        </h1>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Real-time doctor calendar, room bookings, and double-booking conflict prevention
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={openBookingModal}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 shadow-sm transition"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Book Appointment</span>
                    </button>
                </div>

                {/* Filters and Date Bar */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Date Picker Bar */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => shiftDate(-1)}
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800">
                            <CalendarIcon className="w-4 h-4 text-teal-600" />
                            <span>{new Date(selectedDate).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</span>
                        </div>
                        <button
                            onClick={() => shiftDate(1)}
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => {
                                const todayStr = new Date().toISOString().split('T')[0];
                                router.get(route('appointments.index'), { date: todayStr });
                            }}
                            className="px-2.5 py-1.5 text-xs text-teal-700 hover:bg-teal-50 rounded-lg font-semibold"
                        >
                            Today
                        </button>
                    </div>

                    {/* Doctor Filter */}
                    <div className="flex items-center gap-3">
                        <select
                            value={selectedDoctorId || ''}
                            onChange={(e) => {
                                router.get(route('appointments.index'), {
                                    date: selectedDate,
                                    doctor_id: e.target.value || undefined,
                                    status: selectedStatus || undefined,
                                });
                            }}
                            className="text-xs p-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 outline-none text-slate-700"
                        >
                            <option value="">All Physicians & Dentists</option>
                            {doctors.map((d) => (
                                <option key={d.id} value={d.id}>
                                    {d.user?.name} ({d.specialty})
                                </option>
                            ))}
                        </select>

                        <select
                            value={selectedStatus || ''}
                            onChange={(e) => {
                                router.get(route('appointments.index'), {
                                    date: selectedDate,
                                    doctor_id: selectedDoctorId || undefined,
                                    status: e.target.value || undefined,
                                });
                            }}
                            className="text-xs p-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 outline-none text-slate-700"
                        >
                            <option value="">All Statuses</option>
                            <option value="scheduled">Scheduled</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="waiting">Waiting</option>
                            <option value="in_consultation">In Consultation</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>

                {/* Calendar Schedule Grid */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800">
                            Bookings for {selectedDate} ({appointments.length} Total)
                        </span>
                        <div className="flex items-center gap-3 text-[11px] text-slate-500">
                            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span> Scheduled</span>
                            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Waiting</span>
                            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> In Consultation</span>
                            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Completed</span>
                        </div>
                    </div>

                    <div className="divide-y divide-slate-100">
                        {appointments.length === 0 ? (
                            <div className="p-12 text-center text-slate-400 text-xs">
                                No appointments booked on this date. Click "Book Appointment" to add an appointment.
                            </div>
                        ) : (
                            appointments.map((apt) => (
                                <div
                                    key={apt.id}
                                    className="p-4 sm:px-6 hover:bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="w-20 font-mono font-bold text-xs text-slate-900 bg-slate-100 p-2 rounded-lg text-center">
                                            {apt.start_time.substring(0, 5)} - {apt.end_time.substring(0, 5)}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    href={route('patients.show', apt.patient_id)}
                                                    className="font-bold text-slate-900 text-sm hover:text-teal-600"
                                                >
                                                    {apt.patient?.full_name}
                                                </Link>
                                                <span className="font-mono text-[10px] bg-slate-100 text-slate-600 px-1.5 rounded">
                                                    {apt.patient?.patient_uid}
                                                </span>
                                            </div>
                                            <div className="text-xs text-slate-500 flex items-center gap-3 mt-1">
                                                <span>Doctor: <strong>{apt.doctor?.user?.name}</strong></span>
                                                <span>•</span>
                                                <span>Suite: <strong>{apt.room?.name || 'Standard'}</strong></span>
                                                <span>•</span>
                                                <span className="capitalize">{apt.type}</span>
                                            </div>
                                            {apt.reason_for_visit && (
                                                <div className="text-xs text-slate-600 mt-1 italic">
                                                    "{apt.reason_for_visit}"
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Status Controls */}
                                    <div className="flex items-center gap-2 self-end sm:self-center">
                                        <select
                                            value={apt.status}
                                            onChange={(e) => updateStatus(apt.id, e.target.value)}
                                            className="text-xs font-semibold py-1.5 px-3 rounded-lg border border-slate-200 outline-none"
                                        >
                                            <option value="scheduled">Scheduled</option>
                                            <option value="confirmed">Confirmed</option>
                                            <option value="waiting">Waiting Room</option>
                                            <option value="in_consultation">In Consultation</option>
                                            <option value="completed">Completed</option>
                                            <option value="cancelled">Cancelled</option>
                                            <option value="no_show">No Show</option>
                                        </select>

                                        <Link
                                            href={route('consultations.create', { patient_id: apt.patient_id, appointment_id: apt.id })}
                                            className="px-3 py-1.5 rounded-lg bg-teal-50 text-teal-700 hover:bg-teal-100 font-semibold text-xs transition"
                                        >
                                            Open Chart
                                        </Link>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Booking Modal */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                                <CalendarIcon className="w-5 h-5 text-teal-600" />
                                <span>Schedule New Appointment</span>
                            </h3>
                            <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                ✕
                            </button>
                        </div>

                        {errors.start_time && (
                            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                <span>{errors.start_time}</span>
                            </div>
                        )}

                        <form onSubmit={handleScheduleSubmit} className="space-y-4 text-xs">
                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">Patient ID / Profile *</label>
                                <input
                                    type="number"
                                    required
                                    value={data.patient_id}
                                    onChange={(e) => setData('patient_id', e.target.value)}
                                    placeholder="Enter Patient ID (e.g. 1)"
                                    className="w-full p-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-teal-500"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-semibold text-slate-700 mb-1">Doctor *</label>
                                    <select
                                        value={data.doctor_id}
                                        onChange={(e) => handleDoctorChange(e.target.value)}
                                        className="w-full p-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-teal-500"
                                    >
                                        {doctors.map((d) => (
                                            <option key={d.id} value={d.id}>
                                                {d.user?.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block font-semibold text-slate-700 mb-1">Room / Operatory</label>
                                    <select
                                        value={data.room_id}
                                        onChange={(e) => setData('room_id', e.target.value)}
                                        className="w-full p-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-teal-500"
                                    >
                                        <option value="">Any Available Room</option>
                                        {rooms.map((r) => (
                                            <option key={r.id} value={r.id}>
                                                {r.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">Appointment Date *</label>
                                <input
                                    type="date"
                                    required
                                    value={data.appointment_date}
                                    onChange={(e) => handleDateChange(e.target.value)}
                                    className="w-full p-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-teal-500"
                                />
                            </div>

                            {/* Available Time Slots Selector */}
                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">
                                    Doctor Slots (Checked for Overlaps & Breaks)
                                </label>
                                {loadingSlots ? (
                                    <p className="text-slate-400 py-2">Loading doctor slot availability...</p>
                                ) : (
                                    <div className="grid grid-cols-4 gap-1.5 max-h-32 overflow-y-auto p-1 bg-slate-50 rounded-xl border border-slate-200">
                                        {availableSlots.length === 0 ? (
                                            <div className="col-span-4 text-center py-2 text-slate-400">
                                                No predefined schedule for this day. You may manually specify times below.
                                            </div>
                                        ) : (
                                            availableSlots.map((s, idx) => (
                                                <button
                                                    key={idx}
                                                    type="button"
                                                    disabled={!s.is_available}
                                                    onClick={() => {
                                                        setData('start_time', s.start_time);
                                                        setData('end_time', s.end_time);
                                                    }}
                                                    className={`p-1.5 rounded text-[11px] font-mono font-medium transition ${
                                                        data.start_time === s.start_time
                                                            ? 'bg-teal-600 text-white font-bold'
                                                            : s.is_available
                                                            ? 'bg-white hover:bg-teal-50 text-slate-800 border border-slate-200'
                                                            : 'bg-slate-200 text-slate-400 cursor-not-allowed line-through'
                                                    }`}
                                                >
                                                    {s.start_time.substring(0, 5)}
                                                </button>
                                            ))
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-semibold text-slate-700 mb-1">Start Time *</label>
                                    <input
                                        type="time"
                                        required
                                        value={data.start_time}
                                        onChange={(e) => setData('start_time', e.target.value)}
                                        className="w-full p-2.5 border border-slate-300 rounded-xl outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block font-semibold text-slate-700 mb-1">End Time *</label>
                                    <input
                                        type="time"
                                        required
                                        value={data.end_time}
                                        onChange={(e) => setData('end_time', e.target.value)}
                                        className="w-full p-2.5 border border-slate-300 rounded-xl outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">Visit Type</label>
                                <select
                                    value={data.type}
                                    onChange={(e) => setData('type', e.target.value as any)}
                                    className="w-full p-2.5 border border-slate-300 rounded-xl outline-none"
                                >
                                    <option value="consultation">Standard Consultation</option>
                                    <option value="follow_up">Follow-up Review</option>
                                    <option value="procedure">Clinical Procedure</option>
                                    <option value="emergency">Emergency (Overrule non-urgent conflict)</option>
                                    <option value="walk_in">Walk-in Patient</option>
                                </select>
                            </div>

                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">Chief Reason for Visit</label>
                                <textarea
                                    rows={2}
                                    value={data.reason_for_visit}
                                    onChange={(e) => setData('reason_for_visit', e.target.value)}
                                    placeholder="Symptoms, requested procedure, follow-up..."
                                    className="w-full p-2.5 border border-slate-300 rounded-xl outline-none"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                    className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold shadow-sm"
                                >
                                    {processing ? 'Booking...' : 'Confirm Appointment'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
