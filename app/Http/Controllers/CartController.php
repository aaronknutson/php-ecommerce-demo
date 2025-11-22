<?php

namespace App\Http\Controllers;

use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CartController extends Controller
{
    public function index(): Response
    {
        $cartItems = CartItem::query()
            ->with('product.category')
            ->where(function ($query) {
                if (auth()->check()) {
                    $query->where('user_id', auth()->id());
                } else {
                    $query->where('session_id', session()->getId());
                }
            })
            ->get();

        $subtotal = $cartItems->sum(function ($item) {
            return $item->product->price * $item->quantity;
        });

        return Inertia::render('Cart/Index', [
            'cartItems' => $cartItems,
            'subtotal' => $subtotal,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $product = Product::query()->findOrFail($validated['product_id']);

        if (! $product->is_active) {
            return back()->with('error', 'This product is not available.');
        }

        if ($product->stock < $validated['quantity']) {
            return back()->with('error', 'Insufficient stock available.');
        }

        $cartItem = CartItem::query()
            ->where('product_id', $validated['product_id'])
            ->where(function ($query) {
                if (auth()->check()) {
                    $query->where('user_id', auth()->id());
                } else {
                    $query->where('session_id', session()->getId());
                }
            })
            ->first();

        if ($cartItem) {
            $newQuantity = $cartItem->quantity + $validated['quantity'];

            if ($product->stock < $newQuantity) {
                return back()->with('error', 'Insufficient stock available.');
            }

            $cartItem->update(['quantity' => $newQuantity]);
        } else {
            CartItem::query()->create([
                'user_id' => auth()->id(),
                'session_id' => auth()->check() ? null : session()->getId(),
                'product_id' => $validated['product_id'],
                'quantity' => $validated['quantity'],
            ]);
        }

        return back()->with('success', 'Product added to cart successfully.');
    }

    public function update(Request $request, CartItem $cartItem): RedirectResponse
    {
        $this->authorizeCartItem($cartItem);

        $validated = $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        if ($cartItem->product->stock < $validated['quantity']) {
            return back()->with('error', 'Insufficient stock available.');
        }

        $cartItem->update(['quantity' => $validated['quantity']]);

        return back()->with('success', 'Cart updated successfully.');
    }

    public function destroy(CartItem $cartItem): RedirectResponse
    {
        $this->authorizeCartItem($cartItem);

        $cartItem->delete();

        return back()->with('success', 'Item removed from cart.');
    }

    protected function authorizeCartItem(CartItem $cartItem): void
    {
        if (auth()->check()) {
            if ($cartItem->user_id !== auth()->id()) {
                abort(403);
            }
        } else {
            if ($cartItem->session_id !== session()->getId()) {
                abort(403);
            }
        }
    }
}
