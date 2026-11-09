import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useTranslation } from '@/Utils/translations';
import { Smile, Plus, User, CheckCircle2, Clock, DollarSign, Layers } from 'lucide-react';
import { Patient, Doctor } from '@/types';

interface Props {
    patients: Patient[];
    selectedPatient?: (Patient & { branch?: any }) | null;
    teeth: Record<number, any>;
    treatments: any[];
    dentists: Doctor[];
}

// FDI Quadrants for Permanent Teeth
const PERMANENT_QUADRANTS = {
    upperRight: [18, 17, 16, 15, 14, 13, 12, 11],
    upperLeft: [21, 22, 23, 24, 25, 26, 27, 28],
    lowerRight: [48, 47, 46, 45, 44, 43, 42, 41],
    lowerLeft: [31, 32, 33, 34, 35, 36, 37, 38],
};

// FDI Quadrants for Primary Deciduous Teeth
const PRIMARY_QUADRANTS = {
    upperRight: [55, 54, 53, 52, 51],
    upperLeft: [61, 62, 63, 64, 65],
    lowerRight: [85, 84, 83, 82, 81],
    lowerLeft: [71, 72, 73, 74, 75],
};

const CONDITION_COLORS: Record<string, string> = {
    healthy: '#10b981', // green
    caries: '#ef4444', // red
    filled: '#3b82f6', // blue
    crown: '#f59e0b', // amber
    root_canal: '#8b5cf6', // purple
    implant: '#06b6d4', // cyan
    missing: '#94a3b8', // slate/gray
    extracted: '#64748b',
    bridge: '#ec4899',
};

