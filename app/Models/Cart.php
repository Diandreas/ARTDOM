<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Cart extends Model
{
    use HasFactory, HasUuids;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'client_id',
        'coupon_code',
        'discount',
        'total_amount',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'id' => 'string',
            'discount' => 'decimal:2',
            'total_amount' => 'decimal:2',
        ];
    }

    /**
     * Relation : Cart appartient à UN User (client)
     * Relation N-1 (belongsTo) : Un panier appartient à un client
     */
    public function client(): BelongsTo
    {
        return $this->belongsTo(User::class, 'client_id');
    }

    /**
     * Relation : Cart a PLUSIEURS CartItems
     * Relation 1-N (hasMany) : Un panier contient plusieurs articles
     */
    public function items(): HasMany
    {
        return $this->hasMany(CartItem::class);
    }

    /**
     * Relation : Cart peut avoir UN Coupon
     * Relation N-1 (belongsTo) : Un panier peut avoir un coupon appliqué
     * 
     * Note : La clé étrangère est 'coupon_code' (pas 'coupon_id')
     * On utilise 'code' comme clé de référence dans Coupon
     */
    public function coupon(): BelongsTo
    {
        return $this->belongsTo(Coupon::class, 'coupon_code', 'code');
    }

    /**
     * Recalcule le total du panier en fonction des items
     */
    public function recalculate(): void
    {
        $subtotal = $this->items->sum(fn ($item) => $item->getSubtotal());
        $discount = $this->discount ?? 0;
        $this->total_amount = $subtotal - $discount;
        $this->save();
    }

    /**
     * Applique un coupon au panier
     */
    public function applyCoupon(string $code): bool
    {
        $coupon = Coupon::where('code', $code)->first();

        if (!$coupon || !$coupon->isValid()) {
            return false;
        }

        $subtotal = $this->items->sum(fn ($item) => $item->getSubtotal());

        if ($subtotal < $coupon->min_order_amount) {
            return false;
        }

        $this->coupon_code = $code;
        $this->discount = $coupon->applyTo($subtotal);
        $this->recalculate();

        return true;
    }

    /**
     * Crée les réservations à partir du panier
     */
    public function checkout(): array
    {
        $reservations = [];

        foreach ($this->items as $item) {
            // Créer une réservation pour chaque item
            // Cette logique sera complétée plus tard
        }

        return $reservations;
    }
}
