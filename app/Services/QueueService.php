<?php

namespace App\Services;

use App\Models\WaitingQueue;
use App\Models\Appointment;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class QueueService
{
    /**
     * Check in a patient and issue a daily sequential queue ticket.
     */
    public function checkIn(int $branchId, int $patientId, int $doctorId, ?int $appointmentId = null, string $priority = 'normal', ?string $notes = null): WaitingQueue
    {
        return DB::transaction(function () use ($branchId, $patientId, $doctorId, $appointmentId, $priority, $notes) {
            $today = Carbon::today();

            // Next queue number for today in this branch
            $maxNumber = WaitingQueue::where('branch_id', $branchId)
                ->whereDate('check_in_time', $today)
                ->max('queue_number') ?? 0;

            $queueItem = WaitingQueue::create([
                'branch_id' => $branchId,
                'appointment_id' => $appointmentId,
                'patient_id' => $patientId,
                'doctor_id' => $doctorId,
                'queue_number' => $maxNumber + 1,
                'priority' => $priority,
                'status' => 'waiting',
                'check_in_time' => now(),
                'notes' => $notes,
            ]);

            if ($appointmentId) {
                Appointment::where('id', $appointmentId)->update(['status' => 'waiting']);
            }

            return $queueItem;
        });
    }

    /**
     * Call the patient into consultation.
     */
    public function callNext(int $queueId): WaitingQueue
    {
        $item = WaitingQueue::findOrFail($queueId);
        $item->update([
            'status' => 'called',
            'called_time' => now(),
        ]);

        if ($item->appointment_id) {
            Appointment::where('id', $item->appointment_id)->update(['status' => 'in_consultation']);
        }

        return $item;
    }

    /**
     * Complete the queue entry.
     */
    public function complete(int $queueId): WaitingQueue
    {
        $item = WaitingQueue::findOrFail($queueId);
        $item->update([
            'status' => 'completed',
            'completed_time' => now(),
        ]);

        if ($item->appointment_id) {
            Appointment::where('id', $item->appointment_id)->update(['status' => 'completed']);
        }

        return $item;
    }
}
