import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useTranslation, formatCurrency } from '@/Utils/translations';
import {
    Users,
    Calendar,
    Clock,
    DollarSign,
    CheckCircle,
    XCircle,
    TrendingUp,
    AlertCircle,
    UserPlus,
    CalendarPlus,
    Activity,
    ArrowUpRight,
} from 'lucide-react';
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
} from 'recharts';

interface Props {
    metrics: {
        total_patients: number;
        new_patients_month: number;
        today_appointments: number;
        completed_today: number;
        cancelled_today: number;
        waiting_count: number;
        today_revenue: number;
        monthly_revenue: number;
        monthly_expenses: number;
        net_profit: number;
        outstanding_balance: number;
    };
    doctor_stats: Array<{
        id: number;
        name: string;
        specialty: string;
        today_appointments: number;
        completed_appointments: number;
        is_available: boolean;
    }>;
    revenue_trend: Array<{
        date: string;
        amount: number;
    }>;
    upcoming_appointments: Array<any>;
    recent_activities: Array<any>;
}

export default function Dashboard({
    metrics,
    doctor_stats,
    revenue_trend,
    upcoming_appointments,
    recent_activities,
}: Props) {
    const { t } = useTranslation();

    return (
        <AuthenticatedLayout>
            <Head title="Clinical Dashboard - MediCore" />

            <div className="space-y-6">
                {/* Header with Quick Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                            {t('nav.dashboard', 'Clinical Practice Dashboard')}
                        </h1>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Real-time operational metrics, daily queue flow & practice analytics
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link
                            href={route('patients.create')}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 shadow-sm transition"
                        >
                            <UserPlus className="w-4 h-4" />
                            <span>{t('patient.uid', 'Register Patient')}</span>
                        </Link>
                        <Link
                            href={route('appointments.index')}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-sm transition"
                        >
                            <CalendarPlus className="w-4 h-4 text-teal-600" />
                            <span>{t('appointment.book', 'Schedule Visit')}</span>
                        </Link>
                    </div>
                </div>

                {/* KPI Cards Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                    {/* Total Patients */}
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                        <div className="flex items-center justify-between text-slate-500 mb-2">
                            <span className="text-xs font-medium">Total Patients</span>
                            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                                <Users className="w-4 h-4" />
                            </div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-slate-900">{metrics.total_patients}</div>
                            <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">
                                +{metrics.new_patients_month} this month
                            </div>
                        </div>
                    </div>

                    {/* Today's Appointments */}
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                        <div className="flex items-center justify-between text-slate-500 mb-2">
                            <span className="text-xs font-medium">Appointments Today</span>
                            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                <Calendar className="w-4 h-4" />
                            </div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-slate-900">{metrics.today_appointments}</div>
                            <div className="text-[10px] text-slate-500 mt-0.5">
                                {metrics.completed_today} completed
                            </div>
                        </div>
                    </div>

                    {/* Live Waiting Queue */}
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                        <div className="flex items-center justify-between text-slate-500 mb-2">
                            <span className="text-xs font-medium">Waiting Room</span>
                            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                                <Clock className="w-4 h-4" />
                            </div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-amber-600">{metrics.waiting_count}</div>
                            <div className="text-[10px] text-slate-500 mt-0.5">
                                In waiting lounge
                            </div>
                        </div>
                    </div>

                    {/* Today's Revenue */}
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                        <div className="flex items-center justify-between text-slate-500 mb-2">
                            <span className="text-xs font-medium">Today's Collections</span>
                            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                <DollarSign className="w-4 h-4" />
                            </div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-slate-900">{metrics.today_revenue} <span className="text-xs font-normal text-slate-500">MAD</span></div>
                            <div className="text-[10px] text-slate-500 mt-0.5">
                                Cash & Card receipts
                            </div>
                        </div>
                    </div>

                    {/* Monthly Net Profit */}
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                        <div className="flex items-center justify-between text-slate-500 mb-2">
                            <span className="text-xs font-medium">Net Monthly</span>
                            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
                                <TrendingUp className="w-4 h-4" />
                            </div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-teal-700">{metrics.net_profit} <span className="text-xs font-normal text-slate-500">MAD</span></div>
                            <div className="text-[10px] text-slate-500 mt-0.5">
                                Rev: {metrics.monthly_revenue} | Exp: {metrics.monthly_expenses}
                            </div>
                        </div>
                    </div>

                    {/* Outstanding Balance */}
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                        <div className="flex items-center justify-between text-slate-500 mb-2">
                            <span className="text-xs font-medium">Unpaid Invoices</span>
                            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                                <AlertCircle className="w-4 h-4" />
                            </div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-rose-600">{metrics.outstanding_balance} <span className="text-xs font-normal text-slate-500">MAD</span></div>
                            <div className="text-[10px] text-slate-500 mt-0.5">
                                Pending recovery
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts & Doctor Availability Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Revenue Trend Chart */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="font-bold text-slate-800 text-sm">7-Day Revenue Trend</h3>
                                <p className="text-xs text-slate-400">Daily payment collections over past week</p>
                            </div>
                            <span className="text-xs font-semibold px-2 py-1 bg-emerald-50 text-emerald-700 rounded-md">
                                Live Ledger
                            </span>
                        </div>

                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={revenue_trend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#0d9488" stopOpacity={0.4} />
                                            <stop offset="95%" stopColor="#0d9488" stopOpacity={0.0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
                                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                                    <Tooltip
                                        formatter={(val: any) => [`${val} MAD`, 'Collection']}
                                        contentStyle={{ backgroundColor: '#1e293b', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                                    />
                                    <Area type="monotone" dataKey="amount" stroke="#0d9488" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRevenue)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Doctor Availability & Daily Workload */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-slate-800 text-sm">Doctor Status & Workload</h3>
                                <Link href={route('staff.index')} className="text-xs text-teal-600 font-semibold hover:underline">
                                    All Staff →
                                </Link>
                            </div>

                            <div className="space-y-3">
                                {doctor_stats.map((doc) => (
                                    <div key={doc.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs uppercase">
                                                {doc.name.replace('Dr. ', '').charAt(0)}
                                            </div>
                                            <div>
                                                <div className="text-xs font-semibold text-slate-800">{doc.name}</div>
                                                <div className="text-[10px] text-slate-400 capitalize">{doc.specialty}</div>
                                            </div>
                                        </div>
                                        <div className="text-end">
                                            <div className="text-xs font-bold text-slate-800">
                                                {doc.completed_appointments} / {doc.today_appointments}
                                            </div>
                                            <div className="text-[10px] text-slate-400">Completed</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-slate-100 text-center">
                            <Link
                                href={route('waiting-room.index')}
                                className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-teal-50 text-teal-700 hover:bg-teal-100 font-semibold text-xs transition"
                            >
                                <Clock className="w-4 h-4" />
                                <span>Open Waiting Room Console</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Upcoming Appointments Table */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                        <div>
                            <h3 className="font-bold text-slate-800 text-sm">Today's Appointment Schedule</h3>
                            <p className="text-xs text-slate-400">Patients booked for consultation today</p>
                        </div>
                        <Link href={route('appointments.index')} className="text-xs text-teal-600 font-semibold hover:underline">
                            Full Calendar View →
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-start text-xs">
                            <thead className="bg-slate-50 text-slate-500 border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-3 text-start font-semibold">Time</th>
                                    <th className="px-6 py-3 text-start font-semibold">Patient</th>
                                    <th className="px-6 py-3 text-start font-semibold">Doctor</th>
                                    <th className="px-6 py-3 text-start font-semibold">Room</th>
                                    <th className="px-6 py-3 text-start font-semibold">Type</th>
                                    <th className="px-6 py-3 text-start font-semibold">Status</th>
                                    <th className="px-6 py-3 text-end font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-700">
                                {upcoming_appointments.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-8 text-center text-slate-400">
                                            No remaining appointments scheduled for today.
                                        </td>
                                    </tr>
                                ) : (
                                    upcoming_appointments.map((apt) => (
                                        <tr key={apt.id} className="hover:bg-slate-50/70 transition">
                                            <td className="px-6 py-3.5 font-bold text-slate-900">
                                                {apt.start_time.substring(0, 5)} - {apt.end_time.substring(0, 5)}
                                            </td>
                                            <td className="px-6 py-3.5">
                                                <Link
                                                    href={route('patients.show', apt.patient_id)}
                                                    className="font-semibold text-teal-700 hover:underline block"
                                                >
                                                    {apt.patient?.full_name}
                                                </Link>
                                                <span className="text-[10px] text-slate-400">{apt.patient?.patient_uid}</span>
                                            </td>
                                            <td className="px-6 py-3.5 font-medium">{apt.doctor?.user?.name}</td>
                                            <td className="px-6 py-3.5 text-slate-500">{apt.room?.name || 'Standard Suite'}</td>
                                            <td className="px-6 py-3.5 capitalize">{apt.type}</td>
                                            <td className="px-6 py-3.5">
                                                <span
                                                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                                        apt.status === 'completed'
                                                            ? 'bg-emerald-50 text-emerald-700'
                                                            : apt.status === 'in_consultation'
                                                            ? 'bg-blue-50 text-blue-700 animate-pulse'
                                                            : apt.status === 'waiting'
                                                            ? 'bg-amber-50 text-amber-700'
                                                            : 'bg-slate-100 text-slate-700'
                                                    }`}
                                                >
                                                    {apt.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3.5 text-end">
                                                <Link
                                                    href={route('consultations.create', { patient_id: apt.patient_id, appointment_id: apt.id })}
                                                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-600 hover:text-teal-800"
                                                >
                                                    <span>Open Chart</span>
                                                    <ArrowUpRight className="w-3.5 h-3.5" />
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
        </AuthenticatedLayout>
    );
}
