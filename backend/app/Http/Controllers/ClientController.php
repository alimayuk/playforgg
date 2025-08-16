<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\Blog;
use App\Models\Category;
use App\Models\ForumTopic;
use App\Models\Game;
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

    public function articles(Request $request)
    {
        $locale = $request->get('locale', 'tr');
        $perPage = (int) $request->get('perPage', 6);

        $query = Article::where('status', 1)
            ->where('locale', $locale)
            ->select([
                'id',
                'author_id',
                'title',
                'slug',
                'image',
                'excerpt',
                'status',
                'views',
                'locale',
                'created_at',
            ])
            ->orderBy('created_at', 'desc');

        $articles = $query->paginate($perPage);

        return response()->json([
            'data' => $articles->items(),
            'status' => 'success',
            'meta' => [
                'current_page' => $articles->currentPage(),
                'last_page' => $articles->lastPage(),
                'per_page' => $articles->perPage(),
                'total' => $articles->total(),
            ],
        ]);
    }

    public function articleDetail(Request $request, $slug)
    {
        $locale = $request->get('locale', 'tr');
        if (!Article::where('slug', $slug)->where('locale', 1)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Bulunamadı.'
            ], 404);
        }
        $article = Article::with(['category:id,title,slug'])
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



        $otherArticles = Article::with(['category:id,title,slug'])
            ->where('status', 1)
            ->where('locale', $locale)
            ->where('id', '!=', $article->id)
            ->where('category_id', $article->category_id)
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
                'id' => $article->id,
                'title' => $article->title,
                'slug' => $article->slug,
                'image' => $article->image,
                'content' => $article->content,
                'views' => $article->views,
                'comment_count' => $article->comment_count,
                'excerpt' => $article->excerpt,
                'date' => $article->created_at->format('d.m.Y'),
                'category' => [
                    'title' => $article->category->title ?? null,
                    'slug' => $article->category->slug ?? null,
                ],
            ],
            'otherArticles' => $otherArticles,
            'status' => 'success'
        ]);
    }

    public function forumsIndex(Request $request)
    {
        $locale = $request->get('locale', 'tr');
        $forums = ForumTopic::with('user', 'category')->where('status', 1)->latest()->get();
        $categories = Category::where('status', 1)
            ->where('locale', $locale)
            ->select(['id', 'title', 'slug'])
            ->orderBy('title')
            ->get();
        return response()->json([
            'data' => $forums,
            'categories' => $categories,
            'status' => 'success'
        ], 200);
    }

    public function forumsDetail(ForumTopic $topic)
    {
        $topic->increment('views');
        return $topic->load(['user', 'comments.user', 'comments.replies.user']);
    }

    public function gamesIndex(Request $request)
    {
        $locale = $request->get('locale', 'tr');
        $perPage = (int) $request->get('perPage', 9);
        $categorySlug = $request->get('category');

        $query = Game::with(['category' => function ($q) {
            $q->select('id', 'title', 'slug');
        }, 'user' => function ($q) {
            $q->select('id', 'username');
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

        $games = $query->paginate($perPage);

        $categories = Category::where('status', 1)
            ->where('locale', $locale)
            ->select(['id', 'title', 'slug'])
            ->orderBy('title')
            ->get();

        return response()->json([
            'data' => $games->items(),
            'categories' => $categories,
            'status' => 'success',
            'meta' => [
                'current_page' => $games->currentPage(),
                'last_page' => $games->lastPage(),
                'per_page' => $games->perPage(),
                'total' => $games->total(),
            ],
        ]);
    }
    public function gamesDetail(Request $request, $slug)
    {
        $locale = $request->get('locale', 'tr');
        if (!Game::where('slug', $slug)->where('locale', 1)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Bulunamadı.'
            ], 404);
        }
        $game = Game::with(['category:id,title,slug', 'user:id,username'])
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
                'locale',
                'created_at'
            ]);


        $otherGames = Game::with(['category:id,title,slug', 'user:id,username'])
            ->where('status', 1)
            ->where('locale', $locale)
            ->where('id', '!=', $game->id)
            ->where('category_id', $game->category_id)
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
                        'id' => $item->category->id ?? null,
                        'title' => $item->category->title ?? null,
                        'slug' => $item->category->slug ?? null,
                    ],
                    'user' => [
                        'id' => $item->category->id ?? null,
                        'username' => $item->category->username ?? 'Bilinmiyor',
                    ],
                ];
            });

        return response()->json([
            'data' => [
                'id' => $game->id,
                'title' => $game->title,
                'slug' => $game->slug,
                'image' => $game->image,
                'content' => $game->content,
                'views' => $game->views,
                'date' => $game->created_at->format('d.m.Y'),
                'category' => [
                    'id' => $game->category->id ?? null,
                    'title' => $game->category->title ?? null,
                    'slug' => $game->category->slug ?? null,
                ],
                'user' => [
                    'id' => $game->category->id ?? null,
                    'username' => $game->user->username ?? 'Bilinmiyor',
                ],
            ],
            'otherGames' => $otherGames,
            'status' => 'success'
        ]);
    }

    public function commentsIndex(Blog $blog)
    {
        $comments = $blog->comments()
            ->with(['user', 'replies.user'])
            ->latest()
            ->get();

        return response()->json($comments);
    }

    public function homePageData(Request $request)
    {
        $locale = $request->get('locale', 'tr');

        $blogs = Blog::with([
            'category' => fn($q) => $q->select('id', 'title', 'locale')->where('locale', $locale),
            'user' => fn($u) => $u->select('id', 'username')
        ])
            ->where('status', 1)
            ->where('locale', $locale)
            ->select([
                'id',
                'author_id',
                'category_id',
                'title',
                'slug',
                'image',
                'comment_count',
                'excerpt',
                'locale',
                'created_at'
            ])
            ->whereHas(
                'category',
                fn($q) => $q
                    ->where('status', 1)
                    ->where('locale', $locale)
            )
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        $games = Game::with([
            'category' => fn($q) => $q->select('id', 'title', 'locale')->where('locale', $locale)
        ])
            ->where('status', 1)
            ->where('locale', $locale)
            ->select([
                'id',
                'author_id',
                'category_id',
                'title',
                'slug',
                'image',
                'excerpt',
                'locale',
                'created_at'
            ])
            ->whereHas(
                'category',
                fn($q) => $q
                    ->where('status', 1)
                    ->where('locale', $locale)
            )
            ->orderBy('created_at', 'desc')
            ->take(7)
            ->get();

        $featuredCategories = Category::where('status', 1)
            ->where('featured', 1)
            ->where('locale', $locale)
            ->select('id', 'title', 'slug', 'image', 'icon')
            ->orderBy('title')
            ->take(6)
            ->get();
        $categories = Category::where('status', 1)
            ->where('locale', $locale)
            ->select('id', 'title', 'slug')
            ->orderBy('title')
            ->take(9)
            ->get();
        $forums = ForumTopic::where('status', 1)
            ->select('id', 'title', 'slug')
            ->orderBy('created_at', 'desc')
            ->take(7)
            ->get();
        return response()->json([
            'blogs' => $blogs,
            'games' => $games,
            'categories' => $categories,
            'featuredCategories' => $featuredCategories,
            'forums' => $forums,
            'status' => 'success'
        ]);
    }
}
