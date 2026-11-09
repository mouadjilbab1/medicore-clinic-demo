<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Clinic;
use App\Models\Branch;
use App\Models\Doctor;
use App\Models\Patient;
use App\Models\Appointment;
use App\Models\Consultation;
use App\Models\Invoice;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;

class RoleAuthorizationTest extends TestCase
{
    use RefreshDatabase;

    protected Clinic $clinic;
    protected Branch $branch;
    protected User $adminUser;
    protected User $directorUser;
    protected User $doctorUser;
    protected Doctor $doctor;
    protected User $dentistUser;
    protected Doctor $dentist;
    protected User $nurseUser;
    protected User $receptionistUser;
    protected User $accountantUser;
    protected User $patientUserA;
    protected Patient $patientA;
    protected User $patientUserB;
    protected Patient $patientB;
    protected Consultation $consultation;

    protected function setUp(): void
    {
        parent::setUp();

        $this->clinic = Clinic::create([
            'name' => 'MediCore Clinic',
            'phone' => '+1 555-0100',
            'email' => 'contact@medicore.test',
            'address' => '123 Medical Center Way',
            'country' => 'Morocco',
            'currency' => 'MAD',
            'timezone' => 'UTC',
        ]);

        $this->branch = Branch::create([
            'clinic_id' => $this->clinic->id,
            'name' => 'Main Center',
            'code' => 'MAIN',
            'phone' => '+1 555-0100',
            'address' => '123 Medical Center Way',
            'is_main' => true,
            'is_active' => true,
        ]);

        $this->adminUser = User::create([
            'branch_id' => $this->branch->id,
            'name' => 'Admin User',
            'email' => 'admin@medicore.test',
            'password' => Hash::make('password123'),
            'role' => 'admin',
            'locale' => 'en',
            'is_active' => true,
        ]);

        $this->directorUser = User::create([
            'branch_id' => $this->branch->id,
            'name' => 'Clinic Director',
            'email' => 'director@medicore.test',
            'password' => Hash::make('password123'),
            'role' => 'director',
            'locale' => 'en',
            'is_active' => true,
        ]);

        $this->doctorUser = User::create([
            'branch_id' => $this->branch->id,
            'name' => 'Dr. General Practitioner',
            'email' => 'doctor@medicore.test',
            'password' => Hash::make('password123'),
            'role' => 'doctor',
            'locale' => 'en',
            'is_active' => true,
        ]);

        $this->doctor = Doctor::create([
            'user_id' => $this->doctorUser->id,
            'branch_id' => $this->branch->id,
            'specialty' => 'general_practice',
            'license_number' => 'MED-GEN-01',
            'consultation_fee' => 250.00,
            'is_available' => true,
        ]);

        $this->dentistUser = User::create([
            'branch_id' => $this->branch->id,
            'name' => 'Dr. Dental Surgeon',
            'email' => 'dentist@medicore.test',
            'password' => Hash::make('password123'),
            'role' => 'dentist',
            'locale' => 'en',
            'is_active' => true,
        ]);

        $this->dentist = Doctor::create([
            'user_id' => $this->dentistUser->id,
            'branch_id' => $this->branch->id,
            'specialty' => 'dental',
            'license_number' => 'MED-DEN-01',
            'consultation_fee' => 300.00,
            'is_available' => true,
        ]);

        $this->nurseUser = User::create([
            'branch_id' => $this->branch->id,
            'name' => 'Nurse Clara',
            'email' => 'nurse@medicore.test',
            'password' => Hash::make('password123'),
            'role' => 'nurse',
            'locale' => 'en',
            'is_active' => true,
        ]);

        $this->receptionistUser = User::create([
            'branch_id' => $this->branch->id,
            'name' => 'Receptionist Rita',
            'email' => 'receptionist@medicore.test',
            'password' => Hash::make('password123'),
            'role' => 'receptionist',
            'locale' => 'en',
            'is_active' => true,
        ]);

        $this->accountantUser = User::create([
            'branch_id' => $this->branch->id,
            'name' => 'Accountant Alex',
            'email' => 'accountant@medicore.test',
            'password' => Hash::make('password123'),
            'role' => 'accountant',
            'locale' => 'en',
            'is_active' => true,
        ]);

        // Patient A
        $this->patientUserA = User::create([
            'branch_id' => $this->branch->id,
            'name' => 'Patient Alice Smith',
            'email' => 'alice.patient@example.test',
            'password' => Hash::make('password123'),
            'role' => 'patient',
            'locale' => 'en',
            'is_active' => true,
        ]);

        $this->patientA = Patient::create([
            'branch_id' => $this->branch->id,
            'patient_uid' => 'PAT-2026-0001',
            'first_name' => 'Alice',
            'last_name' => 'Smith',
            'gender' => 'female',
            'date_of_birth' => '1992-04-10',
            'phone' => '+1555111111',
            'email' => 'alice.patient@example.test',
            'national_id' => 'CIN-111111',
            'is_active' => true,
        ]);

        // Patient B
        $this->patientUserB = User::create([
            'branch_id' => $this->branch->id,
            'name' => 'Patient Bob Jones',
            'email' => 'bob.patient@example.test',
            'password' => Hash::make('password123'),
            'role' => 'patient',
            'locale' => 'en',
            'is_active' => true,
        ]);

        $this->patientB = Patient::create([
            'branch_id' => $this->branch->id,
            'patient_uid' => 'PAT-2026-0002',
            'first_name' => 'Bob',
            'last_name' => 'Jones',
            'gender' => 'male',
            'date_of_birth' => '1985-08-20',
            'phone' => '+1555222222',
            'email' => 'bob.patient@example.test',
            'national_id' => 'CIN-222222',
            'is_active' => true,
        ]);

        $this->consultation = Consultation::create([
            'branch_id' => $this->branch->id,
            'patient_id' => $this->patientA->id,
            'doctor_id' => $this->doctor->id,
            'consultation_date' => now(),
            'chief_complaint' => 'Routine confidential checkup',
            'clinical_assessment' => 'Healthy adult',
            'is_finalized' => false,
        ]);
    }

