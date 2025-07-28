<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ToggleController extends Controller
{
    // Beyaz liste: toggle yapılabilecek modeller ve alanlar
    protected $allowedModels = [
        'category' => \App\Models\Category::class,
        // 'blog' => \App\Models\Blog::class,
        // Diğer modelleri ekle...
    ];

    protected $allowedFields = [
        'status',
        'featured',
        // İstersen başka boolean alanlar ekle
    ];

    public function toggleField(Request $request, $model, $id)
    {
        $model = strtolower($model);

        // Model beyaz liste kontrolü
        if (!array_key_exists($model, $this->allowedModels)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Geçersiz model.'
            ], 400);
        }

        // Hangi alan toggle yapılacak? query parametre veya body'den alabilirsin
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

        // Alanın toggle edilmesi (boolean varsayımı)
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
