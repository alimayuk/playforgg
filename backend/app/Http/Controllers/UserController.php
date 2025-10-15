<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function getUserProfile(Request $request, $username)
    {
        $user = User::where('username', $username)->firstOrFail();
        // Son 5 blog yorumu
        $user->blog_comments = $user->comments()
            ->where('commentable_type', 'App\Models\Blog')
            ->latest()
            ->take(5)
            ->with('commentable')
            ->get();

        // Son 5 forum topic yorumu
        $user->forum_comments = $user->comments()
            ->where('commentable_type', 'App\Models\ForumTopic')
            ->latest()
            ->take(5)
            ->with('commentable')
            ->get();

        return new UserResource($user);
    }
}
