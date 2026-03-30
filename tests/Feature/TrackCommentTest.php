<?php

use App\Models\Album;
use App\Models\Track;
use App\Models\TrackComment;
use App\Models\User;

test('authenticated user can add a comment to a track', function () {
    $listener = User::factory()->client()->create();
    $artist = User::factory()->artist()->create();
    $artist->artistProfile()->create([
        'stage_name' => 'Artiste Test',
        'bio' => 'Bio test',
        'categories' => ['singer'],
    ]);

    $album = Album::factory()->create([
        'artist_id' => $artist->id,
    ]);

    $track = Track::factory()->create([
        'album_id' => $album->id,
        'file_url' => 'https://example.com/audio.mp3',
    ]);

    $response = $this->actingAs($listener)->from(route('artstream.album', $album))->post(route('tracks.comments.store', $track), [
        'content' => 'Super morceau, bravo.',
    ]);

    $response->assertRedirect(route('artstream.album', $album));
    $response->assertSessionHas('toast');

    $this->assertDatabaseHas('track_comments', [
        'track_id' => $track->id,
        'user_id' => $listener->id,
        'content' => 'Super morceau, bravo.',
    ]);
});

test('album page includes existing comments for each track', function () {
    $listener = User::factory()->client()->create();
    $artist = User::factory()->artist()->create([
        'name' => 'Artiste Principal',
    ]);
    $artist->artistProfile()->create([
        'stage_name' => 'Scene Name',
        'bio' => 'Bio test',
        'categories' => ['singer'],
    ]);

    $album = Album::factory()->create([
        'artist_id' => $artist->id,
    ]);

    $track = Track::factory()->create([
        'album_id' => $album->id,
        'title' => 'Titre Commentable',
        'file_url' => 'https://example.com/audio.mp3',
    ]);

    $comment = TrackComment::create([
        'track_id' => $track->id,
        'user_id' => $listener->id,
        'content' => 'Premier commentaire visible',
    ]);

    TrackComment::create([
        'track_id' => $track->id,
        'user_id' => $artist->id,
        'parent_id' => $comment->id,
        'content' => 'Merci pour ton retour',
    ]);

    $response = $this->get(route('artstream.album', $album));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('ArtStream/album-view')
        ->where('tracks.0.id', $track->id)
        ->where('tracks.0.comments.0.content', 'Premier commentaire visible')
        ->where('tracks.0.comments.0.replies.0.content', 'Merci pour ton retour')
    );
});
