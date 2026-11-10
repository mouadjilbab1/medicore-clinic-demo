<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use App\Models\User;
use App\Models\AuditLog;

class AuthController extends Controller
{
    /**
     * Get the rate limiting throttle key for the request.
     */
    protected function throttleKey(Request $request): string
    {
        return Str::transliterate(Str::lower($request->input('email')) . '|' . $request->ip());
    }

    public function showLogin(): Response
    {
        return Inertia::render('Auth/Login');
    }

    public function login(Request $request): RedirectResponse
    {
        $throttleKey = $this->throttleKey($request);

        if (RateLimiter::tooManyAttempts($throttleKey, 5)) {
            $seconds = RateLimiter::availableIn($throttleKey);
            $targetUser = User::where('email', $request->input('email'))->first();

            AuditLog::create([
                'user_id' => $targetUser?->id,
                'action' => 'login_lockout',
                'auditable_type' => User::class,
                'auditable_id' => $targetUser?->id ?? 0,
                'new_values' => ['email' => $request->input('email'), 'lockout_seconds' => $seconds],
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);

            return back()->withErrors([
                'email' => __('auth.throttle', [
                    'seconds' => $seconds,
                    'minutes' => ceil($seconds / 60),
                ]) ?: "Too many login attempts. Please try again in {$seconds} seconds.",
            ])->onlyInput('email');
        }

        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (Auth::attempt($credentials, $request->boolean('remember'))) {
            RateLimiter::clear($throttleKey);
            $request->session()->regenerate();

            $user = Auth::user();
            $user->update(['last_login_at' => now()]);

            // Set user preferred locale if available
            if ($user->locale) {
                session(['locale' => $user->locale]);
            }

            // Audit log
            AuditLog::create([
                'user_id' => $user->id,
                'action' => 'login',
                'auditable_type' => User::class,
                'auditable_id' => $user->id,
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);

            return redirect()->intended(route('dashboard'));
        }

        RateLimiter::hit($throttleKey, 60);

        return back()->withErrors([
            'email' => __('auth.failed') ?: 'The provided credentials do not match our medical staff records.',
        ])->onlyInput('email');
    }

    public function logout(Request $request): RedirectResponse
    {
        $user = Auth::user();
        if ($user) {
            AuditLog::create([
                'user_id' => $user->id,
                'action' => 'logout',
                'auditable_type' => User::class,
                'auditable_id' => $user->id,
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);
        }

        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login');
    }

    public function setLocale(Request $request): RedirectResponse
    {
        $request->validate([
            'locale' => ['required', 'in:ar,fr,en'],
        ]);

        $locale = $request->input('locale');
        session(['locale' => $locale]);

        if (Auth::check()) {
            Auth::user()->update(['locale' => $locale]);
        }

        return back();
    }

    public function switchBranch(Request $request): RedirectResponse
    {
        $request->validate([
            'branch_id' => ['required', 'exists:branches,id'],
        ]);

        if (Auth::check() && Auth::user()->isAdmin()) {
            Auth::user()->update(['branch_id' => $request->input('branch_id')]);
        }

        return back()->with('success', 'Active clinic branch switched successfully.');
    }
}
