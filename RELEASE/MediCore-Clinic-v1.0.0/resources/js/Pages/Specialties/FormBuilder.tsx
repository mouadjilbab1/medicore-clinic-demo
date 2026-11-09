import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useTranslation } from '@/Utils/translations';
import { FormInput, Plus, Eye, Layers } from 'lucide-react';

interface Props {
    forms: Array<{
        id: number;
        name: string;
        specialty_code: string;
        version: number;
        is_active: boolean;
        description?: string;
        fields_count: number;
        responses_count: number;
    }>;
}

export default function FormBuilderIndex({ forms }: Props) {
    const { t } = useTranslation();
    const [createModalOpen, setCreateModalOpen] = useState(false);

    const { data, setData, post, processing, reset } = useForm({
        name: '',
        specialty_code: '',
        description: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('form-builder.store'), {
            onSuccess: () => {
                setCreateModalOpen(false);
                reset();
            },
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Specialty Form Builder - MediCore" />

            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                            <FormInput className="w-6 h-6 text-teal-600" />
                            <span>Specialty Medical Form Builder</span>
                        </h1>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Create custom clinical intake sheets, specialty questionnaires, and assessment templates
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => setCreateModalOpen(true)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 shadow-sm transition"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Create Form Template</span>
                    </button>
                </div>

                {/* Form Templates Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {forms.map((f) => (
                        <div key={f.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-mono text-[10px] uppercase font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                                        {f.specialty_code}
                                    </span>
                                    <span className="text-[10px] text-slate-400">v{f.version}.0</span>
                                </div>
                                <h3 className="font-bold text-slate-900 text-sm mb-1">{f.name}</h3>
                                <p className="text-xs text-slate-500 line-clamp-2">{f.description || 'Specialty clinical sheet.'}</p>
                            </div>

                            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                                <span className="text-slate-500">
                                    {f.fields_count} Fields • {f.responses_count} Submissions
                                </span>
                                <Link
                                    href={route('form-builder.show', f.id)}
                                    className="font-semibold text-teal-700 hover:underline flex items-center gap-1"
                                >
                                    <span>Manage & Fill</span>
                                    <span>→</span>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Create Template Modal */}
            {createModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
                        <h3 className="font-bold text-slate-900 text-base mb-3">Create Specialty Form Template</h3>
                        <form onSubmit={submit} className="space-y-3 text-xs">
                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">Form Title *</label>
                                <input
                                    type="text"
                                    required
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="e.g. Cardiology Stress Test Sheet"
                                    className="w-full p-2.5 border border-slate-300 rounded-xl outline-none"
                                />
                            </div>

                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">Specialty Identifier Code *</label>
                                <input
                                    type="text"
                                    required
                                    value={data.specialty_code}
                                    onChange={(e) => setData('specialty_code', e.target.value)}
                                    placeholder="e.g. cardiology, ent, gynecology, rheumatology"
                                    className="w-full p-2.5 border border-slate-300 rounded-xl outline-none font-mono"
                                />
                            </div>

                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                                <textarea
                                    rows={2}
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Purpose of this clinical examination form..."
                                    className="w-full p-2.5 border border-slate-300 rounded-xl outline-none"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setCreateModalOpen(false)}
                                    className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-xl"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl"
                                >
                                    Create Template
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
