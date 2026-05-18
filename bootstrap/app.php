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
        // CSRF exclusions for API routes (Laravel 12 idiomatic API).
        // The class was renamed from VerifyCsrfToken to ValidateCsrfToken in L12,
        // so the previous `replace:` no longer matched and exclusions silently failed.
        $middleware->validateCsrfTokens(except: [
            'api/*',
        ]);

        // Custom middleware aliases
        $middleware->alias([
            'force.json' => \App\Http\Middleware\ForceJsonResponse::class,
            'api.custom' => \App\Http\Middleware\ApiMiddleware::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
