<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use App\Models\User;
use App\Models\AuditLog;

class AuthController extends Controller
{
    public function showLogin(): Response
    {
        return Inertia::render('Auth/Login');
    }

    public function login(Request $request): RedirectResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (Auth::attempt($credentials, $request->boolean('remember'))) {
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
