<?php

namespace App\Services;

use App\Models\Appointment;
use App\Models\Doctor;
use App\Models\DoctorSchedule;
use App\Models\DoctorLeave;
use Carbon\Carbon;

class SchedulingService
{
    /**
     * Check if a doctor has an overlapping appointment or leave.
     */
    public function hasConflict(int $doctorId, string $date, string $startTime, string $endTime, ?int $excludeAppointmentId = null): bool
    {
        // 1. Check if doctor is on leave
        $isOnLeave = DoctorLeave::where('doctor_id', $doctorId)
            ->where('status', 'approved')
            ->whereDate('start_date', '<=', $date)
            ->whereDate('end_date', '>=', $date)
            ->exists();

        if ($isOnLeave) {
            return true;
        }

        // 2. Check for overlapping active appointments
        $query = Appointment::where('doctor_id', $doctorId)
            ->whereDate('appointment_date', $date)
            ->whereNotIn('status', ['cancelled', 'no_show'])
            ->where(function ($q) use ($startTime, $endTime) {
                $q->where(function ($sub) use ($startTime, $endTime) {
                    $sub->where('start_time', '<', $endTime)
                        ->where('end_time', '>', $startTime);
                });
            });

        if ($excludeAppointmentId) {
            $query->where('id', '!=', $excludeAppointmentId);
        }

        return $query->exists();
    }

    /**
     * Check if a room is already booked for another procedure.
     */
    public function hasRoomConflict(?int $roomId, string $date, string $startTime, string $endTime, ?int $excludeAppointmentId = null): bool
    {
        if (!$roomId) {
            return false;
        }

        $query = Appointment::where('room_id', $roomId)
            ->whereDate('appointment_date', $date)
            ->whereNotIn('status', ['cancelled', 'no_show'])
            ->where(function ($q) use ($startTime, $endTime) {
                $q->where('start_time', '<', $endTime)
                    ->where('end_time', '>', $startTime);
            });

        if ($excludeAppointmentId) {
            $query->where('id', '!=', $excludeAppointmentId);
        }

        return $query->exists();
    }

    /**
     * Generate available time slots for a doctor on a given date.
     */
    public function getAvailableSlots(int $doctorId, string $date): array
    {
        $carbonDate = Carbon::parse($date);
        $dayOfWeek = $carbonDate->dayOfWeek; // 0=Sun..6=Sat

        $schedule = DoctorSchedule::where('doctor_id', $doctorId)
            ->where('day_of_week', $dayOfWeek)
            ->where('is_active', true)
            ->first();

        if (!$schedule) {
            return [];
        }

        $doctor = Doctor::find($doctorId);
        $slotMinutes = $doctor ? $doctor->slot_duration_minutes : 30;

        $startTime = Carbon::parse("{$date} {$schedule->start_time}");
        $endTime = Carbon::parse("{$date} {$schedule->end_time}");
        $breakStart = $schedule->break_start ? Carbon::parse("{$date} {$schedule->break_start}") : null;
        $breakEnd = $schedule->break_end ? Carbon::parse("{$date} {$schedule->break_end}") : null;

        $slots = [];
        $current = $startTime->copy();

        while ($current->copy()->addMinutes($slotMinutes)->lte($endTime)) {
            $slotEnd = $current->copy()->addMinutes($slotMinutes);
            $startStr = $current->format('H:i:s');
            $endStr = $slotEnd->format('H:i:s');

            // Check if slot falls in break time
            $isBreak = false;
            if ($breakStart && $breakEnd) {
                if ($current->lt($breakEnd) && $slotEnd->gt($breakStart)) {
                    $isBreak = true;
                }
            }

            $isBooked = false;
            if (!$isBreak) {
                $isBooked = $this->hasConflict($doctorId, $date, $startStr, $endStr);
            }

            $slots[] = [
                'start_time' => $startStr,
                'end_time' => $endStr,
                'is_available' => !$isBreak && !$isBooked,
                'is_break' => $isBreak,
            ];

            $current->addMinutes($slotMinutes);
        }

        return $slots;
    }
}
