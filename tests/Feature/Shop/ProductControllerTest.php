<?php

use App\Models\Category;
use App\Models\Product;

use function Pest\Laravel\get;

it('displays active products on shop index page', function () {
    $category = Category::factory()->create();
    $activeProduct = Product::factory()->create([
        'category_id' => $category->id,
        'is_active' => true,
    ]);
    $inactiveProduct = Product::factory()->create([
        'category_id' => $category->id,
        'is_active' => false,
    ]);

    $response = get(route('shop.index'));

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('Shop/Index')
        ->has('products.data', 1)
        ->where('products.data.0.id', $activeProduct->id)
    );
});

it('filters products by category', function () {
    $electronics = Category::factory()->create(['slug' => 'electronics']);
    $clothing = Category::factory()->create(['slug' => 'clothing']);

    $laptop = Product::factory()->create([
        'category_id' => $electronics->id,
        'is_active' => true,
    ]);
    $shirt = Product::factory()->create([
        'category_id' => $clothing->id,
        'is_active' => true,
    ]);

    $response = get(route('shop.index', ['category' => 'electronics']));

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('Shop/Index')
        ->has('products.data', 1)
        ->where('products.data.0.id', $laptop->id)
    );
});

it('searches products by name', function () {
    $category = Category::factory()->create();
    $laptop = Product::factory()->create([
        'category_id' => $category->id,
        'name' => 'Gaming Laptop',
        'is_active' => true,
    ]);
    $phone = Product::factory()->create([
        'category_id' => $category->id,
        'name' => 'Smartphone',
        'is_active' => true,
    ]);

    $response = get(route('shop.index', ['search' => 'Laptop']));

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('Shop/Index')
        ->has('products.data', 1)
        ->where('products.data.0.id', $laptop->id)
    );
});

it('sorts products by price ascending', function () {
    $category = Category::factory()->create();
    $expensive = Product::factory()->create([
        'category_id' => $category->id,
        'price' => 999.99,
        'is_active' => true,
    ]);
    $cheap = Product::factory()->create([
        'category_id' => $category->id,
        'price' => 99.99,
        'is_active' => true,
    ]);

    $response = get(route('shop.index', ['sort' => 'price_asc']));

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('Shop/Index')
        ->has('products.data', 2)
        ->where('products.data.0.id', $cheap->id)
        ->where('products.data.1.id', $expensive->id)
    );
});

it('displays product detail page', function () {
    $category = Category::factory()->create();
    $product = Product::factory()->create([
        'category_id' => $category->id,
        'slug' => 'test-product',
        'is_active' => true,
    ]);

    $response = get(route('shop.show', $product->slug));

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('Shop/ProductDetail')
        ->where('product.id', $product->id)
        ->where('product.slug', $product->slug)
        ->has('relatedProducts')
    );
});

it('returns 404 for inactive product', function () {
    $category = Category::factory()->create();
    $product = Product::factory()->create([
        'category_id' => $category->id,
        'slug' => 'inactive-product',
        'is_active' => false,
    ]);

    $response = get(route('shop.show', $product->slug));

    $response->assertNotFound();
});
