import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useTranslation } from '@/Utils/translations';
import { FormInput, Plus, ArrowLeft, CheckCircle2, User } from 'lucide-react';
import { Patient } from '@/types';

interface Props {
    form: {
        id: number;
        name: string;
        specialty_code: string;
        description?: string;
        fields: Array<{
            id: number;
            label: string;
            field_key: string;
            field_type: string;
            is_required: boolean;
            options?: string[];
        }>;
    };
    patients: Patient[];
    responses: any[];
}

export default function FormShow({ form, patients, responses }: Props) {
    const { t } = useTranslation();
    const [fieldModalOpen, setFieldModalOpen] = useState(false);

    // New Field Form
    const fieldForm = useForm({
        label: '',
        field_key: '',
        field_type: 'text',
        is_required: false,
    });

    // Patient Response Submission Form
    const [selectedPatientId, setSelectedPatientId] = useState('');
    const [formValues, setFormValues] = useState<Record<string, any>>({});

    const handleFieldSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        fieldForm.post(route('form-builder.add-field', form.id), {
            onSuccess: () => {
                setFieldModalOpen(false);
                fieldForm.reset();
            },
        });
    };

    const handleResponseSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedPatientId) return;

        const { post } = useForm();
        post(route('form-builder.submit', form.id), {
            // @ts-ignore
            data: {
                patient_id: selectedPatientId,
                responses: formValues,
            },
            onSuccess: () => {
                setFormValues({});
            },
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title={`${form.name} - Form Builder - MediCore`} />

            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <Link href={route('form-builder.index')} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                                {form.name}
                            </h1>
                            <p className="text-xs text-slate-500">
                                Specialty Code: <span className="font-mono font-bold text-teal-700">{form.specialty_code}</span>
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => setFieldModalOpen(true)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 shadow-sm"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add Schema Field</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Active Form Fields Schema */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                        <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100">
                            Defined Form Fields ({form.fields.length})
                        </h3>

                        <div className="space-y-2">
                            {form.fields.map((field) => (
                                <div key={field.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                                    <div>
                                        <div className="font-bold text-slate-800">{field.label}</div>
                                        <div className="text-[10px] text-slate-400 font-mono">key: {field.field_key}</div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono text-[10px] bg-slate-200 px-2 py-0.5 rounded text-slate-700">
                                            {field.field_type}
                                        </span>
                                        {field.is_required && (
                                            <span className="text-[10px] text-red-600 font-bold">*Required</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Fill & Test Form for Patient */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                        <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100">
                            Fill Assessment Sheet for Patient
                        </h3>

                        <form onSubmit={handleResponseSubmit} className="space-y-3 text-xs">
                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">Select Patient *</label>
                                <select
                                    required
                                    value={selectedPatientId}
                                    onChange={(e) => setSelectedPatientId(e.target.value)}
                                    className="w-full p-2 border border-slate-300 rounded-xl outline-none"
                                >
                                    <option value="">Choose patient...</option>
                                    {patients.map((p) => (
                                        <option key={p.id} value={p.id}>
                                            {p.full_name} ({p.patient_uid})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {form.fields.map((f) => (
                                <div key={f.id}>
                                    <label className="block font-semibold text-slate-700 mb-1">
                                        {f.label} {f.is_required && '*'}
                                    </label>
                                    {f.field_type === 'textarea' ? (
                                        <textarea
                                            rows={2}
                                            value={formValues[f.field_key] || ''}
                                            onChange={(e) => setFormValues({ ...formValues, [f.field_key]: e.target.value })}
                                            className="w-full p-2 border border-slate-200 rounded-xl outline-none"
                                        />
                                    ) : f.field_type === 'select' ? (
                                        <select
                                            value={formValues[f.field_key] || ''}
                                            onChange={(e) => setFormValues({ ...formValues, [f.field_key]: e.target.value })}
                                            className="w-full p-2 border border-slate-200 rounded-xl outline-none"
                                        >
                                            <option value="">Select an option...</option>
                                            {f.options?.map((opt, i) => (
                                                <option key={i} value={opt}>{opt}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        <input
                                            type={f.field_type === 'number' ? 'number' : f.field_type === 'date' ? 'date' : 'text'}
                                            value={formValues[f.field_key] || ''}
                                            onChange={(e) => setFormValues({ ...formValues, [f.field_key]: e.target.value })}
                                            className="w-full p-2 border border-slate-200 rounded-xl outline-none"
                                        />
                                    )}
                                </div>
                            ))}

                            <button
                                type="submit"
                                className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl shadow-sm"
                            >
                                Submit Clinical Response
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Add Field Modal */}
            {fieldModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200">
                        <h3 className="font-bold text-slate-900 text-sm mb-3">Add Field to Template</h3>
                        <form onSubmit={handleFieldSubmit} className="space-y-3 text-xs">
                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">Field Label *</label>
                                <input
                                    type="text"
                                    required
                                    value={fieldForm.data.label}
                                    onChange={(e) => {
                                        const lbl = e.target.value;
                                        fieldForm.setData({
                                            label: lbl,
                                            field_key: lbl.toLowerCase().replace(/[^a-z0-9]/g, '_'),
                                        });
                                    }}
                                    placeholder="e.g. Blood Glucose Level"
                                    className="w-full p-2 border border-slate-300 rounded-xl outline-none"
                                />
                            </div>

                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">Field Key (JSON attribute)</label>
                                <input
                                    type="text"
                                    required
                                    value={fieldForm.data.field_key}
                                    onChange={(e) => fieldForm.setData('field_key', e.target.value)}
                                    className="w-full p-2 border border-slate-300 rounded-xl outline-none font-mono"
                                />
                            </div>

                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">Field Type</label>
                                <select
                                    value={fieldForm.data.field_type}
                                    onChange={(e) => fieldForm.setData('field_type', e.target.value)}
                                    className="w-full p-2 border border-slate-300 rounded-xl outline-none"
                                >
                                    <option value="text">Single-line Text</option>
                                    <option value="textarea">Multi-line Textarea</option>
                                    <option value="number">Numeric Input</option>
                                    <option value="date">Date Picker</option>
                                    <option value="measurement">Clinical Measurement</option>
                                </select>
                            </div>

                            <label className="flex items-center gap-2 text-slate-700 cursor-pointer pt-1">
                                <input
                                    type="checkbox"
                                    checked={fieldForm.data.is_required}
                                    onChange={(e) => fieldForm.setData('is_required', e.target.checked)}
                                    className="rounded border-slate-300 text-teal-600"
                                />
                                <span>Mandatory Required Field</span>
                            </label>

                            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setFieldModalOpen(false)}
                                    className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-xl"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl"
                                >
                                    Save Field
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
