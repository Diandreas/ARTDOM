<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Availability>
 */
class AvailabilityFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'artist_id' => \App\Models\User::factory(),
            'date' => fake()->date(),
            'start_time' => '09:00',
            'end_time' => '18:00',
            'is_booked' => false,
            'is_blocked' => false,
        ];
    }
}
