<?php

namespace App\Http\Controllers\Artist;

use App\Http\Controllers\Controller;
use App\Http\Requests\Artist\StoreAlbumRequest;
use App\Models\Album;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class AlbumUploadController extends Controller
{
    /**
     * Display the album upload interface.
     */
    public function index(): Response
    {
        $artist = Auth::user();

        $albums = Album::where('artist_id', $artist->id)
            ->withCount('tracks')
            ->latest('created_at')
            ->get()
            ->map(function ($album) {
                return [
                    'id' => $album->id,
                    'title' => $album->title,
                    'year' => $album->year,
                    'genre' => $album->genre,
                    'cover_url' => $album->cover_url,
                    'price' => $album->price,
                    'is_streamable' => $album->is_streamable,
                    'is_purchasable' => $album->is_purchasable,
                    'total_plays' => $album->total_plays,
                    'tracks_count' => $album->tracks_count,
                    'published_at' => $album->published_at,
                    'created_at' => $album->created_at->format('d/m/Y'),
                ];
            });

        return Inertia::render('Artist/upload-albums', [
            'albums' => $albums,
        ]);
    }

    /**
     * Store a new album.
     */
    public function store(StoreAlbumRequest $request): RedirectResponse
    {
        $artist = Auth::user();

        // Upload cover image
        $coverPath = $request->file('cover')->store('albums/covers', 'public');

        // Create album
        $album = Album::create([
            'artist_id' => $artist->id,
            'title' => $request->title,
            'year' => $request->year,
            'genre' => $request->genre,
            'cover_url' => Storage::url($coverPath),
            'price' => $request->price ?? 0,
            'is_streamable' => $request->is_free ?? false,
            'is_purchasable' => ! ($request->is_free ?? false),
            'published_at' => now(),
        ]);

        return redirect()
            ->route('artist.albums.index')
            ->with('success', "L'album \"{$album->title}\" a été créé avec succès !");
    }

    /**
     * Delete an album.
     */
    public function destroy(Album $album): RedirectResponse
    {
        $artist = Auth::user();

        // Ensure the artist owns this album
        if ($album->artist_id !== $artist->id) {
            abort(403, 'Vous n\'êtes pas autorisé à supprimer cet album.');
        }

        // Delete cover image from storage
        if ($album->cover_url) {
            $coverPath = str_replace('/storage/', '', $album->cover_url);
            Storage::disk('public')->delete($coverPath);
        }

        // Delete album and related tracks (cascade)
        $title = $album->title;
        $album->delete();

        return redirect()
            ->route('artist.albums.index')
            ->with('success', "L'album \"{$title}\" a été supprimé avec succès.");
    }

    /**
     * Toggle album publication status.
     */
    public function togglePublication(Album $album): RedirectResponse
    {
        $artist = Auth::user();

        if ($album->artist_id !== $artist->id) {
            abort(403);
        }

        $album->update([
            'published_at' => $album->published_at ? null : now(),
        ]);

        $status = $album->published_at ? 'publié' : 'dépublié';

        return redirect()
            ->back()
            ->with('success', "L'album a été {$status} avec succès.");
    }
}
