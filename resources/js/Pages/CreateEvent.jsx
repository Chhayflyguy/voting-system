import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function CreateEvent() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        event_date: '',
        location: '',
        is_football_match: false,
    });

    function handleSubmit(e) {
        e.preventDefault();
        post('/events');
    }

    return (
        <>
            <Head title="Create Event" />

            {/* Floating orbs */}
            <div className="floating-orb" style={{ width: 280, height: 280, background: '#8b5cf6', top: '20%', right: '10%' }} />
            <div className="floating-orb" style={{ width: 220, height: 220, background: '#6366f1', bottom: '20%', left: '5%', animationDelay: '-5s' }} />

            <div className="min-h-screen relative z-10">
                {/* Header */}
                <header className="pt-12 pb-8 px-4 sm:px-6">
                    <div className="max-w-2xl mx-auto">
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
                        <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                            Create
                            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent"> Event</span>
                        </h1>
                        <p className="mt-2 text-slate-400">Set up a new event and share it with others</p>
                    </div>
                </header>

                {/* Form */}
                <main className="px-4 sm:px-6 pb-16">
                    <div className="max-w-2xl mx-auto">
                        <form onSubmit={handleSubmit} className="glass p-6 sm:p-8 opacity-0 animate-fade-in-up" id="create-event-form">
                            <div className="space-y-6">
                                {/* Title */}
                                <div>
                                    <label htmlFor="title" className="block text-sm font-medium text-slate-300 mb-2">
                                        Event Title <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        id="title"
                                        type="text"
                                        className="glass-input"
                                        placeholder="e.g. Weekend Barbecue, Team Building..."
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        required
                                    />
                                    {errors.title && <p className="mt-1 text-sm text-red-400">{errors.title}</p>}
                                </div>

                                {/* Description */}
                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        id="description"
                                        className="glass-input min-h-[100px] resize-none"
                                        placeholder="Add details about the event..."
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        rows={3}
                                    />
                                    {errors.description && <p className="mt-1 text-sm text-red-400">{errors.description}</p>}
                                </div>

                                {/* Date & Location Row */}
                                <div className="grid gap-6 sm:grid-cols-2">
                                    <div>
                                        <label htmlFor="event_date" className="block text-sm font-medium text-slate-300 mb-2">
                                            Event Date <span className="text-red-400">*</span>
                                        </label>
                                        <input
                                            id="event_date"
                                            type="datetime-local"
                                            className="glass-input"
                                            value={data.event_date}
                                            onChange={(e) => setData('event_date', e.target.value)}
                                            required
                                        />
                                        {errors.event_date && <p className="mt-1 text-sm text-red-400">{errors.event_date}</p>}
                                    </div>
                                    <div>
                                        <label htmlFor="location" className="block text-sm font-medium text-slate-300 mb-2">
                                            Location <span className="text-red-400">*</span>
                                        </label>
                                        <input
                                            id="location"
                                            type="text"
                                            className="glass-input"
                                            placeholder="e.g. City Park, Office..."
                                            value={data.location}
                                            onChange={(e) => setData('location', e.target.value)}
                                            required
                                        />
                                        {errors.location && <p className="mt-1 text-sm text-red-400">{errors.location}</p>}
                                    </div>
                                </div>

                                {/* Football Match Toggle */}
                                <div className="glass-subtle p-5">
                                    <label htmlFor="is_football_match" className="flex items-center justify-between cursor-pointer">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                                                data.is_football_match
                                                    ? 'bg-gradient-to-br from-emerald-500/30 to-green-500/20 border border-emerald-500/30'
                                                    : 'bg-white/5 border border-white/10'
                                            }`}>
                                                <svg className={`w-5 h-5 transition-colors ${data.is_football_match ? 'text-emerald-400' : 'text-slate-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                    <circle cx="12" cy="12" r="10" />
                                                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                                                    <path d="M2 12h20" />
                                                </svg>
                                            </div>
                                            <div>
                                                <span className="text-sm font-medium text-white block">Football Match</span>
                                                <span className="text-xs text-slate-400">Enable Team A vs Team B voting</span>
                                            </div>
                                        </div>
                                        {/* Toggle Switch */}
                                        <div className="relative">
                                            <input
                                                id="is_football_match"
                                                type="checkbox"
                                                className="sr-only"
                                                checked={data.is_football_match}
                                                onChange={(e) => setData('is_football_match', e.target.checked)}
                                            />
                                            <div className={`w-12 h-7 rounded-full transition-all duration-300 ${
                                                data.is_football_match
                                                    ? 'bg-gradient-to-r from-emerald-500 to-green-500 shadow-lg shadow-emerald-500/30'
                                                    : 'bg-white/10'
                                            }`}>
                                                <div className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-all duration-300 ${
                                                    data.is_football_match ? 'left-[calc(100%-1.625rem)]' : 'left-0.5'
                                                }`} />
                                            </div>
                                        </div>
                                    </label>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                    <button
                                        type="submit"
                                        className="btn-primary flex-1 flex items-center justify-center gap-2"
                                        disabled={processing}
                                        id="submit-event-btn"
                                    >
                                        {processing ? (
                                            <>
                                                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                </svg>
                                                Creating...
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <polyline points="20 6 9 17 4 12" />
                                                </svg>
                                                Create Event
                                            </>
                                        )}
                                    </button>
                                    <Link
                                        href="/"
                                        className="btn-ghost text-center no-underline"
                                    >
                                        Cancel
                                    </Link>
                                </div>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </>
    );
}
