import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';

function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Phnom_Penh',
    });
}

export default function EventChecklist({ event }) {
    const [newName, setNewName] = useState('');
    const [adding, setAdding] = useState(false);
    const [totalCost, setTotalCost] = useState(event.total_cost || '');
    const [costPerPerson, setCostPerPerson] = useState(0);

    useEffect(() => {
        const cost = parseFloat(totalCost) || 0;
        const count = event.attendances.length;
        if (count > 0) {
            setCostPerPerson(cost / count);
        } else {
            setCostPerPerson(0);
        }
    }, [totalCost, event.attendances.length]);

    function toggleAttendance(attendance) {
        router.patch(`/events/${event.id}/checklist/${attendance.id}`, {
            is_present: !attendance.is_present,
        }, {
            preserveScroll: true,
        });
    }

    function togglePaid(e, attendance) {
        e.stopPropagation();
        router.patch(`/events/${event.id}/checklist/${attendance.id}`, {
            has_paid: !attendance.has_paid,
        }, {
            preserveScroll: true,
        });
    }

    function handleAdd(e) {
        e.preventDefault();
        if (!newName.trim()) return;

        setAdding(true);
        router.post(`/events/${event.id}/checklist`, {
            user_name: newName.trim(),
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setNewName('');
                setAdding(false);
            },
            onError: () => setAdding(false),
        });
    }

    function saveCost() {
        router.patch(`/events/${event.id}/cost`, {
            total_cost: parseFloat(totalCost) || 0,
        }, {
            preserveScroll: true,
        });
    }

    const presentCount = event.attendances.filter(a => a.is_present).length;
    const paidCount = event.attendances.filter(a => a.has_paid).length;
    const totalCount = event.attendances.length;

    return (
        <>
            <Head title={`Checklist - ${event.title}`} />

            {/* Floating orbs */}
            <div className="floating-orb" style={{ width: 320, height: 320, background: '#6366f1', top: '5%', left: '10%' }} />
            <div className="floating-orb" style={{ width: 240, height: 240, background: '#10b981', bottom: '10%', right: '5%', animationDelay: '-8s' }} />

            <div className="min-h-screen relative z-10 px-4 py-12">
                <div className="max-w-2xl mx-auto">
                    {/* Header */}
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <Link
                                href={`/events/${event.id}`}
                                className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors no-underline mb-4"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <line x1="19" y1="12" x2="5" y2="12" />
                                    <polyline points="12 19 5 12 12 5" />
                                </svg>
                                Back to Event
                            </Link>
                            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Checklist</h1>
                            <p className="text-slate-400 text-sm flex items-center gap-2">
                                <span className="text-white font-medium">{event.title}</span>
                                <span className="w-1 h-1 rounded-full bg-slate-600" />
                                <span>{formatDate(event.event_date)}</span>
                            </p>
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-bold text-white">{presentCount}<span className="text-slate-500 text-xl">/{totalCount}</span></div>
                            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Attendance</p>
                        </div>
                    </div>

                    {/* Progress Bars */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div>
                            <div className="flex justify-between text-[10px] uppercase tracking-wider font-bold text-slate-500 mb-1.5">
                                <span>Present</span>
                                <span>{Math.round((presentCount / (totalCount || 1)) * 100)}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                <div 
                                    className="h-full bg-indigo-500 transition-all duration-500"
                                    style={{ width: `${totalCount > 0 ? (presentCount / totalCount) * 100 : 0}%` }}
                                />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-[10px] uppercase tracking-wider font-bold text-slate-500 mb-1.5">
                                <span>Paid</span>
                                <span>{Math.round((paidCount / (totalCount || 1)) * 100)}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                <div 
                                    className="h-full bg-emerald-500 transition-all duration-500"
                                    style={{ width: `${totalCount > 0 ? (paidCount / totalCount) * 100 : 0}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Cost Manager & Add Person Row */}
                    <div className="grid sm:grid-cols-2 gap-4 mb-8">
                        {/* Cost Calculator */}
                        <div className="glass p-5">
                            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                                <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Cost Calculator
                            </h3>
                            <div className="flex gap-2 mb-3">
                                <div className="relative flex-1">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">$</span>
                                    <input
                                        type="number"
                                        className="glass-input pl-7 !py-2"
                                        placeholder="Total price"
                                        value={totalCost}
                                        onChange={(e) => setTotalCost(e.target.value)}
                                    />
                                </div>
                                <button
                                    onClick={saveCost}
                                    className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors border-none cursor-pointer"
                                    title="Save total cost"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                                    </svg>
                                </button>
                            </div>
                            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-emerald-400/80 font-medium">Each Person:</span>
                                    <span className="text-lg font-bold text-emerald-400">${costPerPerson.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Add Person */}
                        <div className="glass p-5">
                            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                                <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                </svg>
                                Add Person
                            </h3>
                            <form onSubmit={handleAdd} className="flex gap-2">
                                <input
                                    type="text"
                                    className="glass-input flex-1 !py-2"
                                    placeholder="Name..."
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                />
                                <button
                                    type="submit"
                                    disabled={adding || !newName.trim()}
                                    className="px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-semibold text-sm border-none cursor-pointer transition-all disabled:opacity-50"
                                >
                                    {adding ? '...' : 'Add'}
                                </button>
                            </form>
                            <p className="text-[10px] text-slate-500 mt-2 italic">Adds to checklist manually</p>
                        </div>
                    </div>

                    {/* Checklist Items */}
                    <div className="glass overflow-hidden">
                        <div className="divide-y divide-white/5">
                            {event.attendances.length > 0 ? (
                                event.attendances.map((attendance) => (
                                    <div 
                                        key={attendance.id}
                                        onClick={() => toggleAttendance(attendance)}
                                        className={`flex items-center gap-3 p-4 cursor-pointer transition-colors hover:bg-white/5 ${attendance.is_present ? 'bg-indigo-500/5' : ''}`}
                                    >
                                        {/* Attendance Checkbox */}
                                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all duration-200 ${attendance.is_present ? 'bg-indigo-500 border-indigo-500 text-white shadow-[0_0_10px_rgba(99,102,241,0.3)]' : 'bg-transparent border-slate-600'}`}>
                                            {attendance.is_present && (
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                    <polyline points="20 6 9 17 4 12" />
                                                </svg>
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <span className={`block font-medium text-sm transition-all duration-200 truncate ${attendance.is_present ? 'text-white' : 'text-slate-400'}`}>
                                                {attendance.user_name}
                                            </span>
                                            {attendance.is_present ? (
                                                <span className="text-[9px] font-bold uppercase tracking-widest text-indigo-400">Arrived</span>
                                            ) : (
                                                <span className="text-[9px] font-bold uppercase tracking-widest text-slate-600">Pending</span>
                                            )}
                                        </div>

                                        {/* Payment Checkbox */}
                                        <div 
                                            onClick={(e) => togglePaid(e, attendance)}
                                            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all duration-200 ${attendance.has_paid ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' : 'bg-white/5 border-white/10 text-slate-500 hover:bg-white/10'}`}
                                        >
                                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${attendance.has_paid ? 'bg-emerald-500 border-emerald-500' : 'border-current'}`}>
                                                {attendance.has_paid && (
                                                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                                                        <polyline points="20 6 9 17 4 12" />
                                                    </svg>
                                                )}
                                            </div>
                                            <span className="text-[10px] font-bold uppercase tracking-wider">
                                                {attendance.has_paid ? 'Paid' : 'Unpaid'}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-12 text-center">
                                    <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center mx-auto mb-4 border border-white/5">
                                        <svg className="w-8 h-8 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                        </svg>
                                    </div>
                                    <p className="text-slate-500 text-sm">No one on the checklist yet.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
