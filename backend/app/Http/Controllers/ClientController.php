<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use App\Models\Category;
use Illuminate\Http\Request;

class ClientController extends Controller
{
    public function blogs(Request $request)
    {
        $locale = $request->get('locale', 'tr');
        $perPage = (int) $request->get('perPage', 9);
        $categorySlug = $request->get('category');

        $query = Blog::with(['category' => function ($q) {
            $q->select('id', 'title', 'slug');
        }])
            ->where('status', 1)
            ->where('locale', $locale)
            ->select([
                'id',
                'author_id',
                'category_id',
                'title',
                'slug',
                'image',
                'content',
                'status',
                'views',
                'comment_count',
                'excerpt',
                'locale',
                'created_at',
            ])
            ->whereHas('category', function ($q) {
                $q->where('status', 1);
            })
            ->orderBy('created_at', 'desc');

        if ($categorySlug && $categorySlug !== 'tum') {
            $query->whereHas('category', function ($q) use ($categorySlug) {
                $q->where('slug', $categorySlug);
            });
        }

        $blogs = $query->paginate($perPage);

        $categories = Category::where('status', 1)
            ->where('locale', $locale)
            ->select(['id', 'title', 'slug'])
            ->orderBy('title')
            ->get();

        return response()->json([
            'data' => $blogs->items(),
            'categories' => $categories,
            'status' => true,
            'meta' => [
                'current_page' => $blogs->currentPage(),
                'last_page' => $blogs->lastPage(),
                'per_page' => $blogs->perPage(),
                'total' => $blogs->total(),
            ],
        ]);
    }
}
