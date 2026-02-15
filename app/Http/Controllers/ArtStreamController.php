<?php

namespace App\Http\Controllers;

use App\Models\Album;
use App\Models\Track;
use Inertia\Inertia;
use Inertia\Response;

class ArtStreamController extends Controller
{
    public function index(): Response
    {
        // Fetch featured/trending albums
        $featuredAlbums = Album::with(['artist.artistProfile', 'tracks'])
            ->where('is_streamable', true)
            ->withCount('tracks')
            ->orderByDesc('total_plays')
            ->limit(12)
            ->get()
            ->map(function ($album) {
                return [
                    'id' => $album->id,
                    'title' => $album->title,
                    'cover_url' => $album->cover_url,
                    'genre' => $album->genre,
                    'year' => $album->year,
                    'price' => $album->price,
                    'total_plays' => $album->total_plays,
                    'tracks_count' => $album->tracks_count,
                    'artist' => [
                        'id' => $album->artist->id,
                        'name' => $album->artist->name,
                        'stage_name' => $album->artist->artistProfile->stage_name ?? $album->artist->name,
                        'profile_photo' => $album->artist->profile_photo,
                    ],
                ];
            });

        // Fetch recent albums
        $recentAlbums = Album::with(['artist.artistProfile'])
            ->where('is_streamable', true)
            ->latest('published_at')
            ->limit(12)
            ->get()
            ->map(function ($album) {
                return [
                    'id' => $album->id,
                    'title' => $album->title,
                    'cover_url' => $album->cover_url,
                    'genre' => $album->genre,
                    'year' => $album->year,
                    'artist' => [
                        'id' => $album->artist->id,
                        'stage_name' => $album->artist->artistProfile->stage_name ?? $album->artist->name,
                    ],
                ];
            });

        // Fetch top tracks (most played)
        $topTracks = Track::with(['album.artist.artistProfile'])
            ->orderByDesc('plays')
            ->limit(20)
            ->get()
            ->map(function ($track) {
                return [
                    'id' => $track->id,
                    'title' => $track->title,
                    'duration_seconds' => $track->duration_seconds,
                    'plays' => $track->plays,
                    'file_url' => $track->file_url,
                    'album' => [
                        'id' => $track->album->id,
                        'title' => $track->album->title,
                        'cover_url' => $track->album->cover_url,
                        'artist' => [
                            'id' => $track->album->artist->id,
                            'stage_name' => $track->album->artist->artistProfile->stage_name ?? $track->album->artist->name,
                        ],
                    ],
                ];
            });

        // Genres available
        $genres = [
            'afrobeat',
            'coupé-décalé',
            'makossa',
            'rumba',
            'highlife',
            'gospel',
            'hip-hop',
            'r&b',
            'jazz',
        ];

        return Inertia::render('ArtStream/music-hub', [
            'featuredAlbums' => $featuredAlbums,
            'recentAlbums' => $recentAlbums,
            'topTracks' => $topTracks,
            'genres' => $genres,
        ]);
    }

    public function album(Album $album): Response
    {
        $album->load(['artist.artistProfile', 'tracks']);

        // Check if user has purchased this album (if authenticated)
        $isPurchased = false;
        $isInLibrary = false;
        if (auth()->check()) {
            // TODO: Check purchase status
            // $isPurchased = auth()->user()->purchasedAlbums()->where('album_id', $album->id)->exists();
            // $isInLibrary = auth()->user()->libraryAlbums()->where('album_id', $album->id)->exists();
        }

        return Inertia::render('ArtStream/album-view', [
            'album' => [
                'id' => $album->id,
                'title' => $album->title,
                'cover_url' => $album->cover_url,
                'genre' => $album->genre,
                'year' => $album->year,
                'price' => $album->price,
                'total_plays' => $album->total_plays,
                'artist' => [
                    'id' => $album->artist->id,
                    'name' => $album->artist->name,
                    'stage_name' => $album->artist->artistProfile->stage_name ?? $album->artist->name,
                    'profile_photo' => $album->artist->profile_photo,
                ],
            ],
            'tracks' => $album->tracks->map(function ($track) {
                return [
                    'id' => $track->id,
                    'title' => $track->title,
                    'duration_seconds' => $track->duration_seconds,
                    'plays' => $track->plays,
                    'file_url' => $track->file_url,
                    'track_number' => $track->track_number,
                ];
            }),
            'isPurchased' => $isPurchased,
            'isInLibrary' => $isInLibrary,
        ]);
    }
}
