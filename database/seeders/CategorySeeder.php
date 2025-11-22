<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Laptops & Computers', 'description' => 'High-performance laptops, desktops, and workstations', 'sort_order' => 1],
            ['name' => 'Smartphones & Tablets', 'description' => 'Latest mobile devices and tablets', 'sort_order' => 2],
            ['name' => 'Audio & Headphones', 'description' => 'Premium headphones, speakers, and audio equipment', 'sort_order' => 3],
            ['name' => 'Gaming', 'description' => 'Gaming consoles, accessories, and peripherals', 'sort_order' => 4],
            ['name' => 'Wearables & Smartwatches', 'description' => 'Fitness trackers and smartwatches', 'sort_order' => 5],
            ['name' => 'Accessories', 'description' => 'Cables, cases, chargers, and more', 'sort_order' => 6],
        ];

        foreach ($categories as $category) {
            Category::create([
                'name' => $category['name'],
                'slug' => Str::slug($category['name']),
                'description' => $category['description'],
                'sort_order' => $category['sort_order'],
            ]);
        }
    }
}
