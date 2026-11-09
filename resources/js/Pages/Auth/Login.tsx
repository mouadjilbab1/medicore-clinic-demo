import React from 'react';
import { useForm, Head } from '@inertiajs/react';
import { useTranslation } from '@/Utils/translations';
import { Lock, Mail, ShieldAlert, ArrowRight } from 'lucide-react';

export default function Login() {
    const { t, isRtl } = useTranslation();
    const { data, setData, post, processing, errors } = useForm({
        email: 'admin@medicore.local',
        password: 'admin123456',
        remember: true,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('login'));
    };

    const fillDemoCredentials = (email: string, pass: string) => {
        setData({
            email,
            password: pass,
            remember: true,
        });
    };

    return (
        <div className={`min-h-screen bg-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 ${isRtl ? 'font-arabic' : 'font-sans'}`}>
            <Head title="Sign In - MediCore Clinic" />

            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
                <div className="inline-flex w-14 h-14 rounded-2xl bg-teal-600 text-white items-center justify-center font-extrabold text-2xl shadow-lg mb-3">
                    M
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                    MediCore Clinic Management
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                    Enterprise Healthcare Practice & Multi-Specialty Operating System
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-slate-200/80">
                    <form className="space-y-5" onSubmit={submit}>
                        {errors.email && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs flex items-center gap-2">
                                <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                                <span>{errors.email}</span>
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="w-4 h-4 text-slate-400 absolute start-3 top-3.5" />
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                    className="block w-full ps-10 pe-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                                    placeholder="doctor@medicore.local"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="w-4 h-4 text-slate-400 absolute start-3 top-3.5" />
                                <input
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    required
                                    className="block w-full ps-10 pe-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-xs">
                            <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                                />
                                <span>Remember my session</span>
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 active:bg-teal-800 shadow-md shadow-teal-600/20 transition disabled:opacity-50"
                        >
                            <span>{processing ? 'Signing In...' : 'Sign In to Clinic'}</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </form>

                    {/* Quick Demo Credentials */}
                    <div className="mt-8 pt-6 border-t border-slate-100">
                        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 text-center">
                            Fast Demo Accounts
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <button
                                type="button"
                                onClick={() => fillDemoCredentials('admin@medicore.local', 'admin123456')}
                                className="p-2 rounded-lg bg-slate-50 hover:bg-teal-50 border border-slate-200 text-start transition"
                            >
                                <span className="font-bold text-slate-800 block">Administrator</span>
                                <span className="text-[10px] text-slate-500">admin@medicore.local</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => fillDemoCredentials('dr.alami@medicore.local', 'doctor123')}
                                className="p-2 rounded-lg bg-slate-50 hover:bg-teal-50 border border-slate-200 text-start transition"
                            >
                                <span className="font-bold text-slate-800 block">General Physician</span>
                                <span className="text-[10px] text-slate-500">dr.alami@medicore.local</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => fillDemoCredentials('dr.bennani@medicore.local', 'doctor123')}
                                className="p-2 rounded-lg bg-slate-50 hover:bg-teal-50 border border-slate-200 text-start transition"
                            >
                                <span className="font-bold text-slate-800 block">Dentist Surgeon</span>
                                <span className="text-[10px] text-slate-500">dr.bennani@medicore.local</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => fillDemoCredentials('receptionist@medicore.local', 'receptionist123')}
                                className="p-2 rounded-lg bg-slate-50 hover:bg-teal-50 border border-slate-200 text-start transition"
                            >
                                <span className="font-bold text-slate-800 block">Reception Desk</span>
                                <span className="text-[10px] text-slate-500">receptionist@medicore.local</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Patient Portal Link */}
                <div className="text-center mt-6">
                    <a
                        href={route('portal.dashboard')}
                        className="text-xs font-semibold text-teal-700 hover:text-teal-800 underline"
                    >
                        Are you a patient? Access the Patient Self-Service Portal →
                    </a>
                </div>
            </div>
        </div>
    );
}
