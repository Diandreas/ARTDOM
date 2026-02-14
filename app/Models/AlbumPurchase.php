<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AlbumPurchase extends Model
{
    use HasFactory, HasUuids;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'client_id',
        'album_id',
        'payment_id',
        'price_paid',
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
            'price_paid' => 'decimal:2',
        ];
    }

    /**
     * Relation : AlbumPurchase appartient à UN User (client)
     * Relation N-1 (belongsTo) : Un achat d'album appartient à un client
     */
    public function client(): BelongsTo
    {
        return $this->belongsTo(User::class, 'client_id');
    }

    /**
     * Relation : AlbumPurchase appartient à UN Album
     * Relation N-1 (belongsTo) : Un achat concerne un album
     */
    public function album(): BelongsTo
    {
        return $this->belongsTo(Album::class);
    }

    /**
     * Relation : AlbumPurchase appartient à UN Payment
     * Relation N-1 (belongsTo) : Un achat est payé via un paiement
     */
    public function payment(): BelongsTo
    {
        return $this->belongsTo(Payment::class);
    }
}
