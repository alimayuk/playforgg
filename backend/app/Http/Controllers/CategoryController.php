<?php

namespace App\Http\Controllers;

use App\Models\Category;
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
            'icon' => 'nullable|string|max:255',
            'status' => 'boolean',
            'featured' => 'boolean',
            'locale' => 'nullable|in:tr,en',
        ]);

        $data = $request->all();

        // Varsayılan olarak 'tr'
        $data['locale'] = $request->input('locale', 'tr');

        if (!$request->slug) {
            $data['slug'] = Str::slug($request->title);
            if (Category::where('slug', $data['slug'])->exists()) {
                $data['slug'] .= '-' . Str::random(5); // Benzersiz hale getirmek için rastgele bir ek ekle
            }
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
            'icon' => 'nullable|string|max:255',
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

        $category->update($data);

        return response()->json([
            'message' => 'Kayıt başarıyla güncellendi.',
            'data' => $category,
            'status' => true
        ], 200);
    }

    public function destroy(Request $request, $id)
    {
        $category = Category::find($id);

        if (!$category) {
            return response()->json(['status' => 'error', 'message' => 'Kategori bulunamadı!'], 404);
        }

        $category->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Kategori silindi.'
        ], 200);
    }
}
