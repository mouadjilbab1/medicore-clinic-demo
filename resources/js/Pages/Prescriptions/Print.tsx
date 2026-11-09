import React, { useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { Prescription, Clinic } from '@/types';
import { Printer } from 'lucide-react';

interface Props {
    prescription: Prescription & {
        patient: any;
        doctor: any;
        items: any[];
    };
    clinic: Clinic;
}

export default function PrescriptionPrint({ prescription, clinic }: Props) {
    useEffect(() => {
        // Automatically trigger print dialog on page load
        window.print();
    }, []);

    return (
        <div className="min-h-screen bg-slate-100 p-4 sm:p-8 flex flex-col items-center justify-start print:bg-white print:p-0">
            <Head title={`Prescription #${prescription.prescription_number} - MediCore`} />

            {/* Print Control Bar (Hidden during print) */}
            <div className="no-print w-full max-w-2xl bg-white p-3 rounded-xl border border-slate-200 mb-6 flex items-center justify-between shadow-sm">
                <span className="text-xs font-semibold text-slate-700">Official Medical Prescription (Rx)</span>
                <button
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold shadow-sm"
                >
                    <Printer className="w-4 h-4" />
                    <span>Print Prescription</span>
                </button>
            </div>

            {/* Official A4 Prescription Document */}
            <div className="w-full max-w-2xl bg-white p-8 sm:p-12 rounded-2xl shadow-xl print:shadow-none print:p-8 border border-slate-200 print:border-none flex flex-col justify-between min-h-[780px]">
                <div>
                    {/* Clinic Header */}
                    <div className="flex items-start justify-between pb-6 border-b-2 border-slate-900">
                        <div>
                            <h1 className="text-xl font-black text-slate-900 tracking-tight">
                                {clinic?.name || 'MediCore Polyclinic Center'}
                            </h1>
                            <p className="text-xs text-slate-600 mt-0.5">{clinic?.address || '145 Boulevard d\'Anfa, Casablanca'}</p>
                            <p className="text-xs text-slate-600">Phone: {clinic?.phone || '+212 522 998877'} • Email: {clinic?.email}</p>
                        </div>
                        <div className="text-end">
                            <h2 className="text-base font-bold text-teal-800">
                                {prescription.doctor?.user?.name || 'Dr. Specialist'}
                            </h2>
                            <p className="text-xs text-slate-500 capitalize">{prescription.doctor?.specialty} Specialist</p>
                            <p className="text-[10px] font-mono text-slate-400">Ordre: {prescription.doctor?.license_number}</p>
                        </div>
                    </div>

                    {/* Patient & Rx Meta Bar */}
                    <div className="my-6 p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between text-xs gap-3">
                        <div>
                            <span className="text-slate-400 block text-[10px] uppercase font-bold">Patient Name</span>
                            <span className="font-bold text-slate-900 text-sm">{prescription.patient?.full_name}</span>
                        </div>
                        <div>
                            <span className="text-slate-400 block text-[10px] uppercase font-bold">Age / Gender</span>
                            <span className="font-semibold">{prescription.patient?.age ? `${prescription.patient?.age} yrs` : '—'} / {prescription.patient?.gender}</span>
                        </div>
                        <div>
                            <span className="text-slate-400 block text-[10px] uppercase font-bold">Patient UID</span>
                            <span className="font-mono font-bold text-teal-700">{prescription.patient?.patient_uid}</span>
                        </div>
                        <div>
                            <span className="text-slate-400 block text-[10px] uppercase font-bold">Prescription #</span>
                            <span className="font-mono font-bold text-slate-800">{prescription.prescription_number}</span>
                        </div>
                        <div>
                            <span className="text-slate-400 block text-[10px] uppercase font-bold">Date</span>
                            <span className="font-semibold">{new Date(prescription.created_at).toLocaleDateString()}</span>
                        </div>
                    </div>

                    {/* Big Rx Logo & Medication Table */}
                    <div className="mt-8">
                        <div className="text-3xl font-black font-serif italic text-teal-800 mb-4">
                            ℞
                        </div>

                        <div className="space-y-4 ps-2">
                            {prescription.items?.map((item, idx) => (
                                <div key={idx} className="pb-3 border-b border-dashed border-slate-200">
                                    <div className="flex items-baseline justify-between">
                                        <div className="font-bold text-slate-900 text-sm">
                                            {idx + 1}. {item.medicine_name} <span className="text-teal-700 font-mono">({item.dosage})</span>
                                        </div>
                                        <span className="text-xs font-mono text-slate-500">Qty: {item.quantity}</span>
                                    </div>
                                    <div className="text-xs text-slate-600 mt-1 ps-4">
                                        ▸ Posology: <span className="font-medium">{item.frequency}</span> • Duration: <span className="font-medium">{item.duration}</span> ({item.route})
                                    </div>
                                    {item.instructions && (
                                        <div className="text-[11px] text-slate-500 italic ps-4 mt-0.5">
                                            Note: {item.instructions}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* General Instructions */}
                    {prescription.instructions && (
                        <div className="mt-8 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                            <span className="font-bold block text-[10px] uppercase tracking-wider text-slate-400 mb-0.5">
                                Advice & Instructions
                            </span>
                            <span>{prescription.instructions}</span>
                        </div>
                    )}
                </div>

                {/* Doctor Signature & Stamp Area */}
                <div className="pt-8 border-t-2 border-slate-200 flex items-end justify-between">
                    <div className="text-[10px] text-slate-400">
                        <p>Valid for dispensing in all licensed pharmacies.</p>
                        <p>Generated by MediCore Clinical Practice Management System.</p>
                    </div>

                    <div className="text-center w-48">
                        <div className="h-16 flex items-center justify-center font-serif text-teal-800 italic font-bold text-sm">
                            Dr. {prescription.doctor?.user?.name}
                        </div>
                        <div className="border-t border-slate-400 pt-1 text-[11px] font-semibold text-slate-700">
                            Physician Signature & Stamp
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
