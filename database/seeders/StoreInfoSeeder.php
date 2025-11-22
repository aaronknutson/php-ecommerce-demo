<?php

namespace Database\Seeders;

use App\Models\StoreInfo;
use Illuminate\Database\Seeder;

class StoreInfoSeeder extends Seeder
{
    public function run(): void
    {
        StoreInfo::create([
            'name' => 'TechHub Electronics',
            'about' => 'Your premier destination for cutting-edge electronics since 2010. We specialize in laptops, smartphones, gaming gear, and premium audio equipment. Our knowledgeable staff is here to help you find the perfect tech for your needs. Visit us in store or shop online for the latest gadgets and exclusive deals.',
            'address_line_1' => '1234 Technology Drive',
            'address_line_2' => 'Suite 100',
            'city' => 'San Francisco',
            'state' => 'CA',
            'zip_code' => '94105',
            'country' => 'US',
            'phone' => '(555) 123-4567',
            'email' => 'info@techhub-electronics.com',
            'hours' => [
                'monday' => '9:00 AM - 8:00 PM',
                'tuesday' => '9:00 AM - 8:00 PM',
                'wednesday' => '9:00 AM - 8:00 PM',
                'thursday' => '9:00 AM - 8:00 PM',
                'friday' => '9:00 AM - 9:00 PM',
                'saturday' => '10:00 AM - 9:00 PM',
                'sunday' => '11:00 AM - 6:00 PM',
            ],
            'map_embed' => '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.0195457167783!2d-122.39929368468173!3d37.79268497975683!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzfCsDQ3JzMzLjciTiAxMjLCsDIzJzQ5LjQiVw!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus" width="100%" height="450" style="border:0;" allowfullscreen="" loading="lazy"></iframe>',
            'images' => [
                '/images/store/storefront-1.jpg',
                '/images/store/storefront-2.jpg',
                '/images/store/interior-1.jpg',
                '/images/store/interior-2.jpg',
            ],
        ]);
    }
}
