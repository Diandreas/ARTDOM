<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CarouselSlide extends Model
{
    protected $fillable = [
        'artist_id',
        'type',
        'title',
        'title_en',
        'subtitle',
        'subtitle_en',
        'image_url',
        'link_url',
        'link_label',
        'is_active',
        'order',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'order' => 'integer',
        ];
    }

    /**
     * Relation : Une slide peut être liée à un artiste
     */
    public function artist(): BelongsTo
    {
        return $this->belongsTo(User::class, 'artist_id');
    }
}
