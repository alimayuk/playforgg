<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

// Giriş ve kayıt — herkese açık
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/test', function() {
    return response()->json(['message' => 'API çalışıyor']);
});

// Token ile korunan (sadece giriş yapmış kullanıcılar erişebilir)
Route::middleware('auth:api')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);         // Kullanıcı bilgisi
    Route::post('/logout', [AuthController::class, 'logout']); // Tokeni geçersiz yap
});
