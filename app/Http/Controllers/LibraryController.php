<?php

namespace App\Http\Controllers;

use App\Models\AlbumPurchase;
use App\Models\Playlist;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LibraryController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        // Get user's playlists
        $playlists = $user->playlists()
            ->withCount('tracks')
            ->latest()
            ->get()
            ->map(function ($playlist) {
                return [
                    'id' => $playlist->id,
                    'title' => $playlist->title,
                    'cover_url' => $playlist->cover_url,
                    'is_public' => $playlist->is_public,
                    'tracks_count' => $playlist->tracks_count,
                    'created_at' => $playlist->created_at->format('d M Y'),
                ];
            });

        // Get user's purchased albums
        $albums = AlbumPurchase::with(['album.artist.artistProfile'])
            ->where('client_id', $user->id)
            ->latest()
            ->get()
            ->map(function ($purchase) {
                return [
                    'id' => $purchase->album->id,
                    'title' => $purchase->album->title,
                    'cover_url' => $purchase->album->cover_url,
                    'artist' => [
                        'id' => $purchase->album->artist->id,
                        'stage_name' => $purchase->album->artist->artistProfile->stage_name ?? $purchase->album->artist->name,
                    ],
                ];
            });

        return Inertia::render('ArtStream/library', [
            'playlists' => $playlists,
            'albums' => $albums,
        ]);
    }
}
