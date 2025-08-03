<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create admin user
        User::create([
            'nik' => '1234567890123456',
            'username' => 'admin',
            'name' => 'Administrator',
            'email' => 'admin@grocery.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'is_active' => true,
        ]);

        // Create staff user
        User::create([
            'nik' => '1234567890123457',
            'username' => 'staff',
            'name' => 'Staff Member',
            'email' => 'staff@grocery.com',
            'password' => Hash::make('password'),
            'role' => 'staff',
            'is_active' => true,
        ]);

        // Create settings
        $settings = [
            ['key' => 'store_name', 'value' => 'FreshMart Grocery', 'type' => 'string', 'description' => 'Store name'],
            ['key' => 'whatsapp_number', 'value' => '6281234567890', 'type' => 'string', 'description' => 'WhatsApp number for orders'],
            ['key' => 'delivery_fee', 'value' => '5000', 'type' => 'number', 'description' => 'Delivery fee in IDR'],
            ['key' => 'store_address', 'value' => 'Jl. Contoh No. 123, Jakarta', 'type' => 'string', 'description' => 'Store address'],
            ['key' => 'store_phone', 'value' => '021-1234567', 'type' => 'string', 'description' => 'Store phone number'],
        ];

        foreach ($settings as $setting) {
            Setting::create($setting);
        }

        // Create categories with specific data
        $categories = [
            ['name' => 'Sayuran Segar', 'icon' => '🥬', 'sort_order' => 1],
            ['name' => 'Buah-buahan', 'icon' => '🍎', 'sort_order' => 2],
            ['name' => 'Produk Susu', 'icon' => '🥛', 'sort_order' => 3],
            ['name' => 'Roti & Kue', 'icon' => '🍞', 'sort_order' => 4],
            ['name' => 'Daging & Unggas', 'icon' => '🥩', 'sort_order' => 5],
            ['name' => 'Ikan & Seafood', 'icon' => '🐟', 'sort_order' => 6],
            ['name' => 'Makanan Kaleng', 'icon' => '🥫', 'sort_order' => 7],
            ['name' => 'Bumbu & Rempah', 'icon' => '🧂', 'sort_order' => 8],
        ];

        foreach ($categories as $categoryData) {
            $category = Category::create([
                'name' => $categoryData['name'],
                'slug' => \Illuminate\Support\Str::slug($categoryData['name']),
                'description' => 'Kategori ' . $categoryData['name'],
                'icon' => $categoryData['icon'],
                'is_active' => true,
                'sort_order' => $categoryData['sort_order'],
            ]);

            // Create products for each category
            $productNames = match ($category->name) {
                'Sayuran Segar' => ['Bayam Segar', 'Kangkung', 'Sawi Hijau', 'Tomat', 'Wortel', 'Brokoli'],
                'Buah-buahan' => ['Apel Fuji', 'Jeruk Manis', 'Pisang Cavendish', 'Anggur Hijau', 'Mangga Harum Manis'],
                'Produk Susu' => ['Susu UHT Full Cream', 'Keju Cheddar', 'Yogurt Greek', 'Mentega Tawar'],
                'Roti & Kue' => ['Roti Tawar Gandum', 'Roti Bakar', 'Croissant', 'Donat Glazed'],
                'Daging & Unggas' => ['Daging Sapi Segar', 'Ayam Broiler', 'Daging Kambing', 'Sosis Sapi'],
                'Ikan & Seafood' => ['Ikan Salmon', 'Udang Segar', 'Cumi-cumi', 'Ikan Tuna'],
                'Makanan Kaleng' => ['Kornet Sapi', 'Sarden', 'Tuna Kaleng', 'Susu Kental Manis'],
                'Bumbu & Rempah' => ['Garam Dapur', 'Merica Hitam', 'Bawang Putih', 'Cabai Merah'],
                default => ['Produk ' . $category->name],
            };

            foreach ($productNames as $index => $productName) {
                Product::create([
                    'category_id' => $category->id,
                    'name' => $productName,
                    'slug' => \Illuminate\Support\Str::slug($productName . '-' . ($index + 1)),
                    'description' => 'Produk berkualitas tinggi: ' . $productName,
                    'price' => fake()->randomFloat(2, 2000, 50000),
                    'discount_price' => fake()->boolean(30) ? fake()->randomFloat(2, 1500, 40000) : null,
                    'unit' => fake()->randomElement(['pcs', 'kg', 'pack', 'box']),
                    'stock' => fake()->numberBetween(10, 100),
                    'minimum_stock' => 5,
                    'is_active' => true,
                    'is_featured' => $index < 2, // First 2 products in each category are featured
                    'sort_order' => $index + 1,
                ]);
            }
        }

        // Create some sample orders
        $orders = Order::factory(10)->create();
        
        foreach ($orders as $order) {
            $itemCount = fake()->numberBetween(1, 5);
            $products = Product::inRandomOrder()->take($itemCount)->get();
            
            $totalAmount = 0;
            
            foreach ($products as $product) {
                $quantity = fake()->numberBetween(1, 3);
                $price = $product->final_price;
                $itemTotal = $price * $quantity;
                
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'product_price' => $price,
                    'quantity' => $quantity,
                    'total' => $itemTotal,
                ]);
                
                $totalAmount += $itemTotal;
            }
            
            // Update order totals
            $order->update([
                'subtotal' => $totalAmount,
                'total' => $totalAmount + $order->delivery_fee,
            ]);
        }
    }
}