export default function DentalIndex({
    patients,
    selectedPatient,
    teeth,
    treatments,
    dentists,
}: Props) {
    const { t } = useTranslation();
    const [viewMode, setViewMode] = useState<'permanent' | 'primary'>('permanent');
    const [selectedTooth, setSelectedTooth] = useState<number | null>(16);
    const [treatmentModalOpen, setTreatmentModalOpen] = useState(false);

    // Form for updating selected tooth condition
    const toothForm = useForm({
        overall_condition: 'healthy',
        surface_occlusal: 'healthy',
        surface_mesial: 'healthy',
        surface_distal: 'healthy',
        surface_buccal: 'healthy',
        surface_lingual: 'healthy',
        mobility_grade: 0,
        notes: '',
    });

    // Form for adding planned procedure
    const treatmentForm = useForm({
        doctor_id: dentists[0]?.id ? String(dentists[0].id) : '',
        tooth_number: selectedTooth ? String(selectedTooth) : '',
        procedure_name: '',
        stage: 'planned',
        cost: 500,
        notes: '',
    });

    const selectTooth = (toothNumber: number) => {
        setSelectedTooth(toothNumber);
        const currentData = teeth[toothNumber];
        if (currentData) {
            toothForm.setData({
                overall_condition: currentData.overall_condition || 'healthy',
                surface_occlusal: currentData.surface_occlusal || 'healthy',
                surface_mesial: currentData.surface_mesial || 'healthy',
                surface_distal: currentData.surface_distal || 'healthy',
                surface_buccal: currentData.surface_buccal || 'healthy',
                surface_lingual: currentData.surface_lingual || 'healthy',
                mobility_grade: currentData.mobility_grade || 0,
                notes: currentData.notes || '',
            });
        } else {
            toothForm.reset();
        }
    };

    const handleToothSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedPatient || !selectedTooth) return;

        toothForm.post(route('dental.tooth.update', { patientId: selectedPatient.id, toothNumber: selectedTooth }));
    };

    const handleTreatmentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedPatient) return;

        treatmentForm.setData('tooth_number', selectedTooth ? String(selectedTooth) : '');
        treatmentForm.post(route('dental.treatments.store', selectedPatient.id), {
            onSuccess: () => {
                setTreatmentModalOpen(false);
                treatmentForm.reset();
            },
        });
    };

    const updateStage = (treatmentId: number, stage: string) => {
        router.patch(route('dental.treatments.stage', treatmentId), { stage });
    };

    // Render an individual interactive tooth SVG representation with 5 surfaces
    const renderToothSvg = (toothNum: number) => {
        const toothData = teeth[toothNum];
        const cond = toothData?.overall_condition || 'healthy';
        const isSelected = selectedTooth === toothNum;

        const occColor = toothData?.surface_occlusal === 'caries' ? '#ef4444' : toothData?.surface_occlusal === 'filled' ? '#3b82f6' : '#ffffff';
        const mesColor = toothData?.surface_mesial === 'caries' ? '#ef4444' : toothData?.surface_mesial === 'filled' ? '#3b82f6' : '#ffffff';
        const distColor = toothData?.surface_distal === 'caries' ? '#ef4444' : toothData?.surface_distal === 'filled' ? '#3b82f6' : '#ffffff';
        const bucColor = toothData?.surface_buccal === 'caries' ? '#ef4444' : toothData?.surface_buccal === 'filled' ? '#3b82f6' : '#ffffff';
        const lingColor = toothData?.surface_lingual === 'caries' ? '#ef4444' : toothData?.surface_lingual === 'filled' ? '#3b82f6' : '#ffffff';

        return (
            <div
                key={toothNum}
                onClick={() => selectTooth(toothNum)}
                className={`flex flex-col items-center p-1.5 rounded-xl cursor-pointer transition select-none ${
                    isSelected ? 'bg-teal-50 ring-2 ring-teal-600 shadow-sm' : 'hover:bg-slate-50'
                }`}
            >
                <span className="font-mono text-[11px] font-bold text-slate-700 mb-1">
                    {toothNum}
                </span>

                {/* SVG 5-Surface Anatomical Diagram */}
                <svg width="44" height="44" viewBox="0 0 100 100" className="border border-slate-300 rounded-lg shadow-inner bg-slate-50">
                    {/* Top Surface (Buccal/Labial) */}
                    <polygon points="0,0 100,0 75,25 25,25" fill={cond === 'missing' ? '#cbd5e1' : bucColor} stroke="#94a3b8" strokeWidth="2" />
                    {/* Bottom Surface (Lingual/Palatal) */}
                    <polygon points="25,75 75,75 100,100 0,100" fill={cond === 'missing' ? '#cbd5e1' : lingColor} stroke="#94a3b8" strokeWidth="2" />
                    {/* Left Surface (Mesial) */}
                    <polygon points="0,0 25,25 25,75 0,100" fill={cond === 'missing' ? '#cbd5e1' : mesColor} stroke="#94a3b8" strokeWidth="2" />
                    {/* Right Surface (Distal) */}
                    <polygon points="75,25 100,0 100,100 75,75" fill={cond === 'missing' ? '#cbd5e1' : distColor} stroke="#94a3b8" strokeWidth="2" />
                    {/* Center Surface (Occlusal/Incisal) */}
                    <rect x="25" y="25" width="50" height="50" fill={cond === 'missing' ? '#cbd5e1' : occColor} stroke="#94a3b8" strokeWidth="2" />

                    {/* Condition Indicator Badges inside SVG */}
                    {cond === 'crown' && (
                        <circle cx="50" cy="50" r="14" fill="#f59e0b" opacity="0.8" />
                    )}
                    {cond === 'root_canal' && (
                        <line x1="30" y1="30" x2="70" y2="70" stroke="#8b5cf6" strokeWidth="6" strokeLinecap="round" />
                    )}
                    {cond === 'missing' && (
                        <line x1="10" y1="10" x2="90" y2="90" stroke="#ef4444" strokeWidth="4" />
                    )}
                    {cond === 'implant' && (
                        <rect x="42" y="30" width="16" height="40" fill="#06b6d4" rx="3" />
                    )}
                </svg>

                {/* Overall Condition Label */}
                <span
                    className="text-[9px] font-semibold mt-1 px-1 rounded uppercase tracking-wider"
                    style={{ color: CONDITION_COLORS[cond] || '#64748b' }}
                >
                    {cond.replace('_', ' ')}
                </span>
            </div>
        );
    };

    return (
        <AuthenticatedLayout>
            <Head title="Interactive FDI Dental Odontogram - MediCore" />

            <div className="space-y-6">
                {/* Header & Patient Selector */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                            <Smile className="w-6 h-6 text-teal-600" />
                            <span>Interactive Dental Odontogram & Surgery Chart</span>
                        </h1>
                        <p className="text-xs text-slate-500 mt-0.5">
                            FDI 2-digit international notation, 5-surface anatomy, conditions & multi-stage treatment planner
                        </p>
                    </div>

                    {/* Patient Switcher */}
                    <div className="flex items-center gap-2">
                        <select
                            value={selectedPatient?.id || ''}
                            onChange={(e) => {
                                if (e.target.value) {
                                    router.get(route('dental.index'), { patient_id: e.target.value });
                                }
                            }}
                            className="text-xs font-semibold p-2.5 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                        >
                            <option value="">Choose Patient Chart...</option>
                            {patients.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.full_name} ({p.patient_uid})
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {!selectedPatient ? (
                    <div className="bg-white p-12 text-center text-slate-400 text-xs rounded-2xl border border-slate-200">
                        Please choose a patient from the dropdown above to load the interactive FDI Odontogram.
                    </div>
                ) : (
                    <>
                        {/* Dental Odontogram Canvas Card */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                                        Odontogram Schema:
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => setViewMode('permanent')}
                                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                                            viewMode === 'permanent'
                                                ? 'bg-teal-600 text-white shadow-sm'
                                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                        }`}
                                    >
                                        Adult Permanent (11 - 48)
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setViewMode('primary')}
                                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                                            viewMode === 'primary'
                                                ? 'bg-teal-600 text-white shadow-sm'
                                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                        }`}
                                    >
                                        Pediatric Deciduous (51 - 85)
                                    </button>
                                </div>

                                {/* Condition Legend */}
                                <div className="hidden lg:flex items-center gap-3 text-[10px] font-semibold text-slate-500">
                                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Healthy</span>
                                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> Caries</span>
                                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Filled</span>
                                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Crown</span>
                                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span> Root Canal</span>
                                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-cyan-500"></span> Implant</span>
                                </div>
                            </div>

                            {/* The Teeth Interactive Grid */}
                            <div className="space-y-6 overflow-x-auto py-2">
                                {viewMode === 'permanent' ? (
                                    <>
                                        {/* Maxillary / Upper Arch */}
                                        <div className="bg-slate-50/60 p-4 rounded-2xl border border-slate-100">
                                            <div className="text-[11px] font-bold text-center uppercase tracking-widest text-slate-400 mb-2">
                                                Maxillary Arch (Upper Jaw)
                                            </div>
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="flex items-center gap-1.5 border-e-2 border-slate-300 pe-3">
                                                    {PERMANENT_QUADRANTS.upperRight.map(renderToothSvg)}
                                                </div>
                                                <div className="flex items-center gap-1.5 ps-1">
                                                    {PERMANENT_QUADRANTS.upperLeft.map(renderToothSvg)}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Mandibular / Lower Arch */}
                                        <div className="bg-slate-50/60 p-4 rounded-2xl border border-slate-100">
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="flex items-center gap-1.5 border-e-2 border-slate-300 pe-3">
                                                    {PERMANENT_QUADRANTS.lowerRight.map(renderToothSvg)}
                                                </div>
                                                <div className="flex items-center gap-1.5 ps-1">
                                                    {PERMANENT_QUADRANTS.lowerLeft.map(renderToothSvg)}
                                                </div>
                                            </div>
                                            <div className="text-[11px] font-bold text-center uppercase tracking-widest text-slate-400 mt-2">
                                                Mandibular Arch (Lower Jaw)
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        {/* Deciduous Arches */}
                                        <div className="bg-slate-50/60 p-4 rounded-2xl border border-slate-100">
                                            <div className="text-[11px] font-bold text-center uppercase tracking-widest text-slate-400 mb-2">
                                                Pediatric Deciduous Upper Arch
                                            </div>
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="flex items-center gap-1.5 border-e-2 border-slate-300 pe-3">
                                                    {PRIMARY_QUADRANTS.upperRight.map(renderToothSvg)}
                                                </div>
                                                <div className="flex items-center gap-1.5 ps-1">
                                                    {PRIMARY_QUADRANTS.upperLeft.map(renderToothSvg)}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-slate-50/60 p-4 rounded-2xl border border-slate-100">
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="flex items-center gap-1.5 border-e-2 border-slate-300 pe-3">
                                                    {PRIMARY_QUADRANTS.lowerRight.map(renderToothSvg)}
                                                </div>
                                                <div className="flex items-center gap-1.5 ps-1">
                                                    {PRIMARY_QUADRANTS.lowerLeft.map(renderToothSvg)}
                                                </div>
                                            </div>
                                            <div className="text-[11px] font-bold text-center uppercase tracking-widest text-slate-400 mt-2">
                                                Pediatric Deciduous Lower Arch
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Selected Tooth Editor & Multi-Stage Treatments Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Tooth Condition Form */}
                            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                                    <h3 className="font-bold text-slate-900 text-sm">
                                        Tooth #{selectedTooth} Condition Editor
                                    </h3>
                                    <span className="text-[10px] font-mono text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                                        FDI {selectedTooth}
                                    </span>
                                </div>

                                <form onSubmit={handleToothSubmit} className="space-y-3 text-xs">
                                    <div>
                                        <label className="block font-semibold text-slate-700 mb-1">Overall Condition</label>
                                        <select
                                            value={toothForm.data.overall_condition}
                                            onChange={(e) => toothForm.setData('overall_condition', e.target.value)}
                                            className="w-full p-2 border border-slate-300 rounded-xl outline-none"
                                        >
                                            <option value="healthy">Healthy</option>
                                            <option value="caries">Caries / Cavity</option>
                                            <option value="filled">Filled Restoration</option>
                                            <option value="crown">Aesthetic Crown</option>
                                            <option value="root_canal">Root Canal (Endo)</option>
                                            <option value="implant">Dental Implant</option>
                                            <option value="missing">Missing / Extracted</option>
                                            <option value="bridge">Bridge Component</option>
                                        </select>
                                    </div>

                                    {/* 5 Surfaces Status */}
                                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                                        <div>
                                            <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Occlusal (Top)</label>
                                            <select
                                                value={toothForm.data.surface_occlusal}
                                                onChange={(e) => toothForm.setData('surface_occlusal', e.target.value)}
                                                className="w-full p-1.5 border border-slate-200 rounded-lg"
                                            >
                                                <option value="healthy">Healthy</option>
                                                <option value="caries">Caries</option>
                                                <option value="filled">Filled</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Mesial (Front)</label>
                                            <select
                                                value={toothForm.data.surface_mesial}
                                                onChange={(e) => toothForm.setData('surface_mesial', e.target.value)}
                                                className="w-full p-1.5 border border-slate-200 rounded-lg"
                                            >
                                                <option value="healthy">Healthy</option>
                                                <option value="caries">Caries</option>
                                                <option value="filled">Filled</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Distal (Back)</label>
                                            <select
                                                value={toothForm.data.surface_distal}
                                                onChange={(e) => toothForm.setData('surface_distal', e.target.value)}
                                                className="w-full p-1.5 border border-slate-200 rounded-lg"
                                            >
                                                <option value="healthy">Healthy</option>
                                                <option value="caries">Caries</option>
                                                <option value="filled">Filled</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Buccal (Cheek)</label>
                                            <select
                                                value={toothForm.data.surface_buccal}
                                                onChange={(e) => toothForm.setData('surface_buccal', e.target.value)}
                                                className="w-full p-1.5 border border-slate-200 rounded-lg"
                                            >
                                                <option value="healthy">Healthy</option>
                                                <option value="caries">Caries</option>
                                                <option value="filled">Filled</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block font-semibold text-slate-700 mb-1">Clinical Tooth Notes</label>
                                        <textarea
                                            rows={2}
                                            value={toothForm.data.notes}
                                            onChange={(e) => toothForm.setData('notes', e.target.value)}
                                            placeholder="Probing depth, mobility grade, pulp sensitivity..."
                                            className="w-full p-2 border border-slate-300 rounded-xl outline-none"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={toothForm.processing}
                                        className="w-full py-2 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold transition"
                                    >
                                        Save Tooth #{selectedTooth} Condition
                                    </button>
                                </form>
                            </div>

                            {/* Dental Treatment Plan & Procedures */}
                            <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                                    <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                                        <Layers className="w-4 h-4 text-teal-600" />
                                        <span>Multi-Stage Dental Treatment Plan</span>
                                    </h3>
                                    <button
                                        type="button"
                                        onClick={() => setTreatmentModalOpen(true)}
                                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-teal-50 text-teal-700 hover:bg-teal-100 font-semibold text-xs transition"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                        <span>Add Procedure</span>
                                    </button>
                                </div>

                                {treatments.length === 0 ? (
                                    <p className="text-xs text-slate-400 py-8 text-center">
                                        No dental procedures planned or completed for this patient yet.
                                    </p>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-start text-xs">
                                            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                                                <tr>
                                                    <th className="px-4 py-2.5 text-start font-semibold">Tooth</th>
                                                    <th className="px-4 py-2.5 text-start font-semibold">Procedure</th>
                                                    <th className="px-4 py-2.5 text-start font-semibold">Stage</th>
                                                    <th className="px-4 py-2.5 text-end font-semibold">Fee (MAD)</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {treatments.map((tr) => (
                                                    <tr key={tr.id}>
                                                        <td className="px-4 py-3 font-mono font-bold text-teal-700">
                                                            {tr.tooth_number ? `#${tr.tooth_number}` : 'General'}
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <div className="font-semibold text-slate-800">{tr.procedure_name}</div>
                                                            {tr.notes && <div className="text-[10px] text-slate-400">{tr.notes}</div>}
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <select
                                                                value={tr.stage}
                                                                onChange={(e) => updateStage(tr.id, e.target.value)}
                                                                className="text-[11px] p-1 rounded-lg border border-slate-200 outline-none"
                                                            >
                                                                <option value="planned">Planned</option>
                                                                <option value="in_progress">In Progress</option>
                                                                <option value="completed">Completed</option>
                                                            </select>
                                                        </td>
                                                        <td className="px-4 py-3 text-end font-bold text-slate-900">
                                                            {tr.cost} MAD
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Add Procedure Modal */}
            {treatmentModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
                        <h3 className="font-bold text-slate-900 text-base mb-3">Add Dental Procedure</h3>
                        <form onSubmit={handleTreatmentSubmit} className="space-y-3 text-xs">
                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">Procedure Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={treatmentForm.data.procedure_name}
                                    onChange={(e) => treatmentForm.setData('procedure_name', e.target.value)}
                                    placeholder="e.g. Composite Restoration, Scaling & Polishing, Extraction..."
                                    className="w-full p-2.5 border border-slate-300 rounded-xl outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-semibold text-slate-700 mb-1">Tooth # (Optional)</label>
                                    <input
                                        type="number"
                                        value={treatmentForm.data.tooth_number}
                                        onChange={(e) => treatmentForm.setData('tooth_number', e.target.value)}
                                        placeholder="e.g. 16"
                                        className="w-full p-2.5 border border-slate-300 rounded-xl outline-none font-mono"
                                    />
                                </div>
                                <div>
                                    <label className="block font-semibold text-slate-700 mb-1">Estimated Cost (MAD)</label>
                                    <input
                                        type="number"
                                        required
                                        value={treatmentForm.data.cost}
                                        onChange={(e) => treatmentForm.setData('cost', Number(e.target.value))}
                                        className="w-full p-2.5 border border-slate-300 rounded-xl outline-none font-mono"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">Clinical Notes</label>
                                <textarea
                                    rows={2}
                                    value={treatmentForm.data.notes}
                                    onChange={(e) => treatmentForm.setData('notes', e.target.value)}
                                    placeholder="Material used, anesthesia, patient instructions..."
                                    className="w-full p-2 border border-slate-300 rounded-xl outline-none"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setTreatmentModalOpen(false)}
                                    className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-xl"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl"
                                >
                                    Add to Treatment Plan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
