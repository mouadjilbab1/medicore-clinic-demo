import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useTranslation } from '@/Utils/translations';
import { Scan, Plus, CheckCircle2, Clock, FileText, X, Eye, Activity } from 'lucide-react';
import { PaginatedData, Patient, Doctor } from '@/types';

interface ImagingRequestItem {
    id: number;
    patient_id: number;
    doctor_id: number;
    modality: 'xray' | 'ultrasound' | 'ct' | 'mri' | 'mammography' | 'other';
    body_part: string;
    clinical_indication: string | null;
    status: 'requested' | 'scheduled' | 'performed' | 'reported' | 'cancelled';
    report_text: string | null;
    created_at: string;
    patient: Patient;
    doctor: Doctor & { user: { name: string } };
    performer?: { name: string };
}

interface Props {
    requests: PaginatedData<ImagingRequestItem>;
    patients: Patient[];
    doctors: (Doctor & { user: { name: string } })[];
}

export default function ImagingIndex({ requests, patients, doctors }: Props) {
    const { t } = useTranslation();
    const [requestModalOpen, setRequestModalOpen] = useState(false);
    const [reportModalOpen, setReportModalOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<ImagingRequestItem | null>(null);

    const requisitionForm = useForm({
        patient_id: patients[0]?.id || '',
        doctor_id: doctors[0]?.id || '',
        modality: 'xray',
        body_part: '',
        clinical_indication: '',
    });

    const reportForm = useForm({
        report_text: '',
    });

    const handleCreateRequisition = (e: React.FormEvent) => {
        e.preventDefault();
        requisitionForm.post(route('imaging.requests.store'), {
            onSuccess: () => {
                setRequestModalOpen(false);
                requisitionForm.reset();
            },
        });
    };

    const handleSaveReport = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedRequest) return;
        reportForm.post(route('imaging.report.save', selectedRequest.id), {
            onSuccess: () => {
                setReportModalOpen(false);
                reportForm.reset();
            },
        });
    };

    const modalityBadge = (modality: string) => {
        const colors: Record<string, string> = {
            xray: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
            ultrasound: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
            ct: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
            mri: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
            mammography: 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300',
            other: 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300',
        };

        return (
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${colors[modality] || colors.other}`}>
                {modality}
            </span>
        );
    };

    const statusBadge = (status: string) => {
        switch (status) {
            case 'reported':
                return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 flex items-center gap-1 w-fit"><CheckCircle2 className="w-3.5 h-3.5" /> Report Ready</span>;
            case 'performed':
                return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-sky-100 text-sky-800">Scanned</span>;
            case 'scheduled':
                return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800">Booked</span>;
            case 'requested':
                return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 flex items-center gap-1 w-fit"><Clock className="w-3.5 h-3.5" /> Requisitioned</span>;
            default:
                return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">{status}</span>;
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Diagnostic Imaging & Radiology - MediCore" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-xl">
                            <Scan className="w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Diagnostic Imaging & Radiology</h1>
                            <p className="text-sm text-slate-500">Requisitions, PACS/DICOM workflows, and radiologist diagnostic reporting</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setRequestModalOpen(true)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium shadow-sm transition-all"
                    >
                        <Plus className="w-4 h-4" />
                        New Imaging Requisition
                    </button>
                </div>

                {/* Requisitions Table */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                        <h2 className="font-semibold text-slate-800 dark:text-white">Imaging Worklist ({requests.total})</h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    <th className="py-3 px-4">Req # / Date</th>
                                    <th className="py-3 px-4">Patient</th>
                                    <th className="py-3 px-4">Modality</th>
                                    <th className="py-3 px-4">Anatomical Target</th>
                                    <th className="py-3 px-4">Prescribed By</th>
                                    <th className="py-3 px-4">Status</th>
                                    <th className="py-3 px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-700 text-sm">
                                {requests.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="py-8 text-center text-slate-500">
                                            No imaging requisitions currently registered. Create a request to begin.
                                        </td>
                                    </tr>
                                ) : (
                                    requests.data.map((req) => (
                                        <tr key={req.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-colors">
                                            <td className="py-3.5 px-4">
                                                <div className="font-mono font-medium text-slate-800 dark:text-slate-200">#RAD-{req.id.toString().padStart(5, '0')}</div>
                                                <div className="text-xs text-slate-400">{new Date(req.created_at).toLocaleDateString()}</div>
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <div className="font-medium text-slate-900 dark:text-white">{req.patient?.first_name} {req.patient?.last_name}</div>
                                                <div className="text-xs font-mono text-indigo-600">{req.patient?.patient_uid}</div>
                                            </td>
                                            <td className="py-3.5 px-4">
                                                {modalityBadge(req.modality)}
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <div className="font-medium text-slate-900 dark:text-white">{req.body_part}</div>
                                                {req.clinical_indication && (
                                                    <div className="text-xs text-slate-500 truncate max-w-xs">{req.clinical_indication}</div>
                                                )}
                                            </td>
                                            <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                                                Dr. {req.doctor?.user?.name}
                                            </td>
                                            <td className="py-3.5 px-4">
                                                {statusBadge(req.status)}
                                            </td>
                                            <td className="py-3.5 px-4 text-right">
                                                <button
                                                    onClick={() => {
                                                        setSelectedRequest(req);
                                                        reportForm.setData('report_text', req.report_text || '');
                                                        setReportModalOpen(true);
                                                    }}
                                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all inline-flex items-center gap-1.5 ${
                                                        req.status === 'reported'
                                                            ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200'
                                                            : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
                                                    }`}
                                                >
                                                    <FileText className="w-3.5 h-3.5" />
                                                    {req.status === 'reported' ? 'View / Edit Report' : 'Write Report'}
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

            {/* Modal: New Imaging Requisition */}
            {requestModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                        <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                            <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                                <Scan className="w-5 h-5 text-indigo-600" />
                                Requisition Diagnostic Imaging
                            </h3>
                            <button onClick={() => setRequestModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleCreateRequisition} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Patient</label>
                                <select
                                    value={requisitionForm.data.patient_id}
                                    onChange={(e) => requisitionForm.setData('patient_id', e.target.value)}
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
                                    value={requisitionForm.data.doctor_id}
                                    onChange={(e) => requisitionForm.setData('doctor_id', e.target.value)}
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
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Imaging Modality</label>
                                    <select
                                        value={requisitionForm.data.modality}
                                        onChange={(e) => requisitionForm.setData('modality', e.target.value as any)}
                                        className="w-full px-3 py-2 border rounded-xl dark:bg-slate-700 dark:border-slate-600 text-sm"
                                    >
                                        <option value="xray">X-Ray (Radiography)</option>
                                        <option value="ultrasound">Ultrasound (Sonography)</option>
                                        <option value="ct">CT Scan (Computed Tomography)</option>
                                        <option value="mri">MRI (Magnetic Resonance)</option>
                                        <option value="mammography">Mammography</option>
                                        <option value="other">Other Diagnostic Scan</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Anatomical Target / Region</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Chest PA & Lateral, Left Knee"
                                        value={requisitionForm.data.body_part}
                                        onChange={(e) => requisitionForm.setData('body_part', e.target.value)}
                                        className="w-full px-3 py-2 border rounded-xl dark:bg-slate-700 dark:border-slate-600 text-sm"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Clinical Indication / Diagnostic Suspicion</label>
                                <textarea
                                    rows={3}
                                    placeholder="e.g. Persistent cough, hemoptysis, rule out pneumonia or consolidation"
                                    value={requisitionForm.data.clinical_indication}
                                    onChange={(e) => requisitionForm.setData('clinical_indication', e.target.value)}
                                    className="w-full px-3 py-2 border rounded-xl dark:bg-slate-700 dark:border-slate-600 text-sm"
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
                                    disabled={requisitionForm.processing}
                                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-sm"
                                >
                                    Create Requisition
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal: Write or View Radiology Report */}
            {reportModalOpen && selectedRequest && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                        <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                            <div>
                                <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-indigo-600" />
                                    Radiology Diagnostic Report: {selectedRequest.body_part}
                                </h3>
                                <div className="text-xs text-slate-500">
                                    Patient: {selectedRequest.patient?.first_name} {selectedRequest.patient?.last_name} ({selectedRequest.patient?.patient_uid}) | Modality: {selectedRequest.modality.toUpperCase()}
                                </div>
                            </div>
                            <button onClick={() => setReportModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSaveReport} className="p-6 space-y-4">
                            <div className="bg-slate-50 dark:bg-slate-900/30 p-3.5 rounded-xl text-xs space-y-1 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                                <div><strong className="text-slate-800 dark:text-slate-200">Indication:</strong> {selectedRequest.clinical_indication || 'Not specified'}</div>
                                <div><strong className="text-slate-800 dark:text-slate-200">Prescribing Doctor:</strong> Dr. {selectedRequest.doctor?.user?.name}</div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                                    Radiologist Findings, Technical Evaluation & Impression
                                </label>
                                <textarea
                                    rows={8}
                                    placeholder="Enter detailed radiological assessment, findings, comparison with prior exams, and diagnostic impression..."
                                    value={reportForm.data.report_text}
                                    onChange={(e) => reportForm.setData('report_text', e.target.value)}
                                    className="w-full px-3 py-2 border rounded-xl dark:bg-slate-700 dark:border-slate-600 text-sm font-sans"
                                    required
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                                <button
                                    type="button"
                                    onClick={() => setReportModalOpen(false)}
                                    className="px-4 py-2 border rounded-xl text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700"
                                >
                                    Close
                                </button>
                                <button
                                    type="submit"
                                    disabled={reportForm.processing}
                                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-sm"
                                >
                                    Save & Approve Findings
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
