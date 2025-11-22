<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(): Response
    {
        $query = Product::query()
            ->with('category')
            ->where('is_active', true);

        if (request('category')) {
            $query->whereHas('category', function ($q) {
                $q->where('slug', request('category'));
            });
        }

        if (request('search')) {
            $query->where(function ($q) {
                $q->where('name', 'like', '%'.request('search').'%')
                    ->orWhere('description', 'like', '%'.request('search').'%')
                    ->orWhere('brand', 'like', '%'.request('search').'%');
            });
        }

        if (request('sort') === 'price_asc') {
            $query->orderBy('price', 'asc');
        } elseif (request('sort') === 'price_desc') {
            $query->orderBy('price', 'desc');
        } elseif (request('sort') === 'name') {
            $query->orderBy('name', 'asc');
        } else {
            $query->latest();
        }

        $products = $query->paginate(12)->withQueryString();

        return Inertia::render('Shop/Index', [
            'products' => $products,
            'categories' => Category::query()
                ->whereNull('parent_id')
                ->with('children')
                ->orderBy('sort_order')
                ->get(),
            'filters' => [
                'search' => request('search'),
                'category' => request('category'),
                'sort' => request('sort'),
            ],
        ]);
    }

    public function show(string $slug): Response
    {
        $product = Product::query()
            ->with(['category'])
            ->where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();

        $relatedProducts = Product::query()
            ->where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->where('is_active', true)
            ->limit(4)
            ->get();

        return Inertia::render('Shop/ProductDetail', [
            'product' => $product,
            'relatedProducts' => $relatedProducts,
        ]);
    }
}
