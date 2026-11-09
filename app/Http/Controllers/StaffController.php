<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use App\Models\User;
use App\Models\Doctor;
use App\Models\Department;
use App\Models\Branch;
use Illuminate\Support\Facades\Hash;

class StaffController extends Controller
{
    public function index(): Response
    {
        $staff = User::with(['branch', 'doctor.schedules'])
            ->where('role', '!=', 'patient')
            ->orderBy('name')
            ->get();

        $departments = Department::all();
        $branches = Branch::where('is_active', true)->get();

        return Inertia::render('Staff/Index', [
            'staff' => $staff,
            'departments' => $departments,
            'branches' => $branches,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:users,email'],
            'phone' => ['required', 'string', 'max:50'],
            'password' => ['required', 'min:8'],
            'role' => ['required', 'in:admin,director,manager,doctor,dentist,nurse,receptionist,accountant,pharmacist,lab_tech,imaging_tech,inventory_mgr'],
            'branch_id' => ['nullable', 'exists:branches,id'],
            'specialty' => ['nullable', 'string', 'max:100'],
            'license_number' => ['nullable', 'string', 'max:100'],
            'consultation_fee' => ['nullable', 'numeric', 'min:0'],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
            'branch_id' => $validated['branch_id'] ?? null,
            'locale' => 'ar',
            'is_active' => true,
        ]);

        if (in_array($validated['role'], ['doctor', 'dentist'])) {
            Doctor::create([
                'user_id' => $user->id,
                'specialty' => $validated['specialty'] ?? ($validated['role'] === 'dentist' ? 'dental' : 'general'),
                'license_number' => $validated['license_number'] ?? 'LIC-' . rand(1000, 9999),
                'consultation_fee' => $validated['consultation_fee'] ?? 250.00,
                'followup_fee' => 120.00,
                'slot_duration_minutes' => 30,
                'commission_rate' => 0.00,
                'is_available' => true,
            ]);
        }

        return back()->with('success', "Staff member '{$user->name}' enrolled successfully.");
    }
}
