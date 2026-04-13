<?php

use App\Models\Album;
use App\Models\Track;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->admin = User::factory()->superAdmin()->create(['is_active' => true]);
    $this->artist = User::factory()->artist()->create(['is_active' => true]);
    $this->album = Album::factory()->create(['artist_id' => $this->artist->id]);
});

it('can ban a track', function () {
    $track = Track::factory()->create(['album_id' => $this->album->id]);

    $this->actingAs($this->admin)
        ->withoutMiddleware()
        ->post(route('admin.tracks.ban', ['track' => $track->id]), [
            'reason' => 'Inappropriate content',
        ]);

    $track = Track::withoutGlobalScopes()->find($track->id);
    expect((bool) $track->is_banned)->toBeTrue()
        ->and($track->ban_reason)->toBe('Inappropriate content');
});

it('hides banned tracks by default', function () {
    $track = Track::factory()->create([
        'album_id' => $this->album->id,
        'is_banned' => true
    ]);

    // Default query should not find it
    expect(Track::find($track->id))->toBeNull()
        ->and(Track::withoutGlobalScopes()->find($track->id))->not->toBeNull();
});

it('hides tracks from banned artists', function () {
    $track = Track::factory()->create(['album_id' => $this->album->id]);
    
    // Ban the artist
    User::withoutGlobalScopes()->where('id', $this->artist->id)->update([
        'is_active' => false, 
        'banned_at' => now()
    ]);

    expect(Track::find($track->id))->toBeNull();
});
