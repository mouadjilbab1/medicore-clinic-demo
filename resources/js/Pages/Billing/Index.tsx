import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useTranslation, formatCurrency } from '@/Utils/translations';
import { Receipt, Plus, Eye, DollarSign, Trash2, Search, Filter } from 'lucide-react';
import { Invoice, Patient, PaginatedData } from '@/types';

interface Props {
    invoices: PaginatedData<Invoice>;
    patients: Patient[];
    statusFilter?: string;
    searchFilter?: string;
}

export default function BillingIndex({ invoices, patients, statusFilter, searchFilter }: Props) {
    const { t } = useTranslation();
    const [createModalOpen, setCreateModalOpen] = useState(false);

    const { data, setData, post, processing, reset } = useForm({
        patient_id: '',
        due_date: new Date().toISOString().split('T')[0],
        notes: '',
        items: [
            {
                item_name: 'Medical Consultation',
                item_type: 'consultation',
                quantity: 1,
                unit_price: 300,
                discount: 0,
                tax_rate: 0,
            },
        ],
    });

    const addItem = () => {
        setData('items', [
            ...data.items,
            {
                item_name: '',
                item_type: 'procedure',
                quantity: 1,
                unit_price: 150,
                discount: 0,
                tax_rate: 0,
            },
        ]);
    };

    const removeItem = (idx: number) => {
        setData('items', data.items.filter((_, i) => i !== idx));
    };

    const updateItem = (idx: number, field: string, val: any) => {
        const next = [...data.items];
        // @ts-ignore
        next[idx][field] = val;
        setData('items', next);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('billing.store'), {
            onSuccess: () => {
                setCreateModalOpen(false);
                reset();
            },
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Billing & Invoicing - MediCore" />

            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                            <Receipt className="w-6 h-6 text-teal-600" />
                            <span>Billing, Invoicing & Cashier</span>
                        </h1>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Manage patient accounts, consultation & procedure invoices, partial payments, and receipts
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => setCreateModalOpen(true)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 shadow-sm transition"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Create Invoice</span>
                    </button>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-start text-xs">
                            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-3.5 text-start font-semibold">Invoice #</th>
                                    <th className="px-6 py-3.5 text-start font-semibold">Date</th>
                                    <th className="px-6 py-3.5 text-start font-semibold">Patient</th>
                                    <th className="px-6 py-3.5 text-start font-semibold">Total Amount</th>
                                    <th className="px-6 py-3.5 text-start font-semibold">Paid</th>
                                    <th className="px-6 py-3.5 text-start font-semibold">Balance Due</th>
                                    <th className="px-6 py-3.5 text-start font-semibold">Status</th>
                                    <th className="px-6 py-3.5 text-end font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-700">
                                {invoices.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="px-6 py-12 text-center text-slate-400">
                                            No invoices found.
                                        </td>
                                    </tr>
                                ) : (
                                    invoices.data.map((inv) => (
                                        <tr key={inv.id} className="hover:bg-slate-50/80 transition">
                                            <td className="px-6 py-3.5 font-mono font-bold text-teal-700">
                                                {inv.invoice_number}
                                            </td>
                                            <td className="px-6 py-3.5 text-slate-500">
                                                {inv.invoice_date}
                                            </td>
                                            <td className="px-6 py-3.5">
                                                <Link
                                                    href={route('patients.show', inv.patient_id)}
                                                    className="font-bold text-slate-900 hover:text-teal-600 block"
                                                >
                                                    {inv.patient?.full_name}
                                                </Link>
                                                <span className="text-[10px] text-slate-400">{inv.patient?.patient_uid}</span>
                                            </td>
                                            <td className="px-6 py-3.5 font-bold text-slate-900 font-mono">
                                                {inv.total_amount} MAD
                                            </td>
                                            <td className="px-6 py-3.5 text-emerald-600 font-semibold font-mono">
                                                {inv.paid_amount} MAD
                                            </td>
                                            <td className="px-6 py-3.5 font-bold font-mono text-rose-600">
                                                {inv.balance_due} MAD
                                            </td>
                                            <td className="px-6 py-3.5">
                                                <span
                                                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                                                        inv.status === 'paid'
                                                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                            : inv.status === 'partially_paid'
                                                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                                                    }`}
                                                >
                                                    {inv.status.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3.5 text-end">
                                                <Link
                                                    href={route('billing.show', inv.id)}
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-teal-50 text-teal-700 hover:bg-teal-100 font-semibold text-xs"
                                                >
                                                    <Eye className="w-3.5 h-3.5" />
                                                    <span>View Statement</span>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Create Invoice Modal */}
            {createModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
                        <h3 className="font-bold text-slate-900 text-base mb-4 flex items-center gap-2">
                            <Receipt className="w-5 h-5 text-teal-600" />
                            <span>Generate Patient Billing Invoice</span>
                        </h3>

                        <form onSubmit={submit} className="space-y-4 text-xs">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-semibold text-slate-700 mb-1">Select Patient *</label>
                                    <select
                                        required
                                        value={data.patient_id}
                                        onChange={(e) => setData('patient_id', e.target.value)}
                                        className="w-full p-2.5 border border-slate-300 rounded-xl outline-none"
                                    >
                                        <option value="">Choose patient...</option>
                                        {patients.map((p) => (
                                            <option key={p.id} value={p.id}>
                                                {p.full_name} ({p.patient_uid})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block font-semibold text-slate-700 mb-1">Payment Due Date</label>
                                    <input
                                        type="date"
                                        value={data.due_date}
                                        onChange={(e) => setData('due_date', e.target.value)}
                                        className="w-full p-2.5 border border-slate-300 rounded-xl outline-none"
                                    />
                                </div>
                            </div>

                            {/* Itemized Line Items */}
                            <div className="space-y-3 pt-2">
                                <div className="flex items-center justify-between">
                                    <label className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                                        Services & Itemized Charges
                                    </label>
                                    <button
                                        type="button"
                                        onClick={addItem}
                                        className="text-xs font-semibold text-teal-700 hover:underline flex items-center gap-1"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                        <span>Add Charge Item</span>
                                    </button>
                                </div>

                                {data.items.map((item, idx) => (
                                    <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="font-bold text-slate-700">Line #{idx + 1}</span>
                                            {data.items.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeItem(idx)}
                                                    className="text-rose-600 hover:text-rose-800"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-4 gap-2">
                                            <div className="col-span-2">
                                                <input
                                                    type="text"
                                                    required
                                                    value={item.item_name}
                                                    onChange={(e) => updateItem(idx, 'item_name', e.target.value)}
                                                    placeholder="Service description"
                                                    className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                                                />
                                            </div>
                                            <div>
                                                <select
                                                    value={item.item_type}
                                                    onChange={(e) => updateItem(idx, 'item_type', e.target.value)}
                                                    className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                                                >
                                                    <option value="consultation">Consultation</option>
                                                    <option value="procedure">Procedure</option>
                                                    <option value="dental">Dental</option>
                                                    <option value="lab">Lab Test</option>
                                                    <option value="imaging">Imaging</option>
                                                    <option value="medication">Pharmacy</option>
                                                </select>
                                            </div>
                                            <div>
                                                <input
                                                    type="number"
                                                    required
                                                    value={item.unit_price}
                                                    onChange={(e) => updateItem(idx, 'unit_price', Number(e.target.value))}
                                                    placeholder="Price (MAD)"
                                                    className="w-full p-2 border border-slate-300 rounded-lg bg-white font-mono"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
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
                                    className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl"
                                >
                                    Generate Invoice
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
