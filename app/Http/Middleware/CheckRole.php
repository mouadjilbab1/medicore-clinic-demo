<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  string|array  ...$roles
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        $user = $request->user();

        if (!$user) {
            return redirect()->route('login');
        }

        if (in_array($user->role, ['admin', 'director']) || in_array($user->role, $roles)) {
            return $next($request);
        }

        abort(403, 'Unauthorized medical action: Insufficient clinical or administrative role.');
    }
}
