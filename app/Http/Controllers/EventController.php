<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Vote;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EventController extends Controller
{
    /**
     * Display the home page with all events.
     */
    public function index()
    {
        $events = Event::withCount('votes')
            ->orderBy('event_date', 'asc')
            ->get();

        return Inertia::render('Home', [
            'events' => $events,
        ]);
    }

    /**
     * Show the create event form.
     */
    public function create()
    {
        return Inertia::render('CreateEvent');
    }

    /**
     * Store a newly created event.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'event_date' => 'required|date',
            'location' => 'required|string|max:255',
            'is_football_match' => 'boolean',
        ]);

        Event::create($validated);

        return redirect()->route('events.index');
    }

    /**
     * Display the specified event with its votes.
     */
    public function show(Event $event)
    {
        $event->load('votes');

        return Inertia::render('EventDetail', [
            'event' => $event,
        ]);
    }

    /**
     * Submit or update a vote.
     */
    public function vote(Request $request, Event $event)
    {
        $validated = $request->validate([
            'user_name' => 'required|string|max:255',
            'status' => 'required|string|in:join,not_join,maybe,team_a,team_b',
        ]);

        Vote::updateOrCreate(
            [
                'event_id' => $event->id,
                'user_name' => $validated['user_name'],
            ],
            [
                'status' => $validated['status'],
            ]
        );

        return redirect()->back();
    }

    /**
     * Remove a vote (delete a participant).
     */
    public function removeVote(Event $event, Vote $vote)
    {
        // Ensure the vote belongs to this event
        if ($vote->event_id !== $event->id) {
            abort(404);
        }

        $vote->delete();

        return redirect()->back();
    }
}
