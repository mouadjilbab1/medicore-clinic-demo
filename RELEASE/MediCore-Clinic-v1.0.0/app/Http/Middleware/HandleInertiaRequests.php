<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use App\Models\Clinic;
use App\Models\Branch;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        $locale = session('locale', $user->locale ?? config('app.locale', 'ar'));

        $isInstalled = file_exists(storage_path('installed'));
        $clinic = null;
        $branches = [];
        $currentBranch = null;

        if ($isInstalled && \Illuminate\Support\Facades\Schema::hasTable('clinics')) {
            $clinic = Clinic::first();
            if ($user) {
                $branches = Branch::where('is_active', true)->get();
                $currentBranch = $user->branch_id ? Branch::find($user->branch_id) : $branches->first();
            }
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'role' => $user->role,
                    'locale' => $user->locale,
                    'branch_id' => $user->branch_id,
                    'is_active' => $user->is_active,
                ] : null,
                'role' => $user?->role,
                'permissions' => $user ? ($user->permissions ?? []) : [],
                'current_branch' => $currentBranch,
                'branches' => $branches,
            ],
            'clinic' => $clinic,
            'locale' => $locale,
            'is_installed' => $isInstalled,
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
                'warning' => session('warning'),
            ],
        ];
    }
}
