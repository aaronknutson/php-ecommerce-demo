<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;

class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all();
        $products = Product::all();

        if ($products->isEmpty()) {
            $this->command->warn('No products found. Please run ProductSeeder first.');

            return;
        }

        $users->each(function ($user) use ($products) {
            Order::factory()
                ->count(rand(1, 3))
                ->create(['user_id' => $user->id])
                ->each(function ($order) use ($products) {
                    $orderItems = [];
                    $itemCount = rand(1, 5);

                    for ($i = 0; $i < $itemCount; $i++) {
                        $product = $products->random();
                        $quantity = rand(1, 3);
                        $price = $product->price;

                        $orderItems[] = [
                            'product_id' => $product->id,
                            'quantity' => $quantity,
                            'price' => $price,
                            'total' => $price * $quantity,
                            'product_snapshot' => [
                                'name' => $product->name,
                                'sku' => $product->sku,
                                'brand' => $product->brand ?? 'Generic',
                            ],
                        ];
                    }

                    $order->items()->createMany($orderItems);

                    $subtotal = $order->items->sum('total');
                    $tax = $subtotal * 0.08;
                    $shipping = $subtotal >= 100 ? 0 : 10;
                    $total = $subtotal + $tax + $shipping;

                    $order->update([
                        'subtotal' => $subtotal,
                        'tax' => $tax,
                        'shipping' => $shipping,
                        'total' => $total,
                    ]);
                });
        });

        Order::factory()
            ->count(5)
            ->create([
                'user_id' => null,
                'guest_email' => fake()->safeEmail(),
            ])
            ->each(function ($order) use ($products) {
                $orderItems = [];
                $itemCount = rand(1, 3);

                for ($i = 0; $i < $itemCount; $i++) {
                    $product = $products->random();
                    $quantity = rand(1, 2);
                    $price = $product->price;

                    $orderItems[] = [
                        'product_id' => $product->id,
                        'quantity' => $quantity,
                        'price' => $price,
                        'total' => $price * $quantity,
                        'product_snapshot' => [
                            'name' => $product->name,
                            'sku' => $product->sku,
                            'brand' => $product->brand ?? 'Generic',
                        ],
                    ];
                }

                $order->items()->createMany($orderItems);

                $subtotal = $order->items->sum('total');
                $tax = $subtotal * 0.08;
                $shipping = $subtotal >= 100 ? 0 : 10;
                $total = $subtotal + $tax + $shipping;

                $order->update([
                    'subtotal' => $subtotal,
                    'tax' => $tax,
                    'shipping' => $shipping,
                    'total' => $total,
                ]);
            });
    }
}
