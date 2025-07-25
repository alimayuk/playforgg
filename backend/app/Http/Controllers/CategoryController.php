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

        $categories = Category::where('locale', $locale)->get();

        return response()->json([
            "data" => $categories,
            "status" => true
        ], 200);
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
        $locale = $request->get('locale', 'tr');

        $category = Category::where('id', $id)->where('locale', $locale)->first();

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
