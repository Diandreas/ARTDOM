<?php

use App\Models\ArtistProfile;
use App\Models\User;

it('admin can approve a pending artist without 404', function () {
    $admin = User::factory()->admin()->create();
    $artist = User::factory()->artist()->create(['is_active' => false]);

    ArtistProfile::factory()->create([
        'user_id' => $artist->id,
        'verification_status' => 'pending',
        'is_verified' => false,
    ]);

    $response = $this->actingAs($admin)
        ->post(route('admin.artists.approve', $artist), ['confirm' => true]);

    $response->assertRedirect();

    $artist->refresh();
    $artist->artistProfile->refresh();

    expect($artist->is_active)->toBeTrue()
        ->and($artist->artistProfile->verification_status)->toBe('approved')
        ->and($artist->artistProfile->is_verified)->toBeTrue();
});
