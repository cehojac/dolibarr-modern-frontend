<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DoliProxyController;
use App\Http\Controllers\DoliImageProxyController;

// SPA entry
Route::view('/', 'app')->name('home');

// Proxy para imágenes de Dolibarr (público, sin force.json porque devuelve imagen)
Route::prefix('api')->middleware(['web'])->group(function () {
    Route::get('/doli-image', [DoliImageProxyController::class, 'getImage']);
});

// API routes - con middleware web para sesiones y force.json para respuestas JSON
Route::prefix('api')->middleware(['web', 'force.json'])->group(function () {
    Route::match(['GET', 'POST'], '/auth/login', [AuthController::class, 'login']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/check-permission', [AuthController::class, 'checkPermission']);
    Route::get('/auth/permissions', [AuthController::class, 'getPermissions']);
    Route::get('/auth/debug-session', [AuthController::class, 'debugSession']);

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
