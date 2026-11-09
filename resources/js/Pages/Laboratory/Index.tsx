import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useTranslation } from '@/Utils/translations';
import { FlaskConical, Plus, AlertCircle, CheckCircle2, Clock, FileText, X } from 'lucide-react';
import { PaginatedData, Patient, Doctor } from '@/types';

interface LabResultItem {
    id: number;
    parameter_name: string;
    result_value: string;
    unit: string | null;
    reference_range: string | null;
    is_abnormal: boolean;
    remarks: string | null;
    approved_at: string | null;
    approver?: { name: string };
}

interface LabRequestItem {
    id: number;
    patient_id: number;
    doctor_id: number;
    test_name: string;
    test_code: string | null;
    priority: 'routine' | 'urgent' | 'stat';
    status: 'ordered' | 'collected' | 'analyzed' | 'approved' | 'cancelled';
    notes: string | null;
    created_at: string;
    patient: Patient;
    doctor: Doctor & { user: { name: string } };
    results: LabResultItem[];
}

interface Props {
    requests: PaginatedData<LabRequestItem>;
    patients: Patient[];
    doctors: (Doctor & { user: { name: string } })[];
}

export default function LaboratoryIndex({ requests, patients, doctors }: Props) {
    const { t } = useTranslation();
    const [orderModalOpen, setOrderModalOpen] = useState(false);
    const [resultModalOpen, setResultModalOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<LabRequestItem | null>(null);

    const orderForm = useForm({
        patient_id: patients[0]?.id || '',
        doctor_id: doctors[0]?.id || '',
        test_name: '',
        test_code: '',
        priority: 'routine',
        notes: '',
    });

    const resultForm = useForm({
        parameter_name: '',
        result_value: '',
        unit: '',
        reference_range: '',
        is_abnormal: false,
        remarks: '',
    });

    const handleCreateOrder = (e: React.FormEvent) => {
        e.preventDefault();
        orderForm.post(route('lab.requests.store'), {
            onSuccess: () => {
                setOrderModalOpen(false);
                orderForm.reset();
            },
        });
    };

    const handleAddResult = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedRequest) return;
        resultForm.post(route('lab.results.add', selectedRequest.id), {
            onSuccess: () => {
                resultForm.reset({
                    parameter_name: '',
                    result_value: '',
                    unit: '',
                    reference_range: '',
                    is_abnormal: false,
                    remarks: '',
                });
            },
        });
    };

    const priorityBadge = (priority: string) => {
        switch (priority) {
            case 'stat':
                return <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 animate-pulse">STAT (Immediate)</span>;
            case 'urgent':
                return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">Urgent</span>;
            default:
                return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">Routine</span>;
        }
    };

    const statusBadge = (status: string) => {
        switch (status) {
            case 'approved':
                return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 flex items-center gap-1 w-fit"><CheckCircle2 className="w-3.5 h-3.5" /> Validated</span>;
            case 'analyzed':
                return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-sky-100 text-sky-800">Analyzed</span>;
            case 'collected':
                return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800">Sample Drawn</span>;
            case 'ordered':
                return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 flex items-center gap-1 w-fit"><Clock className="w-3.5 h-3.5" /> Ordered</span>;
            default:
                return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">{status}</span>;
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Laboratory Bench & Diagnostics - MediCore" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-teal-50 dark:bg-teal-900/30 text-teal-600 rounded-xl">
                            <FlaskConical className="w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Clinical Laboratory & Diagnostics</h1>
                            <p className="text-sm text-slate-500">Order, analyze, and validate pathology and biochemical test panels</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setOrderModalOpen(true)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-medium shadow-sm transition-all"
                    >
                        <Plus className="w-4 h-4" />
                        New Lab Order
                    </button>
                </div>

                {/* Orders Table */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                        <h2 className="font-semibold text-slate-800 dark:text-white">Active Lab Orders & Worklist ({requests.total})</h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    <th className="py-3 px-4">Req # / Date</th>
                                    <th className="py-3 px-4">Patient</th>
                                    <th className="py-3 px-4">Test Profile</th>
                                    <th className="py-3 px-4">Prescribed By</th>
                                    <th className="py-3 px-4">Priority</th>
                                    <th className="py-3 px-4">Status</th>
                                    <th className="py-3 px-4">Results Count</th>
                                    <th className="py-3 px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-700 text-sm">
                                {requests.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="py-8 text-center text-slate-500">
                                            No laboratory test orders found. Create a requisition to get started.
                                        </td>
                                    </tr>
                                ) : (
                                    requests.data.map((req) => (
                                        <tr key={req.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-colors">
                                            <td className="py-3.5 px-4">
                                                <div className="font-mono font-medium text-slate-800 dark:text-slate-200">#LAB-{req.id.toString().padStart(5, '0')}</div>
                                                <div className="text-xs text-slate-400">{new Date(req.created_at).toLocaleDateString()}</div>
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <div className="font-medium text-slate-900 dark:text-white">{req.patient?.first_name} {req.patient?.last_name}</div>
                                                <div className="text-xs font-mono text-teal-600">{req.patient?.patient_uid}</div>
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <div className="font-medium text-slate-900 dark:text-white">{req.test_name}</div>
                                                {req.test_code && <div className="text-xs text-slate-400 font-mono">{req.test_code}</div>}
                                            </td>
                                            <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                                                Dr. {req.doctor?.user?.name}
                                            </td>
                                            <td className="py-3.5 px-4">
                                                {priorityBadge(req.priority)}
                                            </td>
                                            <td className="py-3.5 px-4">
                                                {statusBadge(req.status)}
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <span className="font-medium text-slate-700 dark:text-slate-300">
                                                    {req.results?.length || 0} parameter(s)
                                                </span>
                                                {req.results?.some(r => r.is_abnormal) && (
                                                    <span className="ml-2 inline-flex items-center text-xs font-semibold text-rose-600">
                                                        <AlertCircle className="w-3.5 h-3.5 mr-0.5 inline" /> Abnormal
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-3.5 px-4 text-right">
                                                <button
                                                    onClick={() => {
                                                        setSelectedRequest(req);
                                                        setResultModalOpen(true);
                                                    }}
                                                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold transition-all inline-flex items-center gap-1.5"
                                                >
                                                    <FileText className="w-3.5 h-3.5" />
                                                    Results & Worklist
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal: New Lab Order */}
            {orderModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                        <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                            <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                                <FlaskConical className="w-5 h-5 text-teal-600" />
                                Order Diagnostic Test
                            </h3>
                            <button onClick={() => setOrderModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleCreateOrder} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Patient</label>
                                <select
                                    value={orderForm.data.patient_id}
                                    onChange={(e) => orderForm.setData('patient_id', e.target.value)}
                                    className="w-full px-3 py-2 border rounded-xl dark:bg-slate-700 dark:border-slate-600 text-sm"
                                    required
                                >
                                    {patients.map((p) => (
                                        <option key={p.id} value={p.id}>{p.patient_uid} - {p.first_name} {p.last_name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Prescribing Doctor</label>
                                <select
                                    value={orderForm.data.doctor_id}
                                    onChange={(e) => orderForm.setData('doctor_id', e.target.value)}
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
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Test / Panel Name</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Complete Blood Count (CBC)"
                                        value={orderForm.data.test_name}
                                        onChange={(e) => orderForm.setData('test_name', e.target.value)}
                                        className="w-full px-3 py-2 border rounded-xl dark:bg-slate-700 dark:border-slate-600 text-sm"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Test Code (LOINC/Clinic)</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. CBC-01"
                                        value={orderForm.data.test_code}
                                        onChange={(e) => orderForm.setData('test_code', e.target.value)}
                                        className="w-full px-3 py-2 border rounded-xl dark:bg-slate-700 dark:border-slate-600 text-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Priority</label>
                                <select
                                    value={orderForm.data.priority}
                                    onChange={(e) => orderForm.setData('priority', e.target.value as any)}
                                    className="w-full px-3 py-2 border rounded-xl dark:bg-slate-700 dark:border-slate-600 text-sm"
                                >
                                    <option value="routine">Routine</option>
                                    <option value="urgent">Urgent</option>
                                    <option value="stat">STAT (Immediate Emergency)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Clinical Indication / Instructions</label>
                                <textarea
                                    rows={2}
                                    placeholder="e.g. Patient presents with persistent fatigue and pallor"
                                    value={orderForm.data.notes}
                                    onChange={(e) => orderForm.setData('notes', e.target.value)}
                                    className="w-full px-3 py-2 border rounded-xl dark:bg-slate-700 dark:border-slate-600 text-sm"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                                <button
                                    type="button"
                                    onClick={() => setOrderModalOpen(false)}
                                    className="px-4 py-2 border rounded-xl text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={orderForm.processing}
                                    className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-semibold shadow-sm"
                                >
                                    Transmit Order
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal: View Results & Add Parameters */}
            {resultModalOpen && selectedRequest && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                            <div>
                                <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                                    Laboratory Worklist: {selectedRequest.test_name}
                                </h3>
                                <div className="text-xs text-slate-500">
                                    Patient: {selectedRequest.patient?.first_name} {selectedRequest.patient?.last_name} ({selectedRequest.patient?.patient_uid})
                                </div>
                            </div>
                            <button onClick={() => setResultModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto space-y-6">
                            {/* Existing Parameters */}
                            <div>
                                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase mb-3 tracking-wide">
                                    Recorded Parameters ({selectedRequest.results?.length || 0})
                                </h4>

                                {selectedRequest.results?.length === 0 ? (
                                    <div className="p-4 bg-slate-50 dark:bg-slate-900/30 rounded-xl text-center text-sm text-slate-500">
                                        No values recorded yet for this test order. Use the form below to enter validated lab values.
                                    </div>
                                ) : (
                                    <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                                        <table className="w-full text-left text-sm">
                                            <thead>
                                                <tr className="bg-slate-100 dark:bg-slate-900/60 text-xs text-slate-600 dark:text-slate-300 font-semibold">
                                                    <th className="p-3">Analyte / Parameter</th>
                                                    <th className="p-3">Result</th>
                                                    <th className="p-3">Unit</th>
                                                    <th className="p-3">Reference Range</th>
                                                    <th className="p-3">Evaluation</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                                {selectedRequest.results.map((res) => (
                                                    <tr key={res.id} className={res.is_abnormal ? 'bg-rose-50/50 dark:bg-rose-900/10' : ''}>
                                                        <td className="p-3 font-medium text-slate-900 dark:text-white">{res.parameter_name}</td>
                                                        <td className={`p-3 font-bold ${res.is_abnormal ? 'text-rose-600' : 'text-slate-900 dark:text-white'}`}>
                                                            {res.result_value}
                                                        </td>
                                                        <td className="p-3 text-slate-500">{res.unit || '-'}</td>
                                                        <td className="p-3 text-slate-500 font-mono text-xs">{res.reference_range || '-'}</td>
                                                        <td className="p-3">
                                                            {res.is_abnormal ? (
                                                                <span className="px-2 py-0.5 rounded text-xs font-bold bg-rose-100 text-rose-800">Abnormal</span>
                                                            ) : (
                                                                <span className="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-800">Normal</span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>

                            {/* Form to Add Parameter */}
                            <div className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-1.5">
                                    <Plus className="w-4 h-4 text-teal-600" />
                                    Add Diagnostic Parameter Result
                                </h4>
                                <form onSubmit={handleAddResult} className="space-y-3">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Parameter Name</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. Hemoglobin"
                                                value={resultForm.data.parameter_name}
                                                onChange={(e) => resultForm.setData('parameter_name', e.target.value)}
                                                className="w-full px-3 py-1.5 border rounded-lg dark:bg-slate-800 dark:border-slate-600 text-sm"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Result Value</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. 13.8"
                                                value={resultForm.data.result_value}
                                                onChange={(e) => resultForm.setData('result_value', e.target.value)}
                                                className="w-full px-3 py-1.5 border rounded-lg dark:bg-slate-800 dark:border-slate-600 text-sm"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Unit</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. g/dL, mg/dL"
                                                value={resultForm.data.unit}
                                                onChange={(e) => resultForm.setData('unit', e.target.value)}
                                                className="w-full px-3 py-1.5 border rounded-lg dark:bg-slate-800 dark:border-slate-600 text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Biological Reference Interval</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. 12.0 - 15.5"
                                                value={resultForm.data.reference_range}
                                                onChange={(e) => resultForm.setData('reference_range', e.target.value)}
                                                className="w-full px-3 py-1.5 border rounded-lg dark:bg-slate-800 dark:border-slate-600 text-sm"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 pt-1">
                                        <input
                                            type="checkbox"
                                            id="is_abnormal"
                                            checked={resultForm.data.is_abnormal}
                                            onChange={(e) => resultForm.setData('is_abnormal', e.target.checked)}
                                            className="rounded border-slate-300 text-rose-600 focus:ring-rose-500 w-4 h-4"
                                        />
                                        <label htmlFor="is_abnormal" className="text-xs font-semibold text-rose-700 dark:text-rose-400 cursor-pointer">
                                            Flag as Abnormal / Critical Value
                                        </label>
                                    </div>

                                    <div className="flex justify-end pt-2">
                                        <button
                                            type="submit"
                                            disabled={resultForm.processing}
                                            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold transition-all shadow-sm"
                                        >
                                            Record & Validate Parameter
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex justify-between items-center">
                            <span className="text-xs text-slate-500">MediCore Clinical Bench Module</span>
                            <button
                                onClick={() => setResultModalOpen(false)}
                                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-xl text-xs font-semibold"
                            >
                                Close Worklist
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
