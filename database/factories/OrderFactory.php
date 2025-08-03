<?php

namespace Database\Factories;

use App\Models\Order;
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
        $deliveryType = fake()->randomElement(['pickup', 'delivery']);
        $subtotal = fake()->randomFloat(2, 10000, 200000);
        $deliveryFee = $deliveryType === 'delivery' ? 5000 : 0;
        
        return [
            'order_number' => Order::generateOrderNumber(),
            'customer_name' => fake()->name(),
            'customer_phone' => fake()->phoneNumber(),
            'customer_address' => $deliveryType === 'delivery' ? fake()->address() : null,
            'delivery_type' => $deliveryType,
            'subtotal' => $subtotal,
            'delivery_fee' => $deliveryFee,
            'total' => $subtotal + $deliveryFee,
            'status' => fake()->randomElement(['pending', 'confirmed', 'preparing', 'ready', 'completed']),
            'notes' => fake()->boolean(30) ? fake()->sentence() : null,
            'whatsapp_sent_at' => fake()->boolean(70) ? fake()->dateTimeBetween('-1 week', 'now') : null,
        ];
    }
}