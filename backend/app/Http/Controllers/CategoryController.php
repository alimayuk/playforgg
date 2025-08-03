<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Traits\StatusAndFeaturedTrait;
use App\Models\Category;
use App\Services\ImageService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    public function index(Request $request)
    {
        $locale = $request->get('locale', 'tr');
        $perPage = (int) $request->get('per_page', 5); // Varsayılan 5

        $query = Category::query();

        if ($locale !== 'hepsi') {
            $query->where('locale', $locale);
        }

        $query->select([
            'id',
            'parent_id',
            'title',
            'slug',
            'status',
            'image',
            'icon',
            'featured',
            'locale',
            'created_at', // Sıralama için gerekli
        ])->orderBy('created_at', 'desc'); // Yeniden eskiye doğru sıralama

        $categories = $query->paginate($perPage);

        return response()->json([
            'data' => $categories->items(),
            'status' => true,
            'meta' => [
                'current_page' => $categories->currentPage(),
                'last_page' => $categories->lastPage(),
                'per_page' => $categories->perPage(),
                'total' => $categories->total(),
            ]
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'parent_id' => 'nullable|exists:categories,id',
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:300|unique:categories,slug',
            'image' => 'nullable|image|max:2048',
            'icon' => 'nullable|image|max:2048',
            'status' => 'boolean',
            'featured' => 'boolean',
            'locale' => 'nullable|in:tr,en',
        ]);

        $data = $request->all();

        $data['locale'] = $request->input('locale', 'tr');

        if (!$request->slug) {
            $data['slug'] = Str::slug($request->title);
            if (Category::where('slug', $data['slug'])->exists()) {
                $data['slug'] .= '-' . Str::random(5);
            }
        }

        if ($request->hasFile('image')) {
            $data['image'] = ImageService::uploadImage($request->file('image'), 'categories');
            $data['image'] = 'storage/' . $data['image'];
        }

        if ($request->hasFile('icon')) {
            $data['icon'] = ImageService::uploadImage($request->file('icon'), 'categories/icons');
            $data['icon'] = 'storage/' . $data['icon'];
        }

        $category = Category::create($data);

        return response()->json([
            "message" => "Kategori başarıyla oluşturuldu.",
            "data" => $category,
            "status" => true
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:300|unique:categories,slug,' . $id,
            'image' => 'nullable|image|max:2048',
            'icon' => 'nullable|image|max:2048',
            'status' => 'nullable|boolean',
            'featured' => 'nullable|boolean',
            'locale' => 'nullable|in:tr,en',
        ]);

        $category = Category::find($id);
        if (!$category) {
            return response()->json(['status' => 'error', 'message' => 'Kategori bulunamadı!'], 404);
        }

        $data = $request->all();

        if (!$request->slug) {
            $data['slug'] = Str::slug($request->title);
        }

        if ($request->boolean('remove_image')) {
            ImageService::deleteImage($category->image);
            $data['image'] = null;
        } elseif ($request->hasFile('image')) {
            ImageService::deleteImage($category->image);
            $data['image'] = ImageService::uploadImage($request->file('image'), 'categories');
            $data['image'] = 'storage/' . $data['image'];
        }

        if ($request->boolean('remove_icon')) {
            ImageService::deleteImage($category->icon);
            $data['icon'] = null;
        } elseif ($request->hasFile('icon')) {
            ImageService::deleteImage($category->icon);
            $data['icon'] = ImageService::uploadImage($request->file('icon'), 'categories/icons');
            $data['icon'] = 'storage/' . $data['icon'];
        }

        $category->update($data);

        return response()->json([
            'message' => 'Kayıt başarıyla güncellendi.',
            'data' => $category,
            'status' => true
        ], 200);
    }

    public function destroy($id)
    {
        $category = Category::find($id);

        if (!$category) {
            return response()->json(['status' => 'error', 'message' => 'Kategori bulunamadı!'], 404);
        }

        ImageService::deleteImage($category->icon);
        ImageService::deleteImage($category->image);
        $category->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Kategori silindi.'
        ], 200);
    }
}
