<?php

use App\Enums\ArtistLevel;
use App\Enums\ReservationStatus;
use App\Enums\UserRole;
use App\Models\ArtistProfile;
use App\Models\Reservation;
use App\Models\User;
use Illuminate\Support\Facades\Artisan;

test('artist level is updated automatically based on performance', function () {
    // Create an artist with some completed reservations and good rating
    $user = User::factory()->create(['role' => UserRole::Artist]);
    $profile = ArtistProfile::factory()->create([
        'user_id' => $user->id,
        'level' => ArtistLevel::Talent,
        'rating' => 4.2,
        'is_level_manual' => false,
    ]);

    // Create 6 completed reservations
    Reservation::factory()->count(6)->create([
        'artist_id' => $user->id,
        'status' => ReservationStatus::Completed,
    ]);

    // Run the command
    Artisan::call('app:update-artist-levels');

    // Check if level was updated to RisingStar
    expect($profile->refresh()->level)->toBe(ArtistLevel::RisingStar);
});

test('manual artist level is not updated by the command', function () {
    $user = User::factory()->create(['role' => UserRole::Artist]);
    $profile = ArtistProfile::factory()->create([
        'user_id' => $user->id,
        'level' => ArtistLevel::EmergingStar,
        'is_level_manual' => true,
    ]);

    // Artist has 0 reservations, should be Talent if auto
    Artisan::call('app:update-artist-levels');

    // Should stay EmergingStar because it's manual
    expect($profile->refresh()->level)->toBe(ArtistLevel::EmergingStar);
});
