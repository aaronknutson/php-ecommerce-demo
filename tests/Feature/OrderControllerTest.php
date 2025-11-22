<?php

use App\Models\Category;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\get;

it('displays user orders', function () {
    $user = User::factory()->create();
    $category = Category::factory()->create();
    $product = Product::factory()->create(['category_id' => $category->id]);

    $order = Order::factory()->create(['user_id' => $user->id]);
    OrderItem::factory()->create([
        'order_id' => $order->id,
        'product_id' => $product->id,
    ]);

    $response = actingAs($user)->get(route('orders.index'));

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('Orders/Index')
        ->has('orders.data', 1)
        ->where('orders.data.0.id', $order->id)
    );
});

it('displays order details', function () {
    $user = User::factory()->create();
    $category = Category::factory()->create();
    $product = Product::factory()->create(['category_id' => $category->id]);

    $order = Order::factory()->create(['user_id' => $user->id]);
    $orderItem = OrderItem::factory()->create([
        'order_id' => $order->id,
        'product_id' => $product->id,
    ]);

    $response = actingAs($user)->get(route('orders.show', $order));

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('Orders/Show')
        ->where('order.id', $order->id)
        ->has('order.items', 1)
        ->where('order.items.0.id', $orderItem->id)
    );
});

it('prevents user from viewing other user orders', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();

    $order = Order::factory()->create(['user_id' => $otherUser->id]);

    $response = actingAs($user)->get(route('orders.show', $order));

    $response->assertForbidden();
});

it('requires authentication to view orders', function () {
    $response = get(route('orders.index'));

    $response->assertRedirect(route('login'));
});
