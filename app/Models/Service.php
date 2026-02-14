<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Service extends Model
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
        'description',
        'category',
        'price',
        'price_type',
        'duration_minutes',
        'notice_period_hours',
        'location_type',
        'options',
        'media_urls',
        'is_active',
        'order',
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
            'options' => 'array',
            'media_urls' => 'array',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Relation : Service appartient à UN User (artiste)
     * Relation N-1 (belongsTo) : Un service appartient à un artiste
     * 
     * Note : 'artist_id' dans services pointe vers 'id' dans users
     */
    public function artist(): BelongsTo
    {
        return $this->belongsTo(User::class, 'artist_id');
    }

    /**
     * Relation : Un Service peut avoir PLUSIEURS Reservations
     * Relation 1-N (hasMany) : Un service peut être réservé plusieurs fois
     */
    public function reservations(): HasMany
    {
        return $this->hasMany(Reservation::class);
    }

    /**
     * Relation : Un Service peut avoir PLUSIEURS Reviews
     * Relation 1-N (hasMany) : Un service peut recevoir plusieurs avis
     */
    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    /**
     * Relation : Un Service peut être dans PLUSIEURS CartItems
     * Relation 1-N (hasMany) : Un service peut être ajouté plusieurs fois dans des paniers
     */
    public function cartItems(): HasMany
    {
        return $this->hasMany(CartItem::class);
    }

    /**
     * Scopes pour filtrer les services
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByCategory($query, string $category)
    {
        return $query->where('category', $category);
    }
}
