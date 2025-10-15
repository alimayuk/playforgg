<?php

use App\Http\Controllers\ArticleController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\ClientController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\ForumController;
use App\Http\Controllers\GameController;
use App\Http\Controllers\ToggleController;
use App\Http\Controllers\UserController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::prefix('/client')->group(function () {
    Route::get('/home', [ClientController::class, 'homePageData']);
    Route::get('/blogs', [ClientController::class, 'blogs']);
    Route::get('/blogs/{slug}', [ClientController::class, 'blogDetail']);
    Route::get('/articles', [ClientController::class, 'articles']);
    Route::get('/articles/{slug}', [ClientController::class, 'articleDetail']);
    Route::get('{type}/{id}/comments', [ClientController::class, 'comments']);
    Route::get('/forums', [ClientController::class, 'forumsIndex']);
    Route::get('/forums/{slug}', [ClientController::class, 'forumsDetail']);
    Route::get('/games', [ClientController::class, 'gamesIndex']);
    Route::get('/games/{slug}', [ClientController::class, 'gamesDetail']);
});

Route::middleware(['auth:api', 'global.throttle:60,1'])->group(function () {
    Route::put('/toggle-field/{model}/{id}', [ToggleController::class, 'toggleField']);

    Route::prefix('{type}/{id}/comments')->group(function () {
        Route::get('/', [CommentController::class, 'index']);
        Route::post('/', [CommentController::class, 'store']);
        Route::put('/{comment}', [CommentController::class, 'update']);
        Route::delete('/{comment}', [CommentController::class, 'destroy']);
    });

    Route::get('/me', [AuthController::class, 'me']);
    Route::get('/profile/{username}', [UserController::class, 'getUserProfile']);
    Route::post('/logout', [AuthController::class, 'logout']);
});

Route::middleware(['auth:api', 'global.throttle:60,1', 'role:admin'])->group(function () {
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::post('/categories', [CategoryController::class, 'store']);
    Route::put('/categories/{id}', [CategoryController::class, 'update']);
    Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);

    Route::get('/blogs', [BlogController::class, 'index']);
    Route::get('/blogs/{id}', [BlogController::class, 'show']);
    Route::post('/blogs', [BlogController::class, 'store']);
    Route::post('/blogs/{id}', [BlogController::class, 'update']);
    Route::delete('/blogs/{id}', [BlogController::class, 'destroy']);
    Route::post('/upload-temp', [BlogController::class, 'uploadTemp']);

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

    Route::get('/forums', [ForumController::class, 'index']);
    Route::post('/forums', [ForumController::class, 'store']);
    Route::get('/forums/{topic}', [ForumController::class, 'show']);
    Route::put('/forums/{topic}', [ForumController::class, 'update']);
    Route::delete('/forums/{id}', [ForumController::class, 'destroy']);
});
