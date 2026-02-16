<?php

use App\Http\Controllers\Artist\DashboardController as ArtistDashboardController;
use App\Http\Controllers\ArtistController;
use App\Http\Controllers\ArtStreamController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ServiceController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [HomeController::class, 'index'])->name('home');

Route::get('dashboard', [\App\Http\Controllers\Client\DashboardController::class, 'index'])
    ->middleware(['auth', 'verified', 'role.client'])
    ->name('dashboard');

// Artist routes
Route::middleware(['auth', 'role.artist'])->prefix('artist')->name('artist.')->group(function () {
    Route::get('/dashboard', [ArtistDashboardController::class, 'index'])->name('dashboard');

    // Profile management
    Route::get('/profile', [\App\Http\Controllers\Artist\ProfileController::class, 'show'])->name('profile.show');
    Route::put('/profile', [\App\Http\Controllers\Artist\ProfileController::class, 'update'])->name('profile.update');
    Route::post('/profile/media', [\App\Http\Controllers\Artist\ProfileController::class, 'uploadMedia'])->name('profile.media.upload');
    Route::delete('/profile/media/{media}', [\App\Http\Controllers\Artist\ProfileController::class, 'deleteMedia'])->name('profile.media.delete');

    // Album upload management
    Route::get('/albums', [\App\Http\Controllers\Artist\AlbumUploadController::class, 'index'])->name('albums.index');
    Route::post('/albums', [\App\Http\Controllers\Artist\AlbumUploadController::class, 'store'])->name('albums.store');
    Route::delete('/albums/{album}', [\App\Http\Controllers\Artist\AlbumUploadController::class, 'destroy'])->name('albums.destroy');
    Route::patch('/albums/{album}/toggle-publication', [\App\Http\Controllers\Artist\AlbumUploadController::class, 'togglePublication'])->name('albums.toggle');
});

// Client routes
Route::middleware(['auth', 'role.client'])->prefix('client')->name('client.')->group(function () {
    // Cart routes
    Route::get('/cart', [\App\Http\Controllers\CartController::class, 'index'])->name('cart.index');
    Route::post('/cart/items', [\App\Http\Controllers\CartController::class, 'addItem'])->name('cart.addItem');
    Route::delete('/cart/items/{item}', [\App\Http\Controllers\CartController::class, 'removeItem'])->name('cart.removeItem');
    Route::post('/cart/coupon', [\App\Http\Controllers\CartController::class, 'applyCoupon'])->name('cart.applyCoupon');
    Route::delete('/cart', [\App\Http\Controllers\CartController::class, 'clear'])->name('cart.clear');

    // Reservations routes
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

Route::get('/artstream/player', [ArtStreamController::class, 'player'])->name('artstream.player');

Route::get('/artstream/search', [ArtStreamController::class, 'search'])->name('artstream.search');

// Favorites routes
Route::middleware(['auth'])->group(function () {
    Route::post('/tracks/{track}/favorite', [\App\Http\Controllers\FavoriteController::class, 'toggle'])->name('tracks.favorite');
    Route::get('/favorites', [\App\Http\Controllers\FavoriteController::class, 'index'])->name('favorites.index');
});

// Playlist routes
Route::middleware(['auth'])->group(function () {
    Route::get('/playlists', [\App\Http\Controllers\PlaylistController::class, 'index'])->name('playlists.index');
    Route::post('/playlists', [\App\Http\Controllers\PlaylistController::class, 'store'])->name('playlists.store');
    Route::get('/playlists/{playlist}', [\App\Http\Controllers\PlaylistController::class, 'show'])->name('playlists.show');
    Route::delete('/playlists/{playlist}', [\App\Http\Controllers\PlaylistController::class, 'destroy'])->name('playlists.destroy');
    Route::post('/playlists/{playlist}/tracks/{track}', [\App\Http\Controllers\PlaylistController::class, 'addTrack'])->name('playlists.addTrack');
    Route::delete('/playlists/{playlist}/tracks/{track}', [\App\Http\Controllers\PlaylistController::class, 'removeTrack'])->name('playlists.removeTrack');
});

// ArtTube routes
Route::get('/arttube', [\App\Http\Controllers\Stream\VideoController::class, 'index'])->name('arttube.index');
Route::get('/arttube/videos/{video}', [\App\Http\Controllers\Stream\VideoController::class, 'show'])->name('arttube.videos.show');
Route::post('/arttube/videos/{video}/like', [\App\Http\Controllers\Stream\VideoController::class, 'like'])->middleware('auth')->name('arttube.videos.like');
Route::post('/arttube/videos/{video}/comments', [\App\Http\Controllers\Stream\VideoController::class, 'storeComment'])->middleware('auth')->name('arttube.videos.comments');

// Booking routes
Route::middleware(['auth'])->group(function () {
    Route::get('/booking/calendar', [\App\Http\Controllers\BookingController::class, 'calendar'])->name('booking.calendar');
    Route::get('/booking/customize', [\App\Http\Controllers\BookingController::class, 'customize'])->name('booking.customize');
    Route::get('/booking/payment', [\App\Http\Controllers\BookingController::class, 'payment'])->name('booking.payment');
    Route::post('/booking/store', [\App\Http\Controllers\BookingController::class, 'store'])->name('booking.store');
    Route::get('/booking/confirmation/{id}', [\App\Http\Controllers\BookingController::class, 'confirmation'])->name('booking.confirmation');
    Route::get('/booking/{id}/receipt', [\App\Http\Controllers\BookingController::class, 'downloadReceipt'])->name('booking.receipt');

    // Messaging routes
    Route::get('/messages', [\App\Http\Controllers\ConversationController::class, 'index'])->name('messages.index');
    Route::get('/messages/{conversation}', [\App\Http\Controllers\ConversationController::class, 'show'])->name('messages.show');
    Route::post('/messages/{conversation}', [\App\Http\Controllers\ConversationController::class, 'store'])->name('messages.store');
    Route::get('/reservation/{reservation}/contact', [\App\Http\Controllers\ConversationController::class, 'contact'])->name('reservation.contact');
});

Route::get('/artists', [ArtistController::class, 'index'])->name('artists.index');

require __DIR__.'/settings.php';
