<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Album;
use App\Models\ArtistProfile;
use App\Models\Story;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    /**
     * Affiche la page d'accueil du client
     * 
     * Route: GET /
     * Middleware: auth, role:client
     * 
     * Cette méthode charge toutes les données nécessaires pour la page d'accueil:
     * - Stories actives des artistes (24h)
     * - Contenu à la une (promotions, événements)
     * - Catégories disponibles
     * - Artistes tendances (par note/avis)
     * - Derniers albums publiés
     * - Vidéos populaires
     * 
     * Toutes ces données sont passées à Inertia pour le rendu côté frontend
     */
    public function index(Request $request): Response
    {
        // Stories actives (non expirées) des artistes
        $stories = Story::with('artist.artistProfile')
            ->where('expires_at', '>', now())
            ->orderBy('created_at', 'desc')
            ->limit(20)
            ->get();

        // Artistes tendances (par note moyenne et nombre d'avis)
        $trendingArtists = User::where('role', 'artist')
            ->whereHas('artistProfile', function ($query) {
                $query->where('verification_status', 'approved')
                    ->where('is_verified', true);
            })
            ->with(['artistProfile' => function ($query) {
                $query->orderBy('rating', 'desc')
                    ->orderBy('total_reviews', 'desc');
            }])
            ->limit(10)
            ->get();

        // Derniers albums publiés
        $latestAlbums = Album::with('artist.artistProfile')
            ->whereNotNull('published_at')
            ->where('is_streamable', true)
            ->orderBy('published_at', 'desc')
            ->limit(12)
            ->get();

        // Catégories disponibles (depuis les services)
        $categories = \App\Models\Service::select('category')
            ->distinct()
            ->where('is_active', true)
            ->pluck('category')
            ->unique()
            ->values();

        return Inertia::render('Client/Home', [
            'stories' => $stories,
            'trendingArtists' => $trendingArtists,
            'latestAlbums' => $latestAlbums,
            'categories' => $categories,
            // TODO: Ajouter featured (promotions), videos populaires
        ]);
    }
}
