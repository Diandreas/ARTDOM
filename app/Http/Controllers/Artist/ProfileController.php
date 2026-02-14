<?php

namespace App\Http\Controllers\Artist;

use App\Http\Controllers\Controller;
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

        return Inertia::render('Artist/Profile', [
            'artist' => $artist,
            'profile' => $artist->artistProfile,
        ]);
    }

    /**
     * Met à jour le profil artiste
     * 
     * Route: PUT /artist/profile
     * Middleware: auth, role:artist
     * 
     * Met à jour les informations du profil :
     * - Stage name, bio, catégories
     * - Réseaux sociaux
     * - Tarif de base
     */
    public function update(Request $request): RedirectResponse
    {
        $artist = Auth::user();
        $profile = $artist->artistProfile;

        $validated = $request->validate([
            'stage_name' => ['required', 'string', 'max:255'],
            'bio' => ['nullable', 'string', 'max:1000'],
            'categories' => ['nullable', 'array'],
            'base_rate' => ['nullable', 'numeric', 'min:0'],
            'social_links' => ['nullable', 'array'],
            'portfolio_urls' => ['nullable', 'array'],
        ]);

        $profile->update($validated);

        return back()->with('message', 'Profil mis à jour avec succès.');
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
