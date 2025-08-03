<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use App\Services\ImageService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class BlogController extends Controller
{
    public function index(Request $request)
    {
        $locale = $request->get('locale', 'tr');
        $perPage = (int) $request->get('per_page', 5);
        $query = Blog::query();

        if ($locale !== 'hepsi') {
            $query->where('locale', $locale);
        }
        $query->select([
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
        ])->orderBy('created_at', 'desc');

        $blogs = $query->paginate($perPage);

        return response()->json([
            'data' => $blogs->items(),
            'status' => true,
            'meta' => [
                'current_page' => $blogs->currentPage(),
                'last_page' => $blogs->lastPage(),
                'per_page' => $blogs->perPage(),
                'total' => $blogs->total(),
            ]
        ]);
    }
    public function show($id)
    {
        $blog = Blog::find($id);
        if (!$blog) {
            return response()->json(['status' => 'error', 'message' => 'Blog bulunamadı!'], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $blog
        ]);
    }
    public function store(Request $request)
    {
        try {
            $request->validate([
                'title' => 'required|string|max:255',
                'category_id' => 'required|exists:categories,id',
                'content' => 'required|string',
                'image' => 'nullable|image|max:2048',
                'status' => 'boolean',
                'views' => 'integer',
                'locale' => 'string|max:2',
                'excerpt' => 'nullable|string|max:500',
            ]);
            $data = $request->all();
            $data['locale'] = $request->input('locale', 'tr');

            if (!$request->slug) {
                $data['slug'] = Str::slug($request->title);
                if (Blog::where('slug', $data['slug'])->exists()) {
                    $data['slug'] .= '-' . Str::random(5);
                }
            }
            if ($request->hasFile('image')) {
                $data['image'] = ImageService::uploadImage($request->file('image'), 'blogs');
                $data['image'] = 'storage/' . $data['image'];
            }

            $content = $request->input('content');

            preg_match_all('/storage\/temp\/([a-zA-Z0-9\-_]+\.(jpg|png|jpeg|webp|gif))/', $content, $matches);

            foreach ($matches[1] as $filename) {
                $tempPath = 'temp/' . $filename;
                $finalPath = 'uploads/' . $filename;

                if (Storage::disk('public')->exists($tempPath)) {
                    Storage::disk('public')->move($tempPath, $finalPath);
                    $content = str_replace('storage/temp/' . $filename, 'storage/uploads/' . $filename, $content);
                }
            }

            Blog::create([
                'author_id' => $request->user()->id,
                'category_id' => $request->category_id,
                'title' => $request->title,
                'slug' => $data['slug'],
                'image' => $data['image'] ?? null,
                'content' => $content,
                'status' => $request->status ?? false,
                'views' => $request->views ?? 0,
                'locale' => $data['locale'] ?? 'tr',
                'excerpt' => $request->excerpt ?? '',
            ]);


            return response()->json(['message' => 'Blog created', 'status' => 'success'], 201);
        } catch (\Throwable $e) {
            Log::error('Blog kaydedilirken hata: ' . $e->getMessage());
            return response()->json(['message' => 'Sunucu hatası', 'error' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $request->validate([
                'title' => 'required|string|max:255',
                'category_id' => 'required|exists:categories,id',
                'content' => 'required|string',
                'image' => 'nullable|image|max:2048',
                'status' => 'boolean',
                'locale' => 'string|max:2',
                'excerpt' => 'nullable|string|max:500',
            ]);

            $blog = Blog::find($id);
            if (!$blog) {
                return response()->json(['status' => 'error', 'message' => 'Blog bulunamadı!'], 404);
            }

            $data = $request->all();
            $data['locale'] = $request->input('locale', 'tr');

            if (!$request->slug) {
                $data['slug'] = Str::slug($request->title);
                if (Blog::where('slug', $data['slug'])->where('id', '!=', $id)->exists()) {
                    $data['slug'] .= '-' . Str::random(5);
                }
            }

            if ($request->boolean('remove_image')) {
                ImageService::deleteImage($blog->image);
                $data['image'] = null;
            } elseif ($request->hasFile('image')) {
                ImageService::deleteImage($blog->image);
                $data['image'] = ImageService::uploadImage($request->file('image'), 'blogs');
                $data['image'] = 'storage/' . $data['image'];
            } else {
                $data['image'] = $blog->image;
            }

            $newContent = $request->input('content');
            $oldContent = $blog->content;


            preg_match_all('/storage\/temp\/([a-zA-Z0-9\-_]+\.(jpg|png|jpeg|webp|gif))/', $newContent, $matches);

            foreach ($matches[1] as $filename) {
                $tempPath = 'temp/' . $filename;
                $finalPath = 'uploads/' . $filename;

                if (Storage::disk('public')->exists($tempPath)) {
                    Storage::disk('public')->move($tempPath, $finalPath);
                    $newContent = str_replace('storage/temp/' . $filename, 'storage/uploads/' . $filename, $newContent);
                }
            }

            $newUsed = $this->extractUsedImages($newContent);
            $oldUsed = $this->extractUsedImages($oldContent);

            $removed = array_diff($oldUsed, $newUsed);

            foreach ($removed as $filename) {
                $path = 'uploads/' . $filename;
                if (Storage::disk('public')->exists($path)) {
                    Storage::disk('public')->delete($path);
                }
            }

            $blog->update([
                'title' => $request->title,
                'slug' => $data['slug'],
                'category_id' => $request->category_id,
                'image' => $data['image'],
                'content' => $newContent,
                'status' => $request->status ?? false,
                'views' => $request->views ?? 0,
                'locale' => $data['locale'],
                'excerpt' => $request->excerpt ?? '',
            ]);

            return response()->json(['message' => 'Blog güncellendi', 'status' => "success"], 200);
        } catch (\Throwable $e) {
            Log::error('Blog güncellenirken hata: ' . $e->getMessage());
            return response()->json(['message' => 'Sunucu hatası', 'error' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $blog = Blog::find($id);
            if (!$blog) {
                return response()->json(['status' => 'error', 'message' => 'Blog bulunamadı!'], 404);
            }

            $usedImages = $this->extractUsedImages($blog->content);


            foreach ($usedImages as $filename) {
                $path = 'uploads/' . $filename;
                if (Storage::disk('public')->exists($path)) {
                    Storage::disk('public')->delete($path);
                }
            }


            if ($blog->image) {
                ImageService::deleteImage($blog->image);
            }

            $blog->delete();

            return response()->json(['message' => 'Blog silindi', 'status' => true]);
        } catch (\Throwable $e) {
            Log::error('Blog silinirken hata: ' . $e->getMessage());
            return response()->json(['message' => 'Sunucu hatası', 'error' => $e->getMessage()], 500);
        }
    }

    public function uploadTemp(Request $request)
    {
        if (!$request->hasFile('file')) {
            return response()->json(['error' => 'No file uploaded'], 400);
        }

        $file = $request->file('file');
        $path = $file->store('temp', 'public');

        return response()->json([
            'url' => asset('storage/' . $path),
            'temp_path' => $path,
        ]);
    }

    private function extractUsedImages($content)
    {
        preg_match_all('/(?:http[s]?:\/\/[^)\s"]+)?storage\/uploads\/([a-zA-Z0-9\-_]+\.(jpg|jpeg|png|webp|gif))(?:\?[^\s)]*)?/', $content, $matches);

        return $matches[1] ?? [];
    }
}
