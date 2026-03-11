<?php

namespace Database\Factories;

use App\Enums\PaymentStatus;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Payment>
 */
class PaymentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'client_id' => User::factory(),
            'amount' => $this->faker->randomFloat(2, 500, 10000),
            'currency' => 'XAF',
            'method' => $this->faker->randomElement(['mobile_money_orange', 'mobile_money_mtn', 'credit_card']),
            'provider_ref' => $this->faker->unique()->lexify('PAY-????-????'),
            'status' => $this->faker->randomElement(PaymentStatus::cases()),
            'metadata' => null,
            'paid_at' => now(),
        ];
    }
}
