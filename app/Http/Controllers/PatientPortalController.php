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
        // Identify patient by linked session or default demo patient (Patient #1)
        $patient = Patient::with(['branch'])->first();

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
        $validated = $request->validate([
            'patient_id' => ['required', 'exists:patients,id'],
            'doctor_id' => ['required', 'exists:doctors,id'],
            'appointment_date' => ['required', 'date', 'after_or_equal:today'],
            'start_time' => ['required'],
            'reason_for_visit' => ['required', 'string', 'max:500'],
        ]);

        $endTime = date('H:i:s', strtotime($validated['start_time']) + 1800); // +30 mins

        Appointment::create([
            'branch_id' => 1,
            'patient_id' => $validated['patient_id'],
            'doctor_id' => $validated['doctor_id'],
            'appointment_date' => $validated['appointment_date'],
            'start_time' => $validated['start_time'],
            'end_time' => $endTime,
            'type' => 'consultation',
            'status' => 'scheduled',
            'reason_for_visit' => $validated['reason_for_visit'],
        ]);

        return back()->with('success', 'Your appointment request has been submitted for clinic confirmation.');
    }
}
