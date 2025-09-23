<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DoliProxyController;

// SPA entry
Route::view('/', 'app')->name('home');

// API routes with session (web middleware)
Route::prefix('api')->group(function () {
    Route::match(['GET', 'POST'], '/auth/login', [AuthController::class, 'login']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/check-permission', [AuthController::class, 'checkPermission']);
    Route::get('/auth/permissions', [AuthController::class, 'getPermissions']);
    Route::get('/auth/debug-permissions', [AuthController::class, 'debugPermissions']);

    // Cache management routes
    Route::prefix('cache')->group(function () {
        Route::get('/stats', [App\Http\Controllers\CacheController::class, 'stats']);
        Route::post('/clear/{module}', [App\Http\Controllers\CacheController::class, 'clearModule']);
        Route::post('/flush', [App\Http\Controllers\CacheController::class, 'flush']);
        Route::post('/check', [App\Http\Controllers\CacheController::class, 'check']);
    });

    Route::any('/doli/{path}', [DoliProxyController::class, 'handle'])
        ->where('path', '.*');
});

// SPA fallback: any non-API route goes to the SPA
Route::fallback(function () {
    return view('app');
});
