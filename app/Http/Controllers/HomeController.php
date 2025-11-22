<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\StoreInfo;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        $storeInfo = StoreInfo::first();

        $featuredProducts = Product::query()
            ->with('category')
            ->where('is_active', true)
            ->where('is_featured', true)
            ->latest()
            ->limit(8)
            ->get();

        return Inertia::render('Home', [
            'store' => $storeInfo,
            'featuredProducts' => $featuredProducts,
        ]);
    }
}
