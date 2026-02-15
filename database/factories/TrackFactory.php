<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Track>
 */
class TrackFactory extends Factory
{
    public function definition(): array
    {
        $trackNames = [
            'Mon Étoile', 'Danse avec Moi', 'Racines', 'Liberté', 'Amour Éternel',
            'Rêves d\'Enfant', 'Mama Africa', 'Soleil Levant', 'Nuit Étoilée', 'Espoir',
            'Cœur Battant', 'Voyage', 'Renaissance', 'Lumière', 'Paradis',
            'Sourire', 'Mélodie du Soir', 'Passion', 'Harmonie', 'Destinée',
        ];

        return [
            'album_id' => null, // Will be set in seeder
            'title' => fake()->randomElement($trackNames),
            'duration_seconds' => fake()->numberBetween(120, 360), // 2-6 minutes
            'track_number' => 1, // Will be overridden in seeder
            'file_url' => null, // Will be set in seeder
            'plays' => fake()->numberBetween(0, 50000),
        ];
    }
}
