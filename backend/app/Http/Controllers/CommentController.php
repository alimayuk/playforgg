<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use App\Models\Comment;
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

     // Yorum veya cevabı güncelleme
    public function update(Request $request, Blog $blog, Comment $comment)
    {
        $request->validate([
            'text' => 'required|string|max:400'
        ]);

        // Sadece yorum sahibinin düzenlemesine izin ver
        if ($comment->author_id !== auth()->id()) {
            return response()->json(['error' => 'Bu yorumu düzenleme yetkiniz yok.'], 403);
        }

        $comment->update([
            'text' => $request->text
        ]);

        return response()->json($comment->load('user', 'replies'));
    }

    // Yorum veya cevabı silme
    public function destroy(Blog $blog, Comment $comment)
    {
        // Sadece yorum sahibinin silmesine izin ver
        if ($comment->author_id !== auth()->id()) {
            return response()->json(['error' => 'Bu yorumu silme yetkiniz yok.'], 403);
        }

        $comment->delete();

        return response()->json(['message' => 'Yorum silindi.']);
    }
}
