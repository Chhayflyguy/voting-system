<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Vote;
use App\Models\Attendance;
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

    /**
     * Delete an event (requires password).
     */
    public function destroy(Request $request, Event $event)
    {
        $request->validate([
            'password' => 'required|string',
        ]);

        if ($request->password !== 'komdelete') {
            return redirect()->back()->withErrors(['password' => 'Incorrect password.']);
        }

        $event->delete();

        return redirect()->route('events.index');
    }

    /**
     * Show the checklist for an event.
     */
    public function checklist(Event $event)
    {
        // Get all people who voted to join
        $voters = $event->votes()->whereIn('status', ['join', 'team_a', 'team_b'])->get();

        // Ensure attendance record exists for each voter
        foreach ($voters as $voter) {
            Attendance::firstOrCreate([
                'event_id' => $event->id,
                'user_name' => $voter->user_name,
            ]);
        }

        $event->load(['attendances' => function ($query) {
            $query->orderBy('user_name', 'asc');
        }]);

        return Inertia::render('EventChecklist', [
            'event' => $event,
        ]);
    }

    /**
     * Update attendance status.
     */
    public function updateAttendance(Request $request, Event $event, Attendance $attendance)
    {
        // Ensure the attendance belongs to this event
        if ($attendance->event_id !== $event->id) {
            abort(404);
        }

        $validated = $request->validate([
            'is_present' => 'nullable|boolean',
            'has_paid' => 'nullable|boolean',
        ]);

        $attendance->update(array_filter($validated, function ($value) {
            return $value !== null;
        }));

        return redirect()->back();
    }

    /**
     * Update event total cost.
     */
    public function updateCost(Request $request, Event $event)
    {
        $validated = $request->validate([
            'total_cost' => 'required|numeric|min:0',
        ]);

        $event->update([
            'total_cost' => $validated['total_cost'],
        ]);

        return redirect()->back();
    }

    /**
     * Add a new person to the checklist.
     */
    public function addAttendance(Request $request, Event $event)
    {
        $validated = $request->validate([
            'user_name' => 'required|string|max:255',
        ]);

        Attendance::firstOrCreate([
            'event_id' => $event->id,
            'user_name' => $validated['user_name'],
        ]);

        return redirect()->back();
    }
}
