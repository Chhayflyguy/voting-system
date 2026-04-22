<?php

use App\Http\Controllers\EventController;
use Illuminate\Support\Facades\Route;

Route::get('/', [EventController::class, 'index'])->name('events.index');
Route::get('/events/create', [EventController::class, 'create'])->name('events.create');
Route::post('/events', [EventController::class, 'store'])->name('events.store');
Route::get('/events/{event}', [EventController::class, 'show'])->name('events.show');
Route::post('/events/{event}/vote', [EventController::class, 'vote'])->name('events.vote');
Route::delete('/events/{event}/vote/{vote}', [EventController::class, 'removeVote'])->name('events.removeVote');
Route::delete('/events/{event}', [EventController::class, 'destroy'])->name('events.destroy');
