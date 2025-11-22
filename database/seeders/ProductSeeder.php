<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $laptopsCategory = Category::where('slug', 'laptops-computers')->first();
        $smartphonesCategory = Category::where('slug', 'smartphones-tablets')->first();
        $audioCategory = Category::where('slug', 'audio-headphones')->first();
        $gamingCategory = Category::where('slug', 'gaming')->first();
        $wearablesCategory = Category::where('slug', 'wearables-smartwatches')->first();
        $accessoriesCategory = Category::where('slug', 'accessories')->first();

        $products = [
            // Laptops & Computers (15 products)
            [
                'category_id' => $laptopsCategory->id,
                'name' => 'MacBook Pro 16" M3 Max',
                'brand' => 'Apple',
                'description' => 'Powerhouse laptop with M3 Max chip, perfect for creative professionals and developers.',
                'price' => 3499.00,
                'compare_price' => 3999.00,
                'stock' => 15,
                'is_featured' => true,
                'specs' => ['processor' => 'Apple M3 Max', 'ram' => '36GB', 'storage' => '1TB SSD', 'display' => '16.2" Liquid Retina XDR', 'battery' => 'Up to 22 hours'],
            ],
            [
                'category_id' => $laptopsCategory->id,
                'name' => 'Dell XPS 15',
                'brand' => 'Dell',
                'description' => 'Premium Windows laptop with stunning OLED display and powerful performance.',
                'price' => 1899.00,
                'compare_price' => 2299.00,
                'stock' => 22,
                'is_featured' => false,
                'specs' => ['processor' => 'Intel Core i7-13700H', 'ram' => '16GB', 'storage' => '512GB SSD', 'display' => '15.6" OLED 3.5K', 'graphics' => 'NVIDIA RTX 4050'],
            ],
            [
                'category_id' => $laptopsCategory->id,
                'name' => 'ThinkPad X1 Carbon Gen 11',
                'brand' => 'Lenovo',
                'description' => 'Ultra-light business laptop with legendary ThinkPad keyboard and durability.',
                'price' => 1649.00,
                'stock' => 18,
                'specs' => ['processor' => 'Intel Core i7-1355U', 'ram' => '16GB', 'storage' => '512GB SSD', 'display' => '14" WUXGA', 'weight' => '2.48 lbs'],
            ],
            [
                'category_id' => $laptopsCategory->id,
                'name' => 'ASUS ROG Zephyrus G14',
                'brand' => 'ASUS',
                'description' => 'Compact gaming laptop with AMD Ryzen power and excellent battery life.',
                'price' => 1599.00,
                'compare_price' => 1899.00,
                'stock' => 12,
                'specs' => ['processor' => 'AMD Ryzen 9 7940HS', 'ram' => '16GB', 'storage' => '1TB SSD', 'display' => '14" QHD+ 165Hz', 'graphics' => 'NVIDIA RTX 4060'],
            ],
            [
                'category_id' => $laptopsCategory->id,
                'name' => 'Microsoft Surface Laptop 5',
                'brand' => 'Microsoft',
                'description' => 'Sleek and stylish laptop with touchscreen display and premium build quality.',
                'price' => 1299.00,
                'stock' => 20,
                'specs' => ['processor' => 'Intel Core i7-1255U', 'ram' => '16GB', 'storage' => '256GB SSD', 'display' => '13.5" PixelSense touchscreen', 'battery' => 'Up to 18 hours'],
            ],
            [
                'category_id' => $laptopsCategory->id,
                'name' => 'HP Spectre x360 14',
                'brand' => 'HP',
                'description' => '2-in-1 convertible laptop with stunning design and OLED display.',
                'price' => 1449.00,
                'stock' => 14,
                'specs' => ['processor' => 'Intel Core i7-1355U', 'ram' => '16GB', 'storage' => '512GB SSD', 'display' => '13.5" OLED 3K2K touchscreen', 'convertible' => 'Yes'],
            ],
            [
                'category_id' => $laptopsCategory->id,
                'name' => 'Acer Swift 3',
                'brand' => 'Acer',
                'description' => 'Affordable and portable laptop perfect for students and everyday use.',
                'price' => 649.00,
                'stock' => 35,
                'specs' => ['processor' => 'Intel Core i5-1335U', 'ram' => '8GB', 'storage' => '512GB SSD', 'display' => '14" FHD IPS', 'weight' => '2.65 lbs'],
            ],

            // Smartphones & Tablets (12 products)
            [
                'category_id' => $smartphonesCategory->id,
                'name' => 'iPhone 15 Pro Max',
                'brand' => 'Apple',
                'description' => 'Latest iPhone with titanium design, A17 Pro chip, and advanced camera system.',
                'price' => 1199.00,
                'stock' => 45,
                'is_featured' => true,
                'specs' => ['processor' => 'A17 Pro', 'storage' => '256GB', 'display' => '6.7" Super Retina XDR', 'camera' => '48MP Main + 12MP Ultra Wide + 12MP Telephoto', 'battery' => 'Up to 29 hours video'],
            ],
            [
                'category_id' => $smartphonesCategory->id,
                'name' => 'Samsung Galaxy S24 Ultra',
                'brand' => 'Samsung',
                'description' => 'Premium Android flagship with S Pen, incredible camera, and AI features.',
                'price' => 1299.00,
                'stock' => 38,
                'is_featured' => true,
                'specs' => ['processor' => 'Snapdragon 8 Gen 3', 'storage' => '512GB', 'ram' => '12GB', 'display' => '6.8" Dynamic AMOLED 2X 120Hz', 'camera' => '200MP Main + 50MP Telephoto + 12MP Ultra Wide'],
            ],
            [
                'category_id' => $smartphonesCategory->id,
                'name' => 'Google Pixel 8 Pro',
                'brand' => 'Google',
                'description' => 'Google flagship with best-in-class camera AI and pure Android experience.',
                'price' => 999.00,
                'stock' => 28,
                'specs' => ['processor' => 'Google Tensor G3', 'storage' => '128GB', 'ram' => '12GB', 'display' => '6.7" LTPO OLED 120Hz', 'camera' => '50MP Main + 48MP Telephoto + 48MP Ultra Wide'],
            ],
            [
                'category_id' => $smartphonesCategory->id,
                'name' => 'OnePlus 12',
                'brand' => 'OnePlus',
                'description' => 'Flagship killer with blazing fast charging and smooth performance.',
                'price' => 799.00,
                'stock' => 22,
                'specs' => ['processor' => 'Snapdragon 8 Gen 3', 'storage' => '256GB', 'ram' => '12GB', 'display' => '6.82" AMOLED 120Hz', 'charging' => '100W wired'],
            ],
            [
                'category_id' => $smartphonesCategory->id,
                'name' => 'iPad Pro 12.9" M2',
                'brand' => 'Apple',
                'description' => 'Professional tablet with M2 chip and stunning Liquid Retina XDR display.',
                'price' => 1099.00,
                'stock' => 16,
                'is_featured' => true,
                'specs' => ['processor' => 'Apple M2', 'storage' => '128GB', 'display' => '12.9" Liquid Retina XDR', 'camera' => '12MP Wide + 10MP Ultra Wide', 'pencil' => 'Apple Pencil 2nd gen support'],
            ],
            [
                'category_id' => $smartphonesCategory->id,
                'name' => 'Samsung Galaxy Tab S9 Ultra',
                'brand' => 'Samsung',
                'description' => 'Massive Android tablet perfect for productivity and entertainment.',
                'price' => 1199.00,
                'stock' => 12,
                'specs' => ['processor' => 'Snapdragon 8 Gen 2', 'storage' => '256GB', 'ram' => '12GB', 'display' => '14.6" Dynamic AMOLED 2X 120Hz', 's_pen' => 'Included'],
            ],

            // Audio & Headphones (10 products)
            [
                'category_id' => $audioCategory->id,
                'name' => 'Sony WH-1000XM5',
                'brand' => 'Sony',
                'description' => 'Industry-leading noise canceling headphones with exceptional sound quality.',
                'price' => 399.00,
                'compare_price' => 449.00,
                'stock' => 42,
                'is_featured' => true,
                'specs' => ['type' => 'Over-ear', 'noise_canceling' => 'Yes', 'battery' => '30 hours', 'connectivity' => 'Bluetooth 5.2', 'multipoint' => 'Yes'],
            ],
            [
                'category_id' => $audioCategory->id,
                'name' => 'AirPods Pro 2nd Gen',
                'brand' => 'Apple',
                'description' => 'Premium wireless earbuds with active noise cancellation and spatial audio.',
                'price' => 249.00,
                'stock' => 65,
                'is_featured' => true,
                'specs' => ['type' => 'In-ear', 'noise_canceling' => 'Yes', 'battery' => '6 hours (ANC on)', 'charging_case' => 'MagSafe + Lightning', 'water_resistance' => 'IPX4'],
            ],
            [
                'category_id' => $audioCategory->id,
                'name' => 'Bose QuietComfort Ultra',
                'brand' => 'Bose',
                'description' => 'Premium headphones with world-class noise cancellation and immersive audio.',
                'price' => 429.00,
                'stock' => 28,
                'specs' => ['type' => 'Over-ear', 'noise_canceling' => 'Yes', 'battery' => '24 hours', 'spatial_audio' => 'Yes', 'connectivity' => 'Bluetooth 5.3'],
            ],
            [
                'category_id' => $audioCategory->id,
                'name' => 'JBL Flip 6',
                'brand' => 'JBL',
                'description' => 'Portable Bluetooth speaker with powerful sound and waterproof design.',
                'price' => 129.00,
                'stock' => 48,
                'specs' => ['type' => 'Portable speaker', 'battery' => '12 hours', 'waterproof' => 'IP67', 'power' => '30W', 'partyboost' => 'Yes'],
            ],
            [
                'category_id' => $audioCategory->id,
                'name' => 'Sonos Arc',
                'brand' => 'Sonos',
                'description' => 'Premium soundbar with Dolby Atmos and immersive home theater audio.',
                'price' => 899.00,
                'stock' => 15,
                'specs' => ['type' => 'Soundbar', 'channels' => '5.0.2', 'dolby_atmos' => 'Yes', 'voice_control' => 'Alexa + Google Assistant', 'drivers' => '11 speakers'],
            ],

            // Gaming (10 products)
            [
                'category_id' => $gamingCategory->id,
                'name' => 'PlayStation 5',
                'brand' => 'Sony',
                'description' => 'Next-gen gaming console with ultra-fast SSD and stunning 4K graphics.',
                'price' => 499.00,
                'stock' => 25,
                'is_featured' => true,
                'specs' => ['storage' => '825GB SSD', 'resolution' => '4K at 120Hz', 'ray_tracing' => 'Yes', 'controller' => 'DualSense', '3d_audio' => 'Tempest 3D AudioTech'],
            ],
            [
                'category_id' => $gamingCategory->id,
                'name' => 'Xbox Series X',
                'brand' => 'Microsoft',
                'description' => 'Powerful gaming console with Game Pass and backward compatibility.',
                'price' => 499.00,
                'stock' => 30,
                'is_featured' => true,
                'specs' => ['storage' => '1TB SSD', 'resolution' => '4K at 120Hz', 'ray_tracing' => 'Yes', 'backwards_compatible' => 'Yes', 'game_pass' => 'Compatible'],
            ],
            [
                'category_id' => $gamingCategory->id,
                'name' => 'Nintendo Switch OLED',
                'brand' => 'Nintendo',
                'description' => 'Hybrid gaming console with vibrant OLED screen and exclusive games.',
                'price' => 349.00,
                'stock' => 42,
                'specs' => ['display' => '7" OLED', 'storage' => '64GB', 'battery' => '4.5 - 9 hours', 'modes' => 'TV + Tabletop + Handheld', 'online' => 'Nintendo Switch Online'],
            ],
            [
                'category_id' => $gamingCategory->id,
                'name' => 'Razer DeathAdder V3 Pro',
                'brand' => 'Razer',
                'description' => 'Professional wireless gaming mouse with ultra-precise sensor.',
                'price' => 149.00,
                'stock' => 55,
                'specs' => ['sensor' => 'Focus Pro 30K', 'dpi' => 'Up to 30,000', 'wireless' => 'HyperSpeed 2.4GHz', 'battery' => 'Up to 90 hours', 'weight' => '63g'],
            ],
            [
                'category_id' => $gamingCategory->id,
                'name' => 'SteelSeries Arctis Nova Pro Wireless',
                'brand' => 'SteelSeries',
                'description' => 'Premium gaming headset with active noise cancellation and dual battery system.',
                'price' => 349.00,
                'stock' => 18,
                'specs' => ['type' => 'Over-ear', 'wireless' => '2.4GHz + Bluetooth', 'noise_canceling' => 'Yes', 'battery' => 'Dual hot-swappable', 'compatibility' => 'PC + PS5 + Xbox'],
            ],

            // Wearables & Smartwatches (8 products)
            [
                'category_id' => $wearablesCategory->id,
                'name' => 'Apple Watch Series 9',
                'brand' => 'Apple',
                'description' => 'Advanced smartwatch with fitness tracking, health sensors, and seamless iPhone integration.',
                'price' => 429.00,
                'stock' => 38,
                'is_featured' => true,
                'specs' => ['display' => '41mm or 45mm Always-On Retina', 'processor' => 'S9 SiP', 'sensors' => 'Heart rate + ECG + Blood oxygen', 'water_resistance' => '50m', 'battery' => '18 hours'],
            ],
            [
                'category_id' => $wearablesCategory->id,
                'name' => 'Samsung Galaxy Watch 6',
                'brand' => 'Samsung',
                'description' => 'Feature-rich smartwatch with comprehensive health tracking for Android users.',
                'price' => 299.00,
                'stock' => 32,
                'specs' => ['display' => '1.5" Super AMOLED', 'sensors' => 'Heart rate + ECG + Body composition', 'battery' => '40 hours', 'wear_os' => 'Yes', 'water_resistance' => '5ATM'],
            ],
            [
                'category_id' => $wearablesCategory->id,
                'name' => 'Garmin Fenix 7X Solar',
                'brand' => 'Garmin',
                'description' => 'Rugged GPS multisport watch with solar charging and advanced training features.',
                'price' => 899.00,
                'stock' => 12,
                'specs' => ['display' => '1.4" solar charging', 'battery' => '28 days smartwatch mode', 'gps' => 'Multi-GNSS', 'maps' => 'TopoActive', 'water_resistance' => '10ATM'],
            ],
            [
                'category_id' => $wearablesCategory->id,
                'name' => 'Fitbit Charge 6',
                'brand' => 'Fitbit',
                'description' => 'Fitness tracker with built-in GPS and Google integration.',
                'price' => 159.00,
                'stock' => 45,
                'specs' => ['display' => 'Color AMOLED', 'gps' => 'Built-in', 'battery' => '7 days', 'google_apps' => 'YouTube Music + Maps', 'water_resistance' => '5ATM'],
            ],

            // Accessories (10 products)
            [
                'category_id' => $accessoriesCategory->id,
                'name' => 'Anker 747 Power Bank',
                'brand' => 'Anker',
                'description' => 'High-capacity portable charger with 87W fast charging for laptops and phones.',
                'price' => 149.00,
                'stock' => 62,
                'specs' => ['capacity' => '25,600mAh', 'output' => '87W USB-C PD', 'ports' => '2x USB-C + 1x USB-A', 'weight' => '1.25 lbs'],
            ],
            [
                'category_id' => $accessoriesCategory->id,
                'name' => 'USB-C to USB-C Cable 10ft',
                'brand' => 'Anker',
                'description' => 'Durable braided cable supporting 100W charging and 480Mbps data transfer.',
                'price' => 19.99,
                'stock' => 120,
                'specs' => ['length' => '10 feet', 'power' => '100W USB-C PD', 'data' => '480Mbps', 'certification' => 'USB-IF Certified'],
            ],
            [
                'category_id' => $accessoriesCategory->id,
                'name' => 'Spigen Tough Armor Case - iPhone 15 Pro',
                'brand' => 'Spigen',
                'description' => 'Dual-layer protective case with kickstand for iPhone 15 Pro.',
                'price' => 29.99,
                'stock' => 85,
                'specs' => ['protection' => 'Military-grade MIL-STD 810G-516.6', 'kickstand' => 'Yes', 'wireless_charging' => 'Compatible', 'material' => 'TPU + Polycarbonate'],
            ],
            [
                'category_id' => $accessoriesCategory->id,
                'name' => 'SanDisk Extreme Portable SSD 2TB',
                'brand' => 'SanDisk',
                'description' => 'Rugged portable SSD with blazing fast speeds and IP55 rating.',
                'price' => 199.00,
                'compare_price' => 249.00,
                'stock' => 38,
                'specs' => ['capacity' => '2TB', 'speed' => 'Up to 1050MB/s read', 'connector' => 'USB-C', 'durability' => 'IP55 water & dust resistance', 'drop_protection' => '2-meter'],
            ],
            [
                'category_id' => $accessoriesCategory->id,
                'name' => 'Logitech MX Master 3S',
                'brand' => 'Logitech',
                'description' => 'Premium wireless mouse with silent clicks and multi-device support.',
                'price' => 99.00,
                'stock' => 48,
                'specs' => ['sensor' => '8000 DPI', 'connectivity' => 'Bluetooth + USB receiver', 'battery' => '70 days', 'multi_device' => '3 devices', 'silent' => 'Yes'],
            ],
            [
                'category_id' => $accessoriesCategory->id,
                'name' => 'Keychron K8 Pro Mechanical Keyboard',
                'brand' => 'Keychron',
                'description' => 'Wireless mechanical keyboard with hot-swappable switches and RGB backlighting.',
                'price' => 109.00,
                'stock' => 34,
                'specs' => ['layout' => 'Tenkeyless 87-key', 'switches' => 'Hot-swappable Gateron', 'connectivity' => 'Bluetooth + Wired', 'battery' => '4000mAh', 'rgb' => 'South-facing RGB'],
            ],
        ];

        foreach ($products as $product) {
            $slug = Str::slug($product['name']);
            Product::create([
                'category_id' => $product['category_id'],
                'name' => $product['name'],
                'slug' => $slug,
                'sku' => strtoupper(Str::random(3)).'-'.rand(10000, 99999),
                'brand' => $product['brand'],
                'description' => $product['description'],
                'specs' => $product['specs'],
                'price' => $product['price'],
                'compare_price' => $product['compare_price'] ?? null,
                'stock' => $product['stock'],
                'is_featured' => $product['is_featured'] ?? false,
                'is_active' => true,
            ]);
        }
    }
}
