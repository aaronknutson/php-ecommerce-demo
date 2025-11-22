<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'category_id' => $this->category_id,
            'category' => $this->when($this->relationLoaded('category'), function () {
                return CategoryResource::make($this->category)->resolve();
            }),
            'name' => $this->name,
            'slug' => $this->slug,
            'sku' => $this->sku,
            'description' => $this->description,
            'brand' => $this->brand,
            'specs' => $this->specs,
            'price' => $this->price,
            'compare_price' => $this->compare_price,
            'stock' => $this->stock,
            'primary_image' => $this->primary_image,
            'images' => $this->images,
            'is_active' => $this->is_active,
            'is_featured' => $this->is_featured,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
