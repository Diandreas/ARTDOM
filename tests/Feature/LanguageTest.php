<?php

test('language can be updated from a public page', function () {
    $response = $this
        ->from(route('home'))
        ->put(route('language.update'), [
            'locale' => 'en',
        ]);

    $response
        ->assertRedirect(route('home'))
        ->assertSessionHas('locale', 'en')
        ->assertCookie('locale', 'en');
});

test('shared inertia locale follows the session locale', function () {
    $response = $this
        ->withSession(['locale' => 'en'])
        ->get(route('login'));

    $response
        ->assertOk()
        ->assertInertia(fn ($page) => $page->where('locale', 'en'));
});

test('public pages share the active locale with inertia', function () {
    $response = $this
        ->withSession(['locale' => 'en'])
        ->get(route('home'));

    $response
        ->assertOk()
        ->assertInertia(fn ($page) => $page->where('locale', 'en'));
});
