<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ArticleResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'        => $this->id,
            'title'     => $this->title,
            'slug'      => $this->slug,
            'excerpt'   => $this->excerpt,
            'status'    => $this->status,
            'image'     => $this->image,
            'locale'    => $this->locale,
            'created_at' => $this->created_at->format('d-m-Y'),
        ];
    }
}
