<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Availability;
use App\Models\Service;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SearchController extends Controller
{
    /**
     * Affiche la page de recherche avec les filtres
     * 
     * Route: GET /search
     * Middleware: auth, role:client
     * 
     * Affiche le formulaire de recherche avec tous les filtres disponibles
     */
    public function index(): Response
    {
        // Récupérer les catégories et villes pour les filtres
        $categories = Service::select('category')
            ->distinct()
            ->where('is_active', true)
            ->pluck('category')
            ->unique()
            ->values();

        $cities = User::select('city')
            ->whereNotNull('city')
            ->where('role', 'artist')
            ->distinct()
            ->pluck('city')
            ->unique()
            ->values();

        return Inertia::render('Client/Search', [
            'categories' => $categories,
            'cities' => $cities,
        ]);
    }

    /**
     * Retourne les résultats de recherche paginés
     * 
     * Route: GET /search/results
     * Middleware: auth, role:client
     * 
     * Logique:
     * 1. Applique les filtres (ville, catégorie, budget, note, date)
     * 2. Recherche les artistes correspondants
     * 3. Retourne les résultats paginés
     * 
     * Filtres disponibles:
     * - city: Ville de l'artiste
     * - category: Catégorie de service
     * - budget_min/budget_max: Fourchette de prix
     * - rating_min: Note minimale
     * - date: Disponibilité à une date précise
     */
    public function results(Request $request)
    {
        $validated = $request->validate([
            'city' => ['nullable', 'string'],
            'category' => ['nullable', 'string'],
            'budget_min' => ['nullable', 'numeric', 'min:0'],
            'budget_max' => ['nullable', 'numeric', 'min:0'],
            'rating_min' => ['nullable', 'numeric', 'min:0', 'max:5'],
            'date' => ['nullable', 'date'],
            'page' => ['nullable', 'integer', 'min:1'],
        ]);

        // Construire la requête pour les artistes
        $query = User::where('role', 'artist')
            ->whereHas('artistProfile', function ($q) use ($validated) {
                $q->where('verification_status', 'approved')
                    ->where('is_verified', true);

                // Filtre par note minimale
                if (isset($validated['rating_min'])) {
                    $q->where('rating', '>=', $validated['rating_min']);
                }
            })
            ->with(['artistProfile', 'services']);

        // Filtre par ville
        if (isset($validated['city'])) {
            $query->where('city', $validated['city']);
        }

        // Filtre par catégorie de service
        if (isset($validated['category'])) {
            $query->whereHas('services', function ($q) use ($validated) {
                $q->where('category', $validated['category'])
                    ->where('is_active', true);
            });
        }

        // Filtre par budget (prix des services)
        if (isset($validated['budget_min']) || isset($validated['budget_max'])) {
            $query->whereHas('services', function ($q) use ($validated) {
                if (isset($validated['budget_min'])) {
                    $q->where('price', '>=', $validated['budget_min']);
                }
                if (isset($validated['budget_max'])) {
                    $q->where('price', '<=', $validated['budget_max']);
                }
            });
        }

        // Filtre par disponibilité à une date
        if (isset($validated['date'])) {
            $query->whereHas('artistProfile.availabilities', function ($q) use ($validated) {
                $q->where('date', $validated['date'])
                    ->where('is_booked', false)
                    ->where('is_blocked', false);
            });
        }

        // Pagination
        $artists = $query->paginate(12)->withQueryString();

        return Inertia::render('Client/SearchResults', [
            'artists' => $artists,
            'filters' => $validated,
        ]);
    }
}
