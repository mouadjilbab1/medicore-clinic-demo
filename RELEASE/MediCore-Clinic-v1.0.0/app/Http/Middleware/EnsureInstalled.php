<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureInstalled
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $isInstalled = file_exists(storage_path('installed'));
        $isInstallRoute = $request->is('install*') || $request->is('install');

        if (!$isInstalled && !$isInstallRoute) {
            return redirect()->route('install.index');
        }

        if ($isInstalled && $isInstallRoute) {
            return redirect()->route('login');
        }

        return $next($request);
    }
}
