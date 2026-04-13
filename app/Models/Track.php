<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Track extends Model
{
    use HasFactory, HasUuids;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'album_id',
        'title',
        'duration_seconds',
        'file_url',
        'lyrics',
        'plays',
        'track_number',
        'is_banned',
        'ban_reason',
    ];

    /**
     * The "booted" method of the model.
     */
    protected static function booted(): void
    {
        static::addGlobalScope('not_banned', function ($query) {
            $query->where('is_banned', false);
        });

        static::addGlobalScope('active_artist', function ($query) {
            $query->whereHas('album.artist', function ($q) {
                $q->where('is_active', true)->whereNull('banned_at');
            });
        });
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'id' => 'string',
        ];
    }

    /**
     * Relation : Track appartient à UN Album
     * Relation N-1 (belongsTo) : Une piste appartient à un album
     */
    public function album(): BelongsTo
    {
        return $this->belongsTo(Album::class);
    }

    /**
     * Relation : Track peut être dans PLUSIEURS Playlists
     * Relation N-N (belongsToMany) : Une piste peut être dans plusieurs playlists
     *
     * Table pivot : playlist_track
     * Colonne pivot : order (pour l'ordre dans la playlist)
     */
    public function playlists(): BelongsToMany
    {
        return $this->belongsToMany(Playlist::class, 'playlist_track')
            ->withPivot('order')
            ->withTimestamps();
    }

    /**
     * Relation : Track peut avoir PLUSIEURS Commentaires
     */
    public function comments(): HasMany
    {
        return $this->hasMany(TrackComment::class)->whereNull('parent_id')->latest();
    }

    /**
     * Relation : Track peut être mis en favoris par PLUSIEURS Utilisateurs (clients)
     */
    public function favoritedBy(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'favorites')
            ->withTimestamps();
    }

    /**
     * Incrémente le nombre de lectures de la piste
     */
    public function incrementPlays(): void
    {
        $this->increment('plays');
        // Incrémenter aussi le total de l'album
        $this->album->incrementPlays();
    }
}
