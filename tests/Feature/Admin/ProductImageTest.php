<?php

use App\Models\Category;
use App\Models\Product;
use App\Models\User;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\post;
use function Pest\Laravel\put;

beforeEach(function () {
    $this->admin = User::factory()->create(['role' => 'admin']);
    $this->category = Category::factory()->create();
});

it('allows creating product with primary image URL', function () {
    actingAs($this->admin);

    $response = post(route('admin.products.store'), [
        'category_id' => $this->category->id,
        'name' => 'Test Product',
        'sku' => 'TEST-001',
        'description' => 'Test description',
        'price' => 99.99,
        'stock' => 10,
        'primary_image' => 'https://example.com/image.jpg',
        'is_active' => true,
        'is_featured' => false,
    ]);

    $response->assertRedirect(route('admin.products.index'));
    expect(Product::where('sku', 'TEST-001')->first()->primary_image)
        ->toBe('https://example.com/image.jpg');
});

it('allows creating product with multiple image URLs', function () {
    actingAs($this->admin);

    $imageUrls = [
        'https://example.com/image1.jpg',
        'https://example.com/image2.jpg',
        'https://example.com/image3.jpg',
    ];

    $response = post(route('admin.products.store'), [
        'category_id' => $this->category->id,
        'name' => 'Test Product',
        'sku' => 'TEST-002',
        'description' => 'Test description',
        'price' => 99.99,
        'stock' => 10,
        'images' => $imageUrls,
        'is_active' => true,
        'is_featured' => false,
    ]);

    $response->assertRedirect(route('admin.products.index'));
    $product = Product::where('sku', 'TEST-002')->first();
    expect($product->images)->toBe($imageUrls);
});

it('validates primary image URL format', function () {
    actingAs($this->admin);

    $response = post(route('admin.products.store'), [
        'category_id' => $this->category->id,
        'name' => 'Test Product',
        'sku' => 'TEST-003',
        'description' => 'Test description',
        'price' => 99.99,
        'stock' => 10,
        'primary_image' => 'not-a-valid-url',
        'is_active' => true,
        'is_featured' => false,
    ]);

    $response->assertSessionHasErrors(['primary_image']);
});

it('validates additional image URLs format', function () {
    actingAs($this->admin);

    $response = post(route('admin.products.store'), [
        'category_id' => $this->category->id,
        'name' => 'Test Product',
        'sku' => 'TEST-004',
        'description' => 'Test description',
        'price' => 99.99,
        'stock' => 10,
        'images' => [
            'https://example.com/valid.jpg',
            'not-a-valid-url',
        ],
        'is_active' => true,
        'is_featured' => false,
    ]);

    $response->assertSessionHasErrors(['images.1']);
});

it('allows updating product images', function () {
    actingAs($this->admin);

    $product = Product::factory()->create([
        'category_id' => $this->category->id,
    ]);

    $response = put(route('admin.products.update', $product->id), [
        'category_id' => $this->category->id,
        'name' => $product->name,
        'sku' => $product->sku,
        'description' => $product->description,
        'price' => $product->price,
        'stock' => $product->stock,
        'primary_image' => 'https://example.com/updated-image.jpg',
        'images' => [
            'https://example.com/gallery1.jpg',
            'https://example.com/gallery2.jpg',
        ],
        'is_active' => true,
        'is_featured' => false,
    ]);

    $response->assertRedirect(route('admin.products.index'));
    $product->refresh();
    expect($product->primary_image)->toBe('https://example.com/updated-image.jpg')
        ->and($product->images)->toHaveCount(2);
});
