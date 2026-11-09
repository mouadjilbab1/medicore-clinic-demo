<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Clinic;
use App\Models\Branch;
use App\Models\Doctor;
use App\Models\DoctorLeave;
use App\Models\Patient;
use App\Models\Appointment;
use App\Services\SchedulingService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;

class AppointmentSchedulingTest extends TestCase
{
    use RefreshDatabase;

    protected Doctor $doctor;
    protected Patient $patient;
    protected SchedulingService $schedulingService;

    protected function setUp(): void
    {
        parent::setUp();

        $clinic = Clinic::create([
            'name' => 'MediCore Clinic',
            'phone' => '+1 555-0100',
            'email' => 'contact@medicore.test',
            'address' => '123 Medical Center Way',
            'country' => 'Morocco',
            'currency' => 'USD',
            'timezone' => 'UTC',
        ]);

        $branch = Branch::create([
            'clinic_id' => $clinic->id,
            'name' => 'Main Branch',
            'code' => 'MAIN',
            'phone' => '+1 555-0100',
            'address' => '123 Medical Center Way',
            'is_main' => true,
            'is_active' => true,
        ]);

        $doctorUser = User::create([
            'branch_id' => $branch->id,
            'name' => 'Dr. Robert Carter',
            'email' => 'carter@medicore.test',
            'phone' => '+1 555-0200',
            'password' => Hash::make('secret123'),
            'role' => 'doctor',
            'locale' => 'en',
            'is_active' => true,
        ]);

        $this->doctor = Doctor::create([
            'user_id' => $doctorUser->id,
            'specialty' => 'general',
            'license_number' => 'LIC-7721',
            'consultation_fee' => 150.00,
            'followup_fee' => 75.00,
            'slot_duration_minutes' => 30,
            'is_available' => true,
        ]);

        $this->patient = Patient::create([
            'branch_id' => $branch->id,
            'patient_uid' => 'PAT-2026-0001',
            'first_name' => 'Alex',
            'last_name' => 'Vance',
            'date_of_birth' => '1992-04-15',
            'gender' => 'male',
            'phone' => '+1-555-4321',
            'is_active' => true,
        ]);

        $this->schedulingService = app(SchedulingService::class);
    }

    public function test_scheduling_detects_overlapping_appointment_conflict(): void
    {
        // 1. Create an existing appointment from 09:00 to 09:30
        Appointment::create([
            'branch_id' => 1,
            'patient_id' => $this->patient->id,
            'doctor_id' => $this->doctor->id,
            'appointment_date' => '2026-06-01',
            'start_time' => '09:00:00',
            'end_time' => '09:30:00',
            'type' => 'consultation',
            'status' => 'confirmed',
        ]);

        // Same exact time slot has conflict
        $hasConflictExact = $this->schedulingService->hasConflict(
            $this->doctor->id,
            '2026-06-01',
            '09:00:00',
            '09:30:00'
        );
        $this->assertTrue($hasConflictExact);

        // Overlapping partial time slot (09:15 to 09:45) has conflict
        $hasConflictPartial = $this->schedulingService->hasConflict(
            $this->doctor->id,
            '2026-06-01',
            '09:15:00',
            '09:45:00'
        );
        $this->assertTrue($hasConflictPartial);

        // Adjacent subsequent time slot (09:30 to 10:00) has NO conflict
        $hasConflictAdjacent = $this->schedulingService->hasConflict(
            $this->doctor->id,
            '2026-06-01',
            '09:30:00',
            '10:00:00'
        );
        $this->assertFalse($hasConflictAdjacent);
    }

    public function test_doctor_on_approved_leave_is_flagged_with_conflict(): void
    {
        DoctorLeave::create([
            'doctor_id' => $this->doctor->id,
            'start_date' => '2026-07-01',
            'end_date' => '2026-07-07',
            'reason' => 'Annual medical symposium',
            'status' => 'approved',
        ]);

        $hasConflict = $this->schedulingService->hasConflict(
            $this->doctor->id,
            '2026-07-03',
            '10:00:00',
            '10:30:00'
        );

        $this->assertTrue($hasConflict);
    }
}
