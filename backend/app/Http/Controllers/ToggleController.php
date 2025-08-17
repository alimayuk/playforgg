<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ToggleController extends Controller
{
    protected $allowedModels = [
        'category' => \App\Models\Category::class,
        'blog' => \App\Models\Blog::class,
        'game' => \App\Models\Game::class,
        'article' => \App\Models\Article::class
    ];

    protected $allowedFields = [
        'status',
        'featured',
        // başka boolean alanlar ekle
    ];

    public function toggleField(Request $request, $model, $id)
    {
        $model = strtolower($model);

        if (!array_key_exists($model, $this->allowedModels)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Geçersiz model.'
            ], 400);
        }

        $field = $request->query('field') ?? $request->input('field');
        if (!$field || !in_array($field, $this->allowedFields)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Geçersiz alan.'
            ], 400);
        }

        $modelClass = $this->allowedModels[$model];
        $item = $modelClass::find($id);

        if (!$item) {
            return response()->json([
                'status' => 'error',
                'message' => 'Kayıt bulunamadı.'
            ], 404);
        }

        $currentValue = $item->$field;
        $item->$field = !$currentValue;
        $item->save();

        return response()->json([
            'status' => 'success',
            'message' => "$field başarıyla güncellendi.",
            'data' => $item
        ]);
    }
}
