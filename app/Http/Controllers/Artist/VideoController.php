<?php

namespace App\Http\Controllers\Artist;

use App\Http\Controllers\Controller;
use App\Models\Video;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class VideoController extends Controller
{
    /**
     * Affiche la liste des vidéos de l'artiste
     * 
     * Route: GET /artist/videos
     * Middleware: auth, role:artist
     */
    public function index(): Response
    {
        $artist = Auth::user();

        $videos = Video::where('artist_id', $artist->id)
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return Inertia::render('Artist/Videos', [
            'videos' => $videos,
        ]);
    }

    /**
     * Upload une nouvelle vidéo
     * 
     * Route: POST /artist/videos
     * Middleware: auth, role:artist
     * 
     * Logique:
     * 1. Upload la vidéo
     * 2. Génère la thumbnail (ou upload)
     * 3. Crée l'enregistrement Video
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'video' => ['required', 'file', 'mimes:mp4,mov,avi', 'max:102400'], // 100MB max
            'thumbnail' => ['nullable', 'image', 'max:2048'],
            'category' => ['required', 'string', 'max:255'],
            'tags' => ['nullable', 'array'],
            'visibility' => ['required', 'in:public,subscribers,private'],
        ]);

        $artist = Auth::user();

        // Upload de la vidéo
        $videoPath = $request->file('video')->store('artists/'.$artist->id.'/videos', 'public');
        $videoUrl = Storage::url($videoPath);

        // Upload de la thumbnail
        $thumbnailUrl = null;
        if ($request->hasFile('thumbnail')) {
            $thumbnailPath = $request->file('thumbnail')->store('artists/'.$artist->id.'/videos/thumbnails', 'public');
            $thumbnailUrl = Storage::url($thumbnailPath);
        }

        // TODO: Extraire la durée de la vidéo
        $durationSeconds = 0;

        Video::create([
            'artist_id' => $artist->id,
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'video_url' => $videoUrl,
            'thumbnail_url' => $thumbnailUrl,
            'duration_seconds' => $durationSeconds,
            'category' => $validated['category'],
            'tags' => $validated['tags'] ?? null,
            'visibility' => $validated['visibility'],
        ]);

        return redirect()->route('artist.videos.index')->with('message', 'Vidéo uploadée avec succès.');
    }

    /**
     * Met à jour une vidéo
     * 
     * Route: PUT /artist/videos/{video}
     */
    public function update(Request $request, Video $video): RedirectResponse
    {
        if ($video->artist_id !== Auth::id()) {
            abort(403);
        }

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'thumbnail' => ['nullable', 'image', 'max:2048'],
            'category' => ['required', 'string'],
            'tags' => ['nullable', 'array'],
            'visibility' => ['required', 'in:public,subscribers,private'],
        ]);

        // Upload nouvelle thumbnail si fournie
        if ($request->hasFile('thumbnail')) {
            // Supprimer l'ancienne thumbnail
            if ($video->thumbnail_url) {
                $oldPath = str_replace('/storage/', '', $video->thumbnail_url);
                Storage::disk('public')->delete($oldPath);
            }

            $thumbnailPath = $request->file('thumbnail')->store('artists/'.$video->artist_id.'/videos/thumbnails', 'public');
            $validated['thumbnail_url'] = Storage::url($thumbnailPath);
        }

        $video->update($validated);

        return back()->with('message', 'Vidéo mise à jour.');
    }

    /**
     * Supprime une vidéo
     * 
     * Route: DELETE /artist/videos/{video}
     */
    public function destroy(Video $video): RedirectResponse
    {
        if ($video->artist_id !== Auth::id()) {
            abort(403);
        }

        // Supprimer les fichiers
        $videoPath = str_replace('/storage/', '', $video->video_url);
        Storage::disk('public')->delete($videoPath);

        if ($video->thumbnail_url) {
            $thumbnailPath = str_replace('/storage/', '', $video->thumbnail_url);
            Storage::disk('public')->delete($thumbnailPath);
        }

        $video->delete();

        return redirect()->route('artist.videos.index')->with('message', 'Vidéo supprimée.');
    }

    /**
     * Publie une vidéo (la rend visible)
     * 
     * Route: POST /artist/videos/{video}/publish
     */
    public function publish(Video $video): RedirectResponse
    {
        if ($video->artist_id !== Auth::id()) {
            abort(403);
        }

        $video->update(['published_at' => now()]);

        return back()->with('message', 'Vidéo publiée avec succès.');
    }
}
