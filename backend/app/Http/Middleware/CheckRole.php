<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        $user = auth()->user();

        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 401);
        }

        // Kullanıcının rollerini al (array olarak)
        $userRoles = is_array($user->roles) ? $user->roles : [$user->roles];

        // İstenen rollerden herhangi birine sahip mi?
        $hasRole = false;
        foreach ($roles as $role) {
            if (in_array($role, $userRoles)) {
                $hasRole = true;
                break;
            }
        }

        if (!$hasRole) {
            return response()->json([
                'status' => 'error',
                'message' => 'Bu işlem için yetkiniz yok'
            ], 403);
        }

        return $next($request);
    }
}
