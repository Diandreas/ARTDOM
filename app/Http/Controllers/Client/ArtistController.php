<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Album;
use App\Models\Review;
use App\Models\Service;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ArtistController extends Controller
{
    /**
     * Affiche le profil public d'un artiste
     * 
     * Route: GET /artists/{artist}
     * Middleware: auth, role:client
     * 
     * @param User $artist L'artiste (résolu automatiquement par Laravel)
     * 
     * Logique:
     * 1. Charge le profil artiste avec toutes les données
     * 2. Charge les services actifs
     * 3. Charge les albums publiés
     * 4. Charge les avis avec pagination
     * 5. Charge les artistes similaires (même catégorie)
     * 6. Vérifie si le client suit déjà cet artiste
     */
    public function show(User $artist): Response
    {
        // Vérifier que c'est bien un artiste
        if (!$artist->isArtist() || !$artist->artistProfile) {
            abort(404);
        }

        // Charger les relations nécessaires
        $artist->load([
            'artistProfile',
            'services' => function ($query) {
                $query->where('is_active', true)->orderBy('order');
            },
            'albums' => function ($query) {
                $query->whereNotNull('published_at')
                    ->orderBy('published_at', 'desc');
            },
        ]);

        // Charger les avis avec pagination
        $reviews = Review::where('artist_id', $artist->id)
            ->with(['client.clientProfile', 'service'])
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        // Artistes similaires (même catégorie)
        $similarArtists = User::where('role', 'artist')
            ->where('id', '!=', $artist->id)
            ->whereHas('artistProfile', function ($query) use ($artist) {
                // Chercher des artistes avec des catégories similaires
                if ($artist->artistProfile->categories) {
                    $query->whereJsonContains('categories', $artist->artistProfile->categories[0] ?? null);
                }
            })
            ->with('artistProfile')
            ->limit(6)
            ->get();

        // Vérifier si le client suit cet artiste
        $isFollowing = Auth::user()->clientProfile
            ->followedArtists()
            ->where('artist_id', $artist->id)
            ->exists();

        return Inertia::render('Client/ArtistProfile', [
            'artist' => $artist,
            'services' => $artist->services,
            'albums' => $artist->albums,
            'reviews' => $reviews,
            'similarArtists' => $similarArtists,
            'isFollowing' => $isFollowing,
        ]);
    }

    /**
     * Permet au client de suivre un artiste
     * 
     * Route: POST /artists/{artist}/follow
     * Middleware: auth, role:client
     * 
     * Logique:
     * 1. Vérifie que le client ne suit pas déjà l'artiste
     * 2. Ajoute la relation dans la table pivot artist_followers
     */
    public function follow(User $artist): RedirectResponse
    {
        if (!$artist->isArtist()) {
            abort(404);
        }

        $client = Auth::user()->clientProfile;

        // Vérifier si déjà suivi
        if ($client->followedArtists()->where('artist_id', $artist->id)->exists()) {
            return back()->with('message', 'Vous suivez déjà cet artiste.');
        }

        // Ajouter la relation
        $client->followedArtists()->attach($artist->id);

        return back()->with('message', 'Vous suivez maintenant cet artiste.');
    }

    /**
     * Permet au client de ne plus suivre un artiste
     * 
     * Route: DELETE /artists/{artist}/follow
     * Middleware: auth, role:client
     */
    public function unfollow(User $artist): RedirectResponse
    {
        if (!$artist->isArtist()) {
            abort(404);
        }

        $client = Auth::user()->clientProfile;
        $client->followedArtists()->detach($artist->id);

        return back()->with('message', 'Vous ne suivez plus cet artiste.');
    }

    /**
     * Permet au client de signaler un artiste
     * 
     * Route: POST /artists/{artist}/report
     * Middleware: auth, role:client
     * 
     * TODO: Implémenter la logique de signalement (créer un ticket)
     */
    public function report(Request $request, User $artist): RedirectResponse
    {
        $request->validate([
            'reason' => ['required', 'string', 'max:500'],
        ]);

        // TODO: Créer un ticket de signalement
        // Ticket::create([...])

        return back()->with('message', 'Votre signalement a été enregistré. Merci.');
    }
}
