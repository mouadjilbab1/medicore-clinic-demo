<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Doctor;
use App\Models\Clinic;
use App\Models\Branch;
use App\Models\Patient;
use App\Models\Appointment;
use App\Models\AuditLog;
use App\Services\PatientService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;

class PatientManagementTest extends TestCase
{
    use RefreshDatabase;

    protected User $adminUser;
    protected Doctor $doctor;
    protected Branch $branch;
    protected PatientService $patientService;

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

        $this->branch = Branch::create([
            'clinic_id' => $clinic->id,
            'name' => 'Main Branch',
            'code' => 'MAIN',
            'phone' => '+1 555-0100',
            'address' => '123 Medical Center Way',
            'is_main' => true,
            'is_active' => true,
        ]);

        $this->adminUser = User::create([
            'branch_id' => $this->branch->id,
            'name' => 'Dr. Admin',
            'email' => 'admin@medicore.test',
            'phone' => '+1 555-0101',
            'password' => Hash::make('password123'),
            'role' => 'admin',
            'locale' => 'en',
            'is_active' => true,
        ]);

        $this->doctor = Doctor::create([
            'user_id' => $this->adminUser->id,
            'specialty' => 'general',
            'license_number' => 'ADM-001',
            'consultation_fee' => 100.00,
            'followup_fee' => 50.00,
            'slot_duration_minutes' => 30,
            'is_available' => true,
        ]);

        $this->patientService = app(PatientService::class);
    }

    public function test_patient_uid_generation_follows_standard_format(): void
    {
        $uid = $this->patientService->generateUid();
        $year = date('Y');
        $this->assertMatchesRegularExpression("/^PAT-{$year}-\d{4}$/", $uid);
    }

    public function test_duplicate_patients_are_detected(): void
    {
        Patient::create([
            'branch_id' => $this->branch->id,
            'patient_uid' => 'PAT-2026-0001',
            'first_name' => 'Sarah',
            'last_name' => 'Connor',
            'date_of_birth' => '1985-05-12',
            'gender' => 'female',
            'phone' => '+1-555-9999',
            'national_id' => 'ID-9999',
            'is_active' => true,
        ]);

        $duplicates = $this->patientService->findDuplicates('+1-555-9999');
        $this->assertCount(1, $duplicates);
        $this->assertEquals('Sarah', $duplicates[0]['first_name']);
    }

    public function test_patient_merge_transfers_records_and_creates_audit_log(): void
    {
        $source = Patient::create([
            'branch_id' => $this->branch->id,
            'patient_uid' => 'PAT-2026-0010',
            'first_name' => 'Jane',
            'last_name' => 'Doe (Duplicate)',
            'date_of_birth' => '1990-01-01',
            'gender' => 'female',
            'phone' => '+1-555-1111',
            'is_active' => true,
        ]);

        $target = Patient::create([
            'branch_id' => $this->branch->id,
            'patient_uid' => 'PAT-2026-0011',
            'first_name' => 'Jane',
            'last_name' => 'Doe (Original)',
            'date_of_birth' => '1990-01-01',
            'gender' => 'female',
            'phone' => '+1-555-2222',
            'is_active' => true,
        ]);

        // Create an appointment for source
        Appointment::create([
            'branch_id' => $this->branch->id,
            'patient_id' => $source->id,
            'doctor_id' => $this->doctor->id,
            'appointment_date' => '2026-05-10',
            'start_time' => '10:00:00',
            'end_time' => '10:30:00',
            'type' => 'consultation',
            'status' => 'scheduled',
        ]);

        $success = $this->patientService->mergePatients(
            $source->id,
            $target->id,
            'Identified duplicate patient record upon admission',
            $this->adminUser->id
        );

        $this->assertTrue($success);

        // Verify source is soft-deleted and marked inactive
        $this->assertSoftDeleted('patients', ['id' => $source->id]);
        $this->assertDatabaseHas('patients', [
            'id' => $source->id,
            'is_active' => false,
            'merged_into_id' => $target->id,
        ]);

        // Verify appointment was re-assigned to target
        $this->assertDatabaseHas('appointments', [
            'patient_id' => $target->id,
            'doctor_id' => $this->doctor->id,
            'start_time' => '10:00:00',
        ]);

        // Verify audit log exists
        $this->assertDatabaseHas('audit_logs', [
            'user_id' => $this->adminUser->id,
            'action' => 'merged',
            'auditable_type' => Patient::class,
            'auditable_id' => $target->id,
        ]);
    }
}
