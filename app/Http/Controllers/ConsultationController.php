<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use App\Models\Consultation;
use App\Models\Patient;
use App\Models\Doctor;
use App\Models\VitalSign;
use App\Models\Diagnosis;
use App\Models\ClinicalNoteRevision;
use App\Models\AuditLog;
use Illuminate\Support\Facades\DB;

class ConsultationController extends Controller
{
    public function index(Request $request): Response
    {
        $patientId = $request->input('patient_id');
        $doctorId = $request->input('doctor_id');

        $query = Consultation::with(['patient', 'doctor.user', 'diagnoses', 'vitals'])
            ->orderByDesc('consultation_date');

        if ($patientId) {
            $query->where('patient_id', $patientId);
        }

        if ($doctorId) {
            $query->where('doctor_id', $doctorId);
        }

        $consultations = $query->paginate(15)->withQueryString();
        $doctors = Doctor::with('user')->get();

        return Inertia::render('Consultations/Index', [
            'consultations' => $consultations,
            'doctors' => $doctors,
        ]);
    }

    public function create(Request $request): Response
    {
        $patientId = $request->input('patient_id');
        $patient = $patientId ? Patient::with(['allergies', 'consultations'])->findOrFail($patientId) : null;
        $doctors = Doctor::with('user')->where('is_available', true)->get();
        $patients = Patient::where('is_active', true)->select('id', 'first_name', 'last_name', 'patient_uid')->get();

        return Inertia::render('Consultations/Create', [
            'patient' => $patient,
            'patients' => $patients,
            'doctors' => $doctors,
            'appointment_id' => $request->input('appointment_id'),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'patient_id' => ['required', 'exists:patients,id'],
            'doctor_id' => ['required', 'exists:doctors,id'],
            'appointment_id' => ['nullable', 'exists:appointments,id'],
            'chief_complaint' => ['required', 'string'],
            'history_present_illness' => ['nullable', 'string'],
            'physical_examination' => ['nullable', 'string'],
            'clinical_assessment' => ['nullable', 'string'],
            'treatment_plan' => ['nullable', 'string'],
            'follow_up_instructions' => ['nullable', 'string'],
            'follow_up_date' => ['nullable', 'date'],
        ]);

        $validated['branch_id'] = $request->user()?->branch_id ?? 1;
        $validated['consultation_date'] = now();
        $validated['is_finalized'] = false;

        $consultation = Consultation::create($validated);

        AuditLog::create([
            'user_id' => $request->user()?->id,
            'action' => 'created',
            'auditable_type' => Consultation::class,
            'auditable_id' => $consultation->id,
            'new_values' => $validated,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return redirect()->route('consultations.show', $consultation->id)
            ->with('success', 'Clinical encounter draft opened.');
    }

    public function show(int $id): Response
    {
        $consultation = Consultation::with([
            'patient.allergies',
            'doctor.user',
            'vitals',
            'diagnoses',
            'prescriptions.items',
            'revisions.reviser',
            'ophthalmologyRecord',
            'dermatologyRecord',
        ])->findOrFail($id);

        return Inertia::render('Consultations/Show', [
            'consultation' => $consultation,
        ]);
    }

    public function addVitals(Request $request, int $id): RedirectResponse
    {
        $consultation = Consultation::findOrFail($id);

        $validated = $request->validate([
            'systolic_bp' => ['nullable', 'integer', 'between:40,300'],
            'diastolic_bp' => ['nullable', 'integer', 'between:20,200'],
            'heart_rate' => ['nullable', 'integer', 'between:30,250'],
            'respiratory_rate' => ['nullable', 'integer', 'between:5,60'],
            'temperature' => ['nullable', 'numeric', 'between:30,45'],
            'oxygen_saturation' => ['nullable', 'integer', 'between:50,100'],
            'weight' => ['nullable', 'numeric', 'between:1,300'],
            'height' => ['nullable', 'numeric', 'between:30,250'],
        ]);

        // BMI Calculation
        if (!empty($validated['weight']) && !empty($validated['height'])) {
            $heightM = $validated['height'] / 100.0;
            $validated['bmi'] = round($validated['weight'] / ($heightM * $heightM), 1);
        }

        $validated['consultation_id'] = $consultation->id;
        $validated['patient_id'] = $consultation->patient_id;
        $validated['recorded_by'] = $request->user()?->id;
        $validated['recorded_at'] = now();

        VitalSign::create($validated);

        return back()->with('success', 'Vital signs recorded successfully.');
    }

    public function addDiagnosis(Request $request, int $id): RedirectResponse
    {
        $consultation = Consultation::findOrFail($id);

        $validated = $request->validate([
            'diagnosis_name' => ['required', 'string', 'max:255'],
            'icd10_code' => ['nullable', 'string', 'max:50'],
            'type' => ['required', 'in:primary,secondary,differential'],
            'status' => ['required', 'in:active,resolved,chronic'],
            'notes' => ['nullable', 'string'],
        ]);

        $validated['consultation_id'] = $consultation->id;
        $validated['patient_id'] = $consultation->patient_id;

        Diagnosis::create($validated);

        return back()->with('success', 'Diagnosis added to clinical chart.');
    }

    public function signAndFinalize(Request $request, int $id): RedirectResponse
    {
        $consultation = Consultation::findOrFail($id);

        if ($consultation->is_finalized) {
            return back()->with('warning', 'This medical consultation has already been signed and locked.');
        }

        $consultation->update([
            'is_finalized' => true,
            'signed_at' => now(),
            'signed_by' => $request->user()->id,
        ]);

        AuditLog::create([
            'user_id' => $request->user()->id,
            'action' => 'signed',
            'auditable_type' => Consultation::class,
            'auditable_id' => $consultation->id,
            'new_values' => ['is_finalized' => true, 'signed_at' => now()->toIso8601String()],
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return back()->with('success', 'Clinical record signed and finalized.');
    }

    public function addRevision(Request $request, int $id): RedirectResponse
    {
        $consultation = Consultation::findOrFail($id);

        $validated = $request->validate([
            'revision_reason' => ['required', 'string', 'min:5'],
            'chief_complaint' => ['nullable', 'string'],
            'history_present_illness' => ['nullable', 'string'],
            'physical_examination' => ['nullable', 'string'],
            'clinical_assessment' => ['nullable', 'string'],
            'treatment_plan' => ['nullable', 'string'],
        ]);

        DB::transaction(function () use ($consultation, $validated, $request) {
            // Snapshot previous content
            $previousContent = [
                'chief_complaint' => $consultation->chief_complaint,
                'history_present_illness' => $consultation->history_present_illness,
                'physical_examination' => $consultation->physical_examination,
                'clinical_assessment' => $consultation->clinical_assessment,
                'treatment_plan' => $consultation->treatment_plan,
            ];

            ClinicalNoteRevision::create([
                'consultation_id' => $consultation->id,
                'revised_by' => $request->user()->id,
                'revision_reason' => $validated['revision_reason'],
                'previous_content' => $previousContent,
            ]);

            $consultation->update([
                'chief_complaint' => $validated['chief_complaint'] ?? $consultation->chief_complaint,
                'history_present_illness' => $validated['history_present_illness'] ?? $consultation->history_present_illness,
                'physical_examination' => $validated['physical_examination'] ?? $consultation->physical_examination,
                'clinical_assessment' => $validated['clinical_assessment'] ?? $consultation->clinical_assessment,
                'treatment_plan' => $validated['treatment_plan'] ?? $consultation->treatment_plan,
            ]);
        });

        return back()->with('success', 'Clinical addendum attached and record updated.');
    }
}
