<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

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
        $name = fake()->words(random_int(2, 4), true);
        $price = fake()->randomFloat(2, 1000, 50000);
        $hasDiscount = fake()->boolean(30);
        
        return [
            'category_id' => Category::factory(),
            'name' => ucwords($name),
            'slug' => Str::slug($name . '-' . fake()->unique()->numberBetween(1, 1000)),
            'description' => fake()->paragraph(),
            'price' => $price,
            'discount_price' => $hasDiscount ? fake()->randomFloat(2, $price * 0.6, $price * 0.9) : null,
            'unit' => fake()->randomElement(['pcs', 'kg', 'liter', 'box', 'pack']),
            'stock' => fake()->numberBetween(0, 100),
            'minimum_stock' => fake()->numberBetween(5, 20),
            'is_active' => fake()->boolean(90),
            'is_featured' => fake()->boolean(20),
            'sort_order' => fake()->numberBetween(0, 100),
        ];
    }
}