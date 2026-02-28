<?php

use App\Http\Controllers\Admin\ArtistValidationController as AdminArtistValidationController;
use App\Http\Controllers\Admin\Auth\LoginController as AdminLoginController;
use App\Http\Controllers\Admin\BroadcastNotificationController;
use App\Http\Controllers\Admin\ClientActivityController;
use App\Http\Controllers\Admin\ContentModerationController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\FinancialOverviewController;
use App\Http\Controllers\Admin\ReportController;
use App\Http\Controllers\Admin\SuperAdminCrudController;
use App\Http\Controllers\Admin\TicketController as AdminTicketController;
use App\Http\Controllers\Admin\UserManagementController;
use App\Http\Controllers\Artist\DashboardController as ArtistDashboardController;
use App\Http\Controllers\ArtistController;
use App\Http\Controllers\ArtStreamController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ServiceController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [HomeController::class, 'index'])->name('home');

Route::prefix('admin')->name('admin.')->group(function () {
    Route::middleware('guest')->group(function () {
        Route::get('/login', [AdminLoginController::class, 'create'])->name('login');
        Route::post('/login', [AdminLoginController::class, 'store'])->name('login.store');
    });

    Route::middleware(['auth', 'role.admin'])->group(function () {
        Route::post('/logout', [AdminLoginController::class, 'destroy'])->name('logout');
        Route::redirect('/', '/admin/dashboard');
        Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');

        Route::get('/artists/pending', [AdminArtistValidationController::class, 'index'])->name('artists.pending');
        Route::post('/artists/{artist}/approve', [AdminArtistValidationController::class, 'approve'])->name('artists.approve');
        Route::post('/artists/{artist}/reject', [AdminArtistValidationController::class, 'reject'])->name('artists.reject');

        Route::get('/tickets', [AdminTicketController::class, 'index'])->name('tickets.index');
        Route::get('/tickets/{ticket}', [AdminTicketController::class, 'show'])->name('tickets.show');
        Route::post('/tickets/{ticket}/respond', [AdminTicketController::class, 'respond'])->name('tickets.respond');
        Route::patch('/tickets/{ticket}/close', [AdminTicketController::class, 'close'])->name('tickets.close');

        Route::get('/moderation', [ContentModerationController::class, 'index'])->name('moderation.index');
        Route::post('/moderation/reviews/{review}/resolve', [ContentModerationController::class, 'resolveReview'])->name('moderation.reviews.resolve');
        Route::delete('/moderation/reviews/{review}', [ContentModerationController::class, 'deleteReview'])->name('moderation.reviews.delete');
        Route::post('/moderation/comments/{comment}/resolve', [ContentModerationController::class, 'resolveComment'])->name('moderation.comments.resolve');
        Route::delete('/moderation/comments/{comment}', [ContentModerationController::class, 'deleteComment'])->name('moderation.comments.delete');

        Route::get('/reports', [ReportController::class, 'index'])->name('reports.index');
        Route::get('/reports/export', [ReportController::class, 'export'])->name('reports.export');

        Route::get('/broadcast', [BroadcastNotificationController::class, 'create'])->name('broadcast.create');
        Route::post('/broadcast', [BroadcastNotificationController::class, 'store'])->name('broadcast.store');

        Route::get('/client-activity', [ClientActivityController::class, 'index'])->name('client-activity.index');
        Route::get('/financial-overview', [FinancialOverviewController::class, 'index'])->name('financial-overview.index');

        Route::get('/users', [UserManagementController::class, 'index'])->name('users.index');
        Route::get('/users/create', [UserManagementController::class, 'create'])->name('users.create');
        Route::post('/users', [UserManagementController::class, 'store'])->name('users.store');
        Route::get('/users/{user}', [UserManagementController::class, 'show'])->name('users.show');
        Route::get('/users/{user}/edit', [UserManagementController::class, 'edit'])->name('users.edit');
        Route::put('/users/{user}', [UserManagementController::class, 'update'])->name('users.update');
        Route::delete('/users/{user}', [UserManagementController::class, 'destroy'])->name('users.destroy');
        Route::post('/users/{user}/suspend', [UserManagementController::class, 'suspend'])->name('users.suspend');
        Route::post('/users/{user}/activate', [UserManagementController::class, 'activate'])->name('users.activate');
        Route::post('/users/{user}/ban', [UserManagementController::class, 'ban'])->name('users.ban');
        Route::post('/users/{user}/impersonate', [UserManagementController::class, 'impersonate'])->name('users.impersonate');
        Route::post('/users/stop-impersonation', [UserManagementController::class, 'stopImpersonation'])->name('users.stop-impersonation');
        Route::post('/users/bulk', [UserManagementController::class, 'bulk'])->name('users.bulk');
    });

    Route::middleware(['auth', 'role.super_admin'])->group(function () {
        Route::get('/super-crud', [SuperAdminCrudController::class, 'index'])->name('super-crud.index');
        Route::get('/super-crud/{resource}', [SuperAdminCrudController::class, 'show'])->name('super-crud.show');
        Route::post('/super-crud/{resource}', [SuperAdminCrudController::class, 'store'])->name('super-crud.store');
        Route::put('/super-crud/{resource}/{id}', [SuperAdminCrudController::class, 'update'])->name('super-crud.update');
        Route::delete('/super-crud/{resource}/{id}', [SuperAdminCrudController::class, 'destroy'])->name('super-crud.destroy');
    });
});

