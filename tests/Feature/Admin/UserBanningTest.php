<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->admin = User::factory()->superAdmin()->create(['is_active' => true]);
});

it('can ban a user', function () {
    $user = User::factory()->client()->create(['is_active' => true]);

    $response = $this->actingAs($this->admin)
        ->withoutMiddleware()
        ->withoutExceptionHandling()
        ->post(route('admin.users.ban', ['user' => $user->id]), [
            'reason' => 'Violation of terms',
        ]);

    $user = User::withoutGlobalScopes()->find($user->id);
    expect($user->is_active)->toBeFalse()
        ->and($user->banned_at)->not->toBeNull()
        ->and($user->ban_reason)->toBe('Violation of terms');
});

it('hides banned users by default', function () {
    $user = User::factory()->client()->create(['is_active' => false, 'banned_at' => now()]);
    
    // Default query should not find it
    expect(User::find($user->id))->toBeNull()
        // Using withoutGlobalScopes to verify it exists
        ->and(User::withoutGlobalScopes()->find($user->id))->not->toBeNull();
});

it('can unban (activate) a user', function () {
    $user = User::factory()->client()->create([
        'is_active' => false,
        'banned_at' => now(),
        'ban_reason' => 'Old reason'
    ]);

    $this->actingAs($this->admin)
        ->withoutMiddleware()
        ->withoutExceptionHandling()
        ->post(route('admin.users.activate', ['user' => $user->id]));

    $user = User::withoutGlobalScopes()->find($user->id);
    expect($user->is_active)->toBeTrue()
        ->and($user->banned_at)->toBeNull()
        ->and($user->ban_reason)->toBeNull();
});
