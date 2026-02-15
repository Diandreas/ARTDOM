<?php

namespace Database\Factories;

use App\Models\ArtistProfile;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Review>
 */
class ReviewFactory extends Factory
{
    public function definition(): array
    {
        $rating = fake()->numberBetween(3, 5);

        $comments = [
            5 => [
                'Prestation exceptionnelle ! L\'artiste a dépassé toutes mes attentes. Je recommande vivement !',
                'Magnifique performance, tout le monde a adoré. Un grand professionnel !',
                'Parfait du début à la fin. Exactement ce que je voulais pour cet événement spécial.',
                'Artiste très talentueux et à l\'écoute. Mon événement était magique grâce à lui/elle.',
                'Incroyable ! Les invités en parlent encore. Je referai appel sans hésiter.',
            ],
            4 => [
                'Très bonne prestation, quelques petits détails à améliorer mais globalement satisfait.',
                'Artiste professionnel et ponctuel. Belle performance.',
                'Bon travail, conforme à mes attentes. Je recommande.',
                'Prestation de qualité, ambiance garantie !',
            ],
            3 => [
                'Correct, mais j\'attendais un peu plus pour le prix.',
                'Bien dans l\'ensemble, quelques points à améliorer.',
                'Prestation correcte, sans plus.',
            ],
        ];

        return [
            'artist_profile_id' => ArtistProfile::factory(),
            'user_id' => User::factory(),
            'reservation_id' => null, // Will be set in seeder if needed
            'rating' => $rating,
            'comment' => fake()->randomElement($comments[$rating]),
        ];
    }
}
