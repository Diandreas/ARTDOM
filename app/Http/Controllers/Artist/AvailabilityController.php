<?php

namespace App\Http\Controllers\Artist;

use App\Http\Controllers\Controller;
use App\Models\Availability;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class AvailabilityController extends Controller
{
    /**
     * Affiche l'agenda de l'artiste
     * 
     * Route: GET /artist/availability
     * Middleware: auth, role:artist
     * 
     * Affiche le calendrier avec :
     * - Créneaux disponibles (verts)
     * - Créneaux réservés (bleus)
     * - Créneaux bloqués (rouges)
     * - Possibilité d'ajouter/modifier des créneaux
     */
    public function index(Request $request): Response
    {
        $artist = Auth::user();

        $month = $request->input('month', now()->month);
        $year = $request->input('year', now()->year);

        // Récupérer les disponibilités du mois
        $availabilities = Availability::where('artist_id', $artist->id)
            ->whereYear('date', $year)
            ->whereMonth('date', $month)
            ->orderBy('date')
            ->orderBy('start_time')
            ->get();

        return Inertia::render('Artist/Agenda', [
            'availabilities' => $availabilities,
            'currentMonth' => $month,
            'currentYear' => $year,
        ]);
    }

    /**
     * Ajoute des créneaux de disponibilité
     * 
     * Route: POST /artist/availability
     * Middleware: auth, role:artist
     * 
     * Permet d'ajouter :
     * - Un créneau unique (date + heures)
     * - Des créneaux répétés (ex: tous les lundis de 9h à 17h)
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'date' => ['required', 'date', 'after_or_equal:today'],
            'start_time' => ['required', 'date_format:H:i'],
            'end_time' => ['required', 'date_format:H:i', 'after:start_time'],
            'repeat_rule' => ['nullable', 'string'], // Ex: "weekly", "daily"
            'repeat_until' => ['nullable', 'date', 'after:date'],
        ]);

        $artist = Auth::user();

        // Si répétition, créer plusieurs créneaux
        if ($validated['repeat_rule'] && $validated['repeat_until']) {
            $this->createRecurringAvailabilities($artist->id, $validated);
        } else {
            // Créneau unique
            Availability::create([
                'artist_id' => $artist->id,
                'date' => $validated['date'],
                'start_time' => $validated['start_time'],
                'end_time' => $validated['end_time'],
            ]);
        }

        return back()->with('message', 'Créneaux ajoutés avec succès.');
    }

    /**
     * Bloque un créneau (rend indisponible)
     * 
     * Route: POST /artist/availability/block
     * Middleware: auth, role:artist
     * 
     * Crée un créneau bloqué (vacances, événement personnel, etc.)
     */
    public function block(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'date' => ['required', 'date'],
            'start_time' => ['required', 'date_format:H:i'],
            'end_time' => ['required', 'date_format:H:i', 'after:start_time'],
            'block_reason' => ['nullable', 'string', 'max:255'],
        ]);

        $artist = Auth::user();

        Availability::create([
            'artist_id' => $artist->id,
            'date' => $validated['date'],
            'start_time' => $validated['start_time'],
            'end_time' => $validated['end_time'],
            'is_blocked' => true,
            'block_reason' => $validated['block_reason'] ?? null,
        ]);

        return back()->with('message', 'Créneau bloqué.');
    }

    /**
     * Supprime un créneau de disponibilité
     * 
     * Route: DELETE /artist/availability/{availability}
     * Middleware: auth, role:artist
     */
    public function destroy(Availability $availability): RedirectResponse
    {
        if ($availability->artist_id !== Auth::id()) {
            abort(403);
        }

        // Ne pas supprimer si déjà réservé
        if ($availability->is_booked) {
            return back()->withErrors(['message' => 'Impossible de supprimer un créneau déjà réservé.']);
        }

        $availability->delete();

        return back()->with('message', 'Créneau supprimé.');
    }

    /**
     * Crée des créneaux récurrents
     */
    private function createRecurringAvailabilities(string $artistId, array $data): void
    {
        $startDate = \Carbon\Carbon::parse($data['date']);
        $endDate = \Carbon\Carbon::parse($data['repeat_until']);
        $currentDate = $startDate->copy();

        while ($currentDate->lte($endDate)) {
            // Vérifier si cette date correspond à la règle de répétition
            if ($this->matchesRepeatRule($currentDate, $startDate, $data['repeat_rule'])) {
                Availability::create([
                    'artist_id' => $artistId,
                    'date' => $currentDate->format('Y-m-d'),
                    'start_time' => $data['start_time'],
                    'end_time' => $data['end_time'],
                    'repeat_rule' => $data['repeat_rule'],
                ]);
            }

            $currentDate->addDay();
        }
    }

    /**
     * Vérifie si une date correspond à la règle de répétition
     */
    private function matchesRepeatRule($date, $startDate, ?string $rule): bool
    {
        if (!$rule) {
            return $date->isSameDay($startDate);
        }

        return match ($rule) {
            'daily' => true,
            'weekly' => $date->dayOfWeek === $startDate->dayOfWeek,
            'monthly' => $date->day === $startDate->day,
            default => false,
        };
    }
}
