<?php

namespace App\Http\Controllers;

use App\Models\Address;
use App\Models\CartItem;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class CheckoutController extends Controller
{
    public function index(): Response|RedirectResponse
    {
        $cartItems = CartItem::query()
            ->with('product')
            ->where(function ($query) {
                if (auth()->check()) {
                    $query->where('user_id', auth()->id());
                } else {
                    $query->where('session_id', session()->getId());
                }
            })
            ->get();

        if ($cartItems->isEmpty()) {
            return redirect()->route('cart.index')->with('error', 'Your cart is empty.');
        }

        foreach ($cartItems as $item) {
            if (! $item->product->is_active || $item->product->stock < $item->quantity) {
                return redirect()->route('cart.index')->with('error', 'Some items in your cart are no longer available.');
            }
        }

        $subtotal = $cartItems->sum(fn ($item) => $item->product->price * $item->quantity);
        $tax = $subtotal * 0.08;
        $shipping = $subtotal >= 100 ? 0 : 10;
        $total = $subtotal + $tax + $shipping;

        $addresses = auth()->check()
            ? Address::query()->where('user_id', auth()->id())->get()
            : collect();

        return Inertia::render('Checkout/Index', [
            'cartItems' => $cartItems,
            'subtotal' => $subtotal,
            'tax' => $tax,
            'shipping' => $shipping,
            'total' => $total,
            'addresses' => $addresses,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'shipping_address' => 'required|array',
            'shipping_address.first_name' => 'required|string|max:255',
            'shipping_address.last_name' => 'required|string|max:255',
            'shipping_address.address_line_1' => 'required|string|max:255',
            'shipping_address.address_line_2' => 'nullable|string|max:255',
            'shipping_address.city' => 'required|string|max:255',
            'shipping_address.state' => 'required|string|max:255',
            'shipping_address.zip_code' => 'required|string|max:20',
            'shipping_address.country' => 'required|string|max:255',
            'shipping_address.phone' => 'required|string|max:20',
            'billing_address' => 'required|array',
            'billing_address.first_name' => 'required|string|max:255',
            'billing_address.last_name' => 'required|string|max:255',
            'billing_address.address_line_1' => 'required|string|max:255',
            'billing_address.address_line_2' => 'nullable|string|max:255',
            'billing_address.city' => 'required|string|max:255',
            'billing_address.state' => 'required|string|max:255',
            'billing_address.zip_code' => 'required|string|max:20',
            'billing_address.country' => 'required|string|max:255',
            'billing_address.phone' => 'required|string|max:20',
            'payment_method' => 'required|string|in:credit_card,paypal,cash_on_delivery',
            'guest_email' => auth()->guest() ? 'required|email' : 'nullable',
            'notes' => 'nullable|string|max:1000',
        ]);

        $cartItems = CartItem::query()
            ->with('product')
            ->where(function ($query) {
                if (auth()->check()) {
                    $query->where('user_id', auth()->id());
                } else {
                    $query->where('session_id', session()->getId());
                }
            })
            ->get();

        if ($cartItems->isEmpty()) {
            return redirect()->route('cart.index')->with('error', 'Your cart is empty.');
        }

        foreach ($cartItems as $item) {
            if (! $item->product->is_active || $item->product->stock < $item->quantity) {
                return redirect()->route('cart.index')->with('error', 'Some items in your cart are no longer available.');
            }
        }

        $subtotal = $cartItems->sum(fn ($item) => $item->product->price * $item->quantity);
        $tax = $subtotal * 0.08;
        $shipping = $subtotal >= 100 ? 0 : 10;
        $total = $subtotal + $tax + $shipping;

        DB::beginTransaction();

        try {
            $order = Order::query()->create([
                'user_id' => auth()->id(),
                'order_number' => 'ORD-'.strtoupper(uniqid()),
                'status' => 'pending',
                'subtotal' => $subtotal,
                'tax' => $tax,
                'shipping' => $shipping,
                'total' => $total,
                'shipping_address' => $validated['shipping_address'],
                'billing_address' => $validated['billing_address'],
                'payment_method' => $validated['payment_method'],
                'guest_email' => $validated['guest_email'] ?? null,
                'notes' => $validated['notes'] ?? null,
            ]);

            foreach ($cartItems as $cartItem) {
                OrderItem::query()->create([
                    'order_id' => $order->id,
                    'product_id' => $cartItem->product_id,
                    'quantity' => $cartItem->quantity,
                    'price' => $cartItem->product->price,
                    'total' => $cartItem->product->price * $cartItem->quantity,
                    'product_snapshot' => [
                        'name' => $cartItem->product->name,
                        'slug' => $cartItem->product->slug,
                        'description' => $cartItem->product->description,
                        'price' => $cartItem->product->price,
                        'image_url' => $cartItem->product->image_url,
                    ],
                ]);

                $cartItem->product->decrement('stock', $cartItem->quantity);
                $cartItem->delete();
            }

            DB::commit();

            return redirect()->route('orders.show', $order)->with('success', 'Order placed successfully!');
        } catch (\Exception $e) {
            DB::rollBack();

            if (app()->environment('testing')) {
                throw $e;
            }

            return back()->with('error', 'Failed to process order. Please try again.');
        }
    }
}
