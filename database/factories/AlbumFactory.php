<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Album>
 */
class AlbumFactory extends Factory
{
    public function definition(): array
    {
        $albumPrefixes = ['Rythmes', 'Vibes', 'Émotions', 'Souvenirs', 'Passions', 'Racines', 'Horizons', 'Rêves'];
        $albumSuffixes = ['du Cœur', 'd\'Afrique', 'Éternels', 'Sauvages', 'Urbains', 'Ancestraux', 'Modernes'];

        $genres = ['afrobeat', 'coupé-décalé', 'makossa', 'rumba', 'highlife', 'gospel', 'hip-hop', 'r&b', 'jazz'];

        return [
            'artist_id' => null, // Will be set in seeder
            'title' => fake()->randomElement($albumPrefixes).' '.fake()->randomElement($albumSuffixes),
            'cover_url' => null, // Will be set in seeder
            'genre' => fake()->randomElement($genres),
            'year' => fake()->numberBetween(2020, 2026),
            'price' => fake()->randomElement([2500, 3000, 3500, 4000, 5000]),
            'is_streamable' => true,
            'is_purchasable' => fake()->boolean(85),
            'total_plays' => 0,
            'published_at' => now()->subDays(rand(1, 365)),
        ];
    }

    /**
     * Indicate that the album is free.
     */
    public function free(): static
    {
        return $this->state(fn (array $attributes) => [
            'price' => 0,
        ]);
    }
}
