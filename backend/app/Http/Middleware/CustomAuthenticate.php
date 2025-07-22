<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Http\Request;

class CustomAuthenticate extends Middleware
{
    protected function redirectTo($request)
    {
        // Eğer API isteğiyse veya JSON bekleniyorsa yönlendirme yapma
        if ($request->expectsJson() || $request->is('api/*')) {
            return null;
        }

        return route('login');
    }
}
