<?php

namespace App\Http\Controllers\Artist;

use App\Enums\ReservationStatus;
use App\Http\Controllers\Controller;
use App\Models\Reservation;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    /**
     * Affiche la liste des commandes/réservations de l'artiste
     * 
     * Route: GET /artist/orders
     * Middleware: auth, role:artist
     * 
     * Affiche les réservations groupées par statut :
     * - En attente (pending) : nouvelles demandes à accepter/refuser
     * - Confirmées (confirmed) : réservations acceptées
     * - Terminées (completed) : réservations complétées
     */
    public function index(): Response
    {
        $artist = Auth::user();

        $pending = Reservation::where('artist_id', $artist->id)
            ->where('status', ReservationStatus::Pending)
            ->with(['client.clientProfile', 'service'])
            ->orderBy('created_at', 'desc')
            ->get();

        $confirmed = Reservation::where('artist_id', $artist->id)
            ->where('status', ReservationStatus::Confirmed)
            ->with(['client.clientProfile', 'service'])
            ->orderBy('scheduled_at', 'asc')
            ->get();

        $completed = Reservation::where('artist_id', $artist->id)
            ->where('status', ReservationStatus::Completed)
            ->with(['client.clientProfile', 'service', 'review'])
            ->orderBy('scheduled_at', 'desc')
            ->limit(20)
            ->get();

        return Inertia::render('Artist/Orders', [
            'pending' => $pending,
            'confirmed' => $confirmed,
            'completed' => $completed,
        ]);
    }

    /**
     * Affiche les détails d'une réservation
     * 
     * Route: GET /artist/orders/{reservation}
     * Middleware: auth, role:artist
     */
    public function show(Reservation $reservation): Response
    {
        if ($reservation->artist_id !== Auth::id()) {
            abort(403);
        }

        $reservation->load([
            'client.clientProfile',
            'service',
            'payment',
            'conversation.messages.sender',
        ]);

        return Inertia::render('Artist/OrderDetail', [
            'reservation' => $reservation,
        ]);
    }

    /**
     * Accepte une réservation en attente
     * 
     * Route: POST /artist/orders/{reservation}/accept
     * Middleware: auth, role:artist
     * 
     * Logique:
     * 1. Vérifie que la réservation est en attente
     * 2. Confirme la réservation
     * 3. Notifie le client
     */
    public function accept(Reservation $reservation): RedirectResponse
    {
        if ($reservation->artist_id !== Auth::id()) {
            abort(403);
        }

        if ($reservation->status !== ReservationStatus::Pending) {
            return back()->withErrors(['message' => 'Cette réservation ne peut plus être acceptée.']);
        }

        $reservation->update([
            'status' => ReservationStatus::Confirmed,
        ]);

        // TODO: Envoyer une notification au client

        return back()->with('message', 'Réservation acceptée. Le client a été notifié.');
    }

    /**
     * Refuse une réservation en attente
     * 
     * Route: POST /artist/orders/{reservation}/decline
     * Middleware: auth, role:artist
     * 
     * Logique:
     * 1. Annule la réservation
     * 2. Libère la disponibilité
     * 3. Rembourse le client si paiement effectué
     */
    public function decline(Request $request, Reservation $reservation): RedirectResponse
    {
        if ($reservation->artist_id !== Auth::id()) {
            abort(403);
        }

        $request->validate([
            'reason' => ['nullable', 'string', 'max:500'],
        ]);

        if ($reservation->status !== ReservationStatus::Pending) {
            return back()->withErrors(['message' => 'Cette réservation ne peut plus être refusée.']);
        }

        $reservation->update([
            'status' => ReservationStatus::Cancelled,
            'cancelled_at' => now(),
            'cancel_reason' => $request->reason ?? 'Refusée par l\'artiste',
        ]);

        // Libérer la disponibilité
        // TODO: Libérer la disponibilité

        // TODO: Rembourser le client si paiement effectué

        return back()->with('message', 'Réservation refusée. Le client a été notifié.');
    }

    /**
     * Check-in : Démarre une prestation
     * 
     * Route: POST /artist/orders/{reservation}/checkin
     * Middleware: auth, role:artist
     * 
     * Logique:
     * 1. Vérifie que la réservation est confirmée
     * 2. Enregistre l'heure de check-in
     * 3. Enregistre la localisation GPS (optionnel)
     * 4. Change le statut à "in_progress"
     */
    public function checkIn(Request $request, Reservation $reservation): RedirectResponse
    {
        if ($reservation->artist_id !== Auth::id()) {
            abort(403);
        }

        if ($reservation->status !== ReservationStatus::Confirmed) {
            return back()->withErrors(['message' => 'Cette réservation n\'est pas confirmée.']);
        }

        $validated = $request->validate([
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],
        ]);

        $reservation->update([
            'status' => ReservationStatus::InProgress,
            'checkin_at' => now(),
            'checkin_lat' => $validated['latitude'] ?? null,
            'checkin_lng' => $validated['longitude'] ?? null,
        ]);

        return back()->with('message', 'Check-in effectué. La prestation a commencé.');
    }

    /**
     * Check-out : Termine une prestation
     * 
     * Route: POST /artist/orders/{reservation}/checkout
     * Middleware: auth, role:artist
     * 
     * Logique:
     * 1. Vérifie que la réservation est en cours
     * 2. Enregistre l'heure de check-out
     * 3. Calcule la durée réelle
     * 4. Change le statut à "completed"
     * 5. Libère les fonds dans le portefeuille
     */
    public function checkOut(Reservation $reservation): RedirectResponse
    {
        if ($reservation->artist_id !== Auth::id()) {
            abort(403);
        }

        if ($reservation->status !== ReservationStatus::InProgress) {
            return back()->withErrors(['message' => 'Cette réservation n\'est pas en cours.']);
        }

        $reservation->update([
            'status' => ReservationStatus::Completed,
            'checkout_at' => now(),
        ]);

        // TODO: Libérer les fonds dans le portefeuille de l'artiste
        // TODO: Envoyer une notification au client pour laisser un avis

        return back()->with('message', 'Check-out effectué. La prestation est terminée.');
    }
}
