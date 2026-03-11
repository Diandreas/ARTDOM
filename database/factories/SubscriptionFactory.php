<?php

namespace Database\Factories;

use App\Models\Payment;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Subscription>
 */
class SubscriptionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $plan = $this->faker->randomElement(['free', 'monthly', 'annual']);
        $price = match ($plan) {
            'free' => 0,
            'monthly' => 5000,
            'annual' => 50000,
        };

        $startsAt = $this->faker->dateTimeBetween('-1 year', 'now');
        $endsAt = match ($plan) {
            'free' => null,
            'monthly' => (clone $startsAt)->modify('+1 month'),
            'annual' => (clone $startsAt)->modify('+1 year'),
        };

        return [
            'client_id' => User::factory(),
            'plan' => $plan,
            'price' => $price,
            'starts_at' => $startsAt,
            'ends_at' => $endsAt,
            'is_active' => $this->faker->boolean(80),
            'payment_id' => $plan === 'free' ? null : Payment::factory(),
            'cancelled_at' => null,
        ];
    }

    /**
     * Indique que l'abonnement est actif.
     */
    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => true,
            'ends_at' => now()->addMonth(),
        ]);
    }

    /**
     * Indique que l'abonnement est expiré.
     */
    public function expired(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
            'ends_at' => now()->subDay(),
        ]);
    }
}
