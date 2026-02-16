<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Coupon>
 */
class CouponFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'code' => strtoupper(fake()->bothify('????####')),
            'description' => fake()->sentence(),
            'discount_type' => fake()->randomElement(['percentage', 'fixed']),
            'discount_value' => fake()->randomElement([5, 10, 15, 20, 5000, 10000]),
            'min_order_amount' => fake()->randomElement([0, 10000, 20000, 50000]),
            'expires_at' => fake()->optional(0.7)->dateTimeBetween('now', '+6 months'),
            'usage_limit' => fake()->optional(0.5)->numberBetween(10, 100),
            'used_count' => 0,
            'is_active' => true,
        ];
    }

    /**
     * Indicate that the coupon is expired.
     */
    public function expired(): static
    {
        return $this->state(fn (array $attributes) => [
            'expires_at' => now()->subDays(1),
        ]);
    }

    /**
     * Indicate that the coupon is inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }

    /**
     * Indicate that the coupon has reached its usage limit.
     */
    public function reachedLimit(): static
    {
        return $this->state(fn (array $attributes) => [
            'usage_limit' => 10,
            'used_count' => 10,
        ]);
    }
}
