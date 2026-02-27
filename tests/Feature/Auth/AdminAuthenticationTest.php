<?php

use App\Models\User;

test('admin login page can be rendered', function () {
    $response = $this->get(route('admin.login'));

    $response->assertOk();
});

test('non admin users cannot authenticate via admin login', function () {
    $client = User::factory()->create(['role' => 'client']);

    $response = $this->post(route('admin.login.store'), [
        'email' => $client->email,
        'password' => 'password',
    ]);

    $response->assertSessionHasErrors('email');
    $this->assertGuest();
});

test('admin users can authenticate via admin login', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->post(route('admin.login.store'), [
        'email' => $admin->email,
        'password' => 'password',
    ]);

    $this->assertAuthenticatedAs($admin);
    $response->assertRedirect(route('admin.dashboard', absolute: false));
});

test('super admin users can authenticate via admin login', function () {
    $superAdmin = User::factory()->superAdmin()->create();

    $response = $this->post(route('admin.login.store'), [
        'email' => $superAdmin->email,
        'password' => 'password',
    ]);

    $this->assertAuthenticatedAs($superAdmin);
    $response->assertRedirect(route('admin.dashboard', absolute: false));
});

test('admin dashboard is forbidden for non admin users', function () {
    $client = User::factory()->create(['role' => 'client']);

    $response = $this->actingAs($client)->get(route('admin.dashboard'));

    $response->assertForbidden();
});
