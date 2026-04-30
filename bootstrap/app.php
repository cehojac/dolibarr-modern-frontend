<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // Excluir rutas API del CSRF usando el método nativo de Laravel 11
        // (validateCsrfTokens actúa sobre ValidateCsrfToken, la clase real en L11)
        $middleware->validateCsrfTokens(except: [
            'api/*',
        ]);

        // Registrar middleware personalizado para forzar respuestas JSON en rutas API
        $middleware->alias([
            'force.json' => \App\Http\Middleware\ForceJsonResponse::class,
            'api.custom' => \App\Http\Middleware\ApiMiddleware::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
