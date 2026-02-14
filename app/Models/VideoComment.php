<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class VideoComment extends Model
{
    use HasFactory, HasUuids;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'video_id',
        'user_id',
        'parent_id',
        'content',
        'is_reported',
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
            'is_reported' => 'boolean',
        ];
    }

    /**
     * Relation : VideoComment appartient à UN Video
     * Relation N-1 (belongsTo) : Un commentaire appartient à une vidéo
     */
    public function video(): BelongsTo
    {
        return $this->belongsTo(Video::class);
    }

    /**
     * Relation : VideoComment appartient à UN User
     * Relation N-1 (belongsTo) : Un commentaire est écrit par un utilisateur
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relation : VideoComment peut répondre à UN autre VideoComment (parent)
     * Relation N-1 (belongsTo) : Un commentaire peut répondre à un autre
     * 
     * Note : Relation auto-référentielle pour créer des threads de commentaires
     */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(VideoComment::class, 'parent_id');
    }

    /**
     * Relation : VideoComment peut avoir PLUSIEURS réponses (enfants)
     * Relation 1-N (hasMany) : Un commentaire peut avoir plusieurs réponses
     */
    public function replies(): HasMany
    {
        return $this->hasMany(VideoComment::class, 'parent_id');
    }
}
