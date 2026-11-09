<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use App\Models\Patient;
use App\Models\Appointment;
use App\Models\Prescription;
use App\Models\Invoice;
use App\Models\Doctor;

class PatientPortalController extends Controller
{
    public function dashboard(Request $request): Response
    {
        $user = $request->user();

        // Strict Isolation: locate patient profile matching user's registered email
        $patient = Patient::where('email', $user->email)->first();

        // Administrative fallback only for super-admin or clinic director previewing portal
        if (!$patient && in_array($user->role, ['admin', 'director'])) {
            $patient = Patient::with(['branch'])->first();
        }

        if (!$patient) {
            abort(403, 'Access Denied: No medical patient record is registered with this user account.');
        }

        $appointments = Appointment::with(['doctor.user', 'room'])
            ->where('patient_id', $patient->id)
            ->orderByDesc('appointment_date')
            ->get();

        $prescriptions = Prescription::with(['doctor.user', 'items'])
            ->where('patient_id', $patient->id)
            ->where('status', 'active')
            ->orderByDesc('id')
            ->get();

        $invoices = Invoice::with(['items', 'payments'])
            ->where('patient_id', $patient->id)
            ->orderByDesc('id')
            ->get();

        $doctors = Doctor::with('user')->where('is_available', true)->get();

        return Inertia::render('Portal/Dashboard', [
            'patient' => $patient,
            'appointments' => $appointments,
            'prescriptions' => $prescriptions,
            'invoices' => $invoices,
            'doctors' => $doctors,
        ]);
    }

    public function requestAppointment(Request $request): RedirectResponse
    {
        $user = $request->user();

        // Strict Isolation: ensure appointment is booked only for the authenticated patient's profile
        $patient = Patient::where('email', $user->email)->first();

        if (!$patient && in_array($user->role, ['admin', 'director'])) {
            $patient = Patient::find($request->input('patient_id'));
        }

        if (!$patient) {
            abort(403, 'Access Denied: Cannot schedule appointments for another patient.');
        }

        $validated = $request->validate([
            'doctor_id' => ['required', 'exists:doctors,id'],
            'appointment_date' => ['required', 'date', 'after_or_equal:today'],
            'start_time' => ['required'],
            'reason_for_visit' => ['required', 'string', 'max:500'],
        ]);

        $endTime = date('H:i:s', strtotime($validated['start_time']) + 1800); // +30 mins

        Appointment::create([
            'branch_id' => $patient->branch_id ?? 1,
            'patient_id' => $patient->id, // Bound to authenticated patient
            'doctor_id' => $validated['doctor_id'],
            'appointment_date' => $validated['appointment_date'],
            'start_time' => $validated['start_time'],
            'end_time' => $endTime,
            'type' => 'consultation',
            'status' => 'scheduled',
            'reason_for_visit' => $validated['reason_for_visit'],
            'created_by' => $user->id,
        ]);

        return back()->with('success', 'Your appointment request has been scheduled successfully.');
    }
}
