<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use App\Models\ImagingRequest;
use App\Models\Patient;
use App\Models\Doctor;

class ImagingController extends Controller
{
    public function index(): Response
    {
        $requests = ImagingRequest::with(['patient', 'doctor.user', 'performer'])
            ->orderByDesc('id')
            ->paginate(15);

        $patients = Patient::where('is_active', true)->select('id', 'first_name', 'last_name', 'patient_uid')->get();
        $doctors = Doctor::with('user')->where('is_available', true)->get();

        return Inertia::render('Imaging/Index', [
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
            'modality' => ['required', 'in:xray,ultrasound,ct,mri,mammography,other'],
            'body_part' => ['required', 'string', 'max:150'],
            'clinical_indication' => ['nullable', 'string'],
        ]);

        $validated['branch_id'] = $request->user()?->branch_id ?? 1;
        $validated['status'] = 'requested';

        ImagingRequest::create($validated);

        return back()->with('success', 'Diagnostic imaging requisition issued.');
    }

    public function saveReport(Request $request, int $id): RedirectResponse
    {
        $imaging = ImagingRequest::findOrFail($id);

        $validated = $request->validate([
            'report_text' => ['required', 'string'],
        ]);

        $imaging->update([
            'report_text' => $validated['report_text'],
            'status' => 'reported',
            'performed_by' => $request->user()?->id,
        ]);

        return back()->with('success', 'Radiology imaging assessment and findings saved.');
    }
}
