<?php

namespace App\Http\Controllers;

use App\Models\Track;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class FavoriteController extends Controller
{
    public function toggle(Request $request, Track $track): RedirectResponse
    {
        $user = $request->user();

        $isFavorited = $user->favorites()->where('track_id', $track->id)->exists();

        if ($isFavorited) {
            $user->favorites()->detach($track->id);

            return back()->with('toast', [
                'type' => 'success',
                'message' => 'Retiré des favoris',
            ]);
        }

        $user->favorites()->attach($track->id);

        return back()->with('toast', [
            'type' => 'success',
            'message' => 'Ajouté aux favoris',
        ]);
    }

    public function index(Request $request)
    {
        $user = $request->user();

        $favoriteTracks = $user->favorites()
            ->with(['album.artist.artistProfile'])
            ->latest('favorites.created_at')
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

        return inertia('ArtStream/favorites', [
            'tracks' => $favoriteTracks,
        ]);
    }
}
