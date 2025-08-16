<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ForumTopic extends Model
{
    use HasFactory;

    protected $guarded = [
        'id',
        'created_at',
        'updated_at'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }


    public function comments()
    {
        return $this->hasMany(ForumComment::class, 'topic_id')->whereNull('parent_id');
    }

    public function scopeRecentPerUser($query, $userId, $limit = 3)
    {
        return $query->where('author_id', $userId)
            ->orderBy('created_at', 'desc')
            ->limit($limit);
    }
}
