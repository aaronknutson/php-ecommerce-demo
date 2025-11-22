<?php

use App\Models\CartItem;
use App\Models\Category;
use App\Models\Product;
use App\Models\User;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\post;

it('displays cart items for authenticated user', function () {
    $user = User::factory()->create();
    $category = Category::factory()->create();
    $product = Product::factory()->create(['category_id' => $category->id]);
    $cartItem = CartItem::factory()->create([
        'user_id' => $user->id,
        'product_id' => $product->id,
        'quantity' => 2,
    ]);

    $response = actingAs($user)->get(route('cart.index'));

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('Cart/Index')
        ->has('cartItems', 1)
        ->where('cartItems.0.id', $cartItem->id)
    );
});

it('adds product to cart', function () {
    $category = Category::factory()->create();
    $product = Product::factory()->create([
        'category_id' => $category->id,
        'is_active' => true,
        'stock' => 10,
    ]);

    $response = post(route('cart.store'), [
        'product_id' => $product->id,
        'quantity' => 2,
    ]);

    $response->assertRedirect();
    $response->assertSessionHas('success');
    $this->assertDatabaseHas('cart_items', [
        'product_id' => $product->id,
        'quantity' => 2,
    ]);
});

it('updates existing cart item quantity', function () {
    $user = User::factory()->create();
    $category = Category::factory()->create();
    $product = Product::factory()->create([
        'category_id' => $category->id,
        'is_active' => true,
        'stock' => 10,
    ]);

    $cartItem = CartItem::factory()->create([
        'user_id' => $user->id,
        'product_id' => $product->id,
        'quantity' => 1,
    ]);

    $response = actingAs($user)->post(route('cart.store'), [
        'product_id' => $product->id,
        'quantity' => 2,
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('cart_items', [
        'id' => $cartItem->id,
        'product_id' => $product->id,
        'quantity' => 3,
    ]);
});

it('prevents adding inactive product to cart', function () {
    $category = Category::factory()->create();
    $product = Product::factory()->create([
        'category_id' => $category->id,
        'is_active' => false,
    ]);

    $response = post(route('cart.store'), [
        'product_id' => $product->id,
        'quantity' => 1,
    ]);

    $response->assertRedirect();
    $response->assertSessionHas('error');
    $this->assertDatabaseMissing('cart_items', [
        'product_id' => $product->id,
    ]);
});

it('prevents adding more than available stock', function () {
    $category = Category::factory()->create();
    $product = Product::factory()->create([
        'category_id' => $category->id,
        'is_active' => true,
        'stock' => 5,
    ]);

    $response = post(route('cart.store'), [
        'product_id' => $product->id,
        'quantity' => 10,
    ]);

    $response->assertRedirect();
    $response->assertSessionHas('error');
});

it('updates cart item quantity', function () {
    $user = User::factory()->create();
    $category = Category::factory()->create();
    $product = Product::factory()->create([
        'category_id' => $category->id,
        'stock' => 10,
    ]);
    $cartItem = CartItem::factory()->create([
        'user_id' => $user->id,
        'product_id' => $product->id,
        'quantity' => 2,
    ]);

    $response = actingAs($user)->patch(route('cart.update', $cartItem), [
        'quantity' => 5,
    ]);

    $response->assertRedirect();
    $response->assertSessionHas('success');
    $this->assertDatabaseHas('cart_items', [
        'id' => $cartItem->id,
        'quantity' => 5,
    ]);
});

it('removes cart item', function () {
    $user = User::factory()->create();
    $category = Category::factory()->create();
    $product = Product::factory()->create(['category_id' => $category->id]);
    $cartItem = CartItem::factory()->create([
        'user_id' => $user->id,
        'product_id' => $product->id,
    ]);

    $response = actingAs($user)->delete(route('cart.destroy', $cartItem));

    $response->assertRedirect();
    $response->assertSessionHas('success');
    $this->assertDatabaseMissing('cart_items', [
        'id' => $cartItem->id,
    ]);
});

it('prevents unauthorized user from updating cart item', function () {
    $owner = User::factory()->create();
    $otherUser = User::factory()->create();
    $category = Category::factory()->create();
    $product = Product::factory()->create(['category_id' => $category->id]);
    $cartItem = CartItem::factory()->create([
        'user_id' => $owner->id,
        'product_id' => $product->id,
    ]);

    $response = actingAs($otherUser)->patch(route('cart.update', $cartItem), [
        'quantity' => 5,
    ]);

    $response->assertForbidden();
});
