<?php

namespace App\Http\Controllers\Artist;

use App\Http\Controllers\Controller;
use App\Models\Story;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class StoryController extends Controller
{
    /**
     * Upload une story (expire automatiquement après 24h)
     * 
     * Route: POST /artist/stories
     * Middleware: auth, role:artist
     * 
     * Logique:
     * 1. Upload le média (image ou vidéo)
     * 2. Crée la story avec expiration automatique (24h)
     * 3. Retourne la story créée
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'media' => ['required', 'file', 'mimes:jpeg,jpg,png,mp4,mov', 'max:10240'], // 10MB max
        ]);

        $artist = Auth::user();

        $file = $request->file('media');
        $mediaType = str_starts_with($file->getMimeType(), 'image/') ? 'image' : 'video';

        // Upload du fichier
        $path = $file->store('artists/'.$artist->id.'/stories', 'public');
        $mediaUrl = Storage::url($path);

        // Créer la story (expire dans 24h)
        Story::create([
            'artist_id' => $artist->id,
            'media_url' => $mediaUrl,
            'media_type' => $mediaType,
            'expires_at' => now()->addHours(24),
        ]);

        return back()->with('message', 'Story publiée. Elle sera visible pendant 24 heures.');
    }

    /**
     * Supprime une story
     * 
     * Route: DELETE /artist/stories/{story}
     * Middleware: auth, role:artist
     */
    public function destroy(Story $story): RedirectResponse
    {
        if ($story->artist_id !== Auth::id()) {
            abort(403);
        }

        // Supprimer le fichier
        $path = str_replace('/storage/', '', $story->media_url);
        Storage::disk('public')->delete($path);

        $story->delete();

        return back()->with('message', 'Story supprimée.');
    }
}
