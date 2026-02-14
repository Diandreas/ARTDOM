<?php

namespace App\Http\Controllers\Artist;

use App\Http\Controllers\Controller;
use App\Models\Album;
use App\Models\Track;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class AlbumController extends Controller
{
    /**
     * Affiche la liste des albums de l'artiste
     * 
     * Route: GET /artist/albums
     * Middleware: auth, role:artist
     */
    public function index(): Response
    {
        $artist = Auth::user();

        $albums = Album::where('artist_id', $artist->id)
            ->with('tracks')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Artist/Albums', [
            'albums' => $albums,
        ]);
    }

    /**
     * Crée un nouvel album avec ses pistes
     * 
     * Route: POST /artist/albums
     * Middleware: auth, role:artist
     * 
     * Logique:
     * 1. Crée l'album
     * 2. Upload la cover
     * 3. Crée les pistes (tracks) avec upload des fichiers audio
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'year' => ['required', 'integer', 'min:1900', 'max:'.(now()->year + 1)],
            'genre' => ['required', 'string', 'max:255'],
            'cover' => ['nullable', 'image', 'max:2048'], // 2MB max
            'price' => ['nullable', 'numeric', 'min:0'],
            'is_streamable' => ['boolean'],
            'is_purchasable' => ['boolean'],
            'tracks' => ['required', 'array', 'min:1'],
            'tracks.*.title' => ['required', 'string', 'max:255'],
            'tracks.*.file' => ['required', 'file', 'mimes:mp3,wav', 'max:51200'], // 50MB max
            'tracks.*.lyrics' => ['nullable', 'string'],
        ]);

        $artist = Auth::user();

        // Upload de la cover
        $coverUrl = null;
        if ($request->hasFile('cover')) {
            $coverPath = $request->file('cover')->store('artists/'.$artist->id.'/albums/covers', 'public');
            $coverUrl = Storage::url($coverPath);
        }

        // Créer l'album
        $album = Album::create([
            'artist_id' => $artist->id,
            'title' => $validated['title'],
            'year' => $validated['year'],
            'genre' => $validated['genre'],
            'cover_url' => $coverUrl,
            'price' => $validated['price'] ?? 0,
            'is_streamable' => $validated['is_streamable'] ?? true,
            'is_purchasable' => $validated['is_purchasable'] ?? false,
        ]);

        // Créer les pistes
        foreach ($validated['tracks'] as $index => $trackData) {
            $trackFile = $request->file('tracks.'.$index.'.file');
            $trackPath = $trackFile->store('artists/'.$artist->id.'/albums/'.$album->id.'/tracks', 'public');
            $trackUrl = Storage::url($trackPath);

            // TODO: Extraire la durée du fichier audio
            $durationSeconds = 0; // À implémenter avec une bibliothèque audio

            Track::create([
                'album_id' => $album->id,
                'title' => $trackData['title'],
                'duration_seconds' => $durationSeconds,
                'file_url' => $trackUrl,
                'lyrics' => $trackData['lyrics'] ?? null,
                'track_number' => $index + 1,
            ]);
        }

        return redirect()->route('artist.albums.index')->with('message', 'Album créé avec succès.');
    }

    /**
     * Met à jour un album
     * 
     * Route: PUT /artist/albums/{album}
     */
    public function update(Request $request, Album $album): RedirectResponse
    {
        if ($album->artist_id !== Auth::id()) {
            abort(403);
        }

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'year' => ['required', 'integer'],
            'genre' => ['required', 'string'],
            'cover' => ['nullable', 'image', 'max:2048'],
            'price' => ['nullable', 'numeric', 'min:0'],
            'is_streamable' => ['boolean'],
            'is_purchasable' => ['boolean'],
        ]);

        // Upload nouvelle cover si fournie
        if ($request->hasFile('cover')) {
            // Supprimer l'ancienne cover
            if ($album->cover_url) {
                $oldPath = str_replace('/storage/', '', $album->cover_url);
                Storage::disk('public')->delete($oldPath);
            }

            $coverPath = $request->file('cover')->store('artists/'.$album->artist_id.'/albums/covers', 'public');
            $validated['cover_url'] = Storage::url($coverPath);
        }

        $album->update($validated);

        return back()->with('message', 'Album mis à jour.');
    }

    /**
     * Supprime un album
     * 
     * Route: DELETE /artist/albums/{album}
     */
    public function destroy(Album $album): RedirectResponse
    {
        if ($album->artist_id !== Auth::id()) {
            abort(403);
        }

        // Supprimer les fichiers
        // TODO: Supprimer les fichiers audio et la cover

        $album->delete();

        return redirect()->route('artist.albums.index')->with('message', 'Album supprimé.');
    }

    /**
     * Ajoute une piste à un album
     * 
     * Route: POST /artist/albums/{album}/tracks
     */
    public function addTrack(Request $request, Album $album): RedirectResponse
    {
        if ($album->artist_id !== Auth::id()) {
            abort(403);
        }

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'file' => ['required', 'file', 'mimes:mp3,wav', 'max:51200'],
            'lyrics' => ['nullable', 'string'],
        ]);

        $trackFile = $request->file('file');
        $trackPath = $trackFile->store('artists/'.$album->artist_id.'/albums/'.$album->id.'/tracks', 'public');
        $trackUrl = Storage::url($trackPath);

        // Déterminer le numéro de piste
        $trackNumber = $album->tracks()->max('track_number') + 1;

        Track::create([
            'album_id' => $album->id,
            'title' => $validated['title'],
            'duration_seconds' => 0, // TODO: Extraire la durée
            'file_url' => $trackUrl,
            'lyrics' => $validated['lyrics'] ?? null,
            'track_number' => $trackNumber,
        ]);

        return back()->with('message', 'Piste ajoutée à l\'album.');
    }

    /**
     * Supprime une piste d'un album
     * 
     * Route: DELETE /artist/albums/{album}/tracks/{track}
     */
    public function removeTrack(Album $album, Track $track): RedirectResponse
    {
        if ($album->artist_id !== Auth::id() || $track->album_id !== $album->id) {
            abort(403);
        }

        // Supprimer le fichier audio
        $path = str_replace('/storage/', '', $track->file_url);
        Storage::disk('public')->delete($path);

        $track->delete();

        return back()->with('message', 'Piste supprimée.');
    }

    /**
     * Publie un album (le rend visible publiquement)
     * 
     * Route: POST /artist/albums/{album}/publish
     */
    public function publish(Album $album): RedirectResponse
    {
        if ($album->artist_id !== Auth::id()) {
            abort(403);
        }

        // Vérifier qu'il y a au moins une piste
        if ($album->tracks->isEmpty()) {
            return back()->withErrors(['message' => 'Un album doit contenir au moins une piste pour être publié.']);
        }

        $album->update(['published_at' => now()]);

        return back()->with('message', 'Album publié avec succès.');
    }
}
