<?php

use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    $this->artist = User::factory()->artist()->create([
        'name' => 'John Doe',
        'phone' => '+2250123456789',
        'city' => 'Abidjan',
    ]);

    $this->client = User::factory()->client()->create();
});

test('artist can view their profile edit page', function () {
    $response = $this->actingAs($this->artist)->get(route('artist.profile.show'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('Artist/Profile/Edit')
        ->has('user')
        ->has('profile')
        ->has('availableCategories')
    );
});

test('client cannot access artist profile edit page', function () {
    $response = $this->actingAs($this->client)->get(route('artist.profile.show'));

    $response->assertRedirect(route('dashboard'));
});

test('guest cannot access artist profile edit page', function () {
    $response = $this->get(route('artist.profile.show'));

    $response->assertRedirect(route('login'));
});

test('artist can update their profile', function () {
    $response = $this->actingAs($this->artist)->put(route('artist.profile.update'), [
        'name' => 'Jane Doe',
        'stage_name' => 'DJ Jane',
        'bio' => 'Nouvelle bio artistique',
        'categories' => ['Musicien', 'DJ'],
        'phone' => '+2250987654321',
        'city' => 'Yamoussoukro',
        'base_rate' => 50000,
        'social_links' => [
            'facebook' => 'https://facebook.com/djjane',
            'instagram' => 'https://instagram.com/djjane',
        ],
    ]);

    $response->assertRedirect();
    $response->assertSessionHas('toast');

    // Check user data updated
    $this->artist->refresh();
    expect($this->artist->name)->toBe('Jane Doe');
    expect($this->artist->phone)->toBe('+2250987654321');
    expect($this->artist->city)->toBe('Yamoussoukro');

    // Check profile data updated
    $this->artist->artistProfile->refresh();
    expect($this->artist->artistProfile->stage_name)->toBe('DJ Jane');
    expect($this->artist->artistProfile->bio)->toBe('Nouvelle bio artistique');
    expect($this->artist->artistProfile->categories)->toBe(['Musicien', 'DJ']);
    expect((float) $this->artist->artistProfile->base_rate)->toBe(50000.0);
    expect($this->artist->artistProfile->social_links)->toMatchArray([
        'facebook' => 'https://facebook.com/djjane',
        'instagram' => 'https://instagram.com/djjane',
    ]);
});

test('artist profile update validates required fields', function () {
    $response = $this->actingAs($this->artist)->put(route('artist.profile.update'), [
        'name' => '',
        'stage_name' => '',
    ]);

    $response->assertSessionHasErrors(['name', 'stage_name']);
});

test('artist profile update validates bio max length', function () {
    $response = $this->actingAs($this->artist)->put(route('artist.profile.update'), [
        'name' => 'John Doe',
        'stage_name' => 'DJ John',
        'bio' => str_repeat('a', 1001),
    ]);

    $response->assertSessionHasErrors('bio');
});

test('artist profile update validates social links are valid urls', function () {
    $response = $this->actingAs($this->artist)->put(route('artist.profile.update'), [
        'name' => 'John Doe',
        'stage_name' => 'DJ John',
        'social_links' => [
            'facebook' => 'not-a-url',
            'instagram' => 'also-not-a-url',
        ],
    ]);

    $response->assertSessionHasErrors(['social_links.facebook', 'social_links.instagram']);
});

test('artist profile update validates base rate is numeric', function () {
    $response = $this->actingAs($this->artist)->put(route('artist.profile.update'), [
        'name' => 'John Doe',
        'stage_name' => 'DJ John',
        'base_rate' => 'not-a-number',
    ]);

    $response->assertSessionHasErrors('base_rate');
});

test('artist can upload media to portfolio', function () {
    Storage::fake('public');

    $file = UploadedFile::fake()->image('portfolio.jpg', 1000, 1000);

    $response = $this->actingAs($this->artist)->post(route('artist.profile.media.upload'), [
        'media' => $file,
        'type' => 'photo',
    ]);

    $response->assertRedirect();
    $response->assertSessionHas('message');

    // Check file was stored
    Storage::disk('public')->assertExists('artists/'.$this->artist->id.'/portfolio/'.$file->hashName());

    // Check URL added to portfolio
    $this->artist->artistProfile->refresh();
    expect($this->artist->artistProfile->portfolio_urls)->toHaveCount(1);
});

test('artist can upload video to portfolio', function () {
    Storage::fake('public');

    $file = UploadedFile::fake()->create('video.mp4', 5000, 'video/mp4');

    $response = $this->actingAs($this->artist)->post(route('artist.profile.media.upload'), [
        'media' => $file,
        'type' => 'video',
    ]);

    $response->assertRedirect();
    $response->assertSessionHas('message');

    Storage::disk('public')->assertExists('artists/'.$this->artist->id.'/portfolio/'.$file->hashName());
});

test('portfolio upload validates file type', function () {
    Storage::fake('public');

    $file = UploadedFile::fake()->create('document.pdf', 100, 'application/pdf');

    $response = $this->actingAs($this->artist)->post(route('artist.profile.media.upload'), [
        'media' => $file,
        'type' => 'photo',
    ]);

    $response->assertSessionHasErrors('media');
});

test('portfolio upload validates file size', function () {
    Storage::fake('public');

    // Create file larger than 10MB
    $file = UploadedFile::fake()->create('large.jpg', 11000, 'image/jpeg');

    $response = $this->actingAs($this->artist)->post(route('artist.profile.media.upload'), [
        'media' => $file,
        'type' => 'photo',
    ]);

    $response->assertSessionHasErrors('media');
});

test('artist can delete media from portfolio', function () {
    Storage::fake('public');

    // Setup: add media to portfolio
    $file = UploadedFile::fake()->image('portfolio.jpg');
    $path = $file->store('artists/'.$this->artist->id.'/portfolio', 'public');
    $url = Storage::url($path);

    $this->artist->artistProfile->update([
        'portfolio_urls' => [$url],
    ]);

    // Delete media
    $mediaId = urlencode($url);
    $response = $this->actingAs($this->artist)->delete(route('artist.profile.media.delete', ['media' => $mediaId]));

    $response->assertRedirect();
    $response->assertSessionHas('message');

    // Check file removed from storage
    Storage::disk('public')->assertMissing($path);

    // Check URL removed from portfolio
    $this->artist->artistProfile->refresh();
    expect($this->artist->artistProfile->portfolio_urls)->toHaveCount(0);
});

test('client cannot update artist profile', function () {
    $response = $this->actingAs($this->client)->put(route('artist.profile.update'), [
        'name' => 'Hacker',
        'stage_name' => 'Hacked',
    ]);

    $response->assertRedirect(route('dashboard'));
});

test('client cannot upload media to artist portfolio', function () {
    Storage::fake('public');

    $file = UploadedFile::fake()->image('hack.jpg');

    $response = $this->actingAs($this->client)->post(route('artist.profile.media.upload'), [
        'media' => $file,
        'type' => 'photo',
    ]);

    $response->assertRedirect(route('dashboard'));
});
