<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:api')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // ✅ Kategori CRUD rotaları
    Route::get('/categories', [CategoryController::class, 'index']);       // ?locale=tr
    Route::post('/categories', [CategoryController::class, 'store']);      // body'de locale: 'tr'
    Route::put('/categories/{id}', [CategoryController::class, 'update']); // body'de locale (opsiyonel)
    Route::delete('/categories/{id}', [CategoryController::class, 'destroy']); // ?locale=tr
});
