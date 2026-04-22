import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';

function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

function getStorageKey(eventId) {
    return `vote_event_${eventId}`;
}

function getStoredVote(eventId) {
    try {
        const stored = localStorage.getItem(getStorageKey(eventId));
        return stored ? JSON.parse(stored) : null;
    } catch {
        return null;
    }
}

function setStoredVote(eventId, userName, status) {
    localStorage.setItem(getStorageKey(eventId), JSON.stringify({ userName, status }));
}

function ParticipantChip({ name, color }) {
    const initial = name.charAt(0).toUpperCase();
    return (
        <div className="participant-chip animate-slide-in">
            <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                style={{
                    background: `linear-gradient(135deg, ${color}40, ${color}20)`,
                    color: color,
                    border: `1px solid ${color}30`,
                }}
            >
                {initial}
            </div>
            <span className="truncate max-w-[120px]">{name}</span>
        </div>
    );
}

function TeamColumn({ title, color, icon, members }) {
    return (
        <div className="flex-1">
            <div className="flex items-center gap-2 mb-4">
                <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
                    style={{
                        background: `linear-gradient(135deg, ${color}30, ${color}15)`,
                        border: `1px solid ${color}30`,
                        color: color,
                    }}
                >
                    {icon}
                </div>
                <div>
                    <h4 className="text-sm font-semibold text-white">{title}</h4>
                    <span className="text-xs" style={{ color: color }}>
                        {members.length} {members.length === 1 ? 'player' : 'players'}
                    </span>
                </div>
            </div>
            <div className="space-y-2">
                {members.length > 0 ? (
                    members.map((vote) => (
                        <ParticipantChip key={vote.id} name={vote.user_name} color={color} />
                    ))
                ) : (
                    <p className="text-xs text-slate-500 italic pl-1">No one yet</p>
                )}
            </div>
        </div>
    );
}

function VoteSection({ event, votes }) {
    const [userName, setUserName] = useState('');
    const [currentStatus, setCurrentStatus] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const stored = getStoredVote(event.id);
        if (stored) {
            setUserName(stored.userName);
            setCurrentStatus(stored.status);
        }
    }, [event.id]);

    function handleVote(status) {
        if (!userName.trim()) return;

        setSubmitting(true);
        router.post(`/events/${event.id}/vote`, {
            user_name: userName.trim(),
            status: status,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setCurrentStatus(status);
                setStoredVote(event.id, userName.trim(), status);
                setSubmitting(false);
            },
            onError: () => {
                setSubmitting(false);
            },
        });
    }

    const isFootball = event.is_football_match;
    const hasName = userName.trim().length > 0;

    return (
        <div className="glass p-6 sm:p-8 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
            <h3 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
                <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path d="M9 12l2 2 4-4" />
                    <circle cx="12" cy="12" r="10" />
                </svg>
                Cast Your Vote
            </h3>

            {/* Name Input */}
            <div className="mb-6">
                <label htmlFor="voter-name" className="block text-sm font-medium text-slate-300 mb-2">
                    Your Display Name
                </label>
                <input
                    id="voter-name"
                    type="text"
                    className="glass-input"
                    placeholder="Enter your name..."
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                />
            </div>

            {/* Vote Buttons */}
            <div className="flex flex-wrap gap-3">
                {isFootball ? (
                    <>
                        <button
                            onClick={() => handleVote('team_a')}
                            disabled={!hasName || submitting}
                            className={`vote-btn flex-1 min-w-[120px] ${currentStatus === 'team_a' ? 'active-team-a' : ''}`}
                            id="vote-team-a-btn"
                        >
                            <span className="flex items-center justify-center gap-2">
                                <span className="text-base">🟡</span> Team A
                            </span>
                        </button>
                        <button
                            onClick={() => handleVote('team_b')}
                            disabled={!hasName || submitting}
                            className={`vote-btn flex-1 min-w-[120px] ${currentStatus === 'team_b' ? 'active-team-b' : ''}`}
                            id="vote-team-b-btn"
                        >
                            <span className="flex items-center justify-center gap-2">
                                <span className="text-base">🟢</span> Team B
                            </span>
                        </button>
                        <button
                            onClick={() => handleVote('not_join')}
                            disabled={!hasName || submitting}
                            className={`vote-btn flex-1 min-w-[120px] ${currentStatus === 'not_join' ? 'active-not-join' : ''}`}
                            id="vote-not-join-btn"
                        >
                            <span className="flex items-center justify-center gap-2">
                                <span className="text-base">✕</span> Not Join
                            </span>
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            onClick={() => handleVote('join')}
                            disabled={!hasName || submitting}
                            className={`vote-btn flex-1 min-w-[100px] ${currentStatus === 'join' ? 'active-join' : ''}`}
                            id="vote-join-btn"
                        >
                            <span className="flex items-center justify-center gap-2">
                                <span className="text-base">✓</span> Join
                            </span>
                        </button>
                        <button
                            onClick={() => handleVote('maybe')}
                            disabled={!hasName || submitting}
                            className={`vote-btn flex-1 min-w-[100px] ${currentStatus === 'maybe' ? 'active-maybe' : ''}`}
                            id="vote-maybe-btn"
                        >
                            <span className="flex items-center justify-center gap-2">
                                <span className="text-base">?</span> Maybe
                            </span>
                        </button>
                        <button
                            onClick={() => handleVote('not_join')}
                            disabled={!hasName || submitting}
                            className={`vote-btn flex-1 min-w-[100px] ${currentStatus === 'not_join' ? 'active-not-join' : ''}`}
                            id="vote-not-join-btn"
                        >
                            <span className="flex items-center justify-center gap-2">
                                <span className="text-base">✕</span> Not Join
                            </span>
                        </button>
                    </>
                )}
            </div>

            {!hasName && (
                <p className="mt-3 text-xs text-slate-500 flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 16v-4M12 8h.01" />
                    </svg>
                    Enter your name to vote
                </p>
            )}

            {currentStatus && (
                <div className="mt-4 flex items-center gap-2 text-sm text-emerald-400 animate-fade-in-up">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path d="M9 12l2 2 4-4" />
                        <circle cx="12" cy="12" r="10" />
                    </svg>
                    Your vote has been recorded. Click another option to change it.
                </div>
            )}
        </div>
    );
}

