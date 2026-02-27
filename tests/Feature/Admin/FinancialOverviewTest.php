<?php

use App\Models\Payment;
use App\Models\Reservation;
use App\Models\Service;
use App\Models\Subscription;
use App\Models\User;
use App\Models\Wallet;
use App\Models\Withdrawal;

it('admin can consult global financial overview page', function () {
    $admin = User::factory()->admin()->create();
    $client = User::factory()->create(['role' => 'client']);
    $artist = User::factory()->create(['role' => 'artist']);

    $service = Service::factory()->create(['artist_id' => $artist->id]);

    $reservation = Reservation::query()->create([
        'reservation_number' => 'RSV-MONEY-001',
        'client_id' => $client->id,
        'artist_id' => $artist->id,
        'service_id' => $service->id,
        'scheduled_at' => now()->addDay(),
        'duration_minutes' => 90,
        'status' => 'confirmed',
        'total_amount' => 50000,
        'commission_rate' => 10,
        'commission_amount' => 5000,
        'artist_earnings' => 45000,
        'location_type' => 'home',
    ]);

    Payment::query()->create([
        'reservation_id' => $reservation->id,
        'client_id' => $client->id,
        'amount' => 50000,
        'currency' => 'XAF',
        'method' => 'mobile_money_orange',
        'provider_ref' => 'PAY-REF-001',
        'status' => 'completed',
        'paid_at' => now(),
    ]);

    Subscription::query()->create([
        'client_id' => $client->id,
        'plan' => 'monthly',
        'price' => 5000,
        'starts_at' => now(),
        'is_active' => true,
    ]);

    $wallet = Wallet::query()->create([
        'artist_id' => $artist->id,
        'balance' => 10000,
        'pending_balance' => 2000,
        'currency' => 'XAF',
    ]);

    Withdrawal::query()->create([
        'wallet_id' => $wallet->id,
        'amount' => 7000,
        'fee' => 200,
        'net_amount' => 6800,
        'method' => 'mobile_money',
        'account_details' => ['phone' => '+2250101010101'],
        'status' => 'completed',
        'requested_at' => now()->subDay(),
        'processed_at' => now(),
    ]);

    $this->actingAs($admin)
        ->get(route('admin.financial-overview.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Admin/FinancialOverview')
            ->has('global')
            ->has('monthlyFlow')
            ->has('topArtists')
        );
});
