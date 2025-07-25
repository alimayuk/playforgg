<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $guarded = ['id', 'created_at', 'updated_at'];

    protected $casts = [
        'status' => 'boolean',
        'featured' => 'boolean',
        'views' => 'integer',
    ];

    // Ana kategori (eğer bu kategori bir alt kategoriyse)
    public function parent()
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }

    // Alt kategoriler
    public function children()
    {
        return $this->hasMany(Category::class, 'parent_id');
    }

    // Örnek: blog, ürün, oyun gibi kategoriye ait içerik ilişkisi
    // public function blogs()
    // {
    //     return $this->hasMany(Blog::class);
    // }
}
