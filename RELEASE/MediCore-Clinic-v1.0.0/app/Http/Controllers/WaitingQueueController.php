<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use App\Models\WaitingQueue;
use App\Models\Doctor;
use App\Models\Patient;
use App\Models\Appointment;
use App\Services\QueueService;

class WaitingQueueController extends Controller
{
    public function __construct(protected QueueService $queueService)
    {
    }

    public function index(Request $request): Response
    {
        $doctorId = $request->input('doctor_id');

        $query = WaitingQueue::with(['patient', 'doctor.user', 'appointment'])
            ->whereDate('check_in_time', now()->toDateString())
            ->whereIn('status', ['waiting', 'called', 'in_consultation'])
            ->orderByRaw("CASE priority WHEN 'emergency' THEN 1 WHEN 'urgent' THEN 2 WHEN 'special_needs' THEN 3 ELSE 4 END")
            ->orderBy('check_in_time');

        if ($doctorId) {
            $query->where('doctor_id', $doctorId);
        }

        $activeQueue = $query->get();

        $doctors = Doctor::with('user')->where('is_available', true)->get();
        $patients = Patient::where('is_active', true)->select('id', 'first_name', 'last_name', 'patient_uid', 'phone')->get();

        return Inertia::render('WaitingRoom/Index', [
            'queue' => $activeQueue,
            'doctors' => $doctors,
            'patients' => $patients,
            'selectedDoctorId' => $doctorId ? intval($doctorId) : null,
        ]);
    }

    public function checkIn(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'patient_id' => ['required', 'exists:patients,id'],
            'doctor_id' => ['required', 'exists:doctors,id'],
            'appointment_id' => ['nullable', 'exists:appointments,id'],
            'priority' => ['required', 'in:normal,urgent,emergency,special_needs'],
            'notes' => ['nullable', 'string', 'max:255'],
        ]);

        $branchId = $request->user()?->branch_id ?? 1;

        $queueItem = $this->queueService->checkIn(
            $branchId,
            $validated['patient_id'],
            $validated['doctor_id'],
            $validated['appointment_id'] ?? null,
            $validated['priority'],
            $validated['notes'] ?? null
        );

        return back()->with('success', "Patient checked in with Queue Ticket #{$queueItem->queue_number}");
    }

    public function callNext(int $id): RedirectResponse
    {
        $item = $this->queueService->callNext($id);
        return back()->with('success', "Called Ticket #{$item->queue_number} ({$item->patient->full_name}) into consultation.");
    }

    public function complete(int $id): RedirectResponse
    {
        $this->queueService->complete($id);
        return back()->with('success', "Patient encounter completed from waiting queue.");
    }

    public function skip(int $id): RedirectResponse
    {
        $item = WaitingQueue::findOrFail($id);
        $item->update(['status' => 'skipped']);
        return back()->with('warning', "Ticket #{$item->queue_number} skipped.");
    }

    public function transfer(Request $request, int $id): RedirectResponse
    {
        $request->validate([
            'new_doctor_id' => ['required', 'exists:doctors,id'],
        ]);

        $item = WaitingQueue::findOrFail($id);
        $item->update([
            'doctor_id' => $request->input('new_doctor_id'),
            'status' => 'waiting',
        ]);

        return back()->with('success', "Patient transferred to Dr. {$item->doctor->user->name}.");
    }

    public function publicDisplay(): Response
    {
        $activeQueue = WaitingQueue::with(['patient', 'doctor.user'])
            ->whereDate('check_in_time', now()->toDateString())
            ->whereIn('status', ['waiting', 'called', 'in_consultation'])
            ->orderBy('called_time', 'desc')
            ->get();

        return Inertia::render('WaitingRoom/PublicDisplay', [
            'queue' => $activeQueue,
        ]);
    }
}
