<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use App\Models\DentalTooth;
use App\Models\DentalTreatment;
use App\Models\Patient;
use App\Models\Doctor;
use App\Models\AuditLog;

class DentalController extends Controller
{
    public function index(Request $request): Response
    {
        $patientId = $request->input('patient_id');
        $patients = Patient::where('is_active', true)->select('id', 'first_name', 'last_name', 'patient_uid')->get();
        $selectedPatient = null;
        $teeth = [];
        $treatments = [];

        if ($patientId) {
            $selectedPatient = Patient::with(['branch'])->findOrFail($patientId);
            $teeth = DentalTooth::where('patient_id', $patientId)->get()->keyBy('tooth_number');
            $treatments = DentalTreatment::with('doctor.user')
                ->where('patient_id', $patientId)
                ->orderByDesc('id')
                ->get();
        }

        $dentists = Doctor::with('user')->where('specialty', 'dental')->get();

        return Inertia::render('Specialties/Dental', [
            'patients' => $patients,
            'selectedPatient' => $selectedPatient,
            'teeth' => $teeth,
            'treatments' => $treatments,
            'dentists' => $dentists,
        ]);
    }

    public function updateTooth(Request $request, int $patientId, int $toothNumber): RedirectResponse
    {
        $validated = $request->validate([
            'overall_condition' => ['required', 'string'],
            'surface_occlusal' => ['nullable', 'string'],
            'surface_mesial' => ['nullable', 'string'],
            'surface_distal' => ['nullable', 'string'],
            'surface_buccal' => ['nullable', 'string'],
            'surface_lingual' => ['nullable', 'string'],
            'mobility_grade' => ['nullable', 'integer', 'between:0,3'],
            'notes' => ['nullable', 'string'],
        ]);

        $validated['updated_by'] = $request->user()?->id;

        $tooth = DentalTooth::updateOrCreate(
            ['patient_id' => $patientId, 'tooth_number' => $toothNumber],
            $validated
        );

        AuditLog::create([
            'user_id' => $request->user()?->id,
            'action' => 'tooth_updated',
            'auditable_type' => DentalTooth::class,
            'auditable_id' => $tooth->id,
            'new_values' => $validated,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return back()->with('success', "Tooth #{$toothNumber} status updated.");
    }

    public function storeTreatment(Request $request, int $patientId): RedirectResponse
    {
        $validated = $request->validate([
            'doctor_id' => ['required', 'exists:doctors,id'],
            'tooth_number' => ['nullable', 'integer'],
            'procedure_name' => ['required', 'string', 'max:255'],
            'stage' => ['required', 'in:planned,in_progress,completed'],
            'cost' => ['required', 'numeric', 'min:0'],
            'notes' => ['nullable', 'string'],
        ]);

        $validated['patient_id'] = $patientId;

        DentalTreatment::create($validated);

        return back()->with('success', 'Dental procedure plan recorded.');
    }

    public function updateTreatmentStage(Request $request, int $id): RedirectResponse
    {
        $treatment = DentalTreatment::findOrFail($id);

        $validated = $request->validate([
            'stage' => ['required', 'in:planned,in_progress,completed'],
        ]);

        $treatment->update($validated);

        return back()->with('success', "Dental procedure stage marked as {$validated['stage']}.");
    }
}
