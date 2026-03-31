<?php

use Illuminate\Support\Facades\Schema;

test('homepage loads when the carousel slides table is missing', function () {
    Schema::dropIfExists('carousel_slides');

    $response = $this->get(route('home'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('home')
        ->where('carouselSlides', []));
});
