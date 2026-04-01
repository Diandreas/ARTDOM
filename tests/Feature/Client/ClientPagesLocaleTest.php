<?php

use App\Models\ArtistProfile;
use App\Models\Reservation;
use App\Models\Service;
use App\Models\User;

beforeEach(function () {
    $this->client = User::factory()->client()->create();
    $this->artist = User::factory()->artist()->create();

    ArtistProfile::factory()->create([
        'user_id' => $this->artist->id,
        'stage_name' => 'Locale Artist',
    ]);

    $this->service = Service::factory()->create([
        'artist_id' => $this->artist->id,
        'title' => 'Performance privee',
        'is_active' => true,
    ]);

    $this->reservation = Reservation::factory()->create([
        'client_id' => $this->client->id,
        'artist_id' => $this->artist->id,
        'service_id' => $this->service->id,
        'status' => 'pending',
        'scheduled_at' => now()->addDays(5),
        'duration_minutes' => 60,
        'total_amount' => 15000,
        'commission_amount' => 1500,
        'location_type' => 'home',
        'location_address' => 'Abidjan',
        'recipient_name' => 'Jean',
        'emotion_type' => 'Joie',
        'custom_message' => 'Bon anniversaire',
    ]);
});

test('client reservations page shares the active locale with inertia', function () {
    $response = $this
        ->actingAs($this->client)
        ->withSession(['locale' => 'en'])
        ->get(route('client.reservations.index'));

    $response
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Client/reservations')
            ->where('locale', 'en'));
});

test('client reservation detail page shares the active locale with inertia', function () {
    $response = $this
        ->actingAs($this->client)
        ->withSession(['locale' => 'en'])
        ->get(route('client.reservations.show', $this->reservation));

    $response
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Client/reservation-detail')
            ->where('locale', 'en'));
});

test('client profile page shares the active locale with inertia', function () {
    $response = $this
        ->actingAs($this->client)
        ->withSession(['locale' => 'en'])
        ->get('/client/profile');

    $response
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Client/Profile/Index')
            ->where('locale', 'en'));
});
