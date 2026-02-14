<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Video extends Model
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
        'video_url',
        'thumbnail_url',
        'duration_seconds',
        'category',
        'tags',
        'views',
        'likes',
        'visibility',
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
            'tags' => 'array',
            'published_at' => 'datetime',
        ];
    }

    /**
     * Relation : Video appartient à UN User (artiste)
     * Relation N-1 (belongsTo) : Une vidéo appartient à un artiste
     */
    public function artist(): BelongsTo
    {
        return $this->belongsTo(User::class, 'artist_id');
    }

    /**
     * Relation : Video peut avoir PLUSIEURS VideoComments
     * Relation 1-N (hasMany) : Une vidéo peut avoir plusieurs commentaires
     */
    public function comments(): HasMany
    {
        return $this->hasMany(VideoComment::class);
    }

    /**
     * Incrémente le nombre de vues de la vidéo
     */
    public function incrementViews(): void
    {
        $this->increment('views');
    }
}