    public function test_receptionist_cannot_access_or_alter_medical_consultations(): void
    {
        // Receptionist attempting to list consultations
        $responseIndex = $this->actingAs($this->receptionistUser)
            ->get(route('consultations.index'));
        $responseIndex->assertStatus(403);

        // Receptionist attempting to view medical consultation chart
        $responseShow = $this->actingAs($this->receptionistUser)
            ->get(route('consultations.show', $this->consultation->id));
        $responseShow->assertStatus(403);

        // Receptionist attempting to add diagnosis
        $responseDiagnosis = $this->actingAs($this->receptionistUser)
            ->post(route('consultations.diagnoses', $this->consultation->id), [
                'diagnosis_name' => 'Unauthorized entry',
                'type' => 'primary',
                'status' => 'active',
            ]);
        $responseDiagnosis->assertStatus(403);

        // Receptionist attempting to sign consultation
        $responseSign = $this->actingAs($this->receptionistUser)
            ->post(route('consultations.sign', $this->consultation->id));
        $responseSign->assertStatus(403);

        // Receptionist attempting to create prescription
        $responseRx = $this->actingAs($this->receptionistUser)
            ->post(route('prescriptions.store'), [
                'patient_id' => $this->patientA->id,
                'doctor_id' => $this->doctor->id,
                'items' => [['medicine_name' => 'Aspirin', 'dosage' => '100mg']],
            ]);
        $responseRx->assertStatus(403);
    }

    public function test_accountant_cannot_modify_diagnoses_or_sign_consultations(): void
    {
        // Accountant attempting to view medical consultations
        $responseIndex = $this->actingAs($this->accountantUser)
            ->get(route('consultations.index'));
        $responseIndex->assertStatus(403);

        // Accountant attempting to add diagnosis
        $responseDiag = $this->actingAs($this->accountantUser)
            ->post(route('consultations.diagnoses', $this->consultation->id), [
                'diagnosis_name' => 'Accountant fake diagnosis',
                'type' => 'primary',
                'status' => 'active',
            ]);
        $responseDiag->assertStatus(403);

        // Accountant attempting to sign medical consultation
        $responseSign = $this->actingAs($this->accountantUser)
            ->post(route('consultations.sign', $this->consultation->id));
        $responseSign->assertStatus(403);

        // Accountant attempting to prescribe
        $responseRx = $this->actingAs($this->accountantUser)
            ->post(route('prescriptions.store'), [
                'patient_id' => $this->patientA->id,
                'doctor_id' => $this->doctor->id,
                'items' => [['medicine_name' => 'Penicillin', 'dosage' => '500mg']],
            ]);
        $responseRx->assertStatus(403);
    }

    public function test_doctor_cannot_modify_financial_expenses_or_close_registers(): void
    {
        // Doctor attempting to access accounting financial console
        $responseFin = $this->actingAs($this->doctorUser)
            ->get(route('financial.index'));
        $responseFin->assertStatus(403);

        // Doctor attempting to record clinic expenses
        $responseExp = $this->actingAs($this->doctorUser)
            ->post(route('financial.expenses.store'), [
                'category' => 'office_supplies',
                'title' => 'Doctor Personal Expense',
                'amount' => 500.00,
                'expense_date' => now()->toDateString(),
                'payment_method' => 'cash',
            ]);
        $responseExp->assertStatus(403);

        // Doctor attempting to close cash register
        $responseClose = $this->actingAs($this->doctorUser)
            ->post(route('financial.close-register'), [
                'closing_cash' => 1000.00,
            ]);
        $responseClose->assertStatus(403);
    }

