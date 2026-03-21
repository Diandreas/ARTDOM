<?php

namespace App\Http\Controllers\Artist;

use App\Http\Controllers\Controller;
use App\Http\Requests\Artist\StoreAlbumRequest;
use App\Models\Album;
use App\Models\AlbumPurchase;
use App\Models\Track;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
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
     * Display a single album with its tracks and stats.
     */
    public function show(Album $album): Response
    {
        if ($album->artist_id !== Auth::id()) {
            abort(403);
        }

        $album->load('tracks');

        $purchases = AlbumPurchase::where('album_id', $album->id)->count();
        $revenue = (float) AlbumPurchase::where('album_id', $album->id)->sum('price_paid');
        $revenueThisMonth = (float) AlbumPurchase::where('album_id', $album->id)
            ->where('created_at', '>=', now()->startOfMonth())
            ->sum('price_paid');

        return Inertia::render('Artist/AlbumDetail', [
            'album' => [
                'id' => $album->id,
                'title' => $album->title,
                'year' => $album->year,
                'genre' => $album->genre,
                'cover_url' => $album->cover_url,
                'price' => $album->price,
                'is_streamable' => $album->is_streamable,
                'is_purchasable' => $album->is_purchasable,
                'total_plays' => $album->total_plays,
                'published_at' => $album->published_at,
                'created_at' => $album->created_at->format('d/m/Y'),
                'tracks' => $album->tracks->map(fn ($t) => [
                    'id' => $t->id,
                    'title' => $t->title,
                    'track_number' => $t->track_number,
                    'duration_seconds' => $t->duration_seconds,
                    'plays' => $t->plays,
                    'file_url' => $t->file_url,
                    'lyrics' => $t->lyrics,
                ]),
            ],
            'stats' => [
                'total_plays' => $album->total_plays,
                'purchases' => $purchases,
                'revenue_total' => $revenue,
                'revenue_this_month' => $revenueThisMonth,
            ],
        ]);
    }

    /**
     * Store a new album.
     */
    public function store(StoreAlbumRequest $request): RedirectResponse
    {
        $artist = Auth::user();

        $coverPath = $request->file('cover')->store('albums/covers', 'public');

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
     * Update album metadata and optionally the cover image.
     */
    public function update(Request $request, Album $album): RedirectResponse
    {
        if ($album->artist_id !== Auth::id()) {
            abort(403);
        }

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'year' => ['required', 'integer', 'min:1900', 'max:'.(now()->year + 1)],
            'genre' => ['required', 'string', 'max:255'],
            'cover' => ['nullable', 'image', 'max:2048'],
            'price' => ['nullable', 'numeric', 'min:0'],
            'is_free' => ['boolean'],
        ]);

        if ($request->hasFile('cover')) {
            if ($album->cover_url) {
                $oldPath = str_replace('/storage/', '', parse_url($album->cover_url, PHP_URL_PATH));
                Storage::disk('public')->delete($oldPath);
            }
            $coverPath = $request->file('cover')->store('albums/covers', 'public');
            $validated['cover_url'] = Storage::url($coverPath);
        }

        $isFree = $validated['is_free'] ?? false;

        $album->update([
            'title' => $validated['title'],
            'year' => $validated['year'],
            'genre' => $validated['genre'],
            'cover_url' => $validated['cover_url'] ?? $album->cover_url,
            'price' => $isFree ? 0 : ($validated['price'] ?? $album->price),
            'is_streamable' => $isFree ? true : $album->is_streamable,
            'is_purchasable' => ! $isFree,
        ]);

        return back()->with('success', 'Album mis à jour.');
    }

    /**
     * Delete an album.
     */
    public function destroy(Album $album): RedirectResponse
    {
        $artist = Auth::user();

        if ($album->artist_id !== $artist->id) {
            abort(403, 'Vous n\'êtes pas autorisé à supprimer cet album.');
        }

        if ($album->cover_url) {
            $coverPath = str_replace('/storage/', '', parse_url($album->cover_url, PHP_URL_PATH));
            Storage::disk('public')->delete($coverPath);
        }

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

        return back()->with('success', "L'album a été {$status} avec succès.");
    }

    /**
     * Add a track to an album.
     */
    public function addTrack(Request $request, Album $album): RedirectResponse
    {
        if ($album->artist_id !== Auth::id()) {
            abort(403);
        }

        if (! $request->hasFile('file')) {
            Log::error("Pas de fichier détecté dans la requête addTrack pour l'album {$album->id}.");
        } elseif (! $request->file('file')->isValid()) {
            Log::error("Fichier d'upload invalide pour l'album {$album->id}. Code d'erreur PHP : ".$request->file('file')->getError());
        }

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'file' => ['required', 'file', 'mimes:mp3,wav', 'max:51200'],
            'lyrics' => ['nullable', 'string'],
        ], [
            'file.uploaded' => "Le fichier est trop lourd pour le serveur. Vérifiez les limites 'upload_max_filesize' et 'post_max_size' de votre configuration PHP (actuellement 2Mo).",
        ]);

        $trackPath = $request->file('file')->store(
            'albums/'.$album->id.'/tracks',
            'public'
        );

        $trackNumber = $album->tracks()->max('track_number') + 1;

        Track::create([
            'album_id' => $album->id,
            'title' => $validated['title'],
            'duration_seconds' => 0,
            'file_url' => Storage::url($trackPath),
            'lyrics' => $validated['lyrics'] ?? null,
            'track_number' => $trackNumber,
        ]);

        return back()->with('success', 'Piste ajoutée.');
    }

    /**
     * Remove a track from an album.
     */
    public function removeTrack(Album $album, Track $track): RedirectResponse
    {
        if ($album->artist_id !== Auth::id() || $track->album_id !== $album->id) {
            abort(403);
        }

        Storage::disk('public')->delete(
            str_replace('/storage/', '', parse_url($track->file_url, PHP_URL_PATH))
        );

        $track->delete();

        return back()->with('success', 'Piste supprimée.');
    }
}
