<?php

namespace App\Http\Controllers\Client;

use App\Enums\ReservationStatus;
use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Coupon;
use App\Models\Reservation;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class CartController extends Controller
{
    /**
     * Affiche le panier du client
     * 
     * Route: GET /cart
     * Middleware: auth, role:client
     * 
     * Affiche tous les articles du panier avec :
     * - Détails de chaque item
     * - Sous-total
     * - Réduction (coupon)
     * - Total final
     */
    public function show(): Response
    {
        $client = Auth::user();
        $cart = $client->clientProfile->cart;

        // Créer un panier vide si n'existe pas
        if (!$cart) {
            $cart = $client->clientProfile->cart()->create();
        }

        $cart->load(['items.service.artist.artistProfile', 'coupon']);

        return Inertia::render('Client/Cart', [
            'cart' => $cart,
        ]);
    }

    /**
     * Ajoute un article au panier
     * 
     * Route: POST /cart/items
     * Middleware: auth, role:client
     * 
     * Logique:
     * 1. Valide les données (service, quantité, date)
     * 2. Vérifie la disponibilité
     * 3. Crée ou met à jour l'item dans le panier
     * 4. Recalcule le total du panier
     */
    public function addItem(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'service_id' => ['required', 'exists:services,id'],
            'quantity' => ['required', 'integer', 'min:1', 'max:10'],
            'scheduled_at' => ['required', 'date', 'after:now'],
            'customization' => ['nullable', 'array'],
        ]);

        $client = Auth::user();
        $cart = $client->clientProfile->cart ?? $client->clientProfile->cart()->create();

        $service = \App\Models\Service::findOrFail($validated['service_id']);

        // Vérifier la disponibilité
        // TODO: Vérifier que le créneau est disponible

        // Créer ou mettre à jour l'item
        $cartItem = $cart->items()->updateOrCreate(
            [
                'service_id' => $service->id,
                'scheduled_at' => $validated['scheduled_at'],
            ],
            [
                'quantity' => $validated['quantity'],
                'unit_price' => $service->price,
                'customization' => $validated['customization'] ?? null,
            ]
        );

        // Recalculer le total
        $cart->recalculate();

        return back()->with('message', 'Article ajouté au panier.');
    }

    /**
     * Supprime un article du panier
     * 
     * Route: DELETE /cart/items/{item}
     * Middleware: auth, role:client
     */
    public function removeItem(CartItem $item): RedirectResponse
    {
        // Vérifier que l'item appartient au panier du client
        $client = Auth::user();
        if ($item->cart->client_id !== $client->id) {
            abort(403);
        }

        $item->delete();

        // Recalculer le total
        $item->cart->recalculate();

        return back()->with('message', 'Article retiré du panier.');
    }

    /**
     * Applique un coupon de réduction
     * 
     * Route: POST /cart/coupon
     * Middleware: auth, role:client
     */
    public function applyCoupon(Request $request): RedirectResponse
    {
        $request->validate([
            'code' => ['required', 'string'],
        ]);

        $client = Auth::user();
        $cart = $client->clientProfile->cart;

        if (!$cart || $cart->items->isEmpty()) {
            return back()->withErrors(['code' => 'Votre panier est vide.']);
        }

        if ($cart->applyCoupon($request->code)) {
            return back()->with('message', 'Coupon appliqué avec succès.');
        }

        return back()->withErrors(['code' => 'Code coupon invalide ou expiré.']);
    }

    /**
     * Retire le coupon du panier
     * 
     * Route: DELETE /cart/coupon
     * Middleware: auth, role:client
     */
    public function removeCoupon(): RedirectResponse
    {
        $client = Auth::user();
        $cart = $client->clientProfile->cart;

        if ($cart) {
            $cart->update([
                'coupon_code' => null,
                'discount' => 0,
            ]);
            $cart->recalculate();
        }

        return back()->with('message', 'Coupon retiré.');
    }

    /**
     * Procède au checkout (création des réservations et paiement)
     * 
     * Route: POST /cart/checkout
     * Middleware: auth, role:client
     * 
     * Logique:
     * 1. Vérifie que le panier n'est pas vide
     * 2. Crée une réservation pour chaque item
     * 3. Crée un paiement groupé
     * 4. Vide le panier
     * 5. Redirige vers la page de paiement
     */
    public function checkout(Request $request): RedirectResponse
    {
        $client = Auth::user();
        $cart = $client->clientProfile->cart;

        if (!$cart || $cart->items->isEmpty()) {
            return back()->withErrors(['message' => 'Votre panier est vide.']);
        }

        $reservations = [];

        // Créer une réservation pour chaque item
        foreach ($cart->items as $item) {
            $service = $item->service;
            $totalAmount = $item->getSubtotal();
            $commissionRate = config('artdom.commission_rate', 0.15);
            $commissionAmount = $totalAmount * $commissionRate;
            $artistEarnings = $totalAmount - $commissionAmount;

            $reservation = Reservation::create([
                'reservation_number' => 'RES-'.strtoupper(Str::random(8)),
                'client_id' => $client->id,
                'artist_id' => $service->artist_id,
                'service_id' => $service->id,
                'scheduled_at' => $item->scheduled_at,
                'duration_minutes' => $service->duration_minutes,
                'status' => ReservationStatus::Pending,
                'total_amount' => $totalAmount,
                'commission_rate' => $commissionRate,
                'commission_amount' => $commissionAmount,
                'artist_earnings' => $artistEarnings,
                'location_type' => 'home', // TODO: Récupérer depuis customization
                'qr_code' => 'qr_'.Str::random(10),
            ]);

            $reservations[] = $reservation;
        }

        // Calculer le total de toutes les réservations
        $totalAmount = collect($reservations)->sum('total_amount');
        $discount = $cart->discount ?? 0;
        $finalAmount = $totalAmount - $discount;

        // Créer un paiement groupé
        $payment = \App\Models\Payment::create([
            'client_id' => $client->id,
            'amount' => $finalAmount,
            'currency' => 'XAF',
            'method' => 'pending', // Sera défini lors du choix du moyen de paiement
            'status' => \App\Enums\PaymentStatus::Pending,
        ]);

        // Lier les réservations au paiement
        foreach ($reservations as $reservation) {
            $reservation->update(['payment_id' => $payment->id]);
        }

        // Vider le panier
        $cart->items()->delete();
        $cart->update([
            'coupon_code' => null,
            'discount' => 0,
            'total_amount' => 0,
        ]);

        // Rediriger vers le paiement
        return redirect()->route('payment.show', $reservations[0])->with('message', 'Réservations créées. Veuillez procéder au paiement.');
    }
}