Route::get('dashboard', [\App\Http\Controllers\Client\DashboardController::class, 'index'])
    ->middleware(['auth', 'verified', 'role.client'])
    ->name('dashboard');

// Artist routes
Route::middleware(['auth', 'role.artist'])->prefix('artist')->name('artist.')->group(function () {
    Route::get('/dashboard', [ArtistDashboardController::class, 'index'])->name('dashboard');

    // Services management
    Route::get('/services', [\App\Http\Controllers\Artist\ServiceController::class, 'index'])->name('services.index');
    Route::post('/services', [\App\Http\Controllers\Artist\ServiceController::class, 'store'])->name('services.store');
    Route::put('/services/{service}', [\App\Http\Controllers\Artist\ServiceController::class, 'update'])->name('services.update');
    Route::delete('/services/{service}', [\App\Http\Controllers\Artist\ServiceController::class, 'destroy'])->name('services.destroy');
    Route::patch('/services/{service}/toggle', [\App\Http\Controllers\Artist\ServiceController::class, 'toggle'])->name('services.toggle');
    Route::post('/services/reorder', [\App\Http\Controllers\Artist\ServiceController::class, 'reorder'])->name('services.reorder');

    // Orders management
    Route::get('/orders', [\App\Http\Controllers\Artist\OrderController::class, 'index'])->name('orders.index');
    Route::get('/orders/{reservation}', [\App\Http\Controllers\Artist\OrderController::class, 'show'])->name('orders.show');
    Route::post('/orders/{reservation}/accept', [\App\Http\Controllers\Artist\OrderController::class, 'accept'])->name('orders.accept');
    Route::post('/orders/{reservation}/decline', [\App\Http\Controllers\Artist\OrderController::class, 'decline'])->name('orders.decline');
    Route::post('/orders/{reservation}/checkin', [\App\Http\Controllers\Artist\OrderController::class, 'checkIn'])->name('orders.checkin');
    Route::post('/orders/{reservation}/checkout', [\App\Http\Controllers\Artist\OrderController::class, 'checkOut'])->name('orders.checkout');

    // Availability/Calendar
    Route::get('/availability', [\App\Http\Controllers\Artist\AvailabilityController::class, 'index'])->name('availability.index');
    Route::post('/availability', [\App\Http\Controllers\Artist\AvailabilityController::class, 'store'])->name('availability.store');
    Route::post('/availability/block', [\App\Http\Controllers\Artist\AvailabilityController::class, 'block'])->name('availability.block');
    Route::delete('/availability/{availability}', [\App\Http\Controllers\Artist\AvailabilityController::class, 'destroy'])->name('availability.destroy');

    // Profile management
    Route::get('/profile', [\App\Http\Controllers\Artist\ProfileController::class, 'show'])->name('profile.show');
    Route::put('/profile', [\App\Http\Controllers\Artist\ProfileController::class, 'update'])->name('profile.update');
    Route::post('/profile/avatar', [\App\Http\Controllers\Artist\ProfileController::class, 'uploadAvatar'])->name('profile.avatar');
    Route::post('/profile/media', [\App\Http\Controllers\Artist\ProfileController::class, 'uploadMedia'])->name('profile.media');
    Route::delete('/profile/media/{media}', [\App\Http\Controllers\Artist\ProfileController::class, 'deleteMedia'])->name('profile.media.delete');

    // Wallet management
    Route::get('/wallet', [\App\Http\Controllers\Artist\WalletController::class, 'index'])->name('wallet.index');
    Route::get('/wallet/transactions', [\App\Http\Controllers\Artist\WalletController::class, 'transactions'])->name('wallet.transactions');
    Route::get('/wallet/export', [\App\Http\Controllers\Artist\WalletController::class, 'exportCsv'])->name('wallet.export');
    Route::post('/wallet/withdraw', [\App\Http\Controllers\Artist\WalletController::class, 'withdraw'])->name('wallet.withdraw');
    Route::get('/wallet/withdrawals/{withdrawal}', [\App\Http\Controllers\Artist\WalletController::class, 'withdrawalStatus'])->name('wallet.withdrawal.show');

    // Subscription management
    Route::get('/subscription', [\App\Http\Controllers\Artist\SubscriptionController::class, 'index'])->name('subscription.index');
    Route::post('/subscription/checkout', [\App\Http\Controllers\Artist\SubscriptionController::class, 'checkout'])->name('subscription.checkout');
    Route::post('/subscription/cancel', [\App\Http\Controllers\Artist\SubscriptionController::class, 'cancel'])->name('subscription.cancel');
    Route::post('/subscription/resume', [\App\Http\Controllers\Artist\SubscriptionController::class, 'resume'])->name('subscription.resume');

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
    Route::get('/library', [\App\Http\Controllers\LibraryController::class, 'index'])->name('library.index');
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
    Route::post('/booking/checkout', [\App\Http\Controllers\BookingController::class, 'checkout'])->name('booking.checkout');
    Route::get('/booking/payment', [\App\Http\Controllers\BookingController::class, 'payment'])->name('booking.payment');
    Route::post('/booking/store', [\App\Http\Controllers\BookingController::class, 'store'])->name('booking.store');
    Route::get('/booking/confirmation/{id}', [\App\Http\Controllers\BookingController::class, 'confirmation'])->name('booking.confirmation');
    Route::get('/booking/{id}/receipt', [\App\Http\Controllers\BookingController::class, 'downloadReceipt'])->name('booking.receipt');

    // Messaging routes
    Route::get('/messages', [\App\Http\Controllers\ConversationController::class, 'index'])->name('messages.index');
    Route::get('/messages/{conversation}', [\App\Http\Controllers\ConversationController::class, 'show'])->name('messages.show');
    Route::post('/messages/{conversation}', [\App\Http\Controllers\ConversationController::class, 'store'])->name('messages.store');
    Route::get('/reservation/{reservation}/contact', [\App\Http\Controllers\ConversationController::class, 'contact'])->name('reservation.contact');

    // Notifications routes
    Route::get('/notifications', [\App\Http\Controllers\NotificationController::class, 'index'])->name('notifications.index');
    Route::post('/notifications/mark-all-read', [\App\Http\Controllers\NotificationController::class, 'markAllAsRead'])->name('notifications.markAllRead');
    Route::post('/notifications/{id}/mark-read', [\App\Http\Controllers\NotificationController::class, 'markAsRead'])->name('notifications.markRead');
    Route::delete('/notifications/{id}', [\App\Http\Controllers\NotificationController::class, 'destroy'])->name('notifications.destroy');

    // Support routes
    Route::get('/support', [\App\Http\Controllers\SupportController::class, 'index'])->name('support.index');
    Route::get('/support/create', [\App\Http\Controllers\SupportController::class, 'create'])->name('support.create');
    Route::post('/support', [\App\Http\Controllers\SupportController::class, 'store'])->name('support.store');
    Route::get('/support/{ticket}', [\App\Http\Controllers\SupportController::class, 'show'])->name('support.show');
});

Route::get('/artists', [ArtistController::class, 'index'])->name('artists.index');

require __DIR__.'/settings.php';
