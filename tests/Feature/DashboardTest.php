<?php

use App\Models\ArtistProfile;
use App\Models\User;

test('guests are redirected to the login page', function () {
    $response = $this->get(route('dashboard'));
    $response->assertRedirect(route('login'));
});

test('authenticated users can visit the dashboard', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->get(route('dashboard'));
    $response->assertOk();
});

test('client dashboard shares the active locale with inertia', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->withSession(['locale' => 'en'])
        ->get(route('dashboard'));

    $response
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('dashboard')
            ->where('locale', 'en'));
});

test('artist dashboard shares the active locale with inertia', function () {
    $artist = User::factory()->artist()->create();
    ArtistProfile::factory()->create(['user_id' => $artist->id]);

    $response = $this
        ->actingAs($artist)
        ->withSession(['locale' => 'en'])
        ->get(route('artist.dashboard'));

    $response
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Artist/dashboard')
            ->where('locale', 'en'));
});
