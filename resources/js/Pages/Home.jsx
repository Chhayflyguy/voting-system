import { Head, Link } from '@inertiajs/react';

function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
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
    return (
        <>
            <Head title="Dashboard" />

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
