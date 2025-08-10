<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function index(Blog $blog)
    {
        $comments = $blog->comments()
            ->with(['user', 'replies.user'])
            ->latest()
            ->get();

        return response()->json($comments);
    }

    public function store(Request $request, Blog $blog)
    {
        $request->validate([
            'text' => 'required|string|max:400',
            'parent_id' => 'nullable|exists:comments,id'
        ]);

        $comment = $blog->comments()->create([
            'author_id' => auth()->id(),
            'text' => $request->text,
            'parent_id' => $request->parent_id
        ]);

        return response()->json($comment->load('user', 'replies'));
    }
}
