<?php

namespace App\Models;

use App\Enums\ReservationStatus;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Reservation extends Model
{
    use HasFactory, HasUuids;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'reservation_number',
        'client_id',
        'artist_id',
        'service_id',
        'scheduled_at',
        'duration_minutes',
        'status',
        'total_amount',
        'commission_rate',
        'commission_amount',
        'artist_earnings',
        'custom_message',
        'recipient_name',
        'relation_type',
        'emotion_type',
        'location_type',
        'location_address',
        'location_link',
        'qr_code',
        'checkin_at',
        'checkout_at',
        'checkin_lat',
        'checkin_lng',
        'cancelled_at',
        'cancel_reason',
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
            'scheduled_at' => 'datetime',
            'total_amount' => 'decimal:2',
            'commission_rate' => 'decimal:2',
            'commission_amount' => 'decimal:2',
            'artist_earnings' => 'decimal:2',
            'status' => ReservationStatus::class,
            'checkin_at' => 'datetime',
            'checkout_at' => 'datetime',
            'checkin_lat' => 'decimal:8',
            'checkin_lng' => 'decimal:8',
            'cancelled_at' => 'datetime',
        ];
    }

    /**
     * Relation : Reservation appartient à UN User (client)
     * Relation N-1 (belongsTo) : Une réservation appartient à un client
     */
    public function client(): BelongsTo
    {
        return $this->belongsTo(User::class, 'client_id');
    }

    /**
     * Relation : Reservation appartient à UN User (artiste)
     * Relation N-1 (belongsTo) : Une réservation appartient à un artiste
     */
    public function artist(): BelongsTo
    {
        return $this->belongsTo(User::class, 'artist_id');
    }

    /**
     * Relation : Reservation appartient à UN Service
     * Relation N-1 (belongsTo) : Une réservation concerne un service spécifique
     */
    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }

    /**
     * Relation : Reservation a UN Payment
     * Relation 1-1 (hasOne) : Une réservation a un seul paiement
     * 
     * Note : Relation optionnelle (nullable) car le paiement peut être créé après
     */
    public function payment(): HasOne
    {
        return $this->hasOne(Payment::class);
    }

    /**
     * Relation : Reservation a UN Review
     * Relation 1-1 (hasOne) : Une réservation peut avoir un seul avis
     * 
     * Note : L'avis est créé après la réservation terminée
     */
    public function review(): HasOne
    {
        return $this->hasOne(Review::class);
    }

    /**
     * Relation : Reservation a UN Conversation
     * Relation 1-1 (hasOne) : Une réservation peut avoir une conversation associée
     * 
     * Note : La conversation permet au client et à l'artiste de communiquer
     */
    public function conversation(): HasOne
    {
        return $this->hasOne(Conversation::class);
    }
}
