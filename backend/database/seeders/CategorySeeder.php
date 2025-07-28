<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use Illuminate\Support\Str;
use Faker\Factory as Faker;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $fakerTr = Faker::create('tr_TR');
        $fakerEn = Faker::create('en_US');

        $locales = ['tr', 'en'];
        $countPerLocale = 50;

        foreach ($locales as $locale) {
            $faker = $locale === 'tr' ? $fakerTr : $fakerEn;

            for ($i = 0; $i < $countPerLocale; $i++) {
                $title = $faker->unique()->words(rand(1, 3), true);

                Category::create([
                    'title' => ucfirst($title),
                    'slug' => Str::slug($title),
                    'locale' => $locale,
                    'status' => rand(0, 1),
                    'featured' => rand(0, 1),
                    'parent_id' => null, // dilersen bazılarına parent ekleyebilirsin
                ]);
            }
        }
    }
}
