<?php

namespace App\Http\Controllers\Artist;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Auth;

class SubscriptionController extends Controller
{
    /**
     * Affiche la page de gestion de l'abonnement
     * 
     * Route: GET /artist/subscription
     * Middleware: auth, role:artist
     */
    public function index(): Response
    {
        $artist = Auth::user();

        // Par défaut, si Cashier n'est pas encore complètement configuré ou si on mock:
        // On récupère depuis la DB: $artist->subscription('default')
        $currentSubscription = null;
        
        if (method_exists($artist, 'subscription') && $artist->subscription('default')) {
            $sub = $artist->subscription('default');
            $currentSubscription = [
                'active' => $sub->active(),
                'on_grace_period' => $sub->onGracePeriod(),
                'ends_at' => $sub->ends_at,
                'next_billing_date' => $sub->next_billing_date,
            ];
        }

        // Simuler des plans (normalement configurés dans Stripe/Dashboard)
        $plans = [
            [
                'id' => env('STRIPE_PRICE_ID_PREMIUM', 'price_fake_premium_id'),
                'name' => 'ArtPass Premium',
                'price' => 5000,
                'currency' => 'FCFA',
                'interval' => 'mois',
                'is_popular' => true,
                'features' => [
                    'Badge Profil Vérifié',
                    'Mise en avant dans les recherches',
                    'Accès prioritaire aux nouvelles demandes',
                    'Pas de frais de commission sur les réservations (0%)',
                    'Mode hors-ligne pour la console de gestion',
                    'Statistiques avancées',
                ]
            ],
        ];

        return Inertia::render('Artist/Subscription', [
            'currentSubscription' => $currentSubscription,
            'plans' => $plans,
        ]);
    }

    /**
     * Crée une session Checkout Stripe
     * 
     * Route: POST /artist/subscription/checkout
     * Middleware: auth, role:artist
     */
    public function checkout(Request $request)
    {
        $request->validate([
            'price_id' => 'required|string',
        ]);

        $artist = Auth::user();

        // Créer l'abonnement via Cashier
        // Note : Si l'utilisateur n'a pas encore de customer_id, Cashier le créera
        return $artist->newSubscription('default', $request->price_id)
            ->checkout([
                'success_url' => route('artist.subscription.index', ['session_id' => '{CHECKOUT_SESSION_ID}']),
                'cancel_url' => route('artist.subscription.index'),
            ]);
    }

    /**
     * Annule l'abonnement
     * 
     * Route: POST /artist/subscription/cancel
     */
    public function cancel(Request $request)
    {
        $artist = Auth::user();

        // Annule l'abonnement, mais permet l'accès jusqu'à la fin de la période
        if ($artist->subscription('default')) {
            $artist->subscription('default')->cancel();
        }

        return back()->with('message', 'Votre abonnement a été annulé avec succès.');
    }

    /**
     * Reprend l'abonnement annulé
     * 
     * Route: POST /artist/subscription/resume
     */
    public function resume(Request $request)
    {
        $artist = Auth::user();

        // Annule l'annulation (resume)
        if ($artist->subscription('default') && $artist->subscription('default')->onGracePeriod()) {
            $artist->subscription('default')->resume();
        }

        return back()->with('message', 'Votre abonnement a été réactivé avec succès.');
    }
}
