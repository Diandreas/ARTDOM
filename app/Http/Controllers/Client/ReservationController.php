<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ReservationController extends Controller
{
    public function index(): Response
    {
        $client = Auth::user();

        // Pour le MVP, on simule des réservations vides
        // TODO: Implémenter avec vraies données quand Reservation model sera prêt
        $reservations = [];

        return Inertia::render('Client/reservations', [
            'reservations' => $reservations,
            'stats' => [
                'upcoming' => 0,
                'past' => 0,
                'cancelled' => 0,
            ],
        ]);
    }

    public function show(string $id): Response
    {
        // Pour le MVP, on simule une réservation
        // TODO: Implémenter avec vraies données
        $reservation = [
            'id' => $id,
            'reservation_number' => 'RES-DEMO123',
            'status' => 'pending',
            'scheduled_at' => now()->addDays(7)->toISOString(),
            'total_amount' => 50000,
            'service' => [
                'title' => 'Concert Privé',
                'duration_minutes' => 120,
            ],
            'artist' => [
                'id' => '1',
                'stage_name' => 'Artiste Demo',
                'profile_photo' => 'https://i.pravatar.cc/400?img=1',
            ],
        ];

        return Inertia::render('Client/reservation-detail', [
            'reservation' => $reservation,
        ]);
    }

    public function cancel(string $id): RedirectResponse
    {
        // TODO: Implémenter l'annulation réelle
        return redirect()
            ->route('client.reservations.index')
            ->with('message', 'Réservation annulée avec succès.');
    }

    public function review(Request $request, string $id): RedirectResponse
    {
        $validated = $request->validate([
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'comment' => ['nullable', 'string', 'max:1000'],
        ]);

        // TODO: Créer le review réel
        return back()->with('message', 'Votre avis a été enregistré. Merci !');
    }
}
