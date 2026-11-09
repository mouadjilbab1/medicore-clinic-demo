<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use App\Models\Prescription;
use App\Models\PrescriptionItem;
use App\Models\Patient;
use App\Models\Doctor;
use App\Models\Clinic;
use App\Models\AuditLog;
use Illuminate\Support\Facades\DB;

class PrescriptionController extends Controller
{
    public function index(Request $request): Response
    {
        $patientId = $request->input('patient_id');

        $query = Prescription::with(['patient', 'doctor.user', 'items'])
            ->orderByDesc('id');

        if ($patientId) {
            $query->where('patient_id', $patientId);
        }

        $prescriptions = $query->paginate(15)->withQueryString();
        $patients = Patient::where('is_active', true)->select('id', 'first_name', 'last_name', 'patient_uid')->get();
        $doctors = Doctor::with('user')->where('is_available', true)->get();

        return Inertia::render('Prescriptions/Index', [
            'prescriptions' => $prescriptions,
            'patients' => $patients,
            'doctors' => $doctors,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'patient_id' => ['required', 'exists:patients,id'],
            'doctor_id' => ['required', 'exists:doctors,id'],
            'consultation_id' => ['nullable', 'exists:consultations,id'],
            'instructions' => ['nullable', 'string'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.medicine_name' => ['required', 'string', 'max:255'],
            'items.*.dosage' => ['required', 'string', 'max:100'],
            'items.*.frequency' => ['required', 'string', 'max:100'],
            'items.*.duration' => ['required', 'string', 'max:100'],
            'items.*.route' => ['required', 'string', 'max:50'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
            'items.*.instructions' => ['nullable', 'string'],
        ]);

        $year = date('Y');
        $last = Prescription::withTrashed()
            ->where('prescription_number', 'like', "RX-{$year}-%")
            ->orderByDesc('id')
            ->first();

        $seq = 1;
        if ($last) {
            $parts = explode('-', $last->prescription_number);
            $seq = intval(end($parts)) + 1;
        }

        $prescriptionNumber = sprintf("RX-%s-%04d", $year, $seq);

        DB::transaction(function () use ($validated, $prescriptionNumber, $request) {
            $prescription = Prescription::create([
                'patient_id' => $validated['patient_id'],
                'doctor_id' => $validated['doctor_id'],
                'consultation_id' => $validated['consultation_id'] ?? null,
                'prescription_number' => $prescriptionNumber,
                'status' => 'active',
                'instructions' => $validated['instructions'] ?? null,
                'signed_at' => now(),
            ]);

            foreach ($validated['items'] as $item) {
                $item['prescription_id'] = $prescription->id;
                PrescriptionItem::create($item);
            }

            AuditLog::create([
                'user_id' => $request->user()?->id,
                'action' => 'prescription_created',
                'auditable_type' => Prescription::class,
                'auditable_id' => $prescription->id,
                'new_values' => ['prescription_number' => $prescriptionNumber],
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);
        });

        return back()->with('success', "Medical prescription #{$prescriptionNumber} issued and signed.");
    }

    public function print(int $id): Response
    {
        $prescription = Prescription::with(['patient', 'doctor.user', 'items'])->findOrFail($id);
        $clinic = Clinic::first();

        return Inertia::render('Prescriptions/Print', [
            'prescription' => $prescription,
            'clinic' => $clinic,
        ]);
    }
}
