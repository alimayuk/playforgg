<?php

namespace App\Http\Controllers;

use App\Http\Requests\ArticleRequest;
use App\Http\Resources\ArticleResource;
use App\Models\Article;
use App\Services\ImageService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class ArticleController extends Controller
{
    public function index(Request $request)
    {
        $locale = $request->get('locale', 'tr');
        $perPage = (int) $request->get('per_page', 5);

        $query = Article::query();

        if ($locale !== 'hepsi') {
            $query->where('locale', $locale);
        }

        $articles = $query->orderBy('created_at', 'desc')->paginate($perPage);


        return ArticleResource::collection($articles)
            ->additional([
                'status' => true,
            ]);
    }

    public function store(ArticleRequest $request)
    {
        $data = $request->validated();
        $data['locale'] = $request->input('locale', 'tr');

        if (!$request->slug) {
            $data['slug'] = Str::slug($request->title);
            if (Article::where('slug', $data['slug'])->exists()) {
                $data['slug'] .= '-' . Str::random(5);
            }
        }

        if ($request->hasFile('image')) {
            $data['image'] = ImageService::uploadImage($request->file('image'), 'articles');
            $data['image'] = 'storage/' . $data['image'];
        }
        $data['author_id'] = auth()->id();
        $article = Article::create($data);

        return new ArticleResource($article);
    }

    public function update(ArticleRequest $request, $id)
    {
        $data = $request->validated();
        $article = Article::find($id);
        if (!$article) {
            return response()->json(['status' => 'error', 'message' => 'Haber bulunamadı!'], 404);
        }

        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($request->title);
        }


        if ($request->boolean('remove_image')) {
            ImageService::deleteImage($article->image);
            $data['image'] = null;
        } elseif ($request->hasFile('image')) {
            ImageService::deleteImage($article->image);
            $data['image'] = ImageService::uploadImage($request->file('image'), 'articles');
            $data['image'] = 'storage/' . $data['image'];
        }
        $data['author_id'] = auth()->id();
        $article->update($data);

        return response()->json([
            'message' => 'Kayıt başarıyla güncellendi.',
            'data' => new ArticleResource($article),
            'status' => true
        ], 200);
    }

    public function destroy($id)
    {
        try {
            $article = Article::find($id);
            if (!$article) {
                return response()->json(['status' => 'error', 'message' => 'Haber bulunamadı!'], 404);
            }

            if ($article->image) {
                ImageService::deleteImage($article->image);
            }

            $article->delete();

            return response()->json(['message' => 'Haber silindi', 'status' => true]);
        } catch (\Throwable $e) {
            Log::error('Haber silinirken hata: ' . $e->getMessage());
            return response()->json(['message' => 'Sunucu hatası', 'error' => $e->getMessage()], 500);
        }
    }
}
