<?php

namespace App\Http\Controllers;

use App\Http\Requests\AddToCartRequest;
use App\Http\Requests\ApplyCouponRequest;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Service;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CartController extends Controller
{
    /**
     * Affiche le panier du client
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        $cart = Cart::firstOrCreate(
            ['client_id' => $user->id],
            ['total_amount' => 0]
        );

        $cart->load([
            'items.service.artist.artistProfile',
            'coupon',
        ]);

        $items = $cart->items->map(function ($item) {
            return [
                'id' => $item->id,
                'service' => [
                    'id' => $item->service->id,
                    'title' => $item->service->title,
                    'artist' => [
                        'id' => $item->service->artist->id,
                        'stage_name' => $item->service->artist->artistProfile->stage_name ?? $item->service->artist->name,
                        'photo_url' => $item->service->artist->artistProfile->photo_url ?? null,
                    ],
                ],
                'quantity' => $item->quantity,
                'unit_price' => (float) $item->unit_price,
                'subtotal' => $item->getSubtotal(),
                'customization' => $item->customization,
                'scheduled_at' => $item->scheduled_at?->format('d/m/Y H:i'),
            ];
        });

        $subtotal = $cart->items->sum(fn ($item) => $item->getSubtotal());
        $discount = (float) $cart->discount ?? 0;
        $serviceFee = $subtotal * 0.05; // 5% frais de service ARTDOM
        $total = $subtotal - $discount + $serviceFee;

        return Inertia::render('Client/Cart/Index', [
            'cart' => [
                'id' => $cart->id,
                'items' => $items,
                'coupon_code' => $cart->coupon_code,
                'subtotal' => $subtotal,
                'discount' => $discount,
                'service_fee' => $serviceFee,
                'total' => $total,
            ],
        ]);
    }

    /**
     * Ajoute un item au panier
     */
    public function addItem(AddToCartRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $user = $request->user();

        $cart = Cart::firstOrCreate(
            ['client_id' => $user->id],
            ['total_amount' => 0]
        );

        $service = Service::findOrFail($validated['service_id']);

        // Créer l'item
        $cart->items()->create([
            'service_id' => $service->id,
            'quantity' => $validated['quantity'],
            'unit_price' => $service->price,
            'customization' => $validated['customization'] ?? null,
            'scheduled_at' => $validated['scheduled_at'],
        ]);

        // Recalculer le total
        $cart->recalculate();

        return redirect()->back()->with('toast', [
            'type' => 'success',
            'message' => 'Service ajouté au panier',
        ]);
    }

    /**
     * Retire un item du panier
     */
    public function removeItem(Request $request, CartItem $item): RedirectResponse
    {
        $user = $request->user();
        $cart = $item->cart;

        // Vérifier que l'item appartient bien au panier de l'utilisateur
        if ($cart->client_id !== $user->id) {
            abort(403, 'Non autorisé');
        }

        $item->delete();

        // Recalculer le total
        $cart->recalculate();

        return redirect()->back()->with('toast', [
            'type' => 'success',
            'message' => 'Service retiré du panier',
        ]);
    }

    /**
     * Applique un coupon au panier
     */
    public function applyCoupon(ApplyCouponRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $user = $request->user();

        $cart = Cart::where('client_id', $user->id)->firstOrFail();

        $success = $cart->applyCoupon($validated['code']);

        if (! $success) {
            return redirect()->back()->withErrors([
                'code' => 'Ce code promo est invalide ou ne peut pas être appliqué à votre panier.',
            ])->with('toast', [
                'type' => 'error',
                'message' => 'Code promo invalide',
            ]);
        }

        return redirect()->back()->with('toast', [
            'type' => 'success',
            'message' => 'Code promo appliqué avec succès',
        ]);
    }

    /**
     * Vide le panier
     */
    public function clear(Request $request): RedirectResponse
    {
        $user = $request->user();
        $cart = Cart::where('client_id', $user->id)->first();

        if ($cart) {
            $cart->items()->delete();
            $cart->coupon_code = null;
            $cart->discount = 0;
            $cart->total_amount = 0;
            $cart->save();
        }

        return redirect()->back()->with('toast', [
            'type' => 'success',
            'message' => 'Panier vidé',
        ]);
    }
}
