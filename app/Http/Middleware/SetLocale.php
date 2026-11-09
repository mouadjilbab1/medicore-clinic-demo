<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Symfony\Component\HttpFoundation\Response;

class SetLocale
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $supportedLocales = ['ar', 'fr', 'en'];

        if ($request->has('lang') && in_array($request->query('lang'), $supportedLocales)) {
            $locale = $request->query('lang');
            session(['locale' => $locale]);
        } elseif (session()->has('locale') && in_array(session('locale'), $supportedLocales)) {
            $locale = session('locale');
        } elseif ($request->user() && in_array($request->user()->locale, $supportedLocales)) {
            $locale = $request->user()->locale;
            session(['locale' => $locale]);
        } else {
            $locale = config('app.locale', 'ar');
        }

        App::setLocale($locale);

        return $next($request);
    }
}
