<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Review extends Model
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
        'artist_id',
        'service_id',
        'rating',
        'comment',
        'is_reported',
        'report_reason',
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
            'is_reported' => 'boolean',
        ];
    }

    /**
     * Relation : Review appartient à UN Reservation
     * Relation N-1 (belongsTo) : Un avis appartient à une réservation
     * 
     * Note : Relation unique (une réservation = un seul avis)
     */
    public function reservation(): BelongsTo
    {
        return $this->belongsTo(Reservation::class);
    }

    /**
     * Relation : Review appartient à UN User (client)
     * Relation N-1 (belongsTo) : Un avis est écrit par un client
     */
    public function client(): BelongsTo
    {
        return $this->belongsTo(User::class, 'client_id');
    }

    /**
     * Relation : Review appartient à UN User (artiste)
     * Relation N-1 (belongsTo) : Un avis concerne un artiste
     */
    public function artist(): BelongsTo
    {
        return $this->belongsTo(User::class, 'artist_id');
    }

    /**
     * Relation : Review appartient à UN Service
     * Relation N-1 (belongsTo) : Un avis concerne un service spécifique
     */
    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }
}
