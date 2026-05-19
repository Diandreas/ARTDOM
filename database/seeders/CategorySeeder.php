<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['slug' => 'peinture',      'label_fr' => 'Peinture',       'label_en' => 'Painting',          'icon' => '🎨', 'order' => 1],
            ['slug' => 'photographie',  'label_fr' => 'Photographie',   'label_en' => 'Photography',       'icon' => '📷', 'order' => 2],
            ['slug' => 'musique',       'label_fr' => 'Musique live',    'label_en' => 'Music performance', 'icon' => '🎵', 'order' => 3],
            ['slug' => 'sculpture',     'label_fr' => 'Sculpture',       'label_en' => 'Sculpture',         'icon' => '🗿', 'order' => 4],
            ['slug' => 'danse',         'label_fr' => 'Danse',           'label_en' => 'Dance',             'icon' => '💃', 'order' => 5],
            ['slug' => 'theatre',       'label_fr' => 'Théâtre',         'label_en' => 'Theater',           'icon' => '🎭', 'order' => 6],
            ['slug' => 'autre',         'label_fr' => 'Autre',           'label_en' => 'Other',             'icon' => '✨', 'order' => 7],
        ];

        foreach ($categories as $category) {
            Category::firstOrCreate(['slug' => $category['slug']], $category);
        }
    }
}
