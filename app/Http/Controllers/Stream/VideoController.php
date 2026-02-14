<?php

namespace App\Http\Controllers\Stream;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Video;
use App\Models\VideoComment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class VideoController extends Controller
{
    /**
     * Affiche le hub ArtTube (vidéos/tutos)
     * 
     * Route: GET /arttube
     * Middleware: auth
     * 
     * Affiche :
     * - Vidéos tendances
     * - Vidéos des artistes suivis
     * - Catégories de tutos
     * - Formations payantes
     */
    public function index(Request $request): Response
    {
        $client = Auth::user();

        // Vidéos tendances (par vues)
        $trending = Video::where('visibility', 'public')
            ->whereNotNull('published_at')
            ->with('artist.artistProfile')
            ->orderBy('views', 'desc')
            ->limit(20)
            ->get();

        // Vidéos des artistes suivis (si client)
        $followingVideos = collect();
        if ($client->isClient() && $client->clientProfile) {
            $followedArtists = $client->clientProfile->followedArtists()->pluck('id');
            $followingVideos = Video::whereIn('artist_id', $followedArtists)
                ->where('visibility', '!=', 'private')
                ->whereNotNull('published_at')
                ->with('artist.artistProfile')
                ->orderBy('published_at', 'desc')
                ->limit(20)
                ->get();
        }

        // Catégories disponibles
        $categories = Video::whereNotNull('published_at')
            ->select('category')
            ->distinct()
            ->pluck('category')
            ->filter()
            ->values();

        return Inertia::render('ArtTube/Hub', [
            'trending' => $trending,
            'following' => $followingVideos,
            'categories' => $categories,
        ]);
    }

    /**
     * Affiche le lecteur vidéo avec commentaires
     * 
     * Route: GET /arttube/videos/{video}
     * Middleware: auth
     * 
     * Affiche :
     * - Lecteur vidéo
     * - Informations de la vidéo
     * - Commentaires (avec pagination)
     * - Vidéos suggérées
     */
    public function show(Video $video): Response
    {
        // Vérifier la visibilité
        if ($video->visibility === 'private') {
            abort(404);
        }

        if ($video->visibility === 'subscribers') {
            $client = Auth::user();
            if (!$client->isClient() || !$client->clientProfile->followedArtists()->where('artist_id', $video->artist_id)->exists()) {
                abort(403, 'Cette vidéo est réservée aux abonnés.');
            }
        }

        // Incrémenter les vues
        $video->incrementViews();

        $video->load([
            'artist.artistProfile',
            'comments' => function ($query) {
                $query->whereNull('parent_id')
                    ->with(['user', 'replies.user'])
                    ->orderBy('created_at', 'desc')
                    ->limit(20);
            },
        ]);

        // Vidéos suggérées (même catégorie ou même artiste)
        $suggested = Video::where('id', '!=', $video->id)
            ->where(function ($query) use ($video) {
                $query->where('category', $video->category)
                    ->orWhere('artist_id', $video->artist_id);
            })
            ->where('visibility', 'public')
            ->whereNotNull('published_at')
            ->with('artist.artistProfile')
            ->limit(10)
            ->get();

        return Inertia::render('ArtTube/VideoPlayer', [
            'video' => $video,
            'suggested' => $suggested,
        ]);
    }

    /**
     * Ajoute un commentaire à une vidéo
     * 
     * Route: POST /arttube/videos/{video}/comments
     * Middleware: auth
     */
    public function storeComment(Request $request, Video $video): RedirectResponse
    {
        $validated = $request->validate([
            'content' => ['required', 'string', 'max:1000'],
            'parent_id' => ['nullable', 'exists:video_comments,id'], // Pour répondre à un commentaire
        ]);

        VideoComment::create([
            'video_id' => $video->id,
            'user_id' => Auth::id(),
            'parent_id' => $validated['parent_id'] ?? null,
            'content' => $validated['content'],
        ]);

        return back()->with('message', 'Commentaire ajouté.');
    }

    /**
     * Like/Unlike une vidéo
     * 
     * Route: POST /arttube/videos/{video}/like
     * Middleware: auth
     * 
     * TODO: Implémenter un système de likes (table pivot ou champ JSON)
     */
    public function like(Video $video): RedirectResponse
    {
        // TODO: Implémenter le système de likes
        // Pour l'instant, on incrémente simplement
        $video->increment('likes');

        return back()->with('message', 'Vidéo likée.');
    }
}
