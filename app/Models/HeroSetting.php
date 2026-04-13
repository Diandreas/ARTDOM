<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HeroSetting extends Model
{
    protected $fillable = [
        'type',
        'title',
        'title_en',
        'subtitle',
        'subtitle_en',
        'image_url',
        'image_url_en',
        'video_url',
        'link_url',
        'link_label',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }
}
