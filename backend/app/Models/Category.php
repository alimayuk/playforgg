<?php

namespace App\Models;

use App\Services\ImageService;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $guarded = ['id', 'created_at', 'updated_at'];

    protected $casts = [
        'status' => 'boolean',
        'featured' => 'boolean',
        'views' => 'integer',
    ];

    public function parent()
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(Category::class, 'parent_id');
    }

    public function blogs()
    {
        return $this->hasMany(Blog::class);
    }

    public function games(){
        return $this->hasMany(Game::class);
    }

    protected static function boot()
    {
        parent::boot();

        static::deleting(function ($category) {
            static::deleteModelImages($category);
            foreach ($category->children as $child) {
                $child->delete();
            }
        });
    }

    protected static function deleteModelImages($model)
    {
        foreach (['image', 'icon'] as $field) {
            if (!empty($model->$field)) {
                ImageService::deleteImage($model->$field);
            }
        }
    }
}
