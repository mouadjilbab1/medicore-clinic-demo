<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

// Auto-initialize .env for zero-CLI buyers (cPanel / Shared hosting)
$basePath = dirname(__DIR__);
$envFile = $basePath . DIRECTORY_SEPARATOR . '.env';
if (!file_exists($envFile)) {
    $exampleFile = $basePath . DIRECTORY_SEPARATOR . '.env.production.example';
    if (!file_exists($exampleFile)) {
        $exampleFile = $basePath . DIRECTORY_SEPARATOR . '.env.example';
    }
    if (file_exists($exampleFile)) {
        $content = file_get_contents($exampleFile);
        $key = 'base64:' . base64_encode(random_bytes(32));
        $content = preg_replace('/^APP_KEY=.*$/m', 'APP_KEY=' . $key, $content);
        @file_put_contents($envFile, $content);
    }
}

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->priority([
            \App\Http\Middleware\EnsureInstalled::class,
            \Illuminate\Auth\Middleware\Authenticate::class,
            \App\Http\Middleware\CheckRole::class,
        ]);

        $middleware->web(prepend: [
            \App\Http\Middleware\EnsureInstalled::class,
        ], append: [
            \App\Http\Middleware\SetLocale::class,
            \App\Http\Middleware\HandleInertiaRequests::class,
        ]);

        $middleware->validateCsrfTokens(except: [
            'install/*',
        ]);

        $middleware->alias([
            'role' => \App\Http\Middleware\CheckRole::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
