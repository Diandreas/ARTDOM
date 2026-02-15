<?php

namespace Database\Factories;

use App\Models\ArtistProfile;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Video>
 */
class VideoFactory extends Factory
{
    public function definition(): array
    {
        $videoTypes = [
            'tuto' => [
                'Apprendre les bases de la guitare',
                'Techniques de chant - Les fondamentaux',
                'Pas de danse Afro pour débutants',
                'Comment mixer comme un pro',
                'Peinture à l\'acrylique - Tutoriel complet',
            ],
            'performance' => [
                'Live Session - Acoustic',
                'Performance Studio',
                'Concert Privé - Extraits',
                'Jam Session',
            ],
            'behind' => [
                'Dans les coulisses du studio',
                'Making of - Nouvel Album',
                'Préparation concert',
            ],
        ];

        $type = fake()->randomElement(array_keys($videoTypes));
        $titles = $videoTypes[$type];

        return [
            'artist_profile_id' => ArtistProfile::factory(),
            'title' => fake()->randomElement($titles),
            'description' => 'Découvrez cette vidéo exclusive et laissez-vous inspirer par l\'art et la créativité.',
            'video_url' => null, // Will be set in seeder
            'thumbnail_url' => null, // Will be set in seeder
            'duration' => fake()->numberBetween(180, 1800), // 3-30 minutes in seconds
            'views_count' => fake()->numberBetween(0, 100000),
            'category' => fake()->randomElement(['tutorial', 'performance', 'behind-the-scenes']),
        ];
    }
}
