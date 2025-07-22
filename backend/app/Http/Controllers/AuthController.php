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
            'name' => 'required|string',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:6'
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => bcrypt($validated['password']),
        ]);

        $user->assignRole('user'); // Varsayılan rol

        return response()->json(['message' => 'Kayıt başarılı']);
    }


    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (!$token = JWTAuth::attempt($credentials)) {
            return response()->json(['status' => 'error', 'message' => 'Geçersiz bilgiler'], 401);
        }

        return response()->json([
            'token' => $token,
            'user' => auth()->user()
        ]);
    }

    public function me()
    {
        if (!auth()->user()) {
            return response()->json(['status' => 'error', 'message' => 'Kullanıcı oturumu açık değil'], 401);
        }
        return response()->json(auth()->user());
    }

    public function logout()
    {
        auth()->logout();
        return response()->json(['message' => 'Çıkış yapıldı']);
    }
}
