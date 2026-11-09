<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use App\Models\Patient;
use App\Models\PatientAllergy;
use App\Models\PatientDocument;
use App\Models\AuditLog;
use App\Services\PatientService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class PatientController extends Controller
{
    public function __construct(protected PatientService $patientService)
    {
    }

    public function index(Request $request): Response
    {
        $search = $request->input('search');
        $gender = $request->input('gender');
        $bloodGroup = $request->input('blood_group');

        $query = Patient::with(['branch', 'allergies'])
            ->withCount(['appointments', 'consultations', 'invoices', 'documents'])
            ->orderByDesc('id');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%")
                  ->orWhere('patient_uid', 'like', "%{$search}%")
                  ->orWhere('national_id', 'like', "%{$search}%");
            });
        }

        if ($gender) {
            $query->where('gender', $gender);
        }

        if ($bloodGroup) {
            $query->where('blood_group', $bloodGroup);
        }

        $patients = $query->paginate(15)->withQueryString();

        return Inertia::render('Patients/Index', [
            'patients' => $patients,
            'filters' => [
                'search' => $search,
                'gender' => $gender,
                'blood_group' => $bloodGroup,
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Patients/Create', [
            'suggested_uid' => $this->patientService->generateUid(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'first_name' => ['required', 'string', 'max:100'],
            'last_name' => ['required', 'string', 'max:100'],
            'gender' => ['required', 'in:male,female,other'],
            'date_of_birth' => ['required', 'date'],
            'phone' => ['required', 'string', 'max:50'],
            'email' => ['nullable', 'email', 'max:150'],
            'national_id' => ['nullable', 'string', 'max:50'],
            'blood_group' => ['nullable', 'string', 'max:10'],
            'address' => ['nullable', 'string'],
            'city' => ['nullable', 'string', 'max:100'],
            'emergency_contact_name' => ['nullable', 'string', 'max:100'],
            'emergency_contact_phone' => ['nullable', 'string', 'max:50'],
            'allergies_summary' => ['nullable', 'string'],
            'chronic_conditions_summary' => ['nullable', 'string'],
            'medical_notes' => ['nullable', 'string'],
        ]);

        $user = $request->user();
        $validated['branch_id'] = $user?->branch_id;
        $validated['patient_uid'] = $this->patientService->generateUid();

        $patient = Patient::create($validated);

        AuditLog::create([
            'user_id' => $user?->id,
            'action' => 'created',
            'auditable_type' => Patient::class,
            'auditable_id' => $patient->id,
            'new_values' => $validated,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return redirect()->route('patients.show', $patient->id)
            ->with('success', "Patient profile #{$patient->patient_uid} registered successfully.");
    }

    public function show(int $id): Response
    {
        $patient = Patient::with([
            'branch',
            'allergies',
            'documents.uploader',
            'appointments' => fn ($q) => $q->with(['doctor.user', 'room'])->orderByDesc('appointment_date'),
            'consultations' => fn ($q) => $q->with(['doctor.user', 'diagnoses', 'vitals', 'prescriptions.items'])->orderByDesc('consultation_date'),
            'invoices' => fn ($q) => $q->with(['items', 'payments'])->orderByDesc('invoice_date'),
            'dentalTreatments' => fn ($q) => $q->with('doctor.user')->orderByDesc('id'),
            'dentalTeeth',
        ])->findOrFail($id);

        // Build Chronological Timeline
        $timeline = [];

        foreach ($patient->appointments as $apt) {
            $timeline[] = [
                'type' => 'appointment',
                'date' => $apt->appointment_date->format('Y-m-d') . ' ' . $apt->start_time,
                'title' => 'Appointment: ' . ucfirst($apt->type),
                'description' => $apt->reason_for_visit ?? 'Scheduled visit',
                'doctor' => $apt->doctor?->user?->name,
                'status' => $apt->status,
                'id' => $apt->id,
            ];
        }

        foreach ($patient->consultations as $c) {
            $timeline[] = [
                'type' => 'consultation',
                'date' => $c->consultation_date->format('Y-m-d H:i'),
                'title' => 'Medical Encounter (Consultation)',
                'description' => $c->chief_complaint,
                'doctor' => $c->doctor?->user?->name,
                'status' => $c->is_finalized ? 'Finalized & Signed' : 'Draft',
                'id' => $c->id,
            ];
        }

        foreach ($patient->invoices as $inv) {
            $timeline[] = [
                'type' => 'invoice',
                'date' => $inv->invoice_date->format('Y-m-d'),
                'title' => "Invoice #{$inv->invoice_number}",
                'description' => "Total: {$inv->total_amount} MAD, Status: " . ucfirst($inv->status),
                'amount' => $inv->total_amount,
                'status' => $inv->status,
                'id' => $inv->id,
            ];
        }

        usort($timeline, fn ($a, $b) => strcmp($b['date'], $a['date']));

        return Inertia::render('Patients/Show', [
            'patient' => $patient,
            'timeline' => $timeline,
        ]);
    }

    public function edit(int $id): Response
    {
        $patient = Patient::with('allergies')->findOrFail($id);
        return Inertia::render('Patients/Edit', [
            'patient' => $patient,
        ]);
    }

    public function update(Request $request, int $id): RedirectResponse
    {
        $patient = Patient::findOrFail($id);

        $validated = $request->validate([
            'first_name' => ['required', 'string', 'max:100'],
            'last_name' => ['required', 'string', 'max:100'],
            'gender' => ['required', 'in:male,female,other'],
            'date_of_birth' => ['required', 'date'],
            'phone' => ['required', 'string', 'max:50'],
            'email' => ['nullable', 'email', 'max:150'],
            'national_id' => ['nullable', 'string', 'max:50'],
            'blood_group' => ['nullable', 'string', 'max:10'],
            'address' => ['nullable', 'string'],
            'city' => ['nullable', 'string', 'max:100'],
            'emergency_contact_name' => ['nullable', 'string', 'max:100'],
            'emergency_contact_phone' => ['nullable', 'string', 'max:50'],
            'allergies_summary' => ['nullable', 'string'],
            'chronic_conditions_summary' => ['nullable', 'string'],
            'medical_notes' => ['nullable', 'string'],
        ]);

        $old = $patient->toArray();
        $patient->update($validated);

        AuditLog::create([
            'user_id' => $request->user()?->id,
            'action' => 'updated',
            'auditable_type' => Patient::class,
            'auditable_id' => $patient->id,
            'old_values' => $old,
            'new_values' => $validated,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return redirect()->route('patients.show', $patient->id)
            ->with('success', 'Patient demographic information updated.');
    }

    public function checkDuplicates(Request $request)
    {
        $phone = $request->input('phone', '');
        $nationalId = $request->input('national_id');
        $email = $request->input('email');
        $excludeId = $request->input('exclude_id');

        $duplicates = $this->patientService->findDuplicates($phone, $nationalId, $email, $excludeId);

        return response()->json(['duplicates' => $duplicates]);
    }

    public function merge(Request $request): RedirectResponse
    {
        $request->validate([
            'source_patient_id' => ['required', 'exists:patients,id'],
            'target_patient_id' => ['required', 'exists:patients,id', 'different:source_patient_id'],
            'reason' => ['required', 'string', 'min:5'],
        ]);

        $this->patientService->mergePatients(
            $request->input('source_patient_id'),
            $request->input('target_patient_id'),
            $request->input('reason'),
            $request->user()->id
        );

        return redirect()->route('patients.show', $request->input('target_patient_id'))
            ->with('success', 'Duplicate patient records successfully merged with audit trail.');
    }
}
