<?php

namespace App\Http\Controllers\Client;

use App\Enums\PaymentStatus;
use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\Subscription;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class SubscriptionController extends Controller
{
    /**
     * Affiche la page d'abonnement
     * 
     * Route: GET /subscription
     * Middleware: auth, role:client
     * 
     * Affiche :
     * - Plans disponibles (Free, Monthly, Annual)
     * - Avantages de chaque plan
     * - Statut de l'abonnement actuel
     */
    public function show(): Response
    {
        $client = Auth::user();
        $currentSubscription = $client->clientProfile
            ->subscriptions()
            ->where('is_active', true)
            ->first();

        $plans = [
            'free' => [
                'name' => 'Gratuit',
                'price' => 0,
                'features' => [
                    'Streaming avec publicité',
                    'Accès limité aux contenus',
                ],
            ],
            'monthly' => [
                'name' => 'Mensuel',
                'price' => 5000, // XAF
                'features' => [
                    'Streaming sans publicité',
                    'Téléchargement illimité',
                    'Accès anticipé aux nouveautés',
                    'Réduction 10% sur les réservations',
                ],
            ],
            'annual' => [
                'name' => 'Annuel',
                'price' => 50000, // XAF (économise 2 mois)
                'features' => [
                    'Streaming sans publicité',
                    'Téléchargement illimité',
                    'Accès anticipé aux nouveautés',
                    'Réduction 10% sur les réservations',
                    'Économisez 2 mois',
                ],
            ],
        ];

        return Inertia::render('Client/Subscription', [
            'currentSubscription' => $currentSubscription,
            'plans' => $plans,
        ]);
    }

    /**
     * Crée un nouvel abonnement
     * 
     * Route: POST /subscription
     * Middleware: auth, role:client
     * 
     * Logique:
     * 1. Valide le plan choisi
     * 2. Crée l'abonnement
     * 3. Initie le paiement
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'plan' => ['required', 'in:monthly,annual'],
        ]);

        $client = Auth::user();
        $clientProfile = $client->clientProfile;

        // Désactiver l'abonnement actuel s'il existe
        $clientProfile->subscriptions()
            ->where('is_active', true)
            ->update(['is_active' => false, 'cancelled_at' => now()]);

        // Calculer les dates
        $startsAt = now();
        $endsAt = match ($validated['plan']) {
            'monthly' => $startsAt->copy()->addMonth(),
            'annual' => $startsAt->copy()->addYear(),
        };

        $price = match ($validated['plan']) {
            'monthly' => 5000,
            'annual' => 50000,
        };

        // Créer l'abonnement
        $subscription = Subscription::create([
            'client_id' => $client->id,
            'plan' => $validated['plan'],
            'price' => $price,
            'starts_at' => $startsAt,
            'ends_at' => $endsAt,
            'is_active' => false, // Actif après paiement
        ]);

        // Créer le paiement
        $payment = Payment::create([
            'client_id' => $client->id,
            'amount' => $price,
            'currency' => 'XAF',
            'method' => 'pending',
            'status' => PaymentStatus::Pending,
        ]);

        $subscription->update(['payment_id' => $payment->id]);

        // Rediriger vers le paiement
        return redirect()->route('payment.show', ['reservation' => null, 'subscription' => $subscription->id])
            ->with('message', 'Veuillez procéder au paiement pour activer votre abonnement.');
    }

    /**
     * Annule un abonnement actif
     * 
     * Route: DELETE /subscription
     * Middleware: auth, role:client
     * 
     * L'abonnement reste actif jusqu'à la fin de la période payée
     */
    public function cancel(): RedirectResponse
    {
        $client = Auth::user();
        $subscription = $client->clientProfile
            ->subscriptions()
            ->where('is_active', true)
            ->first();

        if (!$subscription) {
            return back()->withErrors(['message' => 'Aucun abonnement actif trouvé.']);
        }

        $subscription->update([
            'is_active' => false,
            'cancelled_at' => now(),
        ]);

        return back()->with('message', 'Votre abonnement a été annulé. Il restera actif jusqu\'à '.$subscription->ends_at->format('d/m/Y').'.');
    }

    /**
     * Change de plan d'abonnement
     * 
     * Route: PUT /subscription
     * Middleware: auth, role:client
     */
    public function upgrade(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'plan' => ['required', 'in:monthly,annual'],
        ]);

        // Annuler l'abonnement actuel et créer le nouveau
        $this->cancel();
        return $this->store($request);
    }
}
