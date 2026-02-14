<?php

namespace App\Http\Controllers\Client;

use App\Enums\PaymentStatus;
use App\Enums\ReservationStatus;
use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\Reservation;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class PaymentController extends Controller
{
    /**
     * Affiche la page de paiement pour une réservation
     * 
     * Route: GET /payment/{reservation}
     * Middleware: auth, role:client
     * 
     * Affiche les options de paiement disponibles :
     * - Mobile Money (Orange, MTN)
     * - Carte bancaire (Stripe/Paystack)
     * - PayPal
     * - Virement bancaire
     */
    public function show(Reservation $reservation): Response
    {
        // Vérifier que la réservation appartient au client
        if ($reservation->client_id !== Auth::id()) {
            abort(403);
        }

        $reservation->load(['service', 'artist.artistProfile']);

        return Inertia::render('Client/Payment', [
            'reservation' => $reservation,
            'paymentMethods' => [
                'mobile_money_orange' => 'Orange Money',
                'mobile_money_mtn' => 'MTN Money',
                'card_stripe' => 'Carte bancaire (Stripe)',
                'paypal' => 'PayPal',
                'bank_transfer' => 'Virement bancaire',
            ],
        ]);
    }

    /**
     * Initie le processus de paiement
     * 
     * Route: POST /payment/{reservation}
     * Middleware: auth, role:client
     * 
     * Logique:
     * 1. Valide le moyen de paiement choisi
     * 2. Crée ou met à jour le paiement
     * 3. Redirige vers le provider de paiement ou traite le paiement
     */
    public function initiate(Request $request, Reservation $reservation): RedirectResponse
    {
        if ($reservation->client_id !== Auth::id()) {
            abort(403);
        }

        $validated = $request->validate([
            'method' => ['required', 'in:mobile_money_orange,mobile_money_mtn,card_stripe,paypal,bank_transfer'],
            'phone' => ['required_if:method,mobile_money_orange,mobile_money_mtn', 'string'],
            'card_token' => ['required_if:method,card_stripe', 'string'],
        ]);

        // Créer ou mettre à jour le paiement
        $payment = $reservation->payment ?? Payment::create([
            'reservation_id' => $reservation->id,
            'client_id' => Auth::id(),
            'amount' => $reservation->total_amount,
            'currency' => 'XAF',
            'method' => $validated['method'],
            'status' => PaymentStatus::Processing,
        ]);

        // Traiter selon le moyen de paiement
        switch ($validated['method']) {
            case 'mobile_money_orange':
            case 'mobile_money_mtn':
                // TODO: Appeler l'API Mobile Money
                return $this->processMobileMoney($payment, $validated['method'], $validated['phone']);

            case 'card_stripe':
                // TODO: Appeler Stripe
                return $this->processStripe($payment, $validated['card_token']);

            case 'paypal':
                // TODO: Rediriger vers PayPal
                return redirect()->away('https://paypal.com/...');

            case 'bank_transfer':
                // Afficher les coordonnées bancaires
                return redirect()->route('payment.bank-transfer', $payment);
        }
    }

    /**
     * Gère le callback du provider de paiement
     * 
     * Route: GET /payment/callback
     * 
     * Appelé après le paiement pour confirmer le statut
     */
    public function callback(Request $request): RedirectResponse
    {
        // TODO: Vérifier la signature du callback
        // TODO: Mettre à jour le statut du paiement
        // TODO: Confirmer la réservation si paiement réussi

        return redirect()->route('reservations.index')->with('message', 'Paiement effectué avec succès !');
    }

    /**
     * Gère les webhooks des providers de paiement
     * 
     * Route: POST /payment/webhook/{provider}
     * 
     * Appelé de manière asynchrone par les providers
     */
    public function webhook(Request $request, string $provider): \Illuminate\Http\Response
    {
        // TODO: Vérifier la signature du webhook
        // TODO: Traiter la notification de paiement
        // TODO: Mettre à jour le statut du paiement et de la réservation

        return response('OK', 200);
    }

    /**
     * Télécharge le reçu de paiement en PDF
     * 
     * Route: GET /payment/{payment}/receipt
     */
    public function receipt(Payment $payment): \Illuminate\Http\Response
    {
        if ($payment->client_id !== Auth::id()) {
            abort(403);
        }

        // TODO: Générer le PDF du reçu
        // return PDF::loadView('receipt', ['payment' => $payment])->download();

        return response('Receipt PDF', 200);
    }

    /**
     * Traite un paiement Mobile Money
     */
    private function processMobileMoney(Payment $payment, string $method, string $phone): RedirectResponse
    {
        // TODO: Appeler l'API Mobile Money
        // TODO: Stocker provider_ref

        return redirect()->route('payment.callback')->with('payment_id', $payment->id);
    }

    /**
     * Traite un paiement Stripe
     */
    private function processStripe(Payment $payment, string $cardToken): RedirectResponse
    {
        // TODO: Appeler Stripe API
        // TODO: Stocker provider_ref

        return redirect()->route('payment.callback')->with('payment_id', $payment->id);
    }
}
