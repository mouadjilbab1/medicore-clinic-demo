import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { Calendar, Pill, Receipt, Clock, Plus, User, Phone, Heart, FileText, CheckCircle2, AlertCircle, X, Shield } from 'lucide-react';
import { Patient, Appointment, Prescription, Invoice, Doctor } from '@/types';

interface Props {
    patient: Patient;
    appointments: Appointment[];
    prescriptions: Prescription[];
    invoices: Invoice[];
    doctors: (Doctor & { user: { name: string } })[];
}

export default function PatientPortalDashboard({ patient, appointments, prescriptions, invoices, doctors }: Props) {
    const [activeTab, setActiveTab] = useState<'appointments' | 'prescriptions' | 'billing'>('appointments');
    const [requestModalOpen, setRequestModalOpen] = useState(false);

    const bookingForm = useForm({
        patient_id: patient.id,
        doctor_id: doctors[0]?.id || '',
        appointment_date: new Date().toISOString().split('T')[0],
        start_time: '09:00',
        reason_for_visit: '',
    });

    const handleRequestAppointment = (e: React.FormEvent) => {
        e.preventDefault();
        bookingForm.post(route('portal.appointments.request'), {
            onSuccess: () => {
                setRequestModalOpen(false);
                bookingForm.reset();
            },
        });
    };

    const statusBadge = (status: string) => {
        switch (status) {
            case 'completed':
                return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">Completed</span>;
            case 'confirmed':
                return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">Confirmed</span>;
            case 'scheduled':
                return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">Pending Review</span>;
            case 'cancelled':
                return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800">Cancelled</span>;
            default:
                return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">{status}</span>;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-sans pb-16">
            <Head title={`Patient Portal - ${patient.first_name} ${patient.last_name}`} />

            {/* Portal Navigation Bar */}
            <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-30 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                            +
                        </div>
                        <div>
                            <span className="font-bold text-slate-900 dark:text-white tracking-tight">MediCore Patient Portal</span>
                            <span className="ml-2 text-xs text-teal-600 font-semibold px-2 py-0.5 rounded-full bg-teal-50 dark:bg-teal-900/30">Secure Health Hub</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link
                            href={route('login')}
                            className="text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors"
                        >
                            Staff Portal Sign-in &rarr;
                        </Link>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
                {/* Patient Banner */}
                <div className="bg-gradient-to-r from-teal-700 via-teal-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex items-center gap-5">
                        <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center font-bold text-2xl border border-white/20">
                            {patient.first_name[0]}{patient.last_name[0]}
                        </div>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-bold">{patient.first_name} {patient.last_name}</h1>
                                <span className="bg-teal-500/30 border border-teal-400/40 text-xs px-2.5 py-0.5 rounded-full font-mono">
                                    {patient.patient_uid}
                                </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-teal-100">
                                <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> Gender: {patient.gender}</span>
                                <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5 text-rose-400" /> Blood Group: {patient.blood_group || 'O+'}</span>
                                <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {patient.phone}</span>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => setRequestModalOpen(true)}
                        className="px-5 py-3 bg-white text-teal-800 hover:bg-teal-50 font-bold rounded-2xl shadow-lg transition-all flex items-center gap-2 text-sm shrink-0"
                    >
                        <Plus className="w-4 h-4" />
                        Request Appointment
                    </button>
                </div>

                {/* Tab Navigation */}
                <div className="flex border-b border-slate-200 dark:border-slate-700 gap-4">
                    <button
                        onClick={() => setActiveTab('appointments')}
                        className={`pb-4 px-2 font-semibold text-sm flex items-center gap-2 border-b-2 transition-all ${
                            activeTab === 'appointments'
                                ? 'border-teal-600 text-teal-600 dark:text-teal-400'
                                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                        }`}
                    >
                        <Calendar className="w-4 h-4" />
                        Appointments ({appointments.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('prescriptions')}
                        className={`pb-4 px-2 font-semibold text-sm flex items-center gap-2 border-b-2 transition-all ${
                            activeTab === 'prescriptions'
                                ? 'border-teal-600 text-teal-600 dark:text-teal-400'
                                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                        }`}
                    >
                        <Pill className="w-4 h-4" />
                        Active Prescriptions ({prescriptions.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('billing')}
                        className={`pb-4 px-2 font-semibold text-sm flex items-center gap-2 border-b-2 transition-all ${
                            activeTab === 'billing'
                                ? 'border-teal-600 text-teal-600 dark:text-teal-400'
                                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                        }`}
                    >
                        <Receipt className="w-4 h-4" />
                        Billing & Statements ({invoices.length})
                    </button>
                </div>

                {/* Tab Content */}
                {activeTab === 'appointments' && (
                    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                        <div className="p-4 border-b border-slate-200 dark:border-slate-700 font-semibold text-slate-900 dark:text-white">
                            Your Clinic Appointments
                        </div>
                        <div className="divide-y divide-slate-200 dark:divide-slate-700">
                            {appointments.length === 0 ? (
                                <div className="p-8 text-center text-slate-500">
                                    No appointments scheduled. Click 'Request Appointment' to book a consultation.
                                </div>
                            ) : (
                                appointments.map((apt) => (
                                    <div key={apt.id} className="p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-teal-50 dark:bg-teal-900/30 text-teal-600 rounded-xl">
                                                <Calendar className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-900 dark:text-white">
                                                    Consultation with Dr. {apt.doctor?.user?.name}
                                                </div>
                                                <div className="text-xs text-slate-500 mt-0.5">
                                                    Specialty: {apt.doctor?.specialty} • {apt.reason_for_visit || 'Routine Consultation'}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                                            <div className="text-right">
                                                <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">{apt.appointment_date}</div>
                                                <div className="text-xs text-slate-400">{apt.start_time.slice(0, 5)} - {apt.end_time.slice(0, 5)}</div>
                                            </div>
                                            <div>{statusBadge(apt.status)}</div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'prescriptions' && (
                    <div className="space-y-4">
                        {prescriptions.length === 0 ? (
                            <div className="p-8 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-center text-slate-500">
                                No active medical prescriptions found on record.
                            </div>
                        ) : (
                            prescriptions.map((rx) => (
                                <div key={rx.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                                    <div className="flex justify-between items-start border-b border-slate-200 dark:border-slate-700 pb-4 mb-4">
                                        <div>
                                            <h3 className="font-bold text-slate-900 dark:text-white text-base">Prescription #{rx.prescription_number}</h3>
                                            <p className="text-xs text-slate-500">Prescribed by Dr. {rx.doctor?.user?.name} on {new Date(rx.created_at).toLocaleDateString()}</p>
                                        </div>
                                        <Link
                                            href={route('prescriptions.print', rx.id)}
                                            className="px-3.5 py-1.5 bg-teal-50 text-teal-700 hover:bg-teal-100 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
                                        >
                                            <FileText className="w-3.5 h-3.5" />
                                            Print Rx Sheet
                                        </Link>
                                    </div>

                                    <div className="space-y-3">
                                        {rx.items?.map((item) => (
                                            <div key={item.id} className="p-3 bg-slate-50 dark:bg-slate-900/40 rounded-xl flex justify-between items-center text-sm">
                                                <div>
                                                    <span className="font-bold text-slate-900 dark:text-white">{item.medication_name}</span>
                                                    <span className="ml-2 text-xs text-slate-500 font-mono">({item.dosage})</span>
                                                    <div className="text-xs text-slate-500 mt-0.5">{item.frequency} for {item.duration}</div>
                                                </div>
                                                <span className="text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-full font-medium">
                                                    Route: {item.route || 'Oral'}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {activeTab === 'billing' && (
                    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                        <div className="p-4 border-b border-slate-200 dark:border-slate-700 font-semibold text-slate-900 dark:text-white">
                            Financial Ledger & Invoices
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse text-sm">
                                <thead>
                                    <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 text-xs font-semibold text-slate-500 uppercase">
                                        <th className="p-3.5">Invoice #</th>
                                        <th className="p-3.5">Date</th>
                                        <th className="p-3.5">Total Amount</th>
                                        <th className="p-3.5">Amount Paid</th>
                                        <th className="p-3.5">Outstanding</th>
                                        <th className="p-3.5">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                    {invoices.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="p-8 text-center text-slate-500">
                                                No clinic invoices found.
                                            </td>
                                        </tr>
                                    ) : (
                                        invoices.map((inv) => (
                                            <tr key={inv.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20">
                                                <td className="p-3.5 font-mono font-medium text-slate-900 dark:text-white">#{inv.invoice_number}</td>
                                                <td className="p-3.5 text-slate-500">{inv.invoice_date}</td>
                                                <td className="p-3.5 font-bold">${Number(inv.total_amount).toFixed(2)}</td>
                                                <td className="p-3.5 font-semibold text-emerald-600">${Number(inv.paid_amount).toFixed(2)}</td>
                                                <td className="p-3.5 font-semibold text-rose-600">${Number(inv.balance_due).toFixed(2)}</td>
                                                <td className="p-3.5">
                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                                                        inv.status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                                                    }`}>
                                                        {inv.status.toUpperCase()}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal: Request Appointment */}
            {requestModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                        <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                            <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-teal-600" />
                                Book Consultation Appointment
                            </h3>
                            <button onClick={() => setRequestModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleRequestAppointment} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Select Physician / Specialist</label>
                                <select
                                    value={bookingForm.data.doctor_id}
                                    onChange={(e) => bookingForm.setData('doctor_id', e.target.value)}
                                    className="w-full px-3 py-2 border rounded-xl dark:bg-slate-700 dark:border-slate-600 text-sm"
                                    required
                                >
                                    {doctors.map((d) => (
                                        <option key={d.id} value={d.id}>Dr. {d.user?.name} ({d.specialty})</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Preferred Date</label>
                                    <input
                                        type="date"
                                        value={bookingForm.data.appointment_date}
                                        onChange={(e) => bookingForm.setData('appointment_date', e.target.value)}
                                        className="w-full px-3 py-2 border rounded-xl dark:bg-slate-700 dark:border-slate-600 text-sm"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Preferred Time</label>
                                    <input
                                        type="time"
                                        value={bookingForm.data.start_time}
                                        onChange={(e) => bookingForm.setData('start_time', e.target.value)}
                                        className="w-full px-3 py-2 border rounded-xl dark:bg-slate-700 dark:border-slate-600 text-sm"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Reason for Visit / Symptoms</label>
                                <textarea
                                    rows={3}
                                    placeholder="Describe your primary symptoms or reason for scheduling..."
                                    value={bookingForm.data.reason_for_visit}
                                    onChange={(e) => bookingForm.setData('reason_for_visit', e.target.value)}
                                    className="w-full px-3 py-2 border rounded-xl dark:bg-slate-700 dark:border-slate-600 text-sm"
                                    required
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                                <button
                                    type="button"
                                    onClick={() => setRequestModalOpen(false)}
                                    className="px-4 py-2 border rounded-xl text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={bookingForm.processing}
                                    className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-semibold shadow-sm"
                                >
                                    Submit Request
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
