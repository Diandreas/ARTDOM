<?php

namespace App\Http\Controllers\Stream;

use App\Http\Controllers\Controller;
use App\Models\Playlist;
use App\Models\Track;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class PlaylistController extends Controller
{
    /**
     * Crée une nouvelle playlist
     * 
     * Route: POST /playlists
     * Middleware: auth, role:client
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'cover_url' => ['nullable', 'string', 'url'],
            'is_public' => ['boolean'],
        ]);

        $client = Auth::user();

        $playlist = $client->clientProfile->playlists()->create($validated);

        return redirect()->route('library.playlists')->with('message', 'Playlist créée.');
    }

    /**
     * Met à jour une playlist
     * 
     * Route: PUT /playlists/{playlist}
     * Middleware: auth, role:client
     */
    public function update(Request $request, Playlist $playlist): RedirectResponse
    {
        if ($playlist->client_id !== Auth::id()) {
            abort(403);
        }

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'cover_url' => ['nullable', 'string', 'url'],
            'is_public' => ['boolean'],
        ]);

        $playlist->update($validated);

        return back()->with('message', 'Playlist mise à jour.');
    }

    /**
     * Supprime une playlist
     * 
     * Route: DELETE /playlists/{playlist}
     * Middleware: auth, role:client
     */
    public function destroy(Playlist $playlist): RedirectResponse
    {
        if ($playlist->client_id !== Auth::id()) {
            abort(403);
        }

        $playlist->delete();

        return redirect()->route('library.playlists')->with('message', 'Playlist supprimée.');
    }

    /**
     * Ajoute une piste à une playlist
     * 
     * Route: POST /playlists/{playlist}/tracks
     * Middleware: auth, role:client
     */
    public function addTrack(Request $request, Playlist $playlist): RedirectResponse
    {
        if ($playlist->client_id !== Auth::id()) {
            abort(403);
        }

        $validated = $request->validate([
            'track_id' => ['required', 'exists:tracks,id'],
        ]);

        // Vérifier si la piste n'est pas déjà dans la playlist
        if ($playlist->tracks()->where('tracks.id', $validated['track_id'])->exists()) {
            return back()->withErrors(['message' => 'Cette piste est déjà dans la playlist.']);
        }

        // Déterminer l'ordre (dernier + 1)
        $maxOrder = $playlist->tracks()->max('playlist_track.order') ?? 0;

        $playlist->tracks()->attach($validated['track_id'], ['order' => $maxOrder + 1]);

        return back()->with('message', 'Piste ajoutée à la playlist.');
    }

    /**
     * Retire une piste d'une playlist
     * 
     * Route: DELETE /playlists/{playlist}/tracks/{track}
     * Middleware: auth, role:client
     */
    public function removeTrack(Playlist $playlist, Track $track): RedirectResponse
    {
        if ($playlist->client_id !== Auth::id()) {
            abort(403);
        }

        $playlist->tracks()->detach($track->id);

        return back()->with('message', 'Piste retirée de la playlist.');
    }

    /**
     * Réorganise l'ordre des pistes dans une playlist
     * 
     * Route: POST /playlists/{playlist}/tracks/reorder
     * Middleware: auth, role:client
     */
    public function reorder(Request $request, Playlist $playlist): RedirectResponse
    {
        if ($playlist->client_id !== Auth::id()) {
            abort(403);
        }

        $request->validate([
            'tracks' => ['required', 'array'],
            'tracks.*' => ['required', 'exists:tracks,id'],
        ]);

        foreach ($request->tracks as $index => $trackId) {
            $playlist->tracks()->updateExistingPivot($trackId, ['order' => $index + 1]);
        }

        return back()->with('message', 'Ordre des pistes mis à jour.');
    }
}
