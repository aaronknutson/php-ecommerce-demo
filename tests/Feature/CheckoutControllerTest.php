<?php

use App\Models\CartItem;
use App\Models\Category;
use App\Models\Product;
use App\Models\User;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\assertDatabaseHas;
use function Pest\Laravel\get;

it('displays checkout page with cart items', function () {
    $user = User::factory()->create();
    $category = Category::factory()->create();
    $product = Product::factory()->create([
        'category_id' => $category->id,
        'is_active' => true,
        'stock' => 10,
        'price' => 50.00,
    ]);
    $cartItem = CartItem::factory()->create([
        'user_id' => $user->id,
        'product_id' => $product->id,
        'quantity' => 2,
    ]);

    $response = actingAs($user)->get(route('checkout.index'));

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('Checkout/Index')
        ->has('cartItems', 1)
        ->where('subtotal', 100)
    );
});

it('redirects to cart if cart is empty', function () {
    $user = User::factory()->create();

    $response = actingAs($user)->get(route('checkout.index'));

    $response->assertRedirect(route('cart.index'));
    $response->assertSessionHas('error');
});

it('redirects if product is no longer available', function () {
    $user = User::factory()->create();
    $category = Category::factory()->create();
    $product = Product::factory()->create([
        'category_id' => $category->id,
        'is_active' => false,
    ]);
    $cartItem = CartItem::factory()->create([
        'user_id' => $user->id,
        'product_id' => $product->id,
    ]);

    $response = actingAs($user)->get(route('checkout.index'));

    $response->assertRedirect(route('cart.index'));
    $response->assertSessionHas('error');
});

it('creates order successfully', function () {
    $user = User::factory()->create();
    $category = Category::factory()->create();
    $product = Product::factory()->create([
        'category_id' => $category->id,
        'is_active' => true,
        'stock' => 10,
        'price' => 50.00,
    ]);
    $cartItem = CartItem::factory()->create([
        'user_id' => $user->id,
        'product_id' => $product->id,
        'quantity' => 2,
    ]);

    try {
        $response = actingAs($user)->post(route('checkout.store'), [
            'shipping_address' => [
                'first_name' => 'John',
                'last_name' => 'Doe',
                'address_line_1' => '123 Main St',
                'address_line_2' => 'Apt 4',
                'city' => 'New York',
                'state' => 'NY',
                'zip_code' => '10001',
                'country' => 'USA',
                'phone' => '555-1234',
            ],
            'billing_address' => [
                'first_name' => 'John',
                'last_name' => 'Doe',
                'address_line_1' => '123 Main St',
                'address_line_2' => 'Apt 4',
                'city' => 'New York',
                'state' => 'NY',
                'zip_code' => '10001',
                'country' => 'USA',
                'phone' => '555-1234',
            ],
            'payment_method' => 'credit_card',
        ]);
    } catch (\Exception $e) {
        dump($e->getMessage(), $e->getFile(), $e->getLine());
        throw $e;
    }

    $response->assertRedirect();

    assertDatabaseHas('orders', [
        'user_id' => $user->id,
        'status' => 'pending',
        'subtotal' => '100.00',
    ]);

    assertDatabaseHas('order_items', [
        'product_id' => $product->id,
        'quantity' => 2,
        'price' => '50.00',
    ]);

    $this->assertDatabaseMissing('cart_items', [
        'id' => $cartItem->id,
    ]);

    expect($product->fresh()->stock)->toBe(8);
});

it('validates required checkout fields', function () {
    $user = User::factory()->create();
    $category = Category::factory()->create();
    $product = Product::factory()->create([
        'category_id' => $category->id,
        'is_active' => true,
        'stock' => 10,
    ]);
    CartItem::factory()->create([
        'user_id' => $user->id,
        'product_id' => $product->id,
    ]);

    $response = actingAs($user)->post(route('checkout.store'), []);

    $response->assertSessionHasErrors([
        'shipping_address',
        'billing_address',
        'payment_method',
    ]);
});

it('prevents checkout if product stock is insufficient', function () {
    $user = User::factory()->create();
    $category = Category::factory()->create();
    $product = Product::factory()->create([
        'category_id' => $category->id,
        'is_active' => true,
        'stock' => 1,
    ]);
    $cartItem = CartItem::factory()->create([
        'user_id' => $user->id,
        'product_id' => $product->id,
        'quantity' => 5,
    ]);

    $response = actingAs($user)->get(route('checkout.index'));

    $response->assertRedirect(route('cart.index'));
    $response->assertSessionHas('error');
});

it('requires authentication for checkout', function () {
    $response = get(route('checkout.index'));

    $response->assertRedirect(route('login'));
});
