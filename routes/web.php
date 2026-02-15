<?php

use App\Http\Controllers\Artist\DashboardController as ArtistDashboardController;
use App\Http\Controllers\ArtistController;
use App\Http\Controllers\ArtStreamController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ServiceController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [HomeController::class, 'index'])->name('home');

Route::get('dashboard', function () {
    return Inertia::render('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// Artist routes
Route::middleware(['auth'])->prefix('artist')->name('artist.')->group(function () {
    Route::get('/dashboard', [ArtistDashboardController::class, 'index'])->name('dashboard');
});

// Client routes
Route::middleware(['auth'])->prefix('client')->name('client.')->group(function () {
    Route::get('/reservations', [\App\Http\Controllers\Client\ReservationController::class, 'index'])->name('reservations.index');
    Route::get('/reservations/{reservation}', [\App\Http\Controllers\Client\ReservationController::class, 'show'])->name('reservations.show');
    Route::post('/reservations/{reservation}/cancel', [\App\Http\Controllers\Client\ReservationController::class, 'cancel'])->name('reservations.cancel');
    Route::post('/reservations/{reservation}/review', [\App\Http\Controllers\Client\ReservationController::class, 'review'])->name('reservations.review');
});

Route::get('/register/selection', function () {
    return Inertia::render('auth/register-selection');
})->name('register.selection');

Route::get('/register/artist', function () {
    return Inertia::render('auth/register-artist');
})->name('register.artist');

Route::get('/splash', function () {
    return Inertia::render('splash');
})->name('splash');

Route::get('/onboarding', function () {
    return Inertia::render('onboarding');
})->name('onboarding');

Route::get('/artist/{id}', [ArtistController::class, 'show'])->name('artist.show');

Route::get('/service/{id}', [ServiceController::class, 'show'])->name('service.show');

Route::get('/artstream', [ArtStreamController::class, 'index'])->name('artstream.index');

Route::get('/artstream/album/{album}', [ArtStreamController::class, 'album'])->name('artstream.album');

Route::get('/artstream/player', function () {
    return Inertia::render('ArtStream/full-player');
})->name('artstream.player');

Route::get('/artists', [ArtistController::class, 'index'])->name('artists.index');

require __DIR__.'/settings.php';
