<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use App\Models\Appointment;
use App\Models\Doctor;
use App\Models\Patient;
use App\Models\Room;
use App\Models\AuditLog;
use App\Services\SchedulingService;
use Carbon\Carbon;

class AppointmentController extends Controller
{
    public function __construct(protected SchedulingService $schedulingService)
    {
    }

    public function index(Request $request): Response
    {
        $doctorId = $request->input('doctor_id');
        $date = $request->input('date', Carbon::today()->format('Y-m-d'));
        $status = $request->input('status');

        $query = Appointment::with(['patient', 'doctor.user', 'room'])
            ->orderBy('appointment_date')
            ->orderBy('start_time');

        if ($doctorId) {
            $query->where('doctor_id', $doctorId);
        }

        if ($date) {
            $query->where('appointment_date', $date);
        }

        if ($status) {
            $query->where('status', $status);
        }

        $appointments = $query->get();

        $doctors = Doctor::with('user')->where('is_available', true)->get();
        $rooms = Room::where('is_active', true)->get();

        return Inertia::render('Appointments/Index', [
            'appointments' => $appointments,
            'doctors' => $doctors,
            'rooms' => $rooms,
            'selectedDate' => $date,
            'selectedDoctorId' => $doctorId ? intval($doctorId) : null,
            'selectedStatus' => $status,
        ]);
    }

    public function getAvailableSlots(Request $request)
    {
        $request->validate([
            'doctor_id' => ['required', 'exists:doctors,id'],
            'date' => ['required', 'date'],
        ]);

        $slots = $this->schedulingService->getAvailableSlots(
            intval($request->input('doctor_id')),
            $request->input('date')
        );

        return response()->json(['slots' => $slots]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'patient_id' => ['required', 'exists:patients,id'],
            'doctor_id' => ['required', 'exists:doctors,id'],
            'room_id' => ['nullable', 'exists:rooms,id'],
            'appointment_date' => ['required', 'date'],
            'start_time' => ['required'],
            'end_time' => ['required'],
            'type' => ['required', 'in:consultation,follow_up,procedure,emergency,walk_in'],
            'reason_for_visit' => ['nullable', 'string', 'max:500'],
            'notes' => ['nullable', 'string', 'max:500'],
        ]);

        // Strict Conflict Prevention
        $hasDoctorConflict = $this->schedulingService->hasConflict(
            $validated['doctor_id'],
            $validated['appointment_date'],
            $validated['start_time'],
            $validated['end_time']
        );

        if ($hasDoctorConflict && $validated['type'] !== 'emergency') {
            return back()->withErrors([
                'start_time' => 'Scheduling Conflict: Doctor has an overlapping appointment or approved leave during this time block.',
            ]);
        }

        if (!empty($validated['room_id'])) {
            $hasRoomConflict = $this->schedulingService->hasRoomConflict(
                $validated['room_id'],
                $validated['appointment_date'],
                $validated['start_time'],
                $validated['end_time']
            );

            if ($hasRoomConflict && $validated['type'] !== 'emergency') {
                return back()->withErrors([
                    'room_id' => 'Room Conflict: The selected operatory or consultation suite is already booked.',
                ]);
            }
        }

        $validated['branch_id'] = $request->user()?->branch_id;
        $validated['created_by'] = $request->user()?->id;
        $validated['status'] = $validated['type'] === 'walk_in' ? 'arrived' : 'scheduled';

        $appointment = Appointment::create($validated);

        AuditLog::create([
            'user_id' => $request->user()?->id,
            'action' => 'created',
            'auditable_type' => Appointment::class,
            'auditable_id' => $appointment->id,
            'new_values' => $validated,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return redirect()->route('appointments.index', ['date' => $appointment->appointment_date->format('Y-m-d')])
            ->with('success', 'Appointment scheduled successfully.');
    }

    public function updateStatus(Request $request, int $id): RedirectResponse
    {
        $appointment = Appointment::findOrFail($id);

        $validated = $request->validate([
            'status' => ['required', 'in:scheduled,confirmed,arrived,waiting,in_consultation,completed,cancelled,no_show'],
            'cancellation_reason' => ['nullable', 'string'],
        ]);

        $oldStatus = $appointment->status;
        $appointment->update($validated);

        AuditLog::create([
            'user_id' => $request->user()?->id,
            'action' => 'status_updated',
            'auditable_type' => Appointment::class,
            'auditable_id' => $appointment->id,
            'old_values' => ['status' => $oldStatus],
            'new_values' => $validated,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return back()->with('success', "Appointment status updated to " . ucfirst($appointment->status));
    }
}
