<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CustomerController extends Controller
{
    public function index(): Response
    {
        $customers = User::query()
            ->where('role', 'customer')
            ->withCount('orders')
            ->latest()
            ->paginate(20);

        return Inertia::render('Admin/Customers/Index', [
            'customers' => $customers,
        ]);
    }

    public function show(User $customer): Response
    {
        if ($customer->role !== 'customer') {
            abort(404);
        }

        $customer->load([
            'orders' => fn ($query) => $query->latest()->limit(10),
            'addresses',
        ]);

        return Inertia::render('Admin/Customers/Show', [
            'customer' => $customer,
        ]);
    }
}