    public function test_nurse_can_record_vitals_but_cannot_sign_or_diagnose(): void
    {
        // Nurse can access consultation to record vitals
        $responseShow = $this->actingAs($this->nurseUser)
            ->get(route('consultations.show', $this->consultation->id));
        $responseShow->assertStatus(200);

        // Nurse records vitals -> allowed
        $responseVitals = $this->actingAs($this->nurseUser)
            ->post(route('consultations.vitals', $this->consultation->id), [
                'systolic_bp' => 120,
                'diastolic_bp' => 80,
                'heart_rate' => 72,
                'temperature' => 36.8,
            ]);
        $responseVitals->assertSessionHasNoErrors();
        $this->assertDatabaseHas('vital_signs', [
            'consultation_id' => $this->consultation->id,
            'systolic_bp' => 120,
        ]);

        // Nurse attempting to diagnose -> 403 Forbidden
        $responseDiag = $this->actingAs($this->nurseUser)
            ->post(route('consultations.diagnoses', $this->consultation->id), [
                'diagnosis_name' => 'Nurse diagnosis attempt',
                'type' => 'primary',
                'status' => 'active',
            ]);
        $responseDiag->assertStatus(403);

        // Nurse attempting to sign -> 403 Forbidden
        $responseSign = $this->actingAs($this->nurseUser)
            ->post(route('consultations.sign', $this->consultation->id));
        $responseSign->assertStatus(403);
    }

    public function test_unauthorized_users_cannot_access_or_trigger_backups(): void
    {
        $nonAdminRoles = [
            $this->doctorUser,
            $this->dentistUser,
            $this->nurseUser,
            $this->receptionistUser,
            $this->accountantUser,
            $this->patientUserA,
        ];

        foreach ($nonAdminRoles as $user) {
            $responseIndex = $this->actingAs($user)
                ->get(route('backups.index'));
            $responseIndex->assertStatus(403);

            $responseCreate = $this->actingAs($user)
                ->post(route('backups.create'));
            $responseCreate->assertStatus(403);
        }

        // Only Admin and Director can access backups
        $responseAdmin = $this->actingAs($this->adminUser)
            ->get(route('backups.index'));
        $responseAdmin->assertStatus(200);

        $responseDirector = $this->actingAs($this->directorUser)
            ->get(route('backups.index'));
        $responseDirector->assertStatus(200);
    }

    public function test_patient_is_strictly_isolated_from_staff_routes_and_other_patients(): void
    {
        // 1. Patient barred from internal clinical staff dashboard
        $responseDash = $this->actingAs($this->patientUserA)
            ->get(route('dashboard'));
        $responseDash->assertStatus(403);

        // 2. Patient barred from staff patient directory
        $responsePatients = $this->actingAs($this->patientUserA)
            ->get(route('patients.index'));
        $responsePatients->assertStatus(403);

        // 3. Patient barred from clinical consultations
        $responseConsult = $this->actingAs($this->patientUserA)
            ->get(route('consultations.index'));
        $responseConsult->assertStatus(403);

        // 4. Patient barred from staff billing
        $responseBilling = $this->actingAs($this->patientUserA)
            ->get(route('billing.index'));
        $responseBilling->assertStatus(403);

        // 5. Patient barred from staff management
        $responseStaff = $this->actingAs($this->patientUserA)
            ->get(route('staff.index'));
        $responseStaff->assertStatus(403);

        // 6. Patient accessing own portal dashboard -> Success
        $responsePortalA = $this->actingAs($this->patientUserA)
            ->get(route('portal.dashboard'));
        $responsePortalA->assertStatus(200);

        // 7. Patient A cannot schedule an appointment under Patient B's identity
        $appointmentDate = now()->addDays(2)->toDateString();
        $responseTamper = $this->actingAs($this->patientUserA)
            ->post(route('portal.appointments.request'), [
                'patient_id' => $this->patientB->id, // Attempt to inject Patient B's ID
                'doctor_id' => $this->doctor->id,
                'appointment_date' => $appointmentDate,
                'start_time' => '14:00:00',
                'reason_for_visit' => 'Tampered appointment attempt',
            ]);

        $responseTamper->assertSessionHasNoErrors();

        // Verify that the appointment was forced to Patient A's ID, protecting Patient B!
        $this->assertDatabaseHas('appointments', [
            'patient_id' => $this->patientA->id,
            'created_by' => $this->patientUserA->id,
            'reason_for_visit' => 'Tampered appointment attempt',
        ]);
        $this->assertDatabaseMissing('appointments', [
            'patient_id' => $this->patientB->id,
            'reason_for_visit' => 'Tampered appointment attempt',
        ]);
    }
}
