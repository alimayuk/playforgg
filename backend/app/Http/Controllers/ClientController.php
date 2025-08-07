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
            'status' => 'success',
            'meta' => [
                'current_page' => $blogs->currentPage(),
                'last_page' => $blogs->lastPage(),
                'per_page' => $blogs->perPage(),
                'total' => $blogs->total(),
            ],
        ]);
    }

    public function blogDetail(Request $request, $slug)
    {
        $locale = $request->get('locale', 'tr');
        if (!Blog::where('slug', $slug)->where('locale', 1)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Bulunamadı.'
            ], 404);
        }
        $blog = Blog::with(['category:id,title,slug'])
            ->where('slug', $slug)
            ->where('locale', $locale)
            ->where('status', 1)
            ->firstOrFail([
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
                'created_at'
            ]);



        $otherBlogs = Blog::with(['category:id,title,slug'])
            ->where('status', 1)
            ->where('locale', $locale)
            ->where('id', '!=', $blog->id)
            ->where('category_id', $blog->category_id)
            ->latest()
            ->take(3)
            ->get([
                'id',
                'title',
                'slug',
                'image',
                'created_at',
                'category_id'
            ])
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'title' => $item->title,
                    'slug' => $item->slug,
                    'image' => $item->image,
                    'date' => $item->created_at->format('d.m.Y'),
                    'category' => [
                        'title' => $item->category->title ?? null,
                        'slug' => $item->category->slug ?? null,
                    ],
                ];
            });

        return response()->json([
            'data' => [
                'id' => $blog->id,
                'title' => $blog->title,
                'slug' => $blog->slug,
                'image' => $blog->image,
                'content' => $blog->content,
                'views' => $blog->views,
                'comment_count' => $blog->comment_count,
                'excerpt' => $blog->excerpt,
                'date' => $blog->created_at->format('d.m.Y'),
                'category' => [
                    'title' => $blog->category->title ?? null,
                    'slug' => $blog->category->slug ?? null,
                ],
            ],
            'otherBlogs' => $otherBlogs,
            'status' => 'success'
        ]);
    }
}
