<?php

use App\Enums\ReservationStatus;
use App\Models\Service;
use App\Models\User;
use App\Models\Reservation;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Notification;

uses(RefreshDatabase::class);

test('end to end booking flow', function () {
    // Disable CSRF but keep Auth and Sessions
    $this->withoutMiddleware([\Illuminate\Foundation\Http\Middleware\VerifyCsrfToken::class]);
    $this->withoutVite();
    
    // Fake mail and notifications
    Mail::fake();
    Notification::fake();

    // 1. Setup: Artist and Service
    $artist = User::factory()->artist()->create(['is_active' => true]);
    $service = Service::factory()->create([
        'artist_id' => $artist->id,
        'duration_minutes' => 60,
        'price' => 10000
    ]);

    // Clients
    $client1 = User::factory()->client()->create(['is_active' => true]);
    $client2 = User::factory()->client()->create(['is_active' => true]);

    $bookingDate = Carbon::now()->addDay()->format('Y-m-d');
    $bookingTime = '10:00';

    // 2. Client 1 books the artist
    $this->actingAs($client1)
        ->post(route('booking.store'), [
            'service_id' => $service->id,
            'date' => $bookingDate,
            'time' => $bookingTime,
            'emotion_type' => 'joy',
            'total_amount' => 10000,
            'payment_method' => 'card',
        ])
        ->assertRedirect();

    $reservation = Reservation::where('client_id', $client1->id)->first();
    expect($reservation)->not->toBeNull();
    expect($reservation->status)->toEqual(ReservationStatus::Pending);

    // 3. Artist logs in and accepts the reservation
    $this->actingAs($artist)
        ->post(route('artist.orders.accept', ['reservation' => $reservation->id]))
        ->assertRedirect();

    $reservation->refresh();
    expect($reservation->status)->toEqual(ReservationStatus::Confirmed);

    // 4. Client 1 checks status
    $response = $this->actingAs($client1)
        ->get(route('client.reservations.show', ['reservation' => $reservation->id]));
    
    $response->assertOk();

    // 5. Client 2 tries to book the SAME slot
    $response = $this->actingAs($client2)
        ->get(route('booking.calendar', [
            'service' => $service->id,
            'date' => $bookingDate
        ]));
    
    $response->assertOk();
    $availableSlots = $response->viewData('page')['props']['availableSlots'];
    
    $targetSlot = collect($availableSlots)->firstWhere('time', $bookingTime);
    
    // The slot should exist but be marked as available = false
    expect($targetSlot)->not->toBeNull();
    expect($targetSlot['available'])->toBeFalse();
});
