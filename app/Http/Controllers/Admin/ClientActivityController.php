<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AlbumPurchase;
use App\Models\Cart;
use App\Models\Payment;
use App\Models\Reservation;
use App\Models\Review;
use App\Models\Subscription;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ClientActivityController extends Controller
{
    public function index(Request $request): Response
    {
        $clientId = (string) $request->input('client_id', '');
        $reservationStatus = (string) $request->input('reservation_status', 'all');
        $subscriptionStatus = (string) $request->input('subscription_status', 'all');

        $reservationsQuery = Reservation::query()
            ->with(['client.clientProfile', 'artist.artistProfile', 'service'])
            ->whereNotNull('client_id')
            ->when($clientId !== '', fn ($query) => $query->where('client_id', $clientId))
            ->when($reservationStatus !== 'all', fn ($query) => $query->where('status', $reservationStatus))
            ->latest('created_at');

        $cartsQuery = Cart::query()
            ->with(['client.clientProfile', 'items.service'])
            ->when($clientId !== '', fn ($query) => $query->where('client_id', $clientId))
            ->withCount('items')
            ->latest('updated_at');

        $subscriptionsQuery = Subscription::query()
            ->with(['client.clientProfile', 'payment'])
            ->when($clientId !== '', fn ($query) => $query->where('client_id', $clientId))
            ->when($subscriptionStatus === 'active', fn ($query) => $query->where('is_active', true))
            ->when($subscriptionStatus === 'inactive', fn ($query) => $query->where('is_active', false))
            ->latest('created_at');

        $reservations = $reservationsQuery
            ->paginate(20, ['*'], 'reservations_page')
            ->withQueryString()
            ->through(function (Reservation $reservation): array {
                $clientFullName = trim((string) (($reservation->client?->clientProfile?->first_name ?? '').' '.($reservation->client?->clientProfile?->last_name ?? '')));
                $artistName = $reservation->artist?->artistProfile?->stage_name ?? $reservation->artist?->email;

                return [
                    'id' => $reservation->id,
                    'reservation_number' => $reservation->reservation_number,
                    'client_id' => $reservation->client_id,
                    'client_name' => $clientFullName !== '' ? $clientFullName : ($reservation->client?->email ?? 'N/A'),
                    'artist_name' => $artistName,
                    'service_title' => $reservation->service?->title,
                    'status' => is_string($reservation->status) ? $reservation->status : $reservation->status->value,
                    'total_amount' => (float) $reservation->total_amount,
                    'created_at' => $reservation->created_at?->toIso8601String(),
                    'scheduled_at' => $reservation->scheduled_at?->toIso8601String(),
                ];
            });

        $carts = $cartsQuery
            ->paginate(20, ['*'], 'carts_page')
            ->withQueryString()
            ->through(function (Cart $cart): array {
                $clientFullName = trim((string) (($cart->client?->clientProfile?->first_name ?? '').' '.($cart->client?->clientProfile?->last_name ?? '')));

                return [
                    'id' => $cart->id,
                    'client_id' => $cart->client_id,
                    'client_name' => $clientFullName !== '' ? $clientFullName : ($cart->client?->email ?? 'N/A'),
                    'items_count' => (int) ($cart->items_count ?? 0),
                    'coupon_code' => $cart->coupon_code,
                    'discount' => (float) $cart->discount,
                    'total_amount' => (float) $cart->total_amount,
                    'updated_at' => $cart->updated_at?->toIso8601String(),
                    'items' => $cart->items->map(fn ($item): array => [
                        'id' => $item->id,
                        'service_title' => $item->service?->title,
                        'quantity' => $item->quantity,
                        'unit_price' => (float) $item->unit_price,
                        'scheduled_at' => $item->scheduled_at?->toIso8601String(),
                    ])->values()->all(),
                ];
            });

        $subscriptions = $subscriptionsQuery
            ->paginate(20, ['*'], 'subscriptions_page')
            ->withQueryString()
            ->through(function (Subscription $subscription): array {
                $clientFullName = trim((string) (($subscription->client?->clientProfile?->first_name ?? '').' '.($subscription->client?->clientProfile?->last_name ?? '')));

                return [
                    'id' => $subscription->id,
                    'client_id' => $subscription->client_id,
                    'client_name' => $clientFullName !== '' ? $clientFullName : ($subscription->client?->email ?? 'N/A'),
                    'plan' => $subscription->plan,
                    'price' => (float) $subscription->price,
                    'is_active' => (bool) $subscription->is_active,
                    'starts_at' => $subscription->starts_at?->toIso8601String(),
                    'ends_at' => $subscription->ends_at?->toIso8601String(),
                    'cancelled_at' => $subscription->cancelled_at?->toIso8601String(),
                    'payment_status' => $subscription->payment ? (is_string($subscription->payment->status) ? $subscription->payment->status : $subscription->payment->status->value) : null,
                    'created_at' => $subscription->created_at?->toIso8601String(),
                ];
            });

        $activity = collect();

        Reservation::query()
            ->when($clientId !== '', fn ($query) => $query->where('client_id', $clientId))
            ->latest('created_at')
            ->limit(50)
            ->get(['id', 'client_id', 'status', 'created_at'])
            ->each(function (Reservation $reservation) use ($activity): void {
                $activity->push([
                    'type' => 'reservation',
                    'title' => 'Reservation '.$reservation->id,
                    'description' => 'Statut: '.(is_string($reservation->status) ? $reservation->status : $reservation->status->value),
                    'client_id' => $reservation->client_id,
                    'occurred_at' => $reservation->created_at?->toIso8601String(),
                ]);
            });

        Cart::query()
            ->when($clientId !== '', fn ($query) => $query->where('client_id', $clientId))
            ->latest('updated_at')
            ->limit(50)
            ->get(['id', 'client_id', 'updated_at'])
            ->each(function (Cart $cart) use ($activity): void {
                $activity->push([
                    'type' => 'cart',
                    'title' => 'Mise a jour panier',
                    'description' => 'Panier #'.$cart->id,
                    'client_id' => $cart->client_id,
                    'occurred_at' => ($cart->updated_at ?: $cart->created_at)?->toIso8601String(),
                ]);
            });

        Subscription::query()
            ->when($clientId !== '', fn ($query) => $query->where('client_id', $clientId))
            ->latest('created_at')
            ->limit(50)
            ->get(['id', 'client_id', 'plan', 'is_active', 'created_at'])
            ->each(function (Subscription $subscription) use ($activity): void {
                $activity->push([
                    'type' => 'subscription',
                    'title' => 'Abonnement '.$subscription->plan,
                    'description' => $subscription->is_active ? 'Actif' : 'Inactif',
                    'client_id' => $subscription->client_id,
                    'occurred_at' => $subscription->created_at?->toIso8601String(),
                ]);
            });

        AlbumPurchase::query()
            ->when($clientId !== '', fn ($query) => $query->where('client_id', $clientId))
            ->latest('created_at')
            ->limit(50)
            ->get(['id', 'client_id', 'price_paid', 'created_at'])
            ->each(function (AlbumPurchase $purchase) use ($activity): void {
                $activity->push([
                    'type' => 'purchase',
                    'title' => 'Achat album',
                    'description' => (float) $purchase->price_paid.' FCFA',
                    'client_id' => $purchase->client_id,
                    'occurred_at' => $purchase->created_at?->toIso8601String(),
                ]);
            });

        Review::query()
            ->when($clientId !== '', fn ($query) => $query->where('client_id', $clientId))
            ->latest('created_at')
            ->limit(50)
            ->get(['id', 'client_id', 'rating', 'created_at'])
            ->each(function (Review $review) use ($activity): void {
                $activity->push([
                    'type' => 'review',
                    'title' => 'Avis client',
                    'description' => 'Note '.$review->rating.'/5',
                    'client_id' => $review->client_id,
                    'occurred_at' => $review->created_at?->toIso8601String(),
                ]);
            });

        Payment::query()
            ->when($clientId !== '', fn ($query) => $query->where('client_id', $clientId))
            ->latest('created_at')
            ->limit(50)
            ->get(['id', 'client_id', 'amount', 'status', 'created_at'])
            ->each(function (Payment $payment) use ($activity): void {
                $activity->push([
                    'type' => 'payment',
                    'title' => 'Paiement',
                    'description' => (float) $payment->amount.' FCFA - '.(is_string($payment->status) ? $payment->status : $payment->status->value),
                    'client_id' => $payment->client_id,
                    'occurred_at' => $payment->created_at?->toIso8601String(),
                ]);
            });

        $clients = User::query()
            ->where('role', 'client')
            ->with('clientProfile')
            ->orderBy('created_at', 'desc')
            ->get(['id', 'email'])
            ->map(function (User $client): array {
                $fullName = trim((string) (($client->clientProfile?->first_name ?? '').' '.($client->clientProfile?->last_name ?? '')));

                return [
                    'id' => $client->id,
                    'label' => $fullName !== '' ? $fullName.' ('.$client->email.')' : $client->email,
                ];
            })
            ->values();

        return Inertia::render('Admin/ClientActivity', [
            'filters' => [
                'client_id' => $clientId,
                'reservation_status' => $reservationStatus,
                'subscription_status' => $subscriptionStatus,
            ],
            'clients' => $clients,
            'reservations' => $reservations,
            'carts' => $carts,
            'subscriptions' => $subscriptions,
            'activity' => $activity
                ->filter(fn (array $entry): bool => ! empty($entry['occurred_at']))
                ->sortByDesc('occurred_at')
                ->take(200)
                ->values(),
            'summary' => [
                'reservations_count' => $reservationsQuery->count(),
                'carts_count' => $cartsQuery->count(),
                'subscriptions_count' => $subscriptionsQuery->count(),
            ],
        ]);
    }
}
