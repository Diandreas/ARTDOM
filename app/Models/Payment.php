<?php

namespace App\Models;

use App\Enums\PaymentStatus;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    use HasFactory, HasUuids;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'reservation_id',
        'client_id',
        'amount',
        'currency',
        'method',
        'provider_ref',
        'status',
        'metadata',
        'paid_at',
        'failed_at',
        'refunded_at',
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
            'amount' => 'decimal:2',
            'metadata' => 'array',
            'paid_at' => 'datetime',
            'failed_at' => 'datetime',
            'refunded_at' => 'datetime',
            'status' => PaymentStatus::class,
        ];
    }

    /**
     * Relation : Payment appartient à UN Reservation (optionnel)
     * Relation N-1 (belongsTo) : Un paiement peut être lié à une réservation
     * 
     * Note : Nullable car un paiement peut être pour un abonnement aussi
     */
    public function reservation(): BelongsTo
    {
        return $this->belongsTo(Reservation::class);
    }

    /**
     * Relation : Payment appartient à UN User (client)
     * Relation N-1 (belongsTo) : Un paiement appartient à un client
     */
    public function client(): BelongsTo
    {
        return $this->belongsTo(User::class, 'client_id');
    }
}
