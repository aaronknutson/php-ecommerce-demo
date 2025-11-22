<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StoreInfo extends Model
{
    /** @use HasFactory<\Database\Factories\StoreInfoFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'about',
        'address_line_1',
        'address_line_2',
        'city',
        'state',
        'zip_code',
        'country',
        'phone',
        'email',
        'hours',
        'map_embed',
        'images',
    ];

    protected function casts(): array
    {
        return [
            'hours' => 'array',
            'images' => 'array',
        ];
    }
}
