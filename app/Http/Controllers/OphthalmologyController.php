<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use App\Models\OphthalmologyRecord;
use App\Models\Patient;
use App\Models\Consultation;

class OphthalmologyController extends Controller
{
    public function index(Request $request): Response
    {
        $records = OphthalmologyRecord::with(['patient', 'consultation.doctor.user'])
            ->orderByDesc('id')
            ->paginate(15);

        $patients = Patient::where('is_active', true)->select('id', 'first_name', 'last_name', 'patient_uid')->get();

        return Inertia::render('Specialties/Ophthalmology', [
            'records' => $records,
            'patients' => $patients,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'patient_id' => ['required', 'exists:patients,id'],
            'consultation_id' => ['nullable', 'exists:consultations,id'],
            'od_va_distance' => ['nullable', 'string', 'max:20'],
            'od_va_near' => ['nullable', 'string', 'max:20'],
            'od_sph' => ['nullable', 'numeric'],
            'od_cyl' => ['nullable', 'numeric'],
            'od_axis' => ['nullable', 'integer', 'between:0,180'],
            'od_add' => ['nullable', 'numeric'],
            'od_iop' => ['nullable', 'numeric'],
            'os_va_distance' => ['nullable', 'string', 'max:20'],
            'os_va_near' => ['nullable', 'string', 'max:20'],
            'os_sph' => ['nullable', 'numeric'],
            'os_cyl' => ['nullable', 'numeric'],
            'os_axis' => ['nullable', 'integer', 'between:0,180'],
            'os_add' => ['nullable', 'numeric'],
            'os_iop' => ['nullable', 'numeric'],
            'pd' => ['nullable', 'numeric'],
            'glasses_prescription_notes' => ['nullable', 'string'],
            'contact_lens_notes' => ['nullable', 'string'],
        ]);

        if (empty($validated['consultation_id'])) {
            $consultation = Consultation::create([
                'patient_id' => $validated['patient_id'],
                'doctor_id' => 3, // Ophthalmology specialist
                'consultation_date' => now(),
                'chief_complaint' => 'Ophthalmology Visual Acuity & Refraction Exam',
                'is_finalized' => true,
            ]);
            $validated['consultation_id'] = $consultation->id;
        }

        OphthalmologyRecord::create($validated);

        return back()->with('success', 'Ophthalmology vision examination saved.');
    }
}
