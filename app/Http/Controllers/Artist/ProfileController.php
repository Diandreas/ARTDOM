<?php

namespace App\Http\Controllers\Artist;

use App\Http\Controllers\Controller;
use App\Http\Requests\Artist\UpdateProfileRequest;
use App\Models\ArtistProfile;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Affiche la page de gestion du profil artiste
     *
     * Route: GET /artist/profile
     * Middleware: auth, role:artist
     *
     * Affiche le formulaire d'édition du profil avec :
     * - Informations personnelles
     * - Photo de profil et couverture
     * - Bio et catégories
     * - Réseaux sociaux
     * - Tarifs
     * - Galerie portfolio
     */
    public function show(): Response
    {
        $artist = Auth::user();
        $artist->load('artistProfile');

        $availableCategories = [
            'Musicien',
            'Chanteur',
            'Danseur',
            'Comédien',
            'Poète',
            'DJ',
            'Artiste visuel',
            'Photographe',
            'Magicien',
            'Autre',
        ];

        return Inertia::render('Artist/Profile/Edit', [
            'user' => [
                'id' => $artist->id,
                'name' => $artist->name,
                'email' => $artist->email,
                'phone' => $artist->phone,
                'city' => $artist->city,
                'profile_photo' => $artist->profile_photo,
            ],
            'profile' => [
                'id' => $artist->artistProfile->id,
                'stage_name' => $artist->artistProfile->stage_name,
                'bio' => $artist->artistProfile->bio,
                'categories' => $artist->artistProfile->categories ?? [],
                'base_rate' => (float) $artist->artistProfile->base_rate,
                'social_links' => $artist->artistProfile->social_links ?? [],
                'portfolio_urls' => $artist->artistProfile->portfolio_urls ?? [],
                'is_verified' => $artist->artistProfile->is_verified,
                'rating' => (float) $artist->artistProfile->rating,
                'total_reviews' => $artist->artistProfile->total_reviews,
            ],
            'availableCategories' => $availableCategories,
        ]);
    }

    /**
     * Met à jour le profil artiste
     *
     * Route: PUT /artist/profile
     * Middleware: auth, role:artist
     *
     * Met à jour les informations du profil :
     * - Informations utilisateur (name, phone, city)
     * - Stage name, bio, catégories
     * - Réseaux sociaux
     * - Tarif de base
     */
    public function update(UpdateProfileRequest $request): RedirectResponse
    {
        $artist = Auth::user();
        $profile = $artist->artistProfile;

        $validated = $request->validated();

        // Update user data
        $artist->update([
            'name' => $validated['name'],
            'phone' => $validated['phone'] ?? null,
            'city' => $validated['city'] ?? null,
        ]);

        // Update artist profile data
        $profile->update([
            'stage_name' => $validated['stage_name'],
            'bio' => $validated['bio'] ?? null,
            'categories' => $validated['categories'] ?? [],
            'base_rate' => $validated['base_rate'] ?? 0,
            'social_links' => $validated['social_links'] ?? [],
        ]);

        return back()->with('toast', [
            'type' => 'success',
            'message' => 'Profil mis à jour avec succès.',
        ]);
    }

    /**
     * Upload des médias (photos/vidéos) pour le portfolio
     * 
     * Route: POST /artist/profile/media
     * Middleware: auth, role:artist
     * 
     * Upload des fichiers média et les ajoute au portfolio
     */
    public function uploadMedia(Request $request): RedirectResponse
    {
        $request->validate([
            'media' => ['required', 'file', 'mimes:jpeg,jpg,png,mp4,mov', 'max:10240'], // 10MB max
            'type' => ['required', 'in:photo,video'],
        ]);

        $artist = Auth::user();
        $profile = $artist->artistProfile;

        // Upload du fichier
        $path = $request->file('media')->store('artists/'.$artist->id.'/portfolio', 'public');

        // Ajouter l'URL au portfolio
        $portfolioUrls = $profile->portfolio_urls ?? [];
        $portfolioUrls[] = Storage::url($path);

        $profile->update(['portfolio_urls' => $portfolioUrls]);

        return back()->with('message', 'Média ajouté au portfolio.');
    }

    /**
     * Supprime un média du portfolio
     * 
     * Route: DELETE /artist/profile/media/{media}
     * Middleware: auth, role:artist
     * 
     * @param string $media L'URL ou l'index du média à supprimer
     */
    public function deleteMedia(Request $request, string $media): RedirectResponse
    {
        $artist = Auth::user();
        $profile = $artist->artistProfile;

        $portfolioUrls = $profile->portfolio_urls ?? [];

        // Supprimer le média du tableau
        $portfolioUrls = array_filter($portfolioUrls, fn ($url) => $url !== $media);

        // Supprimer le fichier du storage
        $path = str_replace('/storage/', '', $media);
        Storage::disk('public')->delete($path);

        $profile->update(['portfolio_urls' => array_values($portfolioUrls)]);

        return back()->with('message', 'Média supprimé du portfolio.');
    }
}
