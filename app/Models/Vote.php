<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Vote extends Model
{
    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'event_id',
        'user_name',
        'status',
    ];

    /**
     * Get the event that the vote belongs to.
     */
    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }
}
