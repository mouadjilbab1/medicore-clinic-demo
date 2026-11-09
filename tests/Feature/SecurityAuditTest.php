<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Clinic;
use App\Models\Branch;
use App\Models\Patient;
use App\Models\Consultation;
use App\Models\Invoice;
use App\Models\AuditLog;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;

class SecurityAuditTest extends TestCase
{
    use RefreshDatabase;

    protected User $adminUser;
    protected User $patientUser;
    protected User $doctorUser;
    protected User $receptionistUser;
    protected Branch $branch;

    protected function setUp(): void
    {
        parent::setUp();

        $clinic = Clinic::create([
            'name' => 'MediCore Security Test Clinic',
            'phone' => '+1 555-0100',
            'email' => 'sec@medicore.test',
            'address' => '100 Security Blvd',
            'country' => 'Morocco',
            'currency' => 'USD',
            'timezone' => 'UTC',
        ]);

        $this->branch = Branch::create([
            'clinic_id' => $clinic->id,
            'name' => 'Main Security Branch',
            'code' => 'SEC-MAIN',
            'phone' => '+1 555-0100',
            'address' => '100 Security Blvd',
            'is_main' => true,
            'is_active' => true,
        ]);

        $this->adminUser = User::create([
            'branch_id' => $this->branch->id,
            'name' => 'Security Admin',
            'email' => 'secadmin@medicore.test',
            'phone' => '+1 555-0101',
            'password' => Hash::make('SuperSecurePass123!'),
            'role' => 'admin',
            'locale' => 'en',
            'is_active' => true,
        ]);

        $this->doctorUser = User::create([
            'branch_id' => $this->branch->id,
            'name' => 'Dr. Verified',
            'email' => 'drverified@medicore.test',
            'phone' => '+1 555-0102',
            'password' => Hash::make('DoctorPass123!'),
            'role' => 'doctor',
            'locale' => 'en',
            'is_active' => true,
        ]);

        $this->receptionistUser = User::create([
            'branch_id' => $this->branch->id,
            'name' => 'Front Desk Reception',
            'email' => 'frontdesk@medicore.test',
            'phone' => '+1 555-0103',
            'password' => Hash::make('FrontDeskPass123!'),
            'role' => 'receptionist',
            'locale' => 'en',
            'is_active' => true,
        ]);

        $this->patientUser = User::create([
            'branch_id' => $this->branch->id,
            'name' => 'John Patient',
            'email' => 'patient@medicore.test',
            'phone' => '+1 555-0104',
            'password' => Hash::make('PatientPass123!'),
            'role' => 'patient',
            'locale' => 'en',
            'is_active' => true,
        ]);

        \App\Models\Doctor::create([
            'user_id' => $this->doctorUser->id,
            'specialty' => 'general',
            'license_number' => 'DOC-SEC-01',
            'consultation_fee' => 150.00,
            'followup_fee' => 75.00,
            'slot_duration_minutes' => 30,
            'is_available' => true,
        ]);

        Patient::create([
            'branch_id' => $this->branch->id,
            'patient_uid' => 'PAT-2026-0001',
            'first_name' => 'Secure',
            'last_name' => 'Patient',
            'date_of_birth' => '1990-01-01',
            'gender' => 'male',
            'phone' => '+1-555-7777',
            'is_active' => true,
        ]);
    }

    /**
     * Vector 1: Guests cannot access protected staff endpoints.
     */
    public function test_unauthenticated_guests_are_redirected_to_login(): void
    {
        $protectedEndpoints = [
            '/',
            '/patients',
            '/consultations',
            '/appointments',
            '/billing',
            '/financial',
            '/inventory',
            '/laboratory',
            '/imaging',
            '/staff',
            '/settings/backup',
        ];

        foreach ($protectedEndpoints as $endpoint) {
            $response = $this->get($endpoint);
            $response->assertRedirect('/login');
        }
    }

    /**
     * Vector 2: Password hashing verification (no plaintext password in DB).
     */
    public function test_passwords_are_securely_hashed_with_bcrypt(): void
    {
        $this->assertTrue(Hash::check('SuperSecurePass123!', $this->adminUser->password));
        $this->assertFalse(Hash::check('WrongPassword', $this->adminUser->password));
        $this->assertStringStartsWith('$2y$', $this->adminUser->password);
    }

    /**
     * Vector 3: SQL Injection mitigation via parameterized queries.
     */
    public function test_search_inputs_mitigate_sql_injection(): void
    {
        $this->actingAs($this->adminUser);

        // SQL injection attempt payload
        $sqlPayload = "' OR '1'='1' -- ";
        $response = $this->get('/patients?search=' . urlencode($sqlPayload));
        
        $response->assertStatus(200);
        // Does not throw an SQL syntax error
    }

    /**
     * Vector 4: Finalized clinical encounter cannot be overwritten without amendment.
     */
    public function test_finalized_consultation_rejects_re_signing(): void
    {
        $this->actingAs($this->doctorUser);

        $consultation = Consultation::create([
            'branch_id' => $this->branch->id,
            'patient_id' => 1,
            'doctor_id' => 1,
            'consultation_date' => now(),
            'chief_complaint' => 'Severe abdominal colic',
            'is_finalized' => true,
            'signed_at' => now(),
            'signed_by' => $this->doctorUser->id,
        ]);

        $response = $this->post(route('consultations.sign', $consultation->id));
        $response->assertRedirect();
        $response->assertSessionHas('warning', 'This medical consultation has already been signed and locked.');
    }

    /**
     * Vector 5: Audit log tracks critical changes.
     */
    public function test_audit_logs_record_critical_actions(): void
    {
        $this->actingAs($this->adminUser);

        $patient = Patient::create([
            'branch_id' => $this->branch->id,
            'patient_uid' => 'PAT-2026-9999',
            'first_name' => 'Audited',
            'last_name' => 'Patient',
            'date_of_birth' => '1995-02-14',
            'gender' => 'male',
            'phone' => '+1-555-0999',
            'is_active' => true,
        ]);

        $this->delete(route('patients.destroy', $patient->id));

        $this->assertDatabaseHas('audit_logs', [
            'user_id' => $this->adminUser->id,
            'action' => 'deleted',
            'auditable_type' => Patient::class,
            'auditable_id' => $patient->id,
        ]);
    }
}
