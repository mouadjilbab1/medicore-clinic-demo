<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use App\Models\Clinic;
use App\Models\Branch;
use App\Models\AuditLog;

class ClinicSettingsController extends Controller
{
    /**
     * Display the clinic settings & corporate profile editor.
     */
    public function edit(): Response
    {
        $clinic = Clinic::firstOrCreate(['id' => 1], [
            'name' => 'MediCore Clinic Center',
            'country' => 'Morocco',
            'timezone' => 'Africa/Casablanca',
            'currency' => 'MAD',
            'settings' => [
                'appointment_interval' => 30,
                'require_phone' => true,
                'enable_odontogram' => true,
                'enable_ophthalmology' => true,
                'vat_percentage' => 0,
            ],
        ]);

        return Inertia::render('Settings/Clinic', [
            'clinic' => $clinic,
        ]);
    }

    /**
     * Update clinic profile, legal information, and clinical rules.
     */
    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'legal_name' => ['nullable', 'string', 'max:255'],
            'tax_number' => ['nullable', 'string', 'max:100'],
            'phone' => ['nullable', 'string', 'max:50'],
            'email' => ['nullable', 'email', 'max:100'],
            'website' => ['nullable', 'string', 'max:255'],
            'address' => ['nullable', 'string', 'max:500'],
            'country' => ['nullable', 'string', 'max:100'],
            'timezone' => ['nullable', 'string', 'max:100'],
            'currency' => ['nullable', 'string', 'max:10'],
            'settings' => ['nullable', 'array'],
            'settings.appointment_interval' => ['nullable', 'integer', 'min:5', 'max:180'],
            'settings.require_phone' => ['nullable', 'boolean'],
            'settings.enable_odontogram' => ['nullable', 'boolean'],
            'settings.enable_ophthalmology' => ['nullable', 'boolean'],
            'settings.vat_percentage' => ['nullable', 'numeric', 'min:0', 'max:100'],
        ]);

        $clinic = Clinic::firstOrCreate(['id' => 1]);
        
        $oldValues = $clinic->toArray();
        $clinic->update($validated);

        // Synchronize main branch contact details
        Branch::where('clinic_id', $clinic->id)
            ->where('is_main', true)
            ->update([
                'name' => $clinic->name,
                'phone' => $clinic->phone,
                'email' => $clinic->email,
                'address' => $clinic->address,
            ]);

        // Audit Trail
        AuditLog::create([
            'user_id' => $request->user()?->id,
            'action' => 'update_clinic_settings',
            'auditable_type' => Clinic::class,
            'auditable_id' => $clinic->id,
            'old_values' => $oldValues,
            'new_values' => $clinic->toArray(),
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return redirect()->back()->with('success', 'تم حفظ وتحديث بيانات العيادة بنجاح، وسيتم تطبيقها على جميع الفواتير والوصفات الطبية.');
    }
}
