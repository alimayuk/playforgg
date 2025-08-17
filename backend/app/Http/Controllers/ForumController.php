<?php

namespace App\Http\Controllers;

use App\Models\ForumTopic;
use App\Models\ForumComment;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ForumController extends Controller
{
    public function index(Request $request)
    {
        $perPage = (int) $request->get('per_page', 5);
        $query = ForumTopic::query();
        $query->select([
            'id',
            'author_id',
            'category_id',
            'title',
            'slug',
            'content',
            'status',
            'created_at',
        ])->orderBy('created_at', 'desc');
        $forums = $query->paginate($perPage);
        return response()->json([
            'data' => $forums->items(),
            'status' => 'success',
            'meta' => [
                'current_page' => $forums->currentPage(),
                'last_page' => $forums->lastPage(),
                'per_page' => $forums->perPage(),
                'total' => $forums->total(),
            ]
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'category_id' => 'nullable|exists:categories,id',
            'status' => 'nullable|boolean'
        ]);
        if (ForumTopic::recentPerUser(auth()->id())->count() >= 3) {
            return response()->json(['error' => '1 saatte maksimum 3 gönderi yapabilirsiniz'], 429);
        }
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
}
