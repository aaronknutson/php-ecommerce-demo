<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    /** @use HasFactory<\Database\Factories\ProductFactory> */
    use HasFactory;

    protected $fillable = [
        'category_id',
        'name',
        'slug',
        'sku',
        'description',
        'brand',
        'specs',
        'price',
        'compare_price',
        'stock',
        'primary_image',
        'images',
        'is_active',
        'is_featured',
    ];

    protected function casts(): array
    {
        return [
            'specs' => 'array',
            'images' => 'array',
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
            'price' => 'decimal:2',
            'compare_price' => 'decimal:2',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function cartItems(): HasMany
    {
        return $this->hasMany(CartItem::class);
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }
}
