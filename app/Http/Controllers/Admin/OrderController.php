<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateOrderStatusRequest;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $orders = Order::query()
            ->with(['user', 'items'])
            ->withCount('items')
            ->when($request->search, function ($query, $search) {
                $query->where('order_number', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    })
                    ->orWhere('guest_email', 'like', "%{$search}%");
            })
            ->when($request->status, function ($query, $status) {
                $query->where('status', $status);
            })
            ->latest()
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Admin/Orders/Index', [
            'orders' => OrderResource::collection($orders),
            'filters' => $request->only(['search', 'status']),
            'statuses' => [
                'pending' => 'Pending',
                'processing' => 'Processing',
                'shipped' => 'Shipped',
                'delivered' => 'Delivered',
                'cancelled' => 'Cancelled',
            ],
        ]);
    }

    public function show(Order $order)
    {
        $order->load(['user', 'items.product']);

        return Inertia::render('Admin/Orders/Show', [
            'order' => OrderResource::make($order)->resolve(),
            'statuses' => [
                'pending' => 'Pending',
                'processing' => 'Processing',
                'shipped' => 'Shipped',
                'delivered' => 'Delivered',
                'cancelled' => 'Cancelled',
            ],
        ]);
    }

    public function updateStatus(UpdateOrderStatusRequest $request, Order $order)
    {
        $validated = $request->validated();

        $order->update([
            'status' => $validated['status'],
            'notes' => $validated['notes'] ?? $order->notes,
        ]);

        return redirect()->back()->with('success', 'Order status updated successfully.');
    }

    public function destroy(Order $order)
    {
        if ($order->status !== 'cancelled') {
            return redirect()->back()->with('error', 'Only cancelled orders can be deleted.');
        }

        $order->delete();

        return redirect()->route('admin.orders.index')->with('success', 'Order deleted successfully.');
    }
}
