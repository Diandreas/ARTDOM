<?php

namespace App\Http\Controllers\Artist;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ServiceController extends Controller
{
    /**
     * Affiche la liste des services de l'artiste
     * 
     * Route: GET /artist/services
     * Middleware: auth, role:artist
     * 
     * Affiche tous les services avec possibilité de :
     * - Ajouter un nouveau service
     * - Modifier un service existant
     * - Activer/désactiver un service
     * - Réorganiser l'ordre d'affichage
     */
    public function index(): Response
    {
        $artist = Auth::user();

        $services = Service::where('artist_id', $artist->id)
            ->with('serviceOptions')
            ->orderBy('order')
            ->get()->map(function ($service) {
                $data = $service->toArray();
                $data['options'] = $service->serviceOptions;
                return $data;
            });

        return Inertia::render('Artist/Services', [
            'services' => $services,
        ]);
    }

    /**
     * Crée un nouveau service
     * 
     * Route: POST /artist/services
     * Middleware: auth, role:artist
     * 
     * Crée un nouveau service avec :
     * - Titre, description, catégorie
     * - Prix et type de prix (fixe, à partir de, horaire)
     * - Durée et délai de prévenance
     * - Type de lieu (domicile, en ligne, public)
     * - Options supplémentaires
     * - Médias (photos/vidéos exemples)
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'category' => ['required', 'string', 'max:255'],
            'price' => ['required', 'numeric', 'min:0'],
            'price_type' => ['required', 'in:fixed,from,hourly'],
            'duration_minutes' => ['required', 'integer', 'min:15'],
            'notice_period_hours' => ['required', 'integer', 'min:0'],
            'location_type' => ['required', 'in:home,online,public,any'],
            'options' => ['nullable', 'array'],
            'media_urls' => ['nullable', 'array'],
        ]);

        $artist = Auth::user();

        // Déterminer l'ordre (dernier + 1)
        $maxOrder = Service::where('artist_id', $artist->id)->max('order') ?? 0;

        $service = Service::create([
            'artist_id' => $artist->id,
            'title' => $validated['title'],
            'description' => $validated['description'],
            'category' => $validated['category'],
            'price' => $validated['price'],
            'price_type' => $validated['price_type'],
            'duration_minutes' => $validated['duration_minutes'],
            'notice_period_hours' => $validated['notice_period_hours'],
            'location_type' => $validated['location_type'],
            'options' => [], // Clear the JSON options
            'media_urls' => $validated['media_urls'] ?? null,
            'order' => $maxOrder + 1,
        ]);

        if (!empty($validated['options'])) {
            foreach ($validated['options'] as $option) {
                $service->serviceOptions()->create([
                    'name' => $option['name'],
                    'description' => $option['description'] ?? null,
                    'price' => $option['price'],
                    'is_active' => $option['is_active'] ?? true,
                ]);
            }
        }

        return redirect()->route('artist.services.index')->with('message', 'Service créé avec succès.');
    }

    /**
     * Met à jour un service
     * 
     * Route: PUT /artist/services/{service}
     * Middleware: auth, role:artist
     */
    public function update(Request $request, Service $service): RedirectResponse
    {
        // Vérifier que le service appartient à l'artiste
        if ($service->artist_id !== Auth::id()) {
            abort(403);
        }

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'category' => ['required', 'string', 'max:255'],
            'price' => ['required', 'numeric', 'min:0'],
            'price_type' => ['required', 'in:fixed,from,hourly'],
            'duration_minutes' => ['required', 'integer', 'min:15'],
            'notice_period_hours' => ['required', 'integer', 'min:0'],
            'location_type' => ['required', 'in:home,online,public,any'],
            'options' => ['nullable', 'array'],
            'media_urls' => ['nullable', 'array'],
        ]);

        $service->update([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'category' => $validated['category'],
            'price' => $validated['price'],
            'price_type' => $validated['price_type'],
            'duration_minutes' => $validated['duration_minutes'],
            'notice_period_hours' => $validated['notice_period_hours'],
            'location_type' => $validated['location_type'],
            'options' => [], // We use the relation now
            'media_urls' => $validated['media_urls'] ?? null,
        ]);

        // Sync options
        // This is a simple sync: delete all and recreate
        // In reality, updating existing would be better if IDs were provided and matched, but deleting is quicker for nested arrays
        $service->serviceOptions()->delete();
        
        if (!empty($validated['options'])) {
            foreach ($validated['options'] as $option) {
                $service->serviceOptions()->create([
                    'name' => $option['name'],
                    'description' => $option['description'] ?? null,
                    'price' => $option['price'],
                    'is_active' => $option['is_active'] ?? true,
                ]);
            }
        }

        return back()->with('message', 'Service mis à jour avec succès.');
    }

    /**
     * Supprime un service
     * 
     * Route: DELETE /artist/services/{service}
     * Middleware: auth, role:artist
     */
    public function destroy(Service $service): RedirectResponse
    {
        if ($service->artist_id !== Auth::id()) {
            abort(403);
        }

        // Vérifier qu'il n'y a pas de réservations en cours
        if ($service->reservations()->whereIn('status', ['pending', 'confirmed'])->exists()) {
            return back()->withErrors(['message' => 'Impossible de supprimer un service avec des réservations en cours.']);
        }

        $service->delete();

        return redirect()->route('artist.services.index')->with('message', 'Service supprimé.');
    }

    /**
     * Active ou désactive un service
     * 
     * Route: PATCH /artist/services/{service}/toggle
     * Middleware: auth, role:artist
     */
    public function toggle(Service $service): RedirectResponse
    {
        if ($service->artist_id !== Auth::id()) {
            abort(403);
        }

        $service->update(['is_active' => !$service->is_active]);

        return back()->with('message', $service->is_active ? 'Service activé.' : 'Service désactivé.');
    }

    /**
     * Réorganise l'ordre des services
     * 
     * Route: POST /artist/services/reorder
     * Middleware: auth, role:artist
     * 
     * Reçoit un tableau d'IDs dans le nouvel ordre
     */
    public function reorder(Request $request): RedirectResponse
    {
        $request->validate([
            'services' => ['required', 'array'],
            'services.*' => ['required', 'exists:services,id'],
        ]);

        $artist = Auth::user();

        foreach ($request->services as $index => $serviceId) {
            Service::where('id', $serviceId)
                ->where('artist_id', $artist->id)
                ->update(['order' => $index + 1]);
        }

        return back()->with('message', 'Ordre des services mis à jour.');
    }
}
