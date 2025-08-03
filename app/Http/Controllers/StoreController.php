<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StoreController extends Controller
{
    /**
     * Display the main store page.
     */
    public function index(Request $request)
    {
        $categories = Category::active()->with(['products' => function ($query) {
            $query->active()->inStock()->orderBy('sort_order')->orderBy('name');
        }])->get();

        $featuredProducts = Product::active()->featured()->inStock()->with('category')->take(8)->get();

        $search = $request->get('search');
        $categoryFilter = $request->get('category');

        $productsQuery = Product::active()->inStock()->with('category');

        if ($search) {
            $productsQuery->where(function ($query) use ($search) {
                $query->where('name', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($categoryFilter) {
            $productsQuery->where('category_id', $categoryFilter);
        }

        $products = $productsQuery->orderBy('is_featured', 'desc')
                                  ->orderBy('sort_order')
                                  ->orderBy('name')
                                  ->paginate(12);

        return Inertia::render('welcome', [
            'categories' => $categories,
            'featuredProducts' => $featuredProducts,
            'products' => $products,
            'filters' => [
                'search' => $search,
                'category' => $categoryFilter,
            ],
        ]);
    }

    /**
     * Display a specific product.
     */
    public function show(Product $product)
    {
        $product->load('category');
        
        $relatedProducts = Product::active()
            ->inStock()
            ->where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->with('category')
            ->take(4)
            ->get();

        return Inertia::render('product-detail', [
            'product' => $product,
            'relatedProducts' => $relatedProducts,
        ]);
    }
}