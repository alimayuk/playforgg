<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function index($type, $id)
    {
        $model = $this->resolveModel($type)::findOrFail($id);

        $comments = $model->comments()
            ->with(['user', 'replies.user'])
            ->latest()
            ->get();

        return response()->json($comments);
    }

    public function store(Request $request, $type, $id)
    {
        $request->validate([
            'text' => 'required|string|max:400',
            'parent_id' => 'nullable|exists:comments,id'
        ]);

        $model = $this->resolveModel($type)::findOrFail($id);

        $comment = $model->comments()->create([
            'author_id' => auth()->id(),
            'text' => $request->text,
            'parent_id' => $request->parent_id
        ]);

        return response()->json($comment->load('user', 'replies'));
    }

    public function update(Request $request, $type, $id, Comment $comment)
    {
        $request->validate([
            'text' => 'required|string|max:400'
        ]);

        if ($comment->author_id !== auth()->id()) {
            return response()->json(['error' => 'Bu yorumu düzenleme yetkiniz yok.'], 403);
        }

        $comment->update(['text' => $request->text]);

        return response()->json($comment->load('user', 'replies'));
    }

    public function destroy($type, $id, Comment $comment)
    {
        if ($comment->author_id !== auth()->id()) {
            return response()->json(['error' => 'Bu yorumu silme yetkiniz yok.'], 403);
        }

        $comment->delete();

        return response()->json(['message' => 'Yorum silindi.']);
    }

    private function resolveModel($type)
    {
        return match ($type) {
            'blogs' => \App\Models\Blog::class,
            'forum-topics' => \App\Models\ForumTopic::class,
            default => abort(404, 'Model bulunamadı')
        };
    }
}
