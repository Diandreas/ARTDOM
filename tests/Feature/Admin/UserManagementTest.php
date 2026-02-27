<?php

use App\Models\ClientProfile;
use App\Models\Payment;
use App\Models\Reservation;
use App\Models\Service;
use App\Models\User;
use App\Models\Wallet;
use App\Models\Withdrawal;

it('admin can view users index and user detail pages', function () {
    $admin = User::factory()->admin()->create();
    $user = User::factory()->create();

    ClientProfile::query()->create([
        'user_id' => $user->id,
        'first_name' => 'Jane',
        'last_name' => 'Doe',
    ]);

    $this->actingAs($admin)
        ->get(route('admin.users.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Admin/Users/Index')
            ->has('users.data')
        );

    $this->actingAs($admin)
        ->get(route('admin.users.show', $user))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Admin/Users/Show')
            ->where('user.id', $user->id)
        );
});

it('admin can create a client user from backoffice', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)
        ->post(route('admin.users.store'), [
            'first_name' => 'John',
            'last_name' => 'Smith',
            'email' => 'john.smith@example.com',
            'phone' => '+2250123456789',
            'role' => 'client',
            'status' => 'active',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'mark_email_verified' => true,
        ]);

    $response->assertRedirect();

    $this->assertDatabaseHas('users', [
        'email' => 'john.smith@example.com',
        'role' => 'client',
    ]);

    $createdUser = User::query()->where('email', 'john.smith@example.com')->firstOrFail();

    $this->assertDatabaseHas('client_profiles', [
        'user_id' => $createdUser->id,
        'first_name' => 'John',
        'last_name' => 'Smith',
    ]);
});

it('admin sees client payments and reservations in user detail', function () {
    $admin = User::factory()->admin()->create();
    $client = User::factory()->create(['role' => 'client']);
    $artist = User::factory()->create(['role' => 'artist']);
    $service = Service::factory()->create(['artist_id' => $artist->id]);

    $reservation = Reservation::query()->create([
        'reservation_number' => 'RSV-CLIENT-DETAIL',
        'client_id' => $client->id,
        'artist_id' => $artist->id,
        'service_id' => $service->id,
        'scheduled_at' => now()->addHours(4),
        'duration_minutes' => 60,
        'status' => 'completed',
        'total_amount' => 12000,
        'commission_rate' => 10,
        'commission_amount' => 1200,
        'artist_earnings' => 10800,
        'location_type' => 'home',
    ]);

    Payment::query()->create([
        'reservation_id' => $reservation->id,
        'client_id' => $client->id,
        'amount' => 12000,
        'currency' => 'XAF',
        'method' => 'card_stripe',
        'provider_ref' => 'PAY-CLIENT-001',
        'status' => 'completed',
        'paid_at' => now(),
    ]);

    $this->actingAs($admin)
        ->get(route('admin.users.show', $client))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Admin/Users/Show')
            ->has('clientFinancialDetails.payments')
            ->has('clientFinancialDetails.reservations')
            ->where('user.type', 'client')
        );
});

it('admin sees artist earnings report in artist detail', function () {
    $admin = User::factory()->admin()->create();
    $artist = User::factory()->create(['role' => 'artist']);
    $client = User::factory()->create(['role' => 'client']);
    $service = Service::factory()->create(['artist_id' => $artist->id]);

    Reservation::query()->create([
        'reservation_number' => 'RSV-ARTIST-REPORT',
        'client_id' => $client->id,
        'artist_id' => $artist->id,
        'service_id' => $service->id,
        'scheduled_at' => now()->addHours(8),
        'duration_minutes' => 90,
        'status' => 'completed',
        'total_amount' => 30000,
        'commission_rate' => 10,
        'commission_amount' => 3000,
        'artist_earnings' => 27000,
        'location_type' => 'home',
    ]);

    $wallet = Wallet::query()->create([
        'artist_id' => $artist->id,
        'balance' => 27000,
        'pending_balance' => 0,
        'currency' => 'XAF',
    ]);

    Withdrawal::query()->create([
        'wallet_id' => $wallet->id,
        'amount' => 10000,
        'fee' => 300,
        'net_amount' => 9700,
        'method' => 'mobile_money',
        'account_details' => ['phone' => '+2250102030405'],
        'status' => 'completed',
        'requested_at' => now()->subDay(),
        'processed_at' => now(),
    ]);

    $this->actingAs($admin)
        ->get(route('admin.users.show', $artist))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Admin/Users/Show')
            ->has('artistEarningsReport.summary')
            ->has('artistEarningsReport.reservation_earnings')
            ->where('user.type', 'artist')
        );
});
