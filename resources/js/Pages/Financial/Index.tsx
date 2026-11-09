import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useTranslation } from '@/Utils/translations';
import { DollarSign, Plus, Lock, TrendingUp, TrendingDown, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';

interface Props {
    metrics: {
        revenue: number;
        expenses: number;
        net_profit: number;
        selected_month: string;
    };
    expenses: any[];
    cash_registers: any[];
    doctor_commissions: Array<{
        id: number;
        name: string;
        specialty: string;
        rate: number;
        total_billed: number;
        commission_earned: number;
    }>;
}

export default function FinancialIndex({
    metrics,
    expenses,
    cash_registers,
    doctor_commissions,
}: Props) {
    const { t } = useTranslation();
    const [expenseModalOpen, setExpenseModalOpen] = useState(false);
    const [closingModalOpen, setClosingModalOpen] = useState(false);

    const expenseForm = useForm({
        category: 'supplies',
        title: '',
        amount: '',
        expense_date: new Date().toISOString().split('T')[0],
        paid_to: '',
        payment_method: 'cash',
    });

    const closingForm = useForm({
        physical_cash_counted: '',
        notes: '',
    });

    const handleExpenseSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        expenseForm.post(route('financial.expenses.store'), {
            onSuccess: () => {
                setExpenseModalOpen(false);
                expenseForm.reset();
            },
        });
    };

    const handleClosingSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        closingForm.post(route('financial.close-register'), {
            onSuccess: () => {
                setClosingModalOpen(false);
                closingForm.reset();
            },
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Financial Management & Cashier - MediCore" />

            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                            <DollarSign className="w-6 h-6 text-teal-600" />
                            <span>Financial Accounting, Expenses & Daily Closing</span>
                        </h1>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Cash drawer reconciliation, operational expenditures, doctor compensations, and P&L ledger
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setExpenseModalOpen(true)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-sm"
                        >
                            <Plus className="w-4 h-4 text-teal-600" />
                            <span>Record Expense</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setClosingModalOpen(true)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 shadow-sm"
                        >
                            <Lock className="w-4 h-4" />
                            <span>Daily Cash Closing</span>
                        </button>
                    </div>
                </div>

                {/* KPI Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                        <div>
                            <span className="text-xs font-semibold text-slate-400 block uppercase">Collections (Revenue)</span>
                            <span className="text-2xl font-bold font-mono text-emerald-600">{metrics.revenue} MAD</span>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                        <div>
                            <span className="text-xs font-semibold text-slate-400 block uppercase">Operational Expenses</span>
                            <span className="text-2xl font-bold font-mono text-rose-600">{metrics.expenses} MAD</span>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                            <TrendingDown className="w-5 h-5" />
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                        <div>
                            <span className="text-xs font-semibold text-slate-400 block uppercase">Net Profit Margin</span>
                            <span className={`text-2xl font-bold font-mono ${metrics.net_profit >= 0 ? 'text-teal-700' : 'text-rose-700'}`}>
                                {metrics.net_profit} MAD
                            </span>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                            <DollarSign className="w-5 h-5" />
                        </div>
                    </div>
                </div>

                {/* Doctor Commissions Table */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
                    <h3 className="font-bold text-slate-900 text-sm">
                        Physician & Specialist Compensation Ledger ({metrics.selected_month})
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-start text-xs">
                            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                                <tr>
                                    <th className="p-3 text-start font-semibold">Doctor Name</th>
                                    <th className="p-3 text-start font-semibold">Specialty</th>
                                    <th className="p-3 text-center font-semibold">Commission Rate</th>
                                    <th className="p-3 text-end font-semibold">Total Consultations Billed</th>
                                    <th className="p-3 text-end font-semibold">Physician Payout Due</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-700">
                                {doctor_commissions.map((doc) => (
                                    <tr key={doc.id}>
                                        <td className="p-3 font-bold text-slate-900">{doc.name}</td>
                                        <td className="p-3 capitalize">{doc.specialty}</td>
                                        <td className="p-3 text-center font-mono font-bold text-teal-700">{doc.rate}%</td>
                                        <td className="p-3 text-end font-mono">{doc.total_billed} MAD</td>
                                        <td className="p-3 text-end font-mono font-bold text-emerald-700">{doc.commission_earned} MAD</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Expenses and Cash Register History */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Expenses Table */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
                        <h3 className="font-bold text-slate-900 text-sm">Recent Operational Expenses</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-start text-xs">
                                <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                                    <tr>
                                        <th className="p-2.5 text-start font-semibold">Date</th>
                                        <th className="p-2.5 text-start font-semibold">Title / Category</th>
                                        <th className="p-2.5 text-end font-semibold">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {expenses.length === 0 ? (
                                        <tr><td colSpan={3} className="p-4 text-center text-slate-400">No expenses recorded for this month.</td></tr>
                                    ) : (
                                        expenses.map((exp) => (
                                            <tr key={exp.id}>
                                                <td className="p-2.5 font-mono text-slate-500">{exp.expense_date}</td>
                                                <td className="p-2.5">
                                                    <div className="font-semibold text-slate-800">{exp.title}</div>
                                                    <span className="text-[10px] text-slate-400 uppercase">{exp.category}</span>
                                                </td>
                                                <td className="p-2.5 text-end font-mono font-bold text-rose-600">-{exp.amount} MAD</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Cash Register Closings */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
                        <h3 className="font-bold text-slate-900 text-sm">Daily Cash Drawer Closing Logs</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-start text-xs">
                                <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                                    <tr>
                                        <th className="p-2.5 text-start font-semibold">Date / Closed By</th>
                                        <th className="p-2.5 text-end font-semibold">System Cash</th>
                                        <th className="p-2.5 text-end font-semibold">Physical Counted</th>
                                        <th className="p-2.5 text-end font-semibold">Discrepancy</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {cash_registers.length === 0 ? (
                                        <tr><td colSpan={4} className="p-4 text-center text-slate-400">No register closings recorded yet.</td></tr>
                                    ) : (
                                        cash_registers.map((cr) => (
                                            <tr key={cr.id}>
                                                <td className="p-2.5">
                                                    <div className="font-semibold text-slate-800">{new Date(cr.created_at).toLocaleDateString()}</div>
                                                    <span className="text-[10px] text-slate-400">{cr.closer?.name || 'Cashier'}</span>
                                                </td>
                                                <td className="p-2.5 text-end font-mono">{cr.system_cash_total} MAD</td>
                                                <td className="p-2.5 text-end font-mono font-bold">{cr.physical_cash_counted} MAD</td>
                                                <td className="p-2.5 text-end font-mono font-bold">
                                                    <span className={cr.discrepancy === 0 ? 'text-emerald-600' : 'text-rose-600'}>
                                                        {cr.discrepancy} MAD
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Expense Modal */}
            {expenseModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
                        <h3 className="font-bold text-slate-900 text-base mb-3">Record Operational Expense</h3>
                        <form onSubmit={handleExpenseSubmit} className="space-y-3 text-xs">
                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">Expense Title *</label>
                                <input
                                    type="text"
                                    required
                                    value={expenseForm.data.title}
                                    onChange={(e) => expenseForm.setData('title', e.target.value)}
                                    placeholder="e.g. Dental consumables invoice, Monthly Internet..."
                                    className="w-full p-2.5 border border-slate-300 rounded-xl outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-semibold text-slate-700 mb-1">Category *</label>
                                    <select
                                        value={expenseForm.data.category}
                                        onChange={(e) => expenseForm.setData('category', e.target.value)}
                                        className="w-full p-2.5 border border-slate-300 rounded-xl outline-none"
                                    >
                                        <option value="supplies">Clinical Supplies</option>
                                        <option value="rent">Premises Rent</option>
                                        <option value="salaries">Salaries & Wages</option>
                                        <option value="utilities">Electricity & Water</option>
                                        <option value="maintenance">Equipment Maintenance</option>
                                        <option value="marketing">Marketing & Web</option>
                                        <option value="tax">Statutory Taxes</option>
                                        <option value="other">Other Operational</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block font-semibold text-slate-700 mb-1">Amount (MAD) *</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        required
                                        value={expenseForm.data.amount}
                                        onChange={(e) => expenseForm.setData('amount', e.target.value)}
                                        className="w-full p-2.5 border border-slate-300 rounded-xl outline-none font-mono"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">Paid To / Supplier</label>
                                <input
                                    type="text"
                                    value={expenseForm.data.paid_to}
                                    onChange={(e) => expenseForm.setData('paid_to', e.target.value)}
                                    placeholder="Supplier name or service company..."
                                    className="w-full p-2.5 border border-slate-300 rounded-xl outline-none"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setExpenseModalOpen(false)}
                                    className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-xl"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={expenseForm.processing}
                                    className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl"
                                >
                                    Record Expense
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Cash Closing Modal */}
            {closingModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200">
                        <h3 className="font-bold text-slate-900 text-base mb-3 flex items-center gap-2">
                            <Lock className="w-5 h-5 text-teal-600" />
                            <span>Daily Cash Drawer Closeout</span>
                        </h3>
                        <p className="text-xs text-slate-500 mb-4">
                            Count all physical banknotes and coins in the reception cash register and input the total.
                        </p>
                        <form onSubmit={handleClosingSubmit} className="space-y-3 text-xs">
                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">Physical Cash Counted (MAD) *</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    required
                                    value={closingForm.data.physical_cash_counted}
                                    onChange={(e) => closingForm.setData('physical_cash_counted', e.target.value)}
                                    placeholder="0.00"
                                    className="w-full p-2.5 border border-slate-300 rounded-xl outline-none font-mono font-bold text-base"
                                />
                            </div>

                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">Closing Notes</label>
                                <textarea
                                    rows={2}
                                    value={closingForm.data.notes}
                                    onChange={(e) => closingForm.setData('notes', e.target.value)}
                                    placeholder="Explain any drawer discrepancy..."
                                    className="w-full p-2 border border-slate-300 rounded-xl outline-none"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setClosingModalOpen(false)}
                                    className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-xl"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={closingForm.processing}
                                    className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl"
                                >
                                    Reconcile & Close Register
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
