<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    use HasFactory;

    protected $fillable = [
        'event_id',
        'user_name',
        'is_present',
        'has_paid',
    ];

    protected $casts = [
        'is_present' => 'boolean',
        'has_paid' => 'boolean',
    ];

    public function event()
    {
        return $this->belongsTo(Event::class);
    }
}
