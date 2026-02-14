<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Coupon extends Model
{
    use HasFactory, HasUuids;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'code',
        'description',
        'discount_type',
        'discount_value',
        'min_order_amount',
        'expires_at',
        'usage_limit',
        'is_active',
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
            'discount_value' => 'decimal:2',
            'min_order_amount' => 'decimal:2',
            'expires_at' => 'datetime',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Vérifie si le coupon est valide
     * 
     * Un coupon est valide si :
     * - Il est actif
     * - Il n'est pas expiré (ou n'a pas de date d'expiration)
     * - Il n'a pas atteint sa limite d'utilisation
     */
    public function isValid(): bool
    {
        if (!$this->is_active) {
            return false;
        }

        if ($this->expires_at && $this->expires_at->isPast()) {
            return false;
        }

        if ($this->usage_limit && $this->used_count >= $this->usage_limit) {
            return false;
        }

        return true;
    }

    /**
     * Applique le coupon à un montant et retourne le montant de la réduction
     * 
     * @param float $amount Le montant total
     * @return float Le montant de la réduction
     */
    public function applyTo(float $amount): float
    {
        if ($this->discount_type === 'percentage') {
            // Réduction en pourcentage
            return $amount * ($this->discount_value / 100);
        }

        // Réduction fixe
        return min($this->discount_value, $amount); // Ne peut pas réduire en dessous de 0
    }
}
