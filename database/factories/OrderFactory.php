<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Order>
 */
class OrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $subtotal = fake()->randomFloat(2, 50, 500);
        $tax = $subtotal * 0.08;
        $shipping = $subtotal >= 100 ? 0 : 10;
        $total = $subtotal + $tax + $shipping;

        return [
            'user_id' => \App\Models\User::factory(),
            'order_number' => 'ORD-'.strtoupper(uniqid()),
            'status' => fake()->randomElement(['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
            'subtotal' => $subtotal,
            'tax' => $tax,
            'shipping' => $shipping,
            'total' => $total,
            'shipping_address' => [
                'first_name' => fake()->firstName(),
                'last_name' => fake()->lastName(),
                'address_line_1' => fake()->streetAddress(),
                'address_line_2' => fake()->boolean(30) ? fake()->secondaryAddress() : null,
                'city' => fake()->city(),
                'state' => fake()->stateAbbr(),
                'zip_code' => fake()->postcode(),
                'country' => 'USA',
                'phone' => fake()->phoneNumber(),
            ],
            'billing_address' => [
                'first_name' => fake()->firstName(),
                'last_name' => fake()->lastName(),
                'address_line_1' => fake()->streetAddress(),
                'address_line_2' => fake()->boolean(30) ? fake()->secondaryAddress() : null,
                'city' => fake()->city(),
                'state' => fake()->stateAbbr(),
                'zip_code' => fake()->postcode(),
                'country' => 'USA',
                'phone' => fake()->phoneNumber(),
            ],
            'payment_method' => fake()->randomElement(['credit_card', 'paypal', 'cash_on_delivery']),
            'guest_email' => null,
            'notes' => fake()->boolean(30) ? fake()->sentence() : null,
        ];
    }
}
