<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Playlist extends Model
{
    use HasFactory, HasUuids;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'client_id',
        'title',
        'cover_url',
        'is_public',
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
            'is_public' => 'boolean',
        ];
    }

    /**
     * Relation : Playlist appartient à UN User (client)
     * Relation N-1 (belongsTo) : Une playlist appartient à un client
     */
    public function client(): BelongsTo
    {
        return $this->belongsTo(User::class, 'client_id');
    }

    /**
     * Relation : Playlist peut contenir PLUSIEURS Tracks
     * Relation N-N (belongsToMany) : Une playlist contient plusieurs pistes
     * 
     * Table pivot : playlist_track
     * Colonne pivot : order (pour l'ordre dans la playlist)
     * 
     * Note : Ordonné par la colonne pivot 'order' pour respecter l'ordre de la playlist
     */
    public function tracks(): BelongsToMany
    {
        return $this->belongsToMany(Track::class, 'playlist_track')
            ->withPivot('order')
            ->orderByPivot('order')
            ->withTimestamps();
    }
}
