<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HeroSection extends Model
{
    protected $fillable = [
        'media_type',
        'title',
        'title_en',
        'subtitle',
        'subtitle_en',
        'image_url',
        'image_url_en',
        'video_url',
        'youtube_url',
        'link_url',
        'link_label',
        'link_label_en',
        'artist_id',
        'order',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'order' => 'integer',
        ];
    }

    public function artist(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(User::class, 'artist_id');
    }
}
