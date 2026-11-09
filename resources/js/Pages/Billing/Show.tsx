import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useTranslation } from '@/Utils/translations';
import { Receipt, ArrowLeft, Printer, CreditCard, DollarSign, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Invoice, Clinic } from '@/types';

interface Props {
    invoice: Invoice & {
        patient: any;
        branch: any;
        items: any[];
        payments: any[];
    };
    clinic: Clinic;
}

export default function BillingShow({ invoice, clinic }: Props) {
    const { t } = useTranslation();
    const [paymentModalOpen, setPaymentModalOpen] = useState(false);

    const paymentForm = useForm({
        amount: invoice.balance_due > 0 ? String(invoice.balance_due) : '',
        payment_method: 'cash',
        transaction_reference: '',
        notes: '',
    });

    const handlePaymentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        paymentForm.post(route('billing.payment', invoice.id), {
            onSuccess: () => {
                setPaymentModalOpen(false);
                paymentForm.reset();
            },
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Invoice #${invoice.invoice_number} - MediCore`} />

            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
                    <div className="flex items-center gap-2">
                        <Link href={route('billing.index')} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                                Invoice Statement #{invoice.invoice_number}
                            </h1>
                            <p className="text-xs text-slate-500">
                                Patient: <strong>{invoice.patient?.full_name}</strong> ({invoice.patient?.patient_uid})
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => window.print()}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-sm"
                        >
                            <Printer className="w-4 h-4 text-slate-500" />
                            <span>Print Receipt</span>
                        </button>

                        {invoice.balance_due > 0 && (
                            <button
                                type="button"
                                onClick={() => setPaymentModalOpen(true)}
                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 shadow-sm"
                            >
                                <CreditCard className="w-4 h-4" />
                                <span>Record Payment</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Printable Invoice Container */}
                <div className="max-w-3xl mx-auto bg-white p-8 sm:p-12 rounded-2xl border border-slate-200 shadow-sm space-y-6 print:border-none print:shadow-none print:p-0">
                    {/* Header */}
                    <div className="flex items-start justify-between pb-6 border-b border-slate-200">
                        <div>
                            <h2 className="text-xl font-black text-slate-900">{clinic?.name || 'MediCore Clinic Center'}</h2>
                            <p className="text-xs text-slate-500 mt-0.5">{clinic?.address || 'Casablanca, Morocco'}</p>
                            <p className="text-xs text-slate-500">Tax ID: {clinic?.tax_number || 'IF-48291039'}</p>
                        </div>
                        <div className="text-end">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Statement</span>
                            <span className="font-mono font-black text-xl text-teal-800">{invoice.invoice_number}</span>
                            <div className="text-xs text-slate-500 mt-1">Date: {invoice.invoice_date}</div>
                        </div>
                    </div>

                    {/* Patient Billing Details */}
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between text-xs gap-4">
                        <div>
                            <span className="text-slate-400 block text-[10px] uppercase font-bold">Billed Patient</span>
                            <span className="font-bold text-slate-900 text-sm">{invoice.patient?.full_name}</span>
                            <div className="text-slate-500">CIN: {invoice.patient?.national_id || 'N/A'} • Phone: {invoice.patient?.phone}</div>
                        </div>
                        <div>
                            <span className="text-slate-400 block text-[10px] uppercase font-bold">Account Status</span>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                                invoice.status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                            }`}>
                                {invoice.status.replace('_', ' ')}
                            </span>
                        </div>
                    </div>

                    {/* Itemized Table */}
                    <table className="w-full text-start text-xs border border-slate-200 rounded-xl overflow-hidden">
                        <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                            <tr>
                                <th className="p-3 text-start">Description</th>
                                <th className="p-3 text-start">Type</th>
                                <th className="p-3 text-center">Qty</th>
                                <th className="p-3 text-end">Unit Price</th>
                                <th className="p-3 text-end">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-800">
                            {invoice.items?.map((item, idx) => (
                                <tr key={idx}>
                                    <td className="p-3 font-semibold">{item.item_name}</td>
                                    <td className="p-3 capitalize text-slate-500">{item.item_type}</td>
                                    <td className="p-3 text-center">{item.quantity}</td>
                                    <td className="p-3 text-end font-mono">{item.unit_price} MAD</td>
                                    <td className="p-3 text-end font-mono font-bold">{item.total} MAD</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Totals Summary */}
                    <div className="flex justify-end">
                        <div className="w-64 space-y-2 text-xs">
                            <div className="flex justify-between text-slate-600">
                                <span>Subtotal:</span>
                                <span className="font-mono">{invoice.subtotal} MAD</span>
                            </div>
                            {invoice.discount_amount > 0 && (
                                <div className="flex justify-between text-emerald-600">
                                    <span>Discount Applied:</span>
                                    <span className="font-mono">-{invoice.discount_amount} MAD</span>
                                </div>
                            )}
                            <div className="flex justify-between font-bold text-sm text-slate-900 pt-2 border-t border-slate-200">
                                <span>Total Amount:</span>
                                <span className="font-mono">{invoice.total_amount} MAD</span>
                            </div>
                            <div className="flex justify-between text-emerald-700 font-semibold">
                                <span>Paid Amount:</span>
                                <span className="font-mono">{invoice.paid_amount} MAD</span>
                            </div>
                            <div className="flex justify-between font-bold text-sm text-rose-600 pt-1 border-t border-slate-100">
                                <span>Balance Remaining:</span>
                                <span className="font-mono">{invoice.balance_due} MAD</span>
                            </div>
                        </div>
                    </div>

                    {/* Payments History Ledger */}
                    {invoice.payments && invoice.payments.length > 0 && (
                        <div className="pt-6 border-t border-slate-200 space-y-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                Payment Receipts & Clearances ({invoice.payments.length})
                            </span>
                            <div className="space-y-1.5">
                                {invoice.payments.map((p: any) => (
                                    <div key={p.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                                        <div>
                                            <span className="font-mono font-bold text-teal-800">{p.receipt_number}</span>
                                            <span className="text-slate-500 ms-2">
                                                Paid via <strong className="capitalize">{p.payment_method}</strong> on {new Date(p.payment_date).toLocaleString()}
                                            </span>
                                        </div>
                                        <span className="font-mono font-bold text-emerald-700">{p.amount} MAD</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Payment Modal */}
            {paymentModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200">
                        <h3 className="font-bold text-slate-900 text-base mb-3 flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-teal-600" />
                            <span>Collect Payment / Receipt</span>
                        </h3>

                        <form onSubmit={handlePaymentSubmit} className="space-y-3 text-xs">
                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">Amount to Pay (MAD) *</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    required
                                    value={paymentForm.data.amount}
                                    onChange={(e) => paymentForm.setData('amount', e.target.value)}
                                    className="w-full p-2.5 border border-slate-300 rounded-xl outline-none font-mono font-bold text-sm"
                                />
                            </div>

                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">Payment Method *</label>
                                <select
                                    value={paymentForm.data.payment_method}
                                    onChange={(e) => paymentForm.setData('payment_method', e.target.value)}
                                    className="w-full p-2.5 border border-slate-300 rounded-xl outline-none"
                                >
                                    <option value="cash">Cash (Especes)</option>
                                    <option value="card">Credit / Debit Card (TPE)</option>
                                    <option value="bank_transfer">Bank Transfer (Virement)</option>
                                    <option value="insurance">Insurance Third-Party (Assurance / CNSS)</option>
                                    <option value="cheque">Cheque</option>
                                </select>
                            </div>

                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">Transaction Reference</label>
                                <input
                                    type="text"
                                    value={paymentForm.data.transaction_reference}
                                    onChange={(e) => paymentForm.setData('transaction_reference', e.target.value)}
                                    placeholder="TPE transaction slip # or transfer ID..."
                                    className="w-full p-2 border border-slate-300 rounded-xl outline-none font-mono"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setPaymentModalOpen(false)}
                                    className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-xl"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={paymentForm.processing}
                                    className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl"
                                >
                                    Issue Receipt
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
