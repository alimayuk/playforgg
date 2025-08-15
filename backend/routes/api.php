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

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::prefix('/client')->group(function () {
    Route::get('/home', [ClientController::class, 'homePageData']);

    Route::get('/blogs', [ClientController::class, 'blogs']);
    Route::get('/blogs/{slug}', [ClientController::class, 'blogDetail']);

    Route::get('/articles', [ClientController::class, 'articles']);
    Route::get('/articles/{slug}', [ClientController::class, 'articleDetail']);

    Route::get('/blogs/{blog}/comments', [ClientController::class, 'commentsIndex']);

    Route::get('/forums', [ClientController::class, 'forumsIndex']);
    Route::get('/forums/{topic}', [ClientController::class, 'forumsDetail']);

    Route::get('/games', [ClientController::class, 'gamesIndex']);
    Route::get('/games/{slug}', [ClientController::class, 'gamesDetail']);
});

Route::middleware(['auth:api', 'global.throttle:60,1'])->group(function () {
    Route::put('/toggle-field/{model}/{id}', [ToggleController::class, 'toggleField']);
    Route::post('/upload-temp', [BlogController::class, 'uploadTemp']);

    Route::post('/blogs/{blog}/comments', [CommentController::class, 'store']);
    Route::put('/blogs/{blog}/comments/{comment}', [CommentController::class, 'update']);
    Route::delete('/blogs/{blog}/comments/{comment}', [CommentController::class, 'destroy']);

    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/categories', [CategoryController::class, 'index']);
    Route::post('/categories', [CategoryController::class, 'store']);
    Route::put('/categories/{id}', [CategoryController::class, 'update']);
    Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);

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

    Route::get('/forums', [ForumController::class, 'index']);
    Route::post('/forums', [ForumController::class, 'store']);
    Route::get('/forums/{topic}', [ForumController::class, 'show']);
    Route::put('/forums/{topic}', [ForumController::class, 'update']);
    Route::delete('/forums/{id}', [ForumController::class, 'destroy']);

    Route::post('/forums/{topic}/comments', [ForumController::class, 'storeComment']);
    Route::delete('/comments/{id}', [ForumController::class, 'destroyComment']);
    Route::put('/comments/{id}', [ForumController::class, 'updateComment']);
});
