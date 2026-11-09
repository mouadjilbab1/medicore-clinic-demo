import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { CheckCircle2, XCircle, Database, ShieldCheck, Building, UserCheck, ArrowRight, ArrowLeft, RefreshCw, Sparkles, HardDrive } from 'lucide-react';

interface Requirement {
    name: string;
    satisfied: boolean;
    current: string;
}

interface Props {
    requirements: Requirement[];
    allSatisfied: boolean;
}

export default function InstallWizard({ requirements, allSatisfied }: Props) {
    const [step, setStep] = useState(1);
    const [dbTesting, setDbTesting] = useState(false);
    const [dbTestResult, setDbTestResult] = useState<{ success: boolean; message: string } | null>(null);

    const form = useForm({
        db_driver: 'sqlite',
        db_host: '127.0.0.1',
        db_port: 3306,
        db_name: 'medicore_clinic',
        db_user: 'root',
        db_password: '',
        clinic_name: 'MediCore Central Clinic',
        clinic_phone: '+1 (555) 012-3456',
        clinic_email: 'info@medicore.local',
        clinic_address: '100 Medical Plaza, Suite 400',
        clinic_currency: 'USD',
        admin_name: 'Dr. System Administrator',
        admin_email: 'admin@medicore.local',
        admin_password: 'Password123!',
        seed_demo_data: true,
    });

    const handleTestDb = async () => {
        setDbTesting(true);
        setDbTestResult(null);
        try {
            const res = await fetch(route('install.db.test'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                },
                body: JSON.stringify({
                    db_driver: form.data.db_driver,
                    db_host: form.data.db_host,
                    db_port: form.data.db_port,
                    db_name: form.data.db_name,
                    db_user: form.data.db_user,
                    db_password: form.data.db_password,
                }),
            });
            const data = await res.json();
            setDbTestResult(data);
        } catch (e: any) {
            setDbTestResult({ success: false, message: 'Could not connect: ' + e.message });
        } finally {
            setDbTesting(false);
        }
    };

    const handleFinalSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post(route('install.complete'));
    };

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 font-sans">
            <Head title="Self-Hosted Installation Wizard - MediCore Clinic" />

            <div className="w-full max-w-3xl bg-slate-800 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
                {/* Header */}
                <div className="bg-slate-850 p-6 sm:p-8 border-b border-slate-700/80 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-2xl border border-teal-500/30">
                            +
                        </div>
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">MediCore Clinic System</h1>
                            <p className="text-xs sm:text-sm text-slate-400">Self-Hosted Enterprise Installation & Deployment</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-700 text-teal-400 border border-slate-600">
                            Step {step} of 5
                        </span>
                    </div>
                </div>

                {/* Body Content */}
                <div className="p-6 sm:p-8 flex-1">
                    {/* Step 1: Welcome & License Model */}
                    {step === 1 && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-xl font-bold text-white mb-2">Welcome to Your Private Clinic Instance</h2>
                                <p className="text-sm text-slate-400 leading-relaxed">
                                    MediCore is delivered under a perpetual, self-hosted, one-time purchase license.
                                    This instance is completely sovereign: all patient medical records, financial data, and configurations remain strictly on this local host without remote callbacks or external dependencies.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="p-4 rounded-2xl bg-slate-750 border border-slate-700/60">
                                    <ShieldCheck className="w-6 h-6 text-teal-400 mb-2" />
                                    <h3 className="font-semibold text-sm text-white">Zero Telemetry</h3>
                                    <p className="text-xs text-slate-400 mt-1">No phone-home calls or external license kill switches.</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-slate-750 border border-slate-700/60">
                                    <HardDrive className="w-6 h-6 text-sky-400 mb-2" />
                                    <h3 className="font-semibold text-sm text-white">Local Database</h3>
                                    <p className="text-xs text-slate-400 mt-1">Full ownership of MySQL or SQLite relational storage.</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-slate-750 border border-slate-700/60">
                                    <Sparkles className="w-6 h-6 text-amber-400 mb-2" />
                                    <h3 className="font-semibold text-sm text-white">Multi-Specialty</h3>
                                    <p className="text-xs text-slate-400 mt-1">FDI Odontogram, Ophthalmology OD/OS, WHO charts ready.</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: System Pre-Requisites */}
                    {step === 2 && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-xl font-bold text-white mb-1">Server Pre-Requisites & Permissions</h2>
                                <p className="text-sm text-slate-400">Verifying PHP runtime, core extensions, and directory write permissions.</p>
                            </div>

                            <div className="space-y-2 border border-slate-700 rounded-2xl p-4 bg-slate-850">
                                {requirements.map((req, i) => (
                                    <div key={i} className="flex items-center justify-between py-2 border-b border-slate-700/50 last:border-b-0 text-sm">
                                        <div className="flex items-center gap-3">
                                            {req.satisfied ? (
                                                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                            ) : (
                                                <XCircle className="w-5 h-5 text-rose-500" />
                                            )}
                                            <span className="font-medium text-slate-200">{req.name}</span>
                                        </div>
                                        <span className={`font-mono text-xs ${req.satisfied ? 'text-emerald-400' : 'text-rose-400 font-bold'}`}>
                                            {req.current}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {!allSatisfied && (
                                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                                    Some server requirements are not met. Please resolve the red items before continuing.
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 3: Database Setup */}
                    {step === 3 && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-xl font-bold text-white mb-1">Database Engine Configuration</h2>
                                <p className="text-sm text-slate-400">Select your preferred storage driver and verify server connection.</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => form.setData('db_driver', 'sqlite')}
                                    className={`p-4 rounded-2xl border text-left transition-all ${
                                        form.data.db_driver === 'sqlite'
                                            ? 'border-teal-500 bg-teal-500/10 text-white'
                                            : 'border-slate-700 bg-slate-850 text-slate-400 hover:border-slate-600'
                                    }`}
                                >
                                    <h3 className="font-bold text-sm text-white">SQLite (Zero Setup)</h3>
                                    <p className="text-xs text-slate-400 mt-1">Single-file database ideal for small to mid-sized clinics or local dev.</p>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => form.setData('db_driver', 'mysql')}
                                    className={`p-4 rounded-2xl border text-left transition-all ${
                                        form.data.db_driver === 'mysql'
                                            ? 'border-teal-500 bg-teal-500/10 text-white'
                                            : 'border-slate-700 bg-slate-850 text-slate-400 hover:border-slate-600'
                                    }`}
                                >
                                    <h3 className="font-bold text-sm text-white">MySQL 8.0+ / MariaDB</h3>
                                    <p className="text-xs text-slate-400 mt-1">High-concurrency enterprise setup for hospitals and multi-branch networks.</p>
                                </button>
                            </div>

                            {form.data.db_driver === 'mysql' && (
                                <div className="grid grid-cols-2 gap-4 bg-slate-850 p-4 rounded-2xl border border-slate-700">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-400 mb-1">Host</label>
                                        <input
                                            type="text"
                                            value={form.data.db_host}
                                            onChange={(e) => form.setData('db_host', e.target.value)}
                                            className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-xl text-sm text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-400 mb-1">Port</label>
                                        <input
                                            type="number"
                                            value={form.data.db_port}
                                            onChange={(e) => form.setData('db_port', parseInt(e.target.value) || 3306)}
                                            className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-xl text-sm text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-400 mb-1">Database Name</label>
                                        <input
                                            type="text"
                                            value={form.data.db_name}
                                            onChange={(e) => form.setData('db_name', e.target.value)}
                                            className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-xl text-sm text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-400 mb-1">Username</label>
                                        <input
                                            type="text"
                                            value={form.data.db_user}
                                            onChange={(e) => form.setData('db_user', e.target.value)}
                                            className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-xl text-sm text-white"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-xs font-semibold text-slate-400 mb-1">Password</label>
                                        <input
                                            type="password"
                                            value={form.data.db_password}
                                            onChange={(e) => form.setData('db_password', e.target.value)}
                                            className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-xl text-sm text-white"
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center justify-between">
                                <button
                                    type="button"
                                    onClick={handleTestDb}
                                    disabled={dbTesting}
                                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-semibold transition-all flex items-center gap-2"
                                >
                                    <RefreshCw className={`w-3.5 h-3.5 ${dbTesting ? 'animate-spin' : ''}`} />
                                    Test Database Connectivity
                                </button>
                                {dbTestResult && (
                                    <span className={`text-xs font-medium ${dbTestResult.success ? 'text-emerald-400' : 'text-rose-400'}`}>
                                        {dbTestResult.message}
                                    </span>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Step 4: Clinic Profile */}
                    {step === 4 && (
                        <div className="space-y-4">
                            <div>
                                <h2 className="text-xl font-bold text-white mb-1">Clinic Profile & Branding</h2>
                                <p className="text-sm text-slate-400">Configure your facility identity for invoices, prescriptions, and reports.</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-xs font-semibold text-slate-400 mb-1">Clinic / Facility Legal Name</label>
                                    <input
                                        type="text"
                                        value={form.data.clinic_name}
                                        onChange={(e) => form.setData('clinic_name', e.target.value)}
                                        className="w-full px-3 py-2 bg-slate-850 border border-slate-700 rounded-xl text-sm text-white"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 mb-1">Official Phone</label>
                                    <input
                                        type="text"
                                        value={form.data.clinic_phone}
                                        onChange={(e) => form.setData('clinic_phone', e.target.value)}
                                        className="w-full px-3 py-2 bg-slate-850 border border-slate-700 rounded-xl text-sm text-white"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 mb-1">Official Email</label>
                                    <input
                                        type="email"
                                        value={form.data.clinic_email}
                                        onChange={(e) => form.setData('clinic_email', e.target.value)}
                                        className="w-full px-3 py-2 bg-slate-850 border border-slate-700 rounded-xl text-sm text-white"
                                        required
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs font-semibold text-slate-400 mb-1">Physical Address</label>
                                    <input
                                        type="text"
                                        value={form.data.clinic_address}
                                        onChange={(e) => form.setData('clinic_address', e.target.value)}
                                        className="w-full px-3 py-2 bg-slate-850 border border-slate-700 rounded-xl text-sm text-white"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 mb-1">Base Currency Code</label>
                                    <select
                                        value={form.data.clinic_currency}
                                        onChange={(e) => form.setData('clinic_currency', e.target.value)}
                                        className="w-full px-3 py-2 bg-slate-850 border border-slate-700 rounded-xl text-sm text-white"
                                    >
                                        <option value="USD">USD ($)</option>
                                        <option value="EUR">EUR (€)</option>
                                        <option value="MAD">MAD (DH)</option>
                                        <option value="SAR">SAR (﷼)</option>
                                        <option value="AED">AED (د.إ)</option>
                                        <option value="GBP">GBP (£)</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 5: Admin Account & Seeding */}
                    {step === 5 && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-xl font-bold text-white mb-1">Super Administrator & Data Provisioning</h2>
                                <p className="text-sm text-slate-400">Establish the master clinic administrator account.</p>
                            </div>

                            <div className="space-y-4 bg-slate-850 p-5 rounded-2xl border border-slate-700">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 mb-1">Administrator Full Name</label>
                                    <input
                                        type="text"
                                        value={form.data.admin_name}
                                        onChange={(e) => form.setData('admin_name', e.target.value)}
                                        className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-xl text-sm text-white"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 mb-1">Administrator Email (Sign-in)</label>
                                    <input
                                        type="email"
                                        value={form.data.admin_email}
                                        onChange={(e) => form.setData('admin_email', e.target.value)}
                                        className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-xl text-sm text-white"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 mb-1">Master Password</label>
                                    <input
                                        type="password"
                                        value={form.data.admin_password}
                                        onChange={(e) => form.setData('admin_password', e.target.value)}
                                        className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-xl text-sm text-white"
                                        required
                                    />
                                </div>

                                <div className="pt-2 border-t border-slate-700/60">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={form.data.seed_demo_data}
                                            onChange={(e) => form.setData('seed_demo_data', e.target.checked)}
                                            className="w-4 h-4 rounded text-teal-500 bg-slate-800 border-slate-600 focus:ring-teal-500"
                                        />
                                        <div>
                                            <span className="text-sm font-semibold text-white">Seed Realistic Clinical Dataset</span>
                                            <p className="text-xs text-slate-400">Generates demo doctors, dental charts, ophthalmology refractions, inventory products, and invoices.</p>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Controls */}
                <div className="bg-slate-850 p-6 border-t border-slate-700 flex justify-between items-center">
                    {step > 1 ? (
                        <button
                            type="button"
                            onClick={() => setStep(step - 1)}
                            className="px-5 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-sm font-medium transition-all flex items-center gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Previous
                        </button>
                    ) : <div />}

                    {step < 5 ? (
                        <button
                            type="button"
                            onClick={() => setStep(step + 1)}
                            disabled={step === 2 && !allSatisfied}
                            className="px-6 py-2.5 bg-teal-500 hover:bg-teal-600 disabled:opacity-50 text-slate-950 font-bold rounded-xl text-sm transition-all flex items-center gap-2 shadow-lg shadow-teal-500/10"
                        >
                            Continue
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={handleFinalSubmit}
                            disabled={form.processing}
                            className="px-7 py-2.5 bg-teal-400 hover:bg-teal-500 text-slate-950 font-extrabold rounded-xl text-sm transition-all flex items-center gap-2 shadow-lg shadow-teal-400/20"
                        >
                            <Sparkles className="w-4 h-4" />
                            {form.processing ? 'Provisioning MediCore...' : 'Complete Installation & Launch'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
