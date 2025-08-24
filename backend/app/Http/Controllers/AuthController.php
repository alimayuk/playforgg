<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'username' => 'required|string|min:3|max:50|unique:users',
                'email' => 'required|email|max:100|unique:users',
                'password' => 'required|string|min:6|confirmed'
            ]);

            $user = User::create([
                'username' => $validated['username'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
            ]);

            // Varsayılan rol atama
            // $user->assignRole('user');

            return response()->json([
                'status' => 'success',
                'message' => 'Kayıt başarılı',
                'user' => [
                    'id' => $user->id,
                    'username' => $user->username,
                    'email' => $user->email
                ]
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Doğrulama hatası',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Register error: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Kayıt sırasında bir hata oluştu'
            ], 500);
        }
    }

    public function login(Request $request): JsonResponse
    {
        try {
            $credentials = $request->validate([
                'username' => 'required|string',
                'password' => 'required|string'
            ]);

            // Eposta ile de giriş yapabilmek için
            $loginType = filter_var($credentials['username'], FILTER_VALIDATE_EMAIL) ? 'email' : 'username';

            $attemptCredentials = [
                $loginType => $credentials['username'],
                'password' => $credentials['password']
            ];

            if (!$token = JWTAuth::attempt($attemptCredentials)) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Geçersiz kullanıcı adı/email veya şifre'
                ], 401);
            }

            $user = auth()->user();

            // Token süresi (7 gün)
            $tokenTTL = 60 * 24 * 7; // dakika cinsinden

            return response()->json([
                'status' => 'success',
                'message' => 'Giriş başarılı',
                'user' => [
                    'id' => $user->id,
                    'username' => $user->username,
                    'email' => $user->email,
                    'roles' => [$user->roles],
                    'created_at' => $user->created_at,
                    'updated_at' => $user->updated_at,
                ]
            ])->cookie(
                'token',
                $token,
                $tokenTTL,
                '/',
                env('SESSION_DOMAIN', 'localhost'),
                env('SESSION_SECURE_COOKIE', false),
                true, // httpOnly
                false,
                env('SESSION_SAME_SITE', 'lax')
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Doğrulama hatası',
                'errors' => $e->errors()
            ], 422);
        } catch (JWTException $e) {
            Log::error('JWT Error: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Token oluşturulamadı'
            ], 500);
        } catch (\Exception $e) {
            Log::error('Login error: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Giriş sırasında bir hata oluştu'
            ], 500);
        }
    }

    public function me(): JsonResponse
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();

            return response()->json([
                'status' => 'success',
                'user' => [
                    'id' => $user->id,
                    'username' => $user->username,
                    'email' => $user->email,
                    'roles' => [$user->roles],
                    'created_at' => $user->created_at,
                    'updated_at' => $user->updated_at,
                ]
            ]);
        } catch (\Tymon\JWTAuth\Exceptions\TokenExpiredException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Token süresi dolmuş'
            ], 401);
        } catch (\Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Geçersiz token'
            ], 401);
        } catch (\Tymon\JWTAuth\Exceptions\JWTException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Token bulunamadı'
            ], 401);
        } catch (\Exception $e) {
            Log::error('Me endpoint error: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Bir hata oluştu'
            ], 500);
        }
    }

    public function logout(): JsonResponse
    {
        try {
            JWTAuth::invalidate(JWTAuth::getToken());

            return response()->json([
                'status' => 'success',
                'message' => 'Çıkış başarılı'
            ])->cookie('token', null, -1); // Cookie'yi sil

        } catch (JWTException $e) {
            Log::error('Logout error: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Çıkış sırasında bir hata oluştu'
            ], 500);
        }
    }

    // public function refresh(): JsonResponse
    // {
    //     try {
    //         $newToken = JWTAuth::refresh(JWTAuth::getToken());

    //         return response()->json([
    //             'status' => 'success',
    //             'message' => 'Token yenilendi'
    //         ])->cookie('token', $newToken, 60 * 24 * 7); // Yeni token ile cookie'yi güncelle

    //     } catch (JWTException $e) {
    //         return response()->json([
    //             'status' => 'error',
    //             'message' => 'Token yenilenemedi'
    //         ], 401);
    //     }
    // }
}
