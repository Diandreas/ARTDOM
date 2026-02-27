<?php

use App\Models\Cart;
use App\Models\Reservation;
use App\Models\Subscription;
use App\Models\User;

it('admin can consult client activity module', function () {
    $admin = User::factory()->admin()->create();
    $client = User::factory()->create(['role' => 'client']);

    Reservation::query()->create([
        'reservation_number' => 'RSV-TEST-001',
        'client_id' => $client->id,
        'artist_id' => User::factory()->artist()->create()->id,
        'service_id' => \App\Models\Service::factory()->create(['artist_id' => User::factory()->artist()->create()->id])->id,
        'scheduled_at' => now()->addDay(),
        'duration_minutes' => 60,
        'status' => 'pending',
        'total_amount' => 10000,
        'commission_rate' => 10,
        'commission_amount' => 1000,
        'artist_earnings' => 9000,
        'location_type' => 'home',
    ]);

    Cart::query()->create([
        'client_id' => $client->id,
        'discount' => 0,
        'total_amount' => 0,
    ]);

    Subscription::query()->create([
        'client_id' => $client->id,
        'plan' => 'monthly',
        'price' => 2000,
        'starts_at' => now(),
        'is_active' => true,
    ]);

    $response = $this->actingAs($admin)->get(route('admin.client-activity.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('Admin/ClientActivity')
        ->has('reservations.data')
        ->has('carts.data')
        ->has('subscriptions.data')
        ->has('activity')
    );
});
