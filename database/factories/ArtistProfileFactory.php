<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ArtistProfile>
 */
class ArtistProfileFactory extends Factory
{
    public function definition(): array
    {
        $categories = [
            'singer' => ['Chanteur', 'Chanteuse'],
            'dancer' => ['Danseur', 'Danseuse'],
            'musician' => ['Musicien', 'Musicienne'],
            'dj' => ['DJ', 'DJ'],
            'painter' => ['Peintre', 'Artiste Peintre'],
            'actor' => ['Comédien', 'Comédienne'],
            'photographer' => ['Photographe', 'Photographe'],
        ];

        $categoryKey = fake()->randomElement(array_keys($categories));

        $bios = [
            "Artiste passionné(e) par la musique africaine et les émotions qu'elle procure. Je crée des moments inoubliables pour vos événements.",
            "Créateur d'émotions, messager de cœurs. Mon art parle aux âmes et touche les cœurs.",
            "Professionnel de l'art depuis plus de 5 ans. Spécialisé dans les événements privés et corporatifs.",
            'Je transforme vos moments spéciaux en souvenirs éternels à travers mon art.',
            'Artiste diplômé, je mets mon talent au service de vos émotions les plus précieuses.',
        ];

        return [
            'user_id' => User::factory()->artist(),
            'stage_name' => fake()->firstName().' '.fake()->randomElement(['Artist', 'Soul', 'Voice', 'Beat', 'Flow']),
            'bio' => fake()->randomElement($bios),
            'categories' => json_encode([$categoryKey]), // JSON array of categories
            'base_rate' => fake()->randomElement([15000, 20000, 25000, 30000, 35000, 40000, 50000, 75000, 100000]),
            'is_verified' => fake()->boolean(80), // 80% verified
        ];
    }

    /**
     * Indicate that the artist is verified.
     */
    public function verified(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_verified' => true,
        ]);
    }

    /**
     * Indicate that the artist is not verified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_verified' => false,
        ]);
    }
}
