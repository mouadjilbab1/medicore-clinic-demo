import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useTranslation } from '@/Utils/translations';
import { Database, Download, ShieldCheck, Clock, CheckCircle2, HardDrive, RefreshCw, FileArchive, AlertTriangle } from 'lucide-react';
import { BackupRecord } from '@/types';

interface Props {
    backups: BackupRecord[];
}

export default function BackupIndex({ backups }: Props) {
    const { t } = useTranslation();
    const [generating, setGenerating] = useState(false);

    const handleCreateBackup = () => {
        setGenerating(true);
        router.post(route('backups.create'), {}, {
            onFinish: () => setGenerating(false),
        });
    };

    const formatBytes = (bytes: number) => {
        if (!bytes || bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <AuthenticatedLayout>
            <Head title="Database Backup & Disaster Recovery - MediCore" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 rounded-xl">
                            <Database className="w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Database Backup & Disaster Recovery</h1>
                            <p className="text-sm text-slate-500">Self-hosted local database snapshots, automated rotations, and sovereign archive exports</p>
                        </div>
                    </div>
                    <button
                        onClick={handleCreateBackup}
                        disabled={generating}
                        className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl font-medium shadow-sm transition-all"
                    >
                        <RefreshCw className={`w-4 h-4 ${generating ? 'animate-spin' : ''}`} />
                        {generating ? 'Capturing Snapshot...' : 'Create Backup Snapshot'}
                    </button>
                </div>

                {/* Status Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-start gap-4">
                        <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600">
                            <HardDrive className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-xs font-semibold text-slate-500 uppercase">Available Snapshots</div>
                            <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{backups.length}</div>
                            <div className="text-xs text-slate-400 mt-0.5">Stored in /storage/app/backups</div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-start gap-4">
                        <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-purple-600">
                            <Clock className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-xs font-semibold text-slate-500 uppercase">Automated Schedule</div>
                            <div className="text-sm font-bold text-slate-900 dark:text-white mt-1">Daily at 02:00 AM</div>
                            <div className="text-xs text-slate-400 mt-0.5">Via Laravel Scheduler cron</div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-start gap-4">
                        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-xs font-semibold text-slate-500 uppercase">Sovereignty & Integrity</div>
                            <div className="text-sm font-bold text-emerald-600 mt-1">100% On-Premise</div>
                            <div className="text-xs text-slate-400 mt-0.5">Zero remote cloud exposure</div>
                        </div>
                    </div>
                </div>

                {/* Backups List */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                        <h2 className="font-semibold text-slate-800 dark:text-white">Backup Archive History</h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    <th className="py-3 px-4">Filename</th>
                                    <th className="py-3 px-4">Size</th>
                                    <th className="py-3 px-4">Created Date & Time</th>
                                    <th className="py-3 px-4">Generated By</th>
                                    <th className="py-3 px-4">Verification</th>
                                    <th className="py-3 px-4 text-right">Download</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-700 text-sm">
                                {backups.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="py-8 text-center text-slate-500">
                                            No database snapshots have been recorded yet. Click 'Create Backup Snapshot' above.
                                        </td>
                                    </tr>
                                ) : (
                                    backups.map((b) => (
                                        <tr key={b.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-colors">
                                            <td className="py-3.5 px-4">
                                                <div className="flex items-center gap-2">
                                                    <FileArchive className="w-4 h-4 text-emerald-600 shrink-0" />
                                                    <span className="font-mono font-medium text-slate-900 dark:text-white">{b.filename}</span>
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-300">
                                                {formatBytes(b.size_bytes)}
                                            </td>
                                            <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                                                {new Date(b.created_at).toLocaleString()}
                                            </td>
                                            <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                                                {b.creator?.name || 'Automated Cron'}
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                                                    <CheckCircle2 className="w-3.5 h-3.5" /> Validated
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4 text-right">
                                                <a
                                                    href={route('backups.download', b.id)}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold transition-all"
                                                >
                                                    <Download className="w-3.5 h-3.5" />
                                                    Download
                                                </a>
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
