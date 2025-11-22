<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\OrderItem>
 */
class OrderItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $price = fake()->randomFloat(2, 10, 500);
        $quantity = fake()->numberBetween(1, 5);

        return [
            'order_id' => \App\Models\Order::factory(),
            'product_id' => \App\Models\Product::factory(),
            'quantity' => $quantity,
            'price' => $price,
            'total' => $price * $quantity,
            'product_snapshot' => [
                'name' => fake()->words(3, true),
                'sku' => 'SKU-'.strtoupper(fake()->bothify('??##??##')),
                'brand' => fake()->company(),
            ],
        ];
    }
}
