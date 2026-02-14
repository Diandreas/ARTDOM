<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class ArtistProfile extends Model
{
    use HasFactory, HasUuids;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'artist_profiles';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'stage_name',
        'bio',
        'categories',
        'base_rate',
        'is_verified',
        'verification_status',
        'id_document_front',
        'id_document_back',
        'rating',
        'total_reviews',
        'social_links',
        'portfolio_urls',
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
            'categories' => 'array',
            'social_links' => 'array',
            'portfolio_urls' => 'array',
            'is_verified' => 'boolean',
            'rating' => 'float',
            'base_rate' => 'decimal:2',
        ];
    }

    /**
     * Relation : ArtistProfile appartient à UN User
     * Relation 1-1 inverse (belongsTo) : Le profil artiste appartient à un utilisateur
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relation : Un ArtistProfile peut avoir PLUSIEURS Services
     * Relation 1-N (hasMany) : Un artiste peut proposer plusieurs services
     * 
     * Note : 'artist_id' dans services pointe vers 'user_id' dans users
     */
    public function services(): HasMany
    {
        return $this->hasMany(Service::class, 'artist_id', 'user_id');
    }

    /**
     * Relation : Un ArtistProfile peut avoir PLUSIEURS Availabilities
     * Relation 1-N (hasMany) : Un artiste peut avoir plusieurs créneaux de disponibilité
     */
    public function availabilities(): HasMany
    {
        return $this->hasMany(Availability::class, 'artist_id', 'user_id');
    }

    /**
     * Relation : Un ArtistProfile peut avoir PLUSIEURS Stories
     * Relation 1-N (hasMany) : Un artiste peut publier plusieurs stories (24h)
     */
    public function stories(): HasMany
    {
        return $this->hasMany(Story::class, 'artist_id', 'user_id');
    }

    /**
     * Relation : Un ArtistProfile peut avoir PLUSIEURS Albums
     * Relation 1-N (hasMany) : Un artiste peut publier plusieurs albums
     */
    public function albums(): HasMany
    {
        return $this->hasMany(Album::class, 'artist_id', 'user_id');
    }

    /**
     * Relation : Un ArtistProfile peut avoir PLUSIEURS Videos
     * Relation 1-N (hasMany) : Un artiste peut publier plusieurs vidéos/tutos
     */
    public function videos(): HasMany
    {
        return $this->hasMany(Video::class, 'artist_id', 'user_id');
    }

    /**
     * Relation : Un ArtistProfile a UN Wallet
     * Relation 1-1 (hasOne) : Un artiste a un seul portefeuille
     */
    public function wallet(): HasOne
    {
        return $this->hasOne(Wallet::class, 'artist_id', 'user_id');
    }

    /**
     * Relation : Un ArtistProfile peut avoir PLUSIEURS Reviews
     * Relation 1-N (hasMany) : Un artiste peut recevoir plusieurs avis
     */
    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class, 'artist_id', 'user_id');
    }

    /**
     * Relation : Un ArtistProfile peut être suivi par PLUSIEURS Clients (Users)
     * Relation N-N inverse (belongsToMany) : Un artiste peut être suivi par plusieurs clients
     * 
     * Table pivot : artist_followers
     * Clé locale : artist_id (dans artist_followers)
     * Clé étrangère : client_id (dans artist_followers)
     */
    public function followers(): BelongsToMany
    {
        return $this->belongsToMany(
            User::class,
            'artist_followers',
            'artist_id',
            'client_id'
        )->withTimestamps();
    }

    /**
     * Scopes pour filtrer les artistes
     */
    public function scopeVerified($query)
    {
        return $query->where('is_verified', true)
            ->where('verification_status', 'approved');
    }

    public function scopeByCategory($query, string $category)
    {
        return $query->whereJsonContains('categories', $category);
    }
}
