<?php

namespace App\Models;

use App\Enums\UserRole;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, HasUuids, Notifiable, TwoFactorAuthenticatable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'email',
        'phone',
        'password',
        'profile_photo',
        'city',
        'role',
        'is_active',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'remember_token',
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
            'is_active' => 'boolean',
            'email_verified_at' => 'datetime',
            'phone_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
            'role' => UserRole::class,
        ];
    }

    /**
     * Relation : Un User peut avoir UN ClientProfile
     * Relation 1-1 (hasOne) : Un utilisateur client a un seul profil client
     */
    public function clientProfile()
    {
        return $this->hasOne(ClientProfile::class);
    }

    /**
     * Relation : Un User peut avoir UN ArtistProfile
     * Relation 1-1 (hasOne) : Un utilisateur artiste a un seul profil artiste
     */
    public function artistProfile()
    {
        return $this->hasOne(ArtistProfile::class);
    }

    /**
     * Relation : Un artiste (User) peut avoir plusieurs Services
     * Relation 1-N (hasMany) : Un artiste a plusieurs services
     */
    public function services()
    {
        return $this->hasMany(Service::class, 'artist_id');
    }

    /**
     * Relation : Un artiste (User) peut avoir plusieurs Albums
     * Relation 1-N (hasMany) : Un artiste a plusieurs albums
     */
    public function albums()
    {
        return $this->hasMany(Album::class, 'artist_id');
    }

    /**
     * Relation : Un User peut participer à PLUSIEURS Conversations
     * Relation N-N (belongsToMany) : Un utilisateur a plusieurs conversations
     */
    public function conversations()
    {
        return $this->belongsToMany(Conversation::class, 'conversation_user')
            ->withPivot('unread_count', 'last_read_at')
            ->withTimestamps();
    }

    /**
     * Relation : Un User peut avoir PLUSIEURS Reservations (en tant que client)
     */
    public function reservations()
    {
        return $this->hasMany(Reservation::class, 'client_id');
    }

    /**
     * Relation : Un User peut avoir PLUSIEURS Reservations (en tant qu'artiste)
     */
    public function artistReservations()
    {
        return $this->hasMany(Reservation::class, 'artist_id');
    }

    /**
     * Relation : Un User peut avoir PLUSIEURS Tracks en favoris
     * Relation N-N (belongsToMany) : Un utilisateur peut avoir plusieurs tracks en favoris
     */
    public function favorites()
    {
        return $this->belongsToMany(Track::class, 'favorites')
            ->withTimestamps();
    }

    /**
     * Relation : Un User peut avoir PLUSIEURS Playlists
     * Relation 1-N (hasMany) : Un utilisateur peut avoir plusieurs playlists
     */
    public function playlists()
    {
        return $this->hasMany(Playlist::class, 'client_id');
    }

    /**
     * Méthodes helper pour vérifier le rôle
     */
    public function isClient(): bool
    {
        return $this->role === UserRole::Client;
    }

    public function isArtist(): bool
    {
        return $this->role === UserRole::Artist;
    }

    public function isAdmin(): bool
    {
        return $this->role === UserRole::Admin;
    }

    public function isSuperAdmin(): bool
    {
        return $this->role === UserRole::SuperAdmin;
    }

    public function hasVerifiedEmail(): bool
    {
        return $this->email_verified_at !== null;
    }
}
