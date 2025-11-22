<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->unique()->words(3, true);

        return [
            'category_id' => \App\Models\Category::factory(),
            'name' => $name,
            'slug' => str($name)->slug(),
            'sku' => fake()->unique()->bothify('SKU-####-???'),
            'description' => fake()->paragraph(),
            'brand' => fake()->company(),
            'specs' => [
                'weight' => fake()->randomFloat(2, 1, 100).' lbs',
                'dimensions' => fake()->numberBetween(5, 50).'x'.fake()->numberBetween(5, 50).'x'.fake()->numberBetween(5, 50).' in',
            ],
            'price' => fake()->randomFloat(2, 10, 1000),
            'compare_price' => null,
            'stock' => fake()->numberBetween(0, 100),
            'primary_image' => null,
            'images' => [],
            'is_active' => true,
            'is_featured' => fake()->boolean(20),
        ];
    }
}
