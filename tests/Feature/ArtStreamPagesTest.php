<?php

test('artstream pages share the active locale with inertia', function () {
    $response = $this
        ->withSession(['locale' => 'en'])
        ->get(route('artstream.index'));

    $response
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('ArtStream/music-hub')
            ->where('locale', 'en'));
});

test('artstream search page shares the active locale with inertia', function () {
    $response = $this
        ->withSession(['locale' => 'en'])
        ->get(route('artstream.search'));

    $response
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('ArtStream/search')
            ->where('locale', 'en'));
});
