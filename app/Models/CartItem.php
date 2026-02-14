<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CartItem extends Model
{
    use HasFactory, HasUuids;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'cart_id',
        'service_id',
        'quantity',
        'unit_price',
        'customization',
        'scheduled_at',
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
            'unit_price' => 'decimal:2',
            'customization' => 'array',
            'scheduled_at' => 'datetime',
        ];
    }

    /**
     * Relation : CartItem appartient à UN Cart
     * Relation N-1 (belongsTo) : Un article de panier appartient à un panier
     */
    public function cart(): BelongsTo
    {
        return $this->belongsTo(Cart::class);
    }

    /**
     * Relation : CartItem appartient à UN Service
     * Relation N-1 (belongsTo) : Un article de panier référence un service
     */
    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }

    /**
     * Calcule le sous-total pour cet item (prix unitaire × quantité)
     */
    public function getSubtotal(): float
    {
        return (float) $this->unit_price * $this->quantity;
    }
}
