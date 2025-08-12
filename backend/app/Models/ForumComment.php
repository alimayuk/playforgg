<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ForumComment extends Model
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

    public function replies()
    {
        return $this->hasMany(ForumComment::class, 'parent_id');
    }

    public function deleteWithReplies()
    {
        foreach ($this->replies as $reply) {
            $reply->deleteWithReplies();
        }
        $this->delete();
    }
}
