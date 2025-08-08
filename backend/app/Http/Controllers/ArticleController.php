<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Services\ImageService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ArticleController extends Controller
{
    public function index(Request $request)
    {
        $articles = Article::get();
        return response()->json([
            'status' => 'success',
            'data' => $articles,
        ], 200);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:300|unique:categories,slug',
            'image' => 'nullable|image',
            'status' => 'boolean',
            'excerpt' => 'nullable|string',
            'locale' => 'nullable|in:tr,en',
        ]);

        $data = $request->all();

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

        return response()->json([
            "message" => "Haber başarıyla oluşturuldu.",
            "data" => $article,
            "status" => true
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'image' => 'nullable|image',
            'status' => 'nullable|boolean',
            'excerpt' => 'nullable|string',
            'locale' => 'nullable|in:tr,en',
        ]);

        $article = Article::find($id);
        if (!$article) {
            return response()->json(['status' => 'error', 'message' => 'Haber bulunamadı!'], 404);
        }

        $data = $request->all();

        if (!$request->slug) {
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
            'data' => $article,
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
