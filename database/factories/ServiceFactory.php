<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Service>
 */
class ServiceFactory extends Factory
{
    public function definition(): array
    {
        $services = [
            'singer' => [
                ['name' => 'Chanson personnalisée d\'anniversaire', 'desc' => 'Une chanson unique créée spécialement pour célébrer votre anniversaire ou celui de vos proches.', 'duration' => 30],
                ['name' => 'Prestation mariage (cérémonie)', 'desc' => 'Performance vocale live pendant votre cérémonie de mariage pour un moment magique.', 'duration' => 120],
                ['name' => 'Concert privé', 'desc' => 'Concert exclusif dans le lieu de votre choix pour votre événement privé.', 'duration' => 180],
                ['name' => 'Hommage funéraire', 'desc' => 'Prestation vocale respectueuse pour rendre un dernier hommage à vos proches.', 'duration' => 45],
            ],
            'dancer' => [
                ['name' => 'Chorégraphie événement', 'desc' => 'Création et performance d\'une chorégraphie sur mesure pour votre événement.', 'duration' => 60],
                ['name' => 'Animation soirée dansante', 'desc' => 'Animation complète de votre soirée avec performances et initiation des invités.', 'duration' => 240],
                ['name' => 'Cours de danse privé', 'desc' => 'Cours particulier de danse pour apprendre à votre rythme.', 'duration' => 60],
            ],
            'dj' => [
                ['name' => 'Mix anniversaire', 'desc' => 'Mixage personnalisé pour enflammer votre fête d\'anniversaire.', 'duration' => 240],
                ['name' => 'Prestation mariage (réception)', 'desc' => 'Ambiance musicale de A à Z pour votre réception de mariage.', 'duration' => 300],
                ['name' => 'Soirée corporate', 'desc' => 'Animation musicale professionnelle pour vos événements d\'entreprise.', 'duration' => 180],
            ],
            'musician' => [
                ['name' => 'Performance instrumentale', 'desc' => 'Prestation live à l\'instrument pour sublimer votre événement.', 'duration' => 90],
                ['name' => 'Accompagnement musical', 'desc' => 'Accompagnement musical en live pour vos moments spéciaux.', 'duration' => 120],
            ],
            'painter' => [
                ['name' => 'Portrait personnalisé', 'desc' => 'Réalisation d\'un portrait sur toile pour immortaliser un moment ou une personne.', 'duration' => 180],
                ['name' => 'Performance live', 'desc' => 'Création d\'une œuvre en direct pendant votre événement.', 'duration' => 240],
            ],
        ];

        $category = fake()->randomElement(array_keys($services));
        $service = fake()->randomElement($services[$category]);

        return [
            'artist_id' => null, // Will be set in seeder
            'title' => $service['name'],
            'description' => $service['desc'],
            'price' => fake()->randomElement([10000, 15000, 20000, 25000, 30000, 40000, 50000, 75000, 100000]),
            'price_type' => 'fixed',
            'duration_minutes' => $service['duration'],
            'notice_period_hours' => 48,
            'location_type' => fake()->randomElement(['home', 'online', 'public', 'any']),
            'category' => $category,
            'is_active' => fake()->boolean(90),
            'order' => 0,
        ];
    }
}
