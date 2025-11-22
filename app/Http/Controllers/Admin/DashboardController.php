<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'total_products' => Product::count(),
            'active_products' => Product::where('is_active', true)->count(),
            'low_stock_products' => Product::where('stock', '<=', 10)->count(),
            'total_orders' => Order::count(),
            'pending_orders' => Order::where('status', 'pending')->count(),
            'total_revenue' => Order::where('status', '!=', 'cancelled')->sum('total'),
            'total_customers' => User::where('role', 'customer')->count(),
        ];

        $recent_orders = Order::with('user')
            ->latest()
            ->limit(5)
            ->get();

        $low_stock_products = Product::where('stock', '<=', 10)
            ->orderBy('stock')
            ->limit(5)
            ->get();

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'recent_orders' => $recent_orders,
            'low_stock_products' => $low_stock_products,
        ]);
    }
}
