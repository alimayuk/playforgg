<?php

use App\Http\Controllers\ArticleController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\ClientController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\GameController;
use App\Http\Controllers\ToggleController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/client/blogs', [ClientController::class, 'blogs']);
Route::get('/client/blogs/{slug}', [ClientController::class, 'blogDetail']);
Route::get('/client/articles', [ClientController::class, 'articles']);
Route::get('/client/articles/{slug}', [ClientController::class, 'articleDetail']);
Route::get('/client/blogs/{blog}/comments', [CommentController::class, 'index']);

Route::middleware('auth:api')->group(function () {

    Route::put('/toggle-field/{model}/{id}', [ToggleController::class, 'toggleField']);
    Route::post('/upload-temp', [BlogController::class, 'uploadTemp']);
    
    Route::post('/blogs/{blog}/comments', [CommentController::class, 'store']);
    Route::put('/blogs/{blog}/comments/{comment}', [CommentController::class, 'update']);
    Route::delete('/blogs/{blog}/comments/{comment}', [CommentController::class, 'destroy']);

    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/categories', [CategoryController::class, 'index']);       // ?locale=tr
    Route::post('/categories', [CategoryController::class, 'store']);      // body'de locale: 'tr'
    Route::put('/categories/{id}', [CategoryController::class, 'update']); // body'de locale (opsiyonel)
    Route::delete('/categories/{id}', [CategoryController::class, 'destroy']); // ?locale=tr

    Route::get('/blogs', [BlogController::class, 'index']);
    Route::get('/blogs/{id}', [BlogController::class, 'show']);
    Route::post('/blogs', [BlogController::class, 'store']);
    Route::post('/blogs/{id}', [BlogController::class, 'update']);
    Route::delete('/blogs/{id}', [BlogController::class, 'destroy']);

    Route::get('/games', [GameController::class, 'index']);
    Route::get('/games/{id}', [GameController::class, 'show']);
    Route::post('/games', [GameController::class, 'store']);
    Route::post('/games/{id}', [GameController::class, 'update']);
    Route::delete('/games/{id}', [GameController::class, 'destroy']);

    Route::get('/articles', [ArticleController::class, 'index']);
    Route::get('/articles/{id}', [ArticleController::class, 'show']);
    Route::post('/articles', [ArticleController::class, 'store']);
    Route::post('/articles/{id}', [ArticleController::class, 'update']);
    Route::delete('/articles/{id}', [ArticleController::class, 'destroy']);
});
