import { Head, Link, usePage } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';

function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Phnom_Penh',
    });
}

function SuccessDialog({ flash, onClose }) {
    const [countdown, setCountdown] = useState(3);

    useEffect(() => {
        if (!flash) return;
        setCountdown(3);
        const interval = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    onClose();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [flash]);

    if (!flash) return null;

    const isCreated = flash.type === 'created';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
            <div
                className="glass relative w-full max-w-md p-8 animate-fade-in-up text-center"
                style={{ zIndex: 51 }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Icon */}
                <div
                    className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
                    style={isCreated ? {
                        background: 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(139,92,246,0.2))',
                        border: '2px solid rgba(99,102,241,0.4)',
                        boxShadow: '0 0 40px rgba(99,102,241,0.3)',
                    } : {
                        background: 'linear-gradient(135deg, rgba(239,68,68,0.25), rgba(220,38,38,0.15))',
                        border: '2px solid rgba(239,68,68,0.35)',
                        boxShadow: '0 0 40px rgba(239,68,68,0.2)',
                    }}
                >
                    {isCreated ? (
                        <svg className="w-10 h-10 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    ) : (
                        <svg className="w-10 h-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    )}
                </div>

                <h2 className="text-2xl font-bold text-white mb-2">
                    {isCreated ? 'Event Created! 🎉' : 'Event Deleted'}
                </h2>
                <p className="text-slate-300 mb-1">
                    <span className={`font-semibold ${isCreated ? 'text-indigo-300' : 'text-red-300'}`}>
                        &ldquo;{flash.title}&rdquo;
                    </span>{' '}
                    {isCreated ? 'has been created successfully.' : 'has been deleted successfully.'}
                </p>
                <p className="text-slate-400 text-sm mb-8">
                    This dialog will close in{' '}
                    <span className={`font-semibold ${isCreated ? 'text-indigo-400' : 'text-red-400'}`}>
                        {countdown}
                    </span>s...
                </p>

                <button
                    onClick={onClose}
                    className="btn-primary w-full flex items-center justify-center gap-2"
                    id="flash-dismiss-btn"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path d="M9 12l2 2 4-4" />
                        <circle cx="12" cy="12" r="10" />
                    </svg>
                    Got it!
                </button>
            </div>
        </div>
    );
}

function EventCard({ event, index }) {
    const isPast = new Date(event.event_date) < new Date();

    return (
        <Link
            href={`/events/${event.id}`}
            className={`glass-card block p-6 opacity-0 animate-fade-in-up cursor-pointer`}
            style={{ animationDelay: `${index * 0.08}s` }}
        >
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                        {event.is_football_match ? (
                            <span className="badge badge-football">
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <circle cx="12" cy="12" r="10" />
                                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                                    <path d="M2 12h20" />
                                </svg>
                                Football Match
                            </span>
                        ) : (
                            <span className="badge badge-event">
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                    <line x1="16" y1="2" x2="16" y2="6" />
                                    <line x1="8" y1="2" x2="8" y2="6" />
                                    <line x1="3" y1="10" x2="21" y2="10" />
                                </svg>
                                Event
                            </span>
                        )}
                        {isPast && (
                            <span className="badge" style={{
                                background: 'rgba(239, 68, 68, 0.15)',
                                color: '#fca5a5',
                                border: '1px solid rgba(239, 68, 68, 0.25)'
                            }}>
                                Past
                            </span>
                        )}
                    </div>
                    <h3 className="text-lg font-semibold text-white truncate">{event.title}</h3>
                </div>
                <div className="flex items-center gap-1.5 ml-4 shrink-0">
                    <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                    <span className="text-sm font-medium text-indigo-300">{event.votes_count}</span>
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    <span>{formatDate(event.event_date)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span className="truncate">{event.location}</span>
                </div>
            </div>

            {event.description && (
                <p className="mt-3 text-sm text-slate-500 line-clamp-2">{event.description}</p>
            )}
        </Link>
    );
}

export default function Home({ events }) {
    const { flash } = usePage().props;

    // Initialize directly from flash so dialog shows immediately on page load / redirect
    const [flashData, setFlashData] = useState(flash || null);
    const [showFlash, setShowFlash] = useState(!!flash);
    const seenTimestampRef = useRef(flash?.id ?? null);

    // Also catch subsequent SPA navigations that update flash without unmounting
    useEffect(() => {
        if (flash && flash.id !== seenTimestampRef.current) {
            seenTimestampRef.current = flash.id;
            setFlashData(flash);
            setShowFlash(true);
        }
    }, [flash]);

    return (
        <>
            <Head title="Dashboard" />

            {/* Success / Delete flash dialog */}
            {showFlash && (
                <SuccessDialog flash={flashData} onClose={() => setShowFlash(false)} />
            )}

            {/* Floating orbs */}
            <div className="floating-orb" style={{ width: 300, height: 300, background: '#6366f1', top: '10%', left: '5%' }} />
            <div className="floating-orb" style={{ width: 250, height: 250, background: '#06b6d4', bottom: '15%', right: '10%', animationDelay: '-7s' }} />
            <div className="floating-orb" style={{ width: 200, height: 200, background: '#8b5cf6', top: '50%', left: '50%', animationDelay: '-14s' }} />

            <div className="min-h-screen relative z-10">
                {/* Header */}
                <header className="pt-12 pb-8 px-4 sm:px-6">
                    <div className="max-w-5xl mx-auto">
                        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                            <div>
                                <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                                    Event
                                    <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent"> Voting</span>
                                </h1>
                                <p className="mt-2 text-slate-400 text-sm sm:text-base">
                                    Organize events and let everyone vote
                                </p>
                            </div>
                            <Link
                                href="/events/create"
                                className="btn-primary inline-flex items-center gap-2 no-underline text-center justify-center"
                                id="create-event-btn"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <line x1="12" y1="5" x2="12" y2="19" />
                                    <line x1="5" y1="12" x2="19" y2="12" />
                                </svg>
                                New Event
                            </Link>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="px-4 sm:px-6 pb-16">
                    <div className="max-w-5xl mx-auto">
                        {events.length === 0 ? (
                            <div className="glass text-center py-20 px-6 opacity-0 animate-fade-in-up">
                                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center border border-indigo-500/20">
                                    <svg className="w-8 h-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                        <line x1="16" y1="2" x2="16" y2="6" />
                                        <line x1="8" y1="2" x2="8" y2="6" />
                                        <line x1="3" y1="10" x2="21" y2="10" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-2">No events yet</h3>
                                <p className="text-slate-400 mb-6">Create your first event and start collecting votes</p>
                                <Link
                                    href="/events/create"
                                    className="btn-primary inline-flex items-center gap-2 no-underline"
                                >
                                    Create First Event
                                </Link>
                            </div>
                        ) : (
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {events.map((event, i) => (
                                    <EventCard key={event.id} event={event} index={i} />
                                ))}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </>
    );
}
