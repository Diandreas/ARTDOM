<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TrackComment extends Model
{
    use HasFactory, HasUuids;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'track_id',
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
     * Relation : TrackComment appartient à UN Track
     */
    public function track(): BelongsTo
    {
        return $this->belongsTo(Track::class);
    }

    /**
     * Relation : TrackComment appartient à UN User
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relation : TrackComment peut répondre à UN autre TrackComment (parent)
     */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(TrackComment::class, 'parent_id');
    }

    /**
     * Relation : TrackComment peut avoir PLUSIEURS réponses (enfants)
     */
    public function replies(): HasMany
    {
        return $this->hasMany(TrackComment::class, 'parent_id');
    }
}
