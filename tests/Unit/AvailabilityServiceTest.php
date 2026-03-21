<?php

use App\Models\Availability;
use App\Models\Reservation;
use App\Models\Service;
use App\Models\User;
use App\Services\AvailabilityService;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(Tests\TestCase::class, RefreshDatabase::class);

test('getAvailableSlots returns slots within availability and marks busy ones', function () {
    // 1. Setup
    $artist = User::factory()->create(['role' => 'artist']);
    $date = '2026-03-25';

    // Available from 09:00 to 12:00
    Availability::create([
        'artist_id' => $artist->id,
        'date' => $date,
        'start_time' => '09:00',
        'end_time' => '12:00',
        'is_blocked' => false,
    ]);

    // dd(Availability::all()->toArray());

    // Existing reservation at 10:00 for 60 mins
    Reservation::factory()->create([
        'artist_id' => $artist->id,
        'scheduled_at' => Carbon::parse("$date 10:00"),
        'duration_minutes' => 60,
        'status' => 'confirmed',
    ]);

    $service = new AvailabilityService;

    // 2. Test for 60 min service
    // Slots every 30 mins: 09:00, 09:30, 10:00, 10:30, 11:00
    // (Last slot starts at 11:00 to end at 12:00)

    $slots = $service->getAvailableSlots($artist, $date, 60);

    expect($slots)->toHaveCount(5);

    // 09:00 -> 10:00 (OK)
    expect($slots[0])->time->toBe('09:00');
    expect($slots[0])->available->toBeTrue();

    // 09:30 -> 10:30 (Overlap with 10:00-11:00)
    expect($slots[1])->time->toBe('09:30');
    expect($slots[1])->available->toBeFalse();

    // 10:00 -> 11:00 (Overlap with 10:00-11:00)
    expect($slots[2])->time->toBe('10:00');
    expect($slots[2])->available->toBeFalse();

    // 10:30 -> 11:30 (Overlap with 10:00-11:00)
    expect($slots[3])->time->toBe('10:30');
    expect($slots[3])->available->toBeFalse();

    // 11:00 -> 12:00 (OK)
    expect($slots[4])->time->toBe('11:00');
    expect($slots[4])->available->toBeTrue();
});

test('getAvailableSlots handles multiple availability blocks', function () {
    $artist = User::factory()->create(['role' => 'artist']);
    $date = '2026-03-25';

    Availability::create([
        'artist_id' => $artist->id,
        'date' => $date,
        'start_time' => '09:00',
        'end_time' => '10:00',
        'is_blocked' => false,
    ]);

    Availability::create([
        'artist_id' => $artist->id,
        'date' => $date,
        'start_time' => '14:00',
        'end_time' => '15:00',
        'is_blocked' => false,
    ]);

    $service = new AvailabilityService;
    $slots = $service->getAvailableSlots($artist, $date, 30);

    // 09:00, 09:30
    // 14:00, 14:30
    expect($slots)->toHaveCount(4);
    expect($slots[0])->time->toBe('09:00');
    expect($slots[2])->time->toBe('14:00');
});
