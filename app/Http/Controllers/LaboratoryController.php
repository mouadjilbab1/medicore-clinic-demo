<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use App\Models\LabRequest;
use App\Models\LabResult;
use App\Models\Patient;
use App\Models\Doctor;

class LaboratoryController extends Controller
{
    public function index(): Response
    {
        $requests = LabRequest::with(['patient', 'doctor.user', 'results.approver'])
            ->orderByDesc('id')
            ->paginate(15);

        $patients = Patient::where('is_active', true)->select('id', 'first_name', 'last_name', 'patient_uid')->get();
        $doctors = Doctor::with('user')->where('is_available', true)->get();

        return Inertia::render('Laboratory/Index', [
            'requests' => $requests,
            'patients' => $patients,
            'doctors' => $doctors,
        ]);
    }

    public function storeRequest(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'patient_id' => ['required', 'exists:patients,id'],
            'doctor_id' => ['required', 'exists:doctors,id'],
            'test_name' => ['required', 'string', 'max:255'],
            'test_code' => ['nullable', 'string', 'max:50'],
            'priority' => ['required', 'in:routine,urgent,stat'],
            'notes' => ['nullable', 'string'],
        ]);

        $validated['branch_id'] = $request->user()?->branch_id ?? 1;
        $validated['status'] = 'ordered';

        LabRequest::create($validated);

        return back()->with('success', 'Laboratory order submitted to lab bench.');
    }

    public function addResult(Request $request, int $id): RedirectResponse
    {
        $labRequest = LabRequest::findOrFail($id);

        $validated = $request->validate([
            'parameter_name' => ['required', 'string', 'max:255'],
            'result_value' => ['required', 'string', 'max:100'],
            'unit' => ['nullable', 'string', 'max:30'],
            'reference_range' => ['nullable', 'string', 'max:100'],
            'is_abnormal' => ['boolean'],
            'remarks' => ['nullable', 'string'],
        ]);

        $validated['request_id'] = $labRequest->id;
        $validated['approved_by'] = $request->user()?->id;
        $validated['approved_at'] = now();

        LabResult::create($validated);

        $labRequest->update(['status' => 'approved']);

        return back()->with('success', 'Diagnostic lab result recorded and validated.');
    }
}
