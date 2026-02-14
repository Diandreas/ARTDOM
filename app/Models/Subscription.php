<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Subscription extends Model
{
    use HasFactory, HasUuids;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'client_id',
        'plan',
        'price',
        'starts_at',
        'ends_at',
        'is_active',
        'payment_id',
        'cancelled_at',
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
            'price' => 'decimal:2',
            'starts_at' => 'datetime',
            'ends_at' => 'datetime',
            'is_active' => 'boolean',
            'cancelled_at' => 'datetime',
        ];
    }

    /**
     * Relation : Subscription appartient à UN User (client)
     * Relation N-1 (belongsTo) : Un abonnement appartient à un client
     */
    public function client(): BelongsTo
    {
        return $this->belongsTo(User::class, 'client_id');
    }

    /**
     * Relation : Subscription appartient à UN Payment
     * Relation N-1 (belongsTo) : Un abonnement est payé via un paiement
     */
    public function payment(): BelongsTo
    {
        return $this->belongsTo(Payment::class);
    }

    /**
     * Vérifie si l'abonnement est expiré
     */
    public function isExpired(): bool
    {
        if (!$this->ends_at) {
            return false; // Abonnement sans fin
        }

        return $this->ends_at->isPast();
    }

    /**
     * Retourne le nombre de jours restants avant expiration
     */
    public function daysRemaining(): ?int
    {
        if (!$this->ends_at) {
            return null; // Abonnement sans fin
        }

        return max(0, now()->diffInDays($this->ends_at, false));
    }
}
