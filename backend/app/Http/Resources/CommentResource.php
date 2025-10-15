<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CommentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'               => $this->id,
            'text'             => $this->text,
            'created_at'       => $this->created_at,
            'commentable_type' => class_basename($this->commentable_type),
            'commentable_id'   => $this->commentable_id,
            'commentable_slug' => $this->commentable->slug ?? null,
            'commentable_title' => $this->commentable->title ?? null,
        ];
    }
}
