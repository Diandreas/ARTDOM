<?php

namespace App\Http\Controllers;

use App\Models\Playlist;
use App\Models\Track;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PlaylistController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

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

        return Inertia::render('ArtStream/playlists', [
            'playlists' => $playlists,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'is_public' => 'boolean',
        ]);

        $playlist = $request->user()->playlists()->create([
            'title' => $validated['title'],
            'is_public' => $validated['is_public'] ?? false,
        ]);

        return redirect()->back()->with([
            'success' => 'Playlist créée avec succès',
            'playlist' => [
                'id' => $playlist->id,
                'title' => $playlist->title,
            ],
        ]);
    }

    public function show(Playlist $playlist): Response
    {
        $this->authorize('view', $playlist);

        $playlist->load(['tracks.album.artist.artistProfile']);

        return Inertia::render('ArtStream/playlist-view', [
            'playlist' => [
                'id' => $playlist->id,
                'title' => $playlist->title,
                'cover_url' => $playlist->cover_url,
                'is_public' => $playlist->is_public,
                'tracks_count' => $playlist->tracks->count(),
            ],
            'tracks' => $playlist->tracks->map(function ($track) {
                return [
                    'id' => $track->id,
                    'title' => $track->title,
                    'duration_seconds' => $track->duration_seconds,
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
            }),
        ]);
    }

    public function addTrack(Request $request, Playlist $playlist, Track $track): RedirectResponse
    {
        $this->authorize('update', $playlist);

        // Get the next order number
        $maxOrder = $playlist->tracks()->max('order') ?? 0;

        // Check if track already exists in playlist
        if ($playlist->tracks()->where('track_id', $track->id)->exists()) {
            return redirect()->back()->withErrors([
                'track' => 'Cette piste est déjà dans la playlist',
            ]);
        }

        $playlist->tracks()->attach($track->id, [
            'order' => $maxOrder + 1,
        ]);

        return redirect()->back()->with('toast', [
            'type' => 'success',
            'message' => 'Piste ajoutée à la playlist',
        ]);
    }

    public function removeTrack(Playlist $playlist, Track $track): RedirectResponse
    {
        $this->authorize('update', $playlist);

        $playlist->tracks()->detach($track->id);

        return redirect()->back()->with('toast', [
            'type' => 'success',
            'message' => 'Piste retirée de la playlist',
        ]);
    }

    public function destroy(Playlist $playlist): RedirectResponse
    {
        $this->authorize('delete', $playlist);

        $playlist->delete();

        return redirect()->route('playlists.index')->with('success', 'Playlist supprimée');
    }
}
