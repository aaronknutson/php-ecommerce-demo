<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
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
            'user_id' => $this->user_id,
            'user' => $this->when($this->user_id, function () {
                return [
                    'id' => $this->user?->id,
                    'name' => $this->user?->name,
                    'email' => $this->user?->email,
                ];
            }),
            'order_number' => $this->order_number,
            'status' => $this->status,
            'subtotal' => (float) $this->subtotal,
            'tax' => (float) $this->tax,
            'shipping' => (float) $this->shipping,
            'total' => (float) $this->total,
            'shipping_address' => $this->transformAddress($this->shipping_address),
            'billing_address' => $this->transformAddress($this->billing_address),
            'payment_method' => $this->payment_method,
            'guest_email' => $this->guest_email,
            'notes' => $this->notes,
            'items' => $this->when($this->relationLoaded('items'), function () {
                return OrderItemResource::collection($this->items)->resolve();
            }),
            'items_count' => $this->items_count ?? 0,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }

    protected function transformAddress($address): ?array
    {
        if (! $address) {
            return null;
        }

        return [
            'line_1' => $address['address_line_1'] ?? $address['line_1'] ?? null,
            'line_2' => $address['address_line_2'] ?? $address['line_2'] ?? null,
            'city' => $address['city'] ?? null,
            'state' => $address['state'] ?? null,
            'postal_code' => $address['zip_code'] ?? $address['postal_code'] ?? null,
            'country' => $address['country'] ?? null,
        ];
    }
}
