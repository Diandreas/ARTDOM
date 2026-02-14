<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

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
     * Incrémente le nombre de lectures de la piste
     */
    public function incrementPlays(): void
    {
        $this->increment('plays');
        // Incrémenter aussi le total de l'album
        $this->album->incrementPlays();
    }
}
