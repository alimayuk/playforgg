<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'username' => 'required|string',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:6'
        ]);

        $user = User::create([
            'username' => $validated['username'],
            'email' => $validated['email'],
            'password' => bcrypt($validated['password']),
        ]);

        // $user->assignRole('user'); // Varsayılan rol

        return response()->json(['message' => 'Kayıt başarılı']);
    }


    public function login(Request $request)
    {
        $credentials = $request->only('username', 'password');

        if (!$token = JWTAuth::attempt($credentials)) {
            return response()->json(['status' => 'error', 'message' => 'Geçersiz bilgiler'], 401);
        }

        return response()->json([
            'status' => 'success',
            'user' => [
                'id' => auth()->user()->id,
                'username' => auth()->user()->username,
                'email' => auth()->user()->email,
                'roles' => auth()->user()->roles, // Kullanıcının rolleri
                'created_at' => auth()->user()->created_at,
                'updated_at' => auth()->user()->updated_at,
            ]
        ])->cookie(
            'token',
            $token,
            60 * 24 * 7,
            '/',    // path
            null,   // domain
            true,   // secure (HTTPS zorunlu)
            true    // httpOnly
        );
    }

    public function me()
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            return response()->json(['status' => 'success', 'user' => $user]);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Unauthorized'], 401);
        }
    }


    public function logout()
    {
        auth()->logout();
        return response()->json(['message' => 'Çıkış yapıldı']);
    }
}
