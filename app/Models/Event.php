<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Event extends Model
{
    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'title',
        'description',
        'event_date',
        'location',
        'is_football_match',
    ];

    /**
     * The attributes that should be cast.
     */
    protected function casts(): array
    {
        return [
            'event_date' => 'datetime',
            'is_football_match' => 'boolean',
        ];
    }

    /**
     * Get the votes for the event.
     */
    public function votes(): HasMany
    {
        return $this->hasMany(Vote::class);
    }
}
