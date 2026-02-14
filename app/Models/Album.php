<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Album extends Model
{
    use HasFactory, HasUuids;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'artist_id',
        'title',
        'year',
        'genre',
        'cover_url',
        'price',
        'is_streamable',
        'is_purchasable',
        'total_plays',
        'published_at',
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
            'is_streamable' => 'boolean',
            'is_purchasable' => 'boolean',
            'published_at' => 'datetime',
        ];
    }

    /**
     * Relation : Album appartient à UN User (artiste)
     * Relation N-1 (belongsTo) : Un album appartient à un artiste
     */
    public function artist(): BelongsTo
    {
        return $this->belongsTo(User::class, 'artist_id');
    }

    /**
     * Relation : Album a PLUSIEURS Tracks
     * Relation 1-N (hasMany) : Un album contient plusieurs pistes
     * 
     * Note : Ordonné par track_number pour respecter l'ordre de l'album
     */
    public function tracks(): HasMany
    {
        return $this->hasMany(Track::class)->orderBy('track_number');
    }

    /**
     * Relation : Album peut avoir PLUSIEURS AlbumPurchases
     * Relation 1-N (hasMany) : Un album peut être acheté plusieurs fois
     */
    public function purchases(): HasMany
    {
        return $this->hasMany(AlbumPurchase::class);
    }

    /**
     * Vérifie si l'album a été acheté par un utilisateur
     */
    public function isPurchasedBy(string $userId): bool
    {
        return $this->purchases()
            ->where('client_id', $userId)
            ->exists();
    }

    /**
     * Incrémente le nombre total de lectures de l'album
     */
    public function incrementPlays(): void
    {
        $this->increment('total_plays');
    }
}
