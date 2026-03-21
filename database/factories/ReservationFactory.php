<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Reservation>
 */
class ReservationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'reservation_number' => 'RES-'.strtoupper(fake()->unique()->bothify('??#?#?')),
            'client_id' => \App\Models\User::factory(),
            'artist_id' => \App\Models\User::factory(),
            'service_id' => \App\Models\Service::factory(),
            'scheduled_at' => fake()->dateTimeBetween('now', '+1 month'),
            'duration_minutes' => fake()->randomElement([30, 60, 90, 120]),
            'status' => 'pending',
            'total_amount' => fake()->randomFloat(2, 50, 500),
            'commission_rate' => 10.00,
            'commission_amount' => 0,
            'artist_earnings' => 0,
            'location_type' => 'online',
        ];
    }
}
