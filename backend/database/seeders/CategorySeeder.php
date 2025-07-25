<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            // TR kategorileri
            [
                'title' => 'Yazılım',
                'slug' => Str::slug('Yazılım'),
                'locale' => 'tr',
                'status' => 1,
                'featured' => 1,
            ],
            [
                'title' => 'Tasarım',
                'slug' => Str::slug('Tasarım'),
                'locale' => 'tr',
                'status' => 1,
                'featured' => 1,
            ],
            // EN kategorileri
            [
                'title' => 'Software',
                'slug' => Str::slug('Software'),
                'locale' => 'en',
                'status' => 1,
                'featured' => 1,
            ],
            [
                'title' => 'Design',
                'slug' => Str::slug('Design'),
                'locale' => 'en',
                'status' => 1,
                'featured' => 1,
            ],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
