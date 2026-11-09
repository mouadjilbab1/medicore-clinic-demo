import React, { useEffect, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Volume2, Clock, Building2 } from 'lucide-react';
import { QueueItem } from '@/types';

interface Props {
    queue: QueueItem[];
}

export default function PublicDisplay({ queue }: Props) {
    const [lastCalledId, setLastCalledId] = useState<number | null>(null);

    // Auto-refresh queue every 10 seconds for real-time live display
    useEffect(() => {
        const interval = setInterval(() => {
            router.reload({ only: ['queue'] });
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    const currentlyCalled = queue.find((q) => q.status === 'called');
    const waitingList = queue.filter((q) => q.status === 'waiting');

    return (
        <div className="min-h-screen bg-slate-950 text-white p-6 sm:p-12 flex flex-col justify-between font-sans selection:bg-teal-500">
            <Head title="Waiting Room Display - MediCore" />

            {/* Top Bar */}
            <div className="flex items-center justify-between pb-6 border-b border-slate-800">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-teal-500 text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-teal-500/20">
                        M
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight">MediCore Clinic</h1>
                        <p className="text-sm text-slate-400 font-medium">Patient Queue Display System</p>
                    </div>
                </div>

                <div className="text-end">
                    <div className="text-2xl font-bold font-mono text-teal-400">
                        {new Date().toLocaleTimeString()}
                    </div>
                    <div className="text-xs text-slate-400">
                        {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                    </div>
                </div>
            </div>

            {/* Main Center Board */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 my-auto py-8">
                {/* Now Calling Big Hero Display */}
                <div className="lg:col-span-2 bg-gradient-to-br from-teal-950/80 to-slate-900 border-2 border-teal-500/40 rounded-3xl p-8 sm:p-12 shadow-2xl flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-3 text-teal-400 font-bold tracking-widest uppercase text-sm sm:text-base mb-4 animate-pulse">
                            <Volume2 className="w-6 h-6" />
                            <span>Now Calling / الآن بالعيادة</span>
                        </div>

                        {currentlyCalled ? (
                            <div className="space-y-6">
                                <div className="text-8xl sm:text-9xl font-black font-mono tracking-tight text-white drop-shadow-md">
                                    #{currentlyCalled.queue_number}
                                </div>
                                <div className="text-3xl sm:text-5xl font-extrabold text-slate-100">
                                    {currentlyCalled.patient?.full_name}
                                </div>
                            </div>
                        ) : (
                            <div className="text-4xl font-bold text-slate-500 py-16">
                                Waiting for Next Call...
                            </div>
                        )}
                    </div>

                    {currentlyCalled && (
                        <div className="pt-8 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
                            <div>
                                <span className="text-xs uppercase tracking-wider text-slate-400 block">Attending Doctor</span>
                                <span className="text-xl sm:text-2xl font-bold text-teal-300">
                                    {currentlyCalled.doctor?.user?.name}
                                </span>
                            </div>
                            <div className="text-end">
                                <span className="text-xs uppercase tracking-wider text-slate-400 block">Room / Suite</span>
                                <span className="text-xl sm:text-2xl font-bold text-white bg-slate-800 px-4 py-1.5 rounded-xl border border-slate-700">
                                    Consultation Suite
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Next in Line Queue Sidebar */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-2 text-slate-400 font-bold uppercase tracking-wider text-xs mb-4">
                            <Clock className="w-4 h-4 text-teal-400" />
                            <span>Next In Line / الدور القادم</span>
                        </div>

                        <div className="space-y-3">
                            {waitingList.slice(0, 6).map((item) => (
                                <div
                                    key={item.id}
                                    className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="font-mono font-bold text-xl text-teal-400">
                                            #{item.queue_number}
                                        </span>
                                        <span className="font-semibold text-sm text-slate-200">
                                            {item.patient?.full_name}
                                        </span>
                                    </div>
                                    <span className="text-xs text-slate-400">
                                        {item.doctor?.user?.name?.replace('Dr. ', '')}
                                    </span>
                                </div>
                            ))}

                            {waitingList.length === 0 && (
                                <p className="text-slate-500 text-xs py-8 text-center">No patients currently queued.</p>
                            )}
                        </div>
                    </div>

                    <div className="text-center text-xs text-slate-500 pt-4 border-t border-slate-800">
                        Please keep your ticket and listen for the audio call.
                    </div>
                </div>
            </div>

            {/* Bottom Marquee Status */}
            <div className="text-center text-xs text-slate-400 py-2 border-t border-slate-900">
                MediCore Clinic Management System • Secure Self-Hosted Practice Infrastructure
            </div>
        </div>
    );
}