function ParticipantList({ event, votes }) {
    const isFootball = event.is_football_match;

    if (isFootball) {
        const teamA = votes.filter((v) => v.status === 'team_a');
        const teamB = votes.filter((v) => v.status === 'team_b');
        const notJoining = votes.filter((v) => v.status === 'not_join');

        return (
            <div className="glass p-6 sm:p-8 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
                <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                    <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                    Teams
                </h3>

                <div className="flex flex-col sm:flex-row gap-6">
                    <TeamColumn
                        title="Team A"
                        color="#f59e0b"
                        icon="A"
                        members={teamA}
                    />
                    <div className="hidden sm:block w-px bg-white/10 self-stretch" />
                    <div className="sm:hidden h-px bg-white/10" />
                    <TeamColumn
                        title="Team B"
                        color="#10b981"
                        icon="B"
                        members={teamB}
                    />
                </div>

                {notJoining.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-white/10">
                        <h4 className="text-sm font-medium text-slate-400 mb-3">Not Joining ({notJoining.length})</h4>
                        <div className="flex flex-wrap gap-2">
                            {notJoining.map((v) => (
                                <ParticipantChip key={v.id} name={v.user_name} color="#ef4444" />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // Standard event
    const going = votes.filter((v) => v.status === 'join');
    const maybe = votes.filter((v) => v.status === 'maybe');
    const notJoining = votes.filter((v) => v.status === 'not_join');

    return (
        <div className="glass p-6 sm:p-8 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                Participants
            </h3>

            {votes.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-slate-500 text-sm">No votes yet. Be the first one!</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Going */}
                    {going.length > 0 && (
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-2 h-2 rounded-full bg-indigo-400" />
                                <h4 className="text-sm font-medium text-indigo-300">
                                    Going ({going.length})
                                </h4>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {going.map((v) => (
                                    <ParticipantChip key={v.id} name={v.user_name} color="#6366f1" />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Maybe */}
                    {maybe.length > 0 && (
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-2 h-2 rounded-full bg-amber-400" />
                                <h4 className="text-sm font-medium text-amber-300">
                                    Maybe ({maybe.length})
                                </h4>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {maybe.map((v) => (
                                    <ParticipantChip key={v.id} name={v.user_name} color="#f59e0b" />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Not Joining */}
                    {notJoining.length > 0 && (
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-2 h-2 rounded-full bg-red-400" />
                                <h4 className="text-sm font-medium text-red-300">
                                    Not Joining ({notJoining.length})
                                </h4>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {notJoining.map((v) => (
                                    <ParticipantChip key={v.id} name={v.user_name} color="#ef4444" />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default function EventDetail({ event }) {
    const votes = event.votes || [];

    return (
        <>
            <Head title={event.title} />

            {/* Floating orbs */}
            <div className="floating-orb" style={{ width: 320, height: 320, background: '#6366f1', top: '5%', left: '10%' }} />
            <div className="floating-orb" style={{ width: 240, height: 240, background: '#06b6d4', bottom: '10%', right: '5%', animationDelay: '-8s' }} />
            <div className="floating-orb" style={{ width: 180, height: 180, background: '#8b5cf6', top: '60%', left: '60%', animationDelay: '-15s' }} />

            <div className="min-h-screen relative z-10">
                {/* Header */}
                <header className="pt-12 pb-8 px-4 sm:px-6">
                    <div className="max-w-3xl mx-auto">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors no-underline mb-6"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <line x1="19" y1="12" x2="5" y2="12" />
                                <polyline points="12 19 5 12 12 5" />
                            </svg>
                            Back to Events
                        </Link>
                    </div>
                </header>

                {/* Content */}
                <main className="px-4 sm:px-6 pb-16">
                    <div className="max-w-3xl mx-auto space-y-6">
                        {/* Event Info */}
                        <div className="glass p-6 sm:p-8 opacity-0 animate-fade-in-up">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-3 flex-wrap">
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
                                    </div>
                                    <h1 className="text-2xl sm:text-3xl font-bold text-white">{event.title}</h1>
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2 mb-4">
                                <div className="flex items-center gap-3 glass-subtle p-4">
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-indigo-500/15 border border-indigo-500/20">
                                        <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                            <line x1="16" y1="2" x2="16" y2="6" />
                                            <line x1="8" y1="2" x2="8" y2="6" />
                                            <line x1="3" y1="10" x2="21" y2="10" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400">Date & Time</p>
                                        <p className="text-sm text-white font-medium">{formatDate(event.event_date)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 glass-subtle p-4">
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-cyan-500/15 border border-cyan-500/20">
                                        <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                            <circle cx="12" cy="10" r="3" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400">Location</p>
                                        <p className="text-sm text-white font-medium">{event.location}</p>
                                    </div>
                                </div>
                            </div>

                            {event.description && (
                                <p className="text-sm text-slate-400 leading-relaxed">{event.description}</p>
                            )}

                            {/* Stats */}
                            <div className="mt-5 pt-5 border-t border-white/10 flex items-center gap-6">
                                <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                        <circle cx="9" cy="7" r="4" />
                                    </svg>
                                    <span className="text-sm text-slate-300">
                                        <span className="font-semibold text-white">{votes.length}</span> total votes
                                    </span>
                                </div>
                                {event.is_football_match && (
                                    <>
                                        <div className="flex items-center gap-1.5">
                                            <span className="w-2 h-2 rounded-full bg-amber-400" />
                                            <span className="text-sm text-slate-400">
                                                Team A: <span className="text-amber-300 font-medium">{votes.filter(v => v.status === 'team_a').length}</span>
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <span className="w-2 h-2 rounded-full bg-emerald-400" />
                                            <span className="text-sm text-slate-400">
                                                Team B: <span className="text-emerald-300 font-medium">{votes.filter(v => v.status === 'team_b').length}</span>
                                            </span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Voting */}
                        <VoteSection event={event} votes={votes} />

                        {/* Participants */}
                        <ParticipantList event={event} votes={votes} />
                    </div>
                </main>
            </div>
        </>
    );
}
