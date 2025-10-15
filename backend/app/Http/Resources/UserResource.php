<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'        => $this->id,
            'username'  => $this->username,
            'email'     => $this->email,
            'blog_comments'  => CommentResource::collection($this->blog_comments),
            'forum_comments' => CommentResource::collection($this->forum_comments),
            'created_at' => $this->created_at->format('d-m-Y'),
        ];
    }
}
