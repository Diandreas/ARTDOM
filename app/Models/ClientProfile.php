<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClientProfile extends Model
{
    use HasFactory, HasUuids;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'client_profiles';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'first_name',
        'last_name',
        'date_of_birth',
        'gender',
        'is_premium',
        'listening_history',
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
            'is_premium' => 'boolean',
            'listening_history' => 'array',
            'date_of_birth' => 'date',
        ];
    }

    /**
     * Relation : ClientProfile appartient à UN User
     * Relation 1-1 inverse (belongsTo) : Le profil client appartient à un utilisateur
     * 
     * Note : La clé étrangère 'user_id' est dans la table client_profiles
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relation : Un ClientProfile peut avoir PLUSIEURS Reservations
     * Relation 1-N (hasMany) : Un client peut faire plusieurs réservations
     * 
     * Note : On utilise 'client_id' dans reservations qui pointe vers 'user_id' dans users
     * Donc on passe par user_id pour faire le lien
     */
    public function reservations()
    {
        return $this->hasMany(Reservation::class, 'client_id', 'user_id');
    }

    /**
     * Relation : Un ClientProfile a UN Cart
     * Relation 1-1 (hasOne) : Un client a un seul panier
     * 
     * Note : Même principe, on passe par user_id
     */
    public function cart()
    {
        return $this->hasOne(Cart::class, 'client_id', 'user_id');
    }

    /**
     * Relation : Un ClientProfile peut avoir PLUSIEURS Subscriptions
     * Relation 1-N (hasMany) : Un client peut avoir plusieurs abonnements (historique)
     */
    public function subscriptions()
    {
        return $this->hasMany(Subscription::class, 'client_id', 'user_id');
    }

    /**
     * Relation : Un ClientProfile peut avoir PLUSIEURS Playlists
     * Relation 1-N (hasMany) : Un client peut créer plusieurs playlists
     */
    public function playlists()
    {
        return $this->hasMany(Playlist::class, 'client_id', 'user_id');
    }

    /**
     * Relation : Un ClientProfile peut avoir PLUSIEURS Reviews
     * Relation 1-N (hasMany) : Un client peut laisser plusieurs avis
     */
    public function reviews()
    {
        return $this->hasMany(Review::class, 'client_id', 'user_id');
    }

    /**
     * Relation : Un ClientProfile peut avoir PLUSIEURS AlbumPurchases
     * Relation 1-N (hasMany) : Un client peut acheter plusieurs albums
     */
    public function albumPurchases()
    {
        return $this->hasMany(AlbumPurchase::class, 'client_id', 'user_id');
    }

    /**
     * Relation : Un ClientProfile peut suivre PLUSIEURS Artists (Users)
     * Relation N-N (belongsToMany) : Un client peut suivre plusieurs artistes
     * 
     * Table pivot : artist_followers
     * Clé locale : client_id (dans artist_followers)
     * Clé étrangère : artist_id (dans artist_followers)
     * 
     * Note : On passe par user_id car les artistes sont aussi des Users
     */
    public function followedArtists()
    {
        return $this->belongsToMany(
            User::class,
            'artist_followers',
            'client_id',
            'artist_id'
        )->withTimestamps();
    }
}
