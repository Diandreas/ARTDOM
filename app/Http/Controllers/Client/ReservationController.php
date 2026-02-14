<?php

namespace App\Http\Controllers\Client;

use App\Enums\ReservationStatus;
use App\Http\Controllers\Controller;
use App\Models\Availability;
use App\Models\Reservation;
use App\Models\Review;
use App\Models\Service;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ReservationController extends Controller
{
    /**
     * Affiche la liste des réservations du client avec onglets
     * 
     * Route: GET /reservations
     * Middleware: auth, role:client
     * 
     * Affiche les réservations groupées par statut :
     * - À venir (pending, confirmed)
     * - Passées (completed)
     * - Annulées (cancelled, refunded)
     */
    public function index(Request $request): Response
    {
        $client = Auth::user();

        $upcoming = Reservation::where('client_id', $client->id)
            ->whereIn('status', [ReservationStatus::Pending, ReservationStatus::Confirmed])
            ->with(['artist.artistProfile', 'service', 'payment'])
            ->orderBy('scheduled_at', 'asc')
            ->get();

        $past = Reservation::where('client_id', $client->id)
            ->where('status', ReservationStatus::Completed)
            ->with(['artist.artistProfile', 'service', 'review'])
            ->orderBy('scheduled_at', 'desc')
            ->get();

        $cancelled = Reservation::where('client_id', $client->id)
            ->whereIn('status', [ReservationStatus::Cancelled, ReservationStatus::Refunded])
            ->with(['artist.artistProfile', 'service'])
            ->orderBy('cancelled_at', 'desc')
            ->get();

        return Inertia::render('Client/Reservations', [
            'upcoming' => $upcoming,
            'past' => $past,
            'cancelled' => $cancelled,
        ]);
    }

    /**
     * Affiche les détails d'une réservation
     * 
     * Route: GET /reservations/{reservation}
     * Middleware: auth, role:client
     * 
     * Charge toutes les informations d'une réservation :
     * - Détails de la réservation
     * - Informations artiste et service
     * - QR Code
     * - Messages de conversation
     * - Historique de paiement
     */
    public function show(Reservation $reservation): Response
    {
        // Vérifier que la réservation appartient au client
        if ($reservation->client_id !== Auth::id()) {
            abort(403);
        }

        $reservation->load([
            'client.clientProfile',
            'artist.artistProfile',
            'service',
            'payment',
            'review',
            'conversation.messages.sender',
        ]);

        return Inertia::render('Client/ReservationDetail', [
            'reservation' => $reservation,
        ]);
    }

    /**
     * Retourne les créneaux disponibles pour un service
     * 
     * Route: GET /services/{service}/availability
     * Middleware: auth, role:client
     * 
     * Retourne un JSON avec les créneaux disponibles pour une date donnée
     * Utilisé pour le calendrier de réservation
     */
    public function availability(Request $request, Service $service): JsonResponse
    {
        $request->validate([
            'date' => ['required', 'date', 'after_or_equal:today'],
        ]);

        $artist = $service->artist;

        // Récupérer les disponibilités pour cette date
        $availabilities = Availability::where('artist_id', $artist->id)
            ->where('date', $request->date)
            ->where('is_booked', false)
            ->where('is_blocked', false)
            ->orderBy('start_time')
            ->get();

        // Formater les créneaux disponibles
        $slots = $availabilities->map(function ($availability) use ($service) {
            return [
                'id' => $availability->id,
                'start_time' => $availability->start_time,
                'end_time' => $availability->end_time,
                'duration' => $service->duration_minutes,
            ];
        });

        return response()->json([
            'date' => $request->date,
            'slots' => $slots,
        ]);
    }

    /**
     * Affiche la page de personnalisation d'une réservation
     * 
     * Route: GET /services/{service}/book
     * Middleware: auth, role:client
     * 
     * Affiche le formulaire de personnalisation :
     * - Sélection de date/heure
     * - Message personnalisé
     * - Informations destinataire
     * - Type d'émotion
     * - Lieu de prestation
     */
    public function customize(Service $service): Response
    {
        $service->load('artist.artistProfile');

        return Inertia::render('Client/Customize', [
            'service' => $service,
        ]);
    }

    /**
     * Crée une nouvelle réservation
     * 
     * Route: POST /reservations
     * Middleware: auth, role:client
     * 
     * Logique:
     * 1. Valide les données de réservation
     * 2. Vérifie la disponibilité
     * 3. Calcule le montant total
     * 4. Crée la réservation
     * 5. Génère le numéro de réservation et QR code
     * 6. Ajoute au panier ou procède directement au checkout
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'service_id' => ['required', 'exists:services,id'],
            'scheduled_at' => ['required', 'date', 'after:now'],
            'duration_minutes' => ['required', 'integer', 'min:15'],
            'custom_message' => ['nullable', 'string', 'max:500'],
            'recipient_name' => ['nullable', 'string', 'max:255'],
            'relation_type' => ['nullable', 'string'],
            'emotion_type' => ['nullable', 'string'],
            'location_type' => ['required', 'in:home,online,public'],
            'location_address' => ['nullable', 'string', 'required_if:location_type,home'],
            'location_link' => ['nullable', 'url', 'required_if:location_type,online'],
            'add_to_cart' => ['boolean'], // Si true, ajoute au panier, sinon checkout direct
        ]);

        $service = Service::findOrFail($validated['service_id']);
        $client = Auth::user();

        // Vérifier la disponibilité
        $availability = Availability::where('artist_id', $service->artist_id)
            ->where('date', date('Y-m-d', strtotime($validated['scheduled_at'])))
            ->where('start_time', date('H:i:s', strtotime($validated['scheduled_at'])))
            ->where('is_booked', false)
            ->where('is_blocked', false)
            ->first();

        if (!$availability) {
            return back()->withErrors([
                'scheduled_at' => 'Ce créneau n\'est plus disponible.',
            ]);
        }

        // Calculer le montant total
        $totalAmount = $service->price;
        $commissionRate = config('artdom.commission_rate', 0.15); // 15% par défaut
        $commissionAmount = $totalAmount * $commissionRate;
        $artistEarnings = $totalAmount - $commissionAmount;

        // Générer le numéro de réservation unique
        $reservationNumber = 'RES-'.strtoupper(Str::random(8));

        // Créer la réservation
        $reservation = Reservation::create([
            'reservation_number' => $reservationNumber,
            'client_id' => $client->id,
            'artist_id' => $service->artist_id,
            'service_id' => $service->id,
            'scheduled_at' => $validated['scheduled_at'],
            'duration_minutes' => $validated['duration_minutes'],
            'status' => ReservationStatus::Pending,
            'total_amount' => $totalAmount,
            'commission_rate' => $commissionRate,
            'commission_amount' => $commissionAmount,
            'artist_earnings' => $artistEarnings,
            'custom_message' => $validated['custom_message'] ?? null,
            'recipient_name' => $validated['recipient_name'] ?? null,
            'relation_type' => $validated['relation_type'] ?? null,
            'emotion_type' => $validated['emotion_type'] ?? null,
            'location_type' => $validated['location_type'],
            'location_address' => $validated['location_address'] ?? null,
            'location_link' => $validated['location_link'] ?? null,
            'qr_code' => $this->generateQrCode($reservationNumber), // TODO: Implémenter génération QR
        ]);

        // Marquer la disponibilité comme réservée
        $availability->update(['is_booked' => true]);

        // Si add_to_cart est true, ajouter au panier
        if ($request->boolean('add_to_cart')) {
            $cart = $client->clientProfile->cart ?? $client->clientProfile->cart()->create();
            $cart->items()->create([
                'service_id' => $service->id,
                'quantity' => 1,
                'unit_price' => $totalAmount,
                'scheduled_at' => $validated['scheduled_at'],
            ]);
            $cart->recalculate();

            return redirect()->route('cart.show')->with('message', 'Réservation ajoutée au panier.');
        }

        // Sinon, rediriger vers le paiement
        return redirect()->route('payment.show', $reservation)->with('message', 'Réservation créée. Veuillez procéder au paiement.');
    }

    /**
     * Annule une réservation
     * 
     * Route: DELETE /reservations/{reservation}
     * Middleware: auth, role:client
     * 
     * Logique:
     * 1. Vérifie que la réservation peut être annulée (policy)
     * 2. Annule la réservation
     * 3. Libère la disponibilité
     * 4. Rembourse si nécessaire
     */
    public function cancel(Reservation $reservation): RedirectResponse
    {
        // Vérifier que la réservation appartient au client
        if ($reservation->client_id !== Auth::id()) {
            abort(403);
        }

        // Vérifier que la réservation peut être annulée
        if (!in_array($reservation->status, [ReservationStatus::Pending, ReservationStatus::Confirmed])) {
            return back()->withErrors(['message' => 'Cette réservation ne peut plus être annulée.']);
        }

        // Annuler la réservation
        $reservation->update([
            'status' => ReservationStatus::Cancelled,
            'cancelled_at' => now(),
            'cancel_reason' => 'Annulée par le client',
        ]);

        // Libérer la disponibilité
        $availability = Availability::where('artist_id', $reservation->artist_id)
            ->where('date', $reservation->scheduled_at->format('Y-m-d'))
            ->where('start_time', $reservation->scheduled_at->format('H:i:s'))
            ->first();

        if ($availability) {
            $availability->update(['is_booked' => false]);
        }

        // TODO: Gérer le remboursement si paiement effectué

        return redirect()->route('reservations.index')->with('message', 'Réservation annulée avec succès.');
    }

    /**
     * Crée un avis pour une réservation terminée
     * 
     * Route: POST /reservations/{reservation}/review
     * Middleware: auth, role:client
     */
    public function review(Request $request, Reservation $reservation): RedirectResponse
    {
        // Vérifier que la réservation appartient au client et est terminée
        if ($reservation->client_id !== Auth::id()) {
            abort(403);
        }

        if ($reservation->status !== ReservationStatus::Completed) {
            return back()->withErrors(['message' => 'Vous ne pouvez noter que les réservations terminées.']);
        }

        // Vérifier qu'un avis n'existe pas déjà
        if ($reservation->review) {
            return back()->withErrors(['message' => 'Vous avez déjà laissé un avis pour cette réservation.']);
        }

        $validated = $request->validate([
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'comment' => ['nullable', 'string', 'max:1000'],
        ]);

        Review::create([
            'reservation_id' => $reservation->id,
            'client_id' => $reservation->client_id,
            'artist_id' => $reservation->artist_id,
            'service_id' => $reservation->service_id,
            'rating' => $validated['rating'],
            'comment' => $validated['comment'] ?? null,
        ]);

        return back()->with('message', 'Votre avis a été enregistré. Merci !');
    }

    /**
     * Génère un QR code pour la réservation
     * TODO: Implémenter avec une bibliothèque QR code
     */
    private function generateQrCode(string $reservationNumber): string
    {
        // TODO: Utiliser une bibliothèque comme SimpleSoftwareIO/simple-qrcode
        return 'qr_'.$reservationNumber;
    }
}
