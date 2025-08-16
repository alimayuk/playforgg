<?php

namespace App\Http\Controllers;

use App\Models\ForumTopic;
use App\Models\ForumComment;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ForumController extends Controller
{
    public function index()
    {
        return ForumTopic::with('user', 'category')->latest()->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'category_id' => 'nullable|exists:categories,id',
            'status' => 'nullable|boolean'
        ]);

        $topic = ForumTopic::create([
            'author_id' => auth()->id(),
            'category_id' => $data['category_id'] ?? null,
            'title' => $data['title'],
            'slug' => Str::slug($data['title']) . '-' . uniqid(),
            'content' => $data['content'],
            'status' => $data['status'] ?? true,
        ]);

        // Load relationships that are needed for the frontend
        $topic->load(['user:id,username', 'category:id,title']);

        return response()->json([
            'id' => $topic->id,
            'title' => $topic->title,
            'content' => $topic->content,
            'created_at' => $topic->created_at->toISOString(),
            'user' => [
                'username' => $topic->user->username
            ],
            'category' => $topic->category ? [
                'id' => $topic->category->id,
                'title' => $topic->category->title
            ] : null
        ], 201);
    }

    public function show(ForumTopic $topic)
    {
        $topic->increment('views');
        return $topic->load(['user', 'comments.user', 'comments.replies.user']);
    }

    public function update(Request $request, ForumTopic $topic)
    {
        // Sadece konunun sahibi güncelleyebilir
        if ($topic->author_id !== auth()->id()) {
            return response()->json(['error' => 'Bu konuyu düzenleme yetkiniz yok.'], 403);
        }

        $data = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'category_id' => 'nullable|exists:categories,id'
        ]);

        $topic->update([
            'title' => $data['title'],
            'slug' => Str::slug($data['title']) . '-' . uniqid(), // istersen slug güncellenebilir
            'content' => $data['content'],
            'category_id' => $data['category_id'] ?? null,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Konu güncellendi.',
            'topic' => $topic->load('user', 'comments')
        ]);
    }


    public function destroy($id)
    {
        $topic = ForumTopic::find($id);
        if (!$topic) {
            return response()->json([
                'status' => 'fail',
                'message' => 'Konu bulunamadı.'
            ], 404);
        }

        if ($topic->author_id !== auth()->id()) {
            return response()->json(['error' => 'Bu konuyu düzenleme yetkiniz yok.'], 403);
        }

        $topic->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Konu başarıyla silindi.'
        ]);
    }

    public function storeComment(Request $request, ForumTopic $topic)
    {
        $data = $request->validate([
            'message' => 'required|string|max:400',
            'parent_id' => 'nullable|exists:forum_comments,id'
        ]);

        $comment = ForumComment::create([
            'topic_id' => $topic->id,
            'author_id' => auth()->id(),
            'message' => $data['message'],
            'parent_id' => $data['parent_id'] ?? null
        ]);

        return response()->json($comment->load('user', 'replies.user'), 201);
    }

    public function destroyComment($id)
    {
        $comment = ForumComment::findOrFail($id);

        if ($comment->author_id !== auth()->id()) {
            return response()->json(['error' => 'Bu yorumu silme yetkiniz yok.'], 403);
        }

        $comment->deleteWithReplies();

        return response()->json([
            'status' => 'success',
            'message' => 'Yorum ve cevapları silindi.'
        ]);
    }

    public function updateComment(Request $request, $id)
    {
        $comment = ForumComment::findOrFail($id);

        if ($comment->author_id !== auth()->id()) {
            return response()->json(['error' => 'Bu yorumu düzenleme yetkiniz yok.'], 403);
        }

        $data = $request->validate([
            'message' => 'required|string|max:400'
        ]);

        $comment->update([
            'message' => $data['message']
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Yorum güncellendi.',
            'comment' => $comment->load('user', 'replies.user')
        ]);
    }
}